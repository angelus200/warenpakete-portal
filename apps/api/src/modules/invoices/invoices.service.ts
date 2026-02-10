import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { InvoiceType } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private pdfGenerator: PdfGeneratorService,
  ) {}

  async generateInvoiceNumber(type: InvoiceType): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = type === InvoiceType.INVOICE ? 'RE' : 'LS';

    // Get or create counter
    let counter = await this.prisma.invoiceCounter.findUnique({
      where: {
        type_year: {
          type,
          year: currentYear,
        },
      },
    });

    if (!counter) {
      counter = await this.prisma.invoiceCounter.create({
        data: {
          type,
          year: currentYear,
          counter: 0,
        },
      });
    }

    // Increment counter
    counter = await this.prisma.invoiceCounter.update({
      where: { id: counter.id },
      data: { counter: { increment: 1 } },
    });

    // Format: RE-2026-00001
    return `${prefix}-${currentYear}-${String(counter.counter).padStart(5, '0')}`;
  }

  async createInvoice(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                packageItems: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if invoice already exists
    const existingInvoice = await this.prisma.invoice.findFirst({
      where: {
        orderId,
        type: InvoiceType.INVOICE,
      },
    });

    if (existingInvoice) {
      return existingInvoice;
    }

    // Generate invoice number
    const invoiceNumber = await this.generateInvoiceNumber(InvoiceType.INVOICE);

    // Determine tax rate based on country
    const customerCountry = order.user.companyCountry || 'DE';
    const isReverseCharge = customerCountry === 'DE' || customerCountry === 'AT';
    const taxRate = isReverseCharge ? 0 : 8.1;

    // Calculate amounts (stored in cents)
    const grossAmountCents = Math.round(Number(order.totalAmount) * 100);
    let netAmountCents: number;
    let taxAmountCents: number;

    if (isReverseCharge) {
      // DE/AT: No tax, net = gross
      netAmountCents = grossAmountCents;
      taxAmountCents = 0;
    } else {
      // CH: Calculate net from gross including 8.1% VAT
      netAmountCents = Math.round(grossAmountCents / 1.081);
      taxAmountCents = grossAmountCents - netAmountCents;
    }

    // Create invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        type: InvoiceType.INVOICE,
        customerCompany: order.user.company || order.user.companyName || 'N/A',
        customerName: order.user.name || `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'N/A',
        customerAddress: `${order.user.companyStreet || ''}, ${order.user.companyZip || ''} ${order.user.companyCity || ''}, ${customerCountry}`.trim(),
        customerCountry,
        customerVatId: order.user.vatId,
        netAmount: netAmountCents,
        taxRate,
        taxAmount: taxAmountCents,
        grossAmount: grossAmountCents,
        stripePaymentIntentId: order.stripePaymentId,
      },
    });

    return invoice;
  }

  async createDeliveryNote(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: {
              include: {
                packageItems: true,
              },
            },
          },
        },
        deliveryAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if delivery note already exists
    const existingDeliveryNote = await this.prisma.invoice.findFirst({
      where: {
        orderId,
        type: InvoiceType.DELIVERY_NOTE,
      },
    });

    if (existingDeliveryNote) {
      return existingDeliveryNote;
    }

    // Generate delivery note number
    const invoiceNumber = await this.generateInvoiceNumber(InvoiceType.DELIVERY_NOTE);

    // Use delivery address if available, otherwise use company address
    let deliveryAddressStr: string;
    if (order.deliveryAddress) {
      deliveryAddressStr = `${order.deliveryAddress.street}, ${order.deliveryAddress.zipCode} ${order.deliveryAddress.city}, ${order.deliveryAddress.country}`;
    } else {
      const country = order.user.companyCountry || 'DE';
      deliveryAddressStr = `${order.user.companyStreet || ''}, ${order.user.companyZip || ''} ${order.user.companyCity || ''}, ${country}`.trim();
    }

    // Create delivery note
    const deliveryNote = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        type: InvoiceType.DELIVERY_NOTE,
        customerCompany: order.user.company || order.user.companyName || 'N/A',
        customerName: order.user.name || `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'N/A',
        customerAddress: deliveryAddressStr,
        customerCountry: order.user.companyCountry || 'DE',
        customerVatId: order.user.vatId,
        netAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        grossAmount: 0,
      },
    });

    return deliveryNote;
  }

  async getInvoicesForOrder(orderId: string) {
    return this.prisma.invoice.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async downloadInvoicePdf(invoiceId: string): Promise<Buffer> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    packageItems: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return this.pdfGenerator.generateInvoicePdf(invoice as any);
  }

  async getAllInvoices() {
    return this.prisma.invoice.findMany({
      include: {
        order: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                company: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // LEGACY METHODS - Keep for backward compatibility with existing commission invoices
  // These use the old invoice logic for monthly commission reports

  /**
   * Generate monthly invoice PDF for reseller
   */
  async generateMonthlyInvoice(
    userId: string,
    year: number,
    month: number,
    res: any,
  ) {
    const PDFDocument = require('pdfkit');
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Calculate date range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get commissions for this month
    const commissions = await this.prisma.commission.findMany({
      where: {
        resellerId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        order: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Get wallet transactions for this month
    const transactions = await this.prisma.walletTransaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate totals
    const totalCommissions = commissions.reduce(
      (sum, c) => sum + Number(c.amount),
      0,
    );
    const paidCommissions = commissions
      .filter(c => c.status === 'PAID')
      .reduce((sum, c) => sum + Number(c.amount), 0);
    const pendingCommissions = commissions
      .filter(c => c.status === 'PENDING')
      .reduce((sum, c) => sum + Number(c.amount), 0);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${year}-${month.toString().padStart(2, '0')}.pdf`,
    );

    // Pipe to response
    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text('Monatsabrechnung', { align: 'center' })
      .moveDown();

    // Period
    doc
      .fontSize(14)
      .text(`Zeitraum: ${this.formatMonth(month)} ${year}`, { align: 'center' })
      .moveDown(2);

    // User info
    doc.fontSize(12).text('Reseller:', { underline: true });
    doc
      .fontSize(10)
      .text(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email);
    if (user.company) doc.text(user.company);
    doc.text(user.email);
    if (user.vatId) doc.text(`USt-IdNr.: ${user.vatId}`);
    doc.moveDown(2);

    // Commissions table
    doc.fontSize(12).text('Kommissionen:', { underline: true }).moveDown();

    if (commissions.length === 0) {
      doc.fontSize(10).text('Keine Kommissionen in diesem Zeitraum.');
    } else {
      // Table header
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 150;
      const col3 = 300;
      const col4 = 400;
      const col5 = 480;

      doc
        .fontSize(9)
        .text('Datum', col1, tableTop, { width: 90 })
        .text('Bestellung', col2, tableTop, { width: 140 })
        .text('Käufer', col3, tableTop, { width: 90 })
        .text('Betrag', col4, tableTop, { width: 70 })
        .text('Provision', col5, tableTop, { width: 70 });

      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
      doc.moveDown();

      // Table rows
      commissions.forEach(commission => {
        const y = doc.y;
        const buyerName =
          `${commission.order.user.firstName || ''} ${commission.order.user.lastName || ''}`.trim() ||
          commission.order.user.email;

        doc
          .fontSize(8)
          .text(
            new Date(commission.createdAt).toLocaleDateString('de-DE'),
            col1,
            y,
            { width: 90 },
          )
          .text(commission.orderId.substring(0, 8), col2, y, { width: 140 })
          .text(buyerName, col3, y, { width: 90 })
          .text(`€${Number(commission.order.totalAmount).toFixed(2)}`, col4, y, {
            width: 70,
          })
          .text(`€${Number(commission.amount).toFixed(2)}`, col5, y, {
            width: 70,
          });

        doc.moveDown(0.5);
      });

      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
    }

    // Summary
    doc.moveDown();
    doc.fontSize(12).text('Zusammenfassung:', { underline: true }).moveDown();

    doc
      .fontSize(10)
      .text(`Gesamt Kommissionen: €${totalCommissions.toFixed(2)}`);
    doc.text(`Bereits ausgezahlt: €${paidCommissions.toFixed(2)}`);
    doc
      .fontSize(12)
      .text(`Noch ausstehend: €${pendingCommissions.toFixed(2)}`, {
        bold: true,
      });

    // Footer
    doc
      .moveDown(3)
      .fontSize(8)
      .text('E-Commerce Rente - Premium Warenpakete Portal', {
        align: 'center',
      })
      .text('https://www.ecommercerente.com', { align: 'center' });

    // Finalize PDF
    doc.end();
  }

  /**
   * Get list of available invoices for a user
   */
  async getAvailableInvoices(userId: string) {
    // Get first commission date
    const firstCommission = await this.prisma.commission.findFirst({
      where: { resellerId: userId },
      orderBy: { createdAt: 'asc' },
    });

    if (!firstCommission) {
      return [];
    }

    const startDate = new Date(firstCommission.createdAt);
    const now = new Date();
    const invoices = [];

    // Generate list of months from first commission to now
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (current <= now) {
      invoices.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        label: `${this.formatMonth(current.getMonth() + 1)} ${current.getFullYear()}`,
      });
      current.setMonth(current.getMonth() + 1);
    }

    return invoices.reverse(); // Most recent first
  }

  private formatMonth(month: number): string {
    const months = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    return months[month - 1];
  }

  /**
   * Generate order invoice PDF (LEGACY)
   */
  async generateOrderInvoice(orderId: string, res?: any): Promise<Buffer | void> {
    const PDFDocument = require('pdfkit');
    // Get order with all details
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        user: true,
        deliveryAddress: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PAID') {
      throw new BadRequestException('Order not paid yet');
    }

    // Generate invoice number if not exists
    if (!order.invoiceNumber) {
      const invoiceNumber = await this.generateLegacyInvoiceNumber();
      await this.prisma.order.update({
        where: { id: orderId },
        data: { invoiceNumber },
      });
      order.invoiceNumber = invoiceNumber;
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    // If no response object, collect chunks to return buffer
    if (!res) {
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        return Buffer.concat(chunks);
      });
    } else {
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=rechnung-${order.invoiceNumber}.pdf`,
      );
      doc.pipe(res);
    }

    // Header
    doc
      .fontSize(24)
      .text('RECHNUNG', { align: 'center', underline: true })
      .moveDown(2);

    // Invoice details
    doc.fontSize(10);
    doc.text(`Rechnungsnummer: ${order.invoiceNumber}`);
    doc.text(`Rechnungsdatum: ${order.paidAt ? new Date(order.paidAt).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE')}`);
    doc.text(`Bestellnummer: ${order.id.substring(0, 8).toUpperCase()}`);
    doc.moveDown(2);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Company info (Rechnungssteller)
    doc.fontSize(12).text('Rechnungssteller (Plattformbetreiber):', { underline: true });
    doc.fontSize(10).moveDown(0.5);
    doc.text('Marketplace24-7 GmbH');
    doc.text('Kantonsstrasse 1');
    doc.text('8807 Freienbach SZ');
    doc.text('Schweiz');
    doc.text('Handelsregister: CH-130.4.033.363-2');
    doc.text('E-Mail: info@non-dom.group');
    doc.moveDown(2);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Customer info (Rechnungsempfänger)
    doc.fontSize(12).text('Rechnungsempfänger:', { underline: true });
    doc.fontSize(10).moveDown(0.5);

    if (order.user.company || order.user.companyName) {
      doc.text(order.user.company || order.user.companyName || '');
    }

    const customerName = `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim();
    if (customerName) {
      doc.text(customerName);
    } else {
      doc.text(order.user.email);
    }

    // Use delivery address if available
    if (order.deliveryAddress) {
      doc.text(order.deliveryAddress.street || '');
      doc.text(`${order.deliveryAddress.zipCode || ''} ${order.deliveryAddress.city || ''}`);
      doc.text(order.deliveryAddress.country || '');
    } else if (order.user.companyStreet) {
      doc.text(order.user.companyStreet);
      doc.text(`${order.user.companyZip || ''} ${order.user.companyCity || ''}`);
      doc.text(order.user.companyCountry || '');
    }

    if (order.user.vatId) {
      doc.text(`USt-IdNr.: ${order.user.vatId}`);
    }
    doc.moveDown(2);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Items table
    doc.fontSize(12).text('Positionen:', { underline: true }).moveDown();

    const tableTop = doc.y;
    const col1 = 50;  // Pos
    const col2 = 80;  // Artikel
    const col3 = 340; // Menge
    const col4 = 390; // Einzelpreis
    const col5 = 480; // Gesamt

    // Table header
    doc.fontSize(9)
      .text('Pos', col1, tableTop, { width: 25 })
      .text('Artikel', col2, tableTop, { width: 250 })
      .text('Menge', col3, tableTop, { width: 40 })
      .text('Einzelpreis', col4, tableTop, { width: 80 })
      .text('Gesamt', col5, tableTop, { width: 70 });

    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown();

    // Table rows
    order.items.forEach((item, index) => {
      const y = doc.y;
      const itemTotal = Number(item.price) * item.quantity;

      doc.fontSize(8)
        .text((index + 1).toString(), col1, y, { width: 25 })
        .text(item.product.name, col2, y, { width: 250 })
        .text(item.quantity.toString(), col3, y, { width: 40 })
        .text(`€${Number(item.price).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`, col4, y, { width: 80 })
        .text(`€${itemTotal.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`, col5, y, { width: 70 });

      doc.moveDown(0.8);
    });

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(2);

    // Totals
    const totalNet = Number(order.totalAmount);
    const vat = 0; // Reverse charge
    const totalGross = totalNet;

    doc.fontSize(10);
    doc.text(`Nettobetrag: €${totalNet.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`, { align: 'right' });
    doc.text('MwSt (0% - Schweizer Unternehmen, Reverse Charge): €0,00', { align: 'right' });
    doc.fontSize(12)
      .text(`Gesamtbetrag: €${totalGross.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`, { align: 'right', bold: true });

    doc.moveDown(2);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // B2B notice
    doc.fontSize(9).text(
      'Hinweis: Diese Rechnung richtet sich ausschließlich an Gewerbetreibende (B2B). Bei EU-Kunden mit gültiger USt-IdNr. gilt das Reverse-Charge-Verfahren.',
      { align: 'left' }
    );

    doc.moveDown();
    doc.fontSize(10).text(
      `Zahlungsstatus: BEZAHLT am ${order.paidAt ? new Date(order.paidAt).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE')}`,
      { bold: true }
    );

    doc.moveDown(2);

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Footer
    doc.fontSize(8).text(
      'Marketplace24-7 GmbH | Kantonsstrasse 1, 8807 Freienbach SZ',
      { align: 'center' }
    );

    // Finalize PDF
    doc.end();

    if (!res) {
      return new Promise((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
      });
    }
  }

  /**
   * Generate unique invoice number (LEGACY)
   */
  private async generateLegacyInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.order.count({
      where: {
        invoiceNumber: { startsWith: `RE-${year}` },
      },
    });
    return `RE-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  /**
   * Send invoice email with PDF attachment (LEGACY)
   */
  async sendInvoiceEmail(orderId: string) {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: { include: { product: true } } },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!order.invoiceNumber) {
      throw new BadRequestException('Invoice number not generated yet');
    }

    // Generate PDF as buffer
    const pdfBuffer = await this.generateOrderInvoice(orderId);

    // Send email with Resend
    try {
      await resend.emails.send({
        from: 'Marketplace24-7 GmbH <noreply@ecommercerente.com>',
        to: order.user.email,
        subject: `Ihre Rechnung ${order.invoiceNumber} - Marketplace24-7 GmbH`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4AF37;">Vielen Dank für Ihre Bestellung!</h2>

            <p>Sehr geehrte/r ${order.user.firstName ? `${order.user.firstName} ${order.user.lastName || ''}` : order.user.email},</p>

            <p>im Anhang finden Sie Ihre Rechnung <strong>${order.invoiceNumber}</strong> für Ihre Bestellung <strong>#${order.id.substring(0, 8).toUpperCase()}</strong>.</p>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Rechnungsdetails</h3>
              <p style="margin: 5px 0;"><strong>Rechnungsnummer:</strong> ${order.invoiceNumber}</p>
              <p style="margin: 5px 0;"><strong>Rechnungsdatum:</strong> ${order.paidAt ? new Date(order.paidAt).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE')}</p>
              <p style="margin: 5px 0;"><strong>Gesamtbetrag:</strong> €${Number(order.totalAmount).toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
              <p style="margin: 5px 0; color: #5cb85c;"><strong>Status:</strong> Bezahlt ✓</p>
            </div>

            <p><strong>Bestellte Produkte:</strong></p>
            <ul>
              ${order.items.map(item => `<li>${item.product.name} - Menge: ${item.quantity}</li>`).join('')}
            </ul>

            <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              Bei Fragen zu Ihrer Rechnung kontaktieren Sie uns bitte unter <a href="mailto:info@non-dom.group">info@non-dom.group</a>
            </p>

            <p style="color: #666; font-size: 12px;">
              <strong>Marketplace24-7 GmbH</strong><br>
              Kantonsstrasse 1<br>
              8807 Freienbach SZ<br>
              Schweiz
            </p>
          </div>
        `,
        attachments: [
          {
            filename: `rechnung-${order.invoiceNumber}.pdf`,
            content: pdfBuffer as Buffer,
          },
        ],
      });


      // Mark as sent
      await this.prisma.order.update({
        where: { id: orderId },
        data: { invoiceSentAt: new Date() },
      });
    } catch (error) {
      console.error('Failed to send invoice email:', error);
      throw new BadRequestException('Failed to send invoice email');
    }
  }
}
