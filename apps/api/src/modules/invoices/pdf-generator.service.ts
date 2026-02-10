import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Invoice, InvoiceType } from '@prisma/client';

interface InvoiceData extends Invoice {
  order: {
    id: string;
    items: Array<{
      quantity: number;
      price: number;
      product: {
        name: string;
        packageItems: Array<{
          name: string;
          quantity: number;
        }>;
      };
    }>;
  };
}

@Injectable()
export class PdfGeneratorService {
  async generateInvoicePdf(invoice: InvoiceData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      if (invoice.type === InvoiceType.INVOICE) {
        this.generateInvoice(doc, invoice);
      } else {
        this.generateDeliveryNote(doc, invoice);
      }

      doc.end();
    });
  }

  private generateInvoice(doc: PDFKit.PDFDocument, invoice: InvoiceData) {
    const isReverseCharge = invoice.customerCountry === 'DE' || invoice.customerCountry === 'AT';

    // Header - Trademark24-7 AG
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .text('Trademark24-7 AG', 50, 50)
      .font('Helvetica')
      .fontSize(10)
      .text('Kantonsstrasse 1', 50, 68)
      .text('8807 Freienbach, Schweiz', 50, 83)
      .text('CHE-246.473.858 MWST', 50, 98);

    // Line separator
    doc.moveTo(50, 130).lineTo(545, 130).stroke();

    // Invoice title and number
    doc.fontSize(16)
      .font('Helvetica-Bold')
      .text('RECHNUNG', 50, 145)
      .fontSize(10)
      .font('Helvetica')
      .text(`Nr. ${invoice.invoiceNumber}`, 50, 168)
      .text(`Datum: ${this.formatDate(invoice.issuedAt)}`, 50, 183);

    // Line separator
    doc.moveTo(50, 210).lineTo(545, 210).stroke();

    // Customer details
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text('Rechnungsempfänger:', 50, 230)
      .font('Helvetica')
      .text(invoice.customerCompany, 50, 248)
      .text(invoice.customerName, 50, 263)
      .text(invoice.customerAddress, 50, 278);

    if (invoice.customerVatId) {
      doc.text(`UID: ${invoice.customerVatId}`, 50, 293);
    }

    // Order details
    doc.text(`Bestellung: ${invoice.order.id.substring(0, 8)}`, 50, 320)
      .text(`Zahlungsart: Stripe${invoice.stripePaymentIntentId ? ` (${invoice.stripePaymentIntentId.substring(0, 20)}...)` : ''}`, 50, 335);

    // Items table
    const tableTop = 370;
    doc.font('Helvetica-Bold')
      .text('Bezeichnung', 50, tableTop)
      .text('Menge', 320, tableTop, { width: 60, align: 'right' })
      .text('Betrag', 420, tableTop, { width: 100, align: 'right' });

    doc.moveTo(50, tableTop + 20).lineTo(545, tableTop + 20).stroke();

    let y = tableTop + 30;

    invoice.order.items.forEach((item) => {
      // Product name
      doc.font('Helvetica-Bold').text(item.product.name, 50, y);

      // Quantity (package count)
      doc.font('Helvetica').text(item.quantity.toString(), 320, y, { width: 60, align: 'right' });

      // Amount
      const itemTotal = Number(item.price) * item.quantity;
      doc.text(`€ ${this.formatAmount(itemTotal)}`, 420, y, { width: 100, align: 'right' });

      y += 18;

      // Package items (Stückliste)
      if (item.product.packageItems && item.product.packageItems.length > 0) {
        doc.font('Helvetica').fontSize(9).text('  enthält:', 50, y);
        y += 14;

        item.product.packageItems.forEach((pkgItem) => {
          doc.text(`  • ${pkgItem.name}`, 50, y);
          doc.text(`${pkgItem.quantity}x`, 320, y, { width: 60, align: 'right' });
          y += 12;
        });

        doc.fontSize(10);
        y += 5;
      }
    });

    // Totals
    doc.moveTo(50, y).lineTo(545, y).stroke();
    y += 15;

    const netAmount = invoice.netAmount / 100;
    const taxAmount = invoice.taxAmount / 100;
    const grossAmount = invoice.grossAmount / 100;

    doc.font('Helvetica').text('Netto:', 350, y)
      .text(`€ ${this.formatAmount(netAmount)}`, 420, y, { width: 100, align: 'right' });
    y += 18;

    if (isReverseCharge) {
      doc.text('MWST:', 350, y)
        .text(`0%`, 390, y, { width: 30, align: 'right' })
        .text(`€ 0,00`, 420, y, { width: 100, align: 'right' });
    } else {
      doc.text('MWST:', 350, y)
        .text(`${invoice.taxRate}%`, 390, y, { width: 30, align: 'right' })
        .text(`€ ${this.formatAmount(taxAmount)}`, 420, y, { width: 100, align: 'right' });
    }
    y += 18;

    doc.moveTo(350, y).lineTo(545, y).stroke();
    y += 10;

    doc.font('Helvetica-Bold')
      .text('GESAMT:', 350, y)
      .text(`€ ${this.formatAmount(grossAmount)}`, 420, y, { width: 100, align: 'right' });
    y += 30;

    // Tax notice
    doc.font('Helvetica').fontSize(9);
    if (isReverseCharge) {
      doc.text(
        'Steuerfreie Ausfuhrlieferung. Die Steuerschuld geht gemäß Reverse-Charge-Verfahren auf den Leistungsempfänger über.',
        50,
        y,
        { width: 495, align: 'left' }
      );
    } else {
      doc.text(`inkl. ${invoice.taxRate}% Schweizer MWST`, 50, y);
    }
    y += 30;

    // Payment notice
    doc.fontSize(10).text(`Bezahlt am: ${this.formatDate(invoice.issuedAt)} via Stripe`, 50, y);

    // Footer
    doc.fontSize(8)
      .font('Helvetica')
      .text(
        'Trademark24-7 AG | Kantonsstrasse 1, 8807 Freienbach | CHE-246.473.858',
        50,
        750,
        { align: 'center', width: 495 }
      );
  }

  private generateDeliveryNote(doc: PDFKit.PDFDocument, invoice: InvoiceData) {
    // Header - Commercehelden GmbH
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .text('Commercehelden GmbH', 50, 50)
      .fontSize(10)
      .font('Helvetica')
      .text('(im Auftrag von Trademark24-7 AG)', 50, 68)
      .text('Pembaurstraße 14, 6020 Innsbruck', 50, 83);

    // Line separator
    doc.moveTo(50, 115).lineTo(545, 115).stroke();

    // Delivery note title and number
    doc.fontSize(16)
      .font('Helvetica-Bold')
      .text('LIEFERSCHEIN', 50, 130)
      .fontSize(10)
      .font('Helvetica')
      .text(`Nr. ${invoice.invoiceNumber}`, 50, 153)
      .text(`Datum: ${this.formatDate(invoice.issuedAt)}`, 50, 168);

    // Line separator
    doc.moveTo(50, 195).lineTo(545, 195).stroke();

    // Delivery address
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text('Lieferadresse:', 50, 215)
      .font('Helvetica')
      .text(invoice.customerCompany, 50, 233)
      .text(invoice.customerName, 50, 248)
      .text(invoice.customerAddress, 50, 263);

    // Order details
    doc.text(`Bestellung: ${invoice.order.id.substring(0, 8)}`, 50, 290);

    // Items table
    const tableTop = 325;
    doc.font('Helvetica-Bold')
      .text('Bezeichnung', 50, tableTop)
      .text('Menge', 400, tableTop, { width: 120, align: 'right' });

    doc.moveTo(50, tableTop + 20).lineTo(545, tableTop + 20).stroke();

    let y = tableTop + 30;
    let totalItems = 0;

    invoice.order.items.forEach((item) => {
      // Product name
      doc.font('Helvetica-Bold').text(item.product.name, 50, y);
      doc.font('Helvetica').text(`${item.quantity} Paket${item.quantity > 1 ? 'e' : ''}`, 400, y, { width: 120, align: 'right' });
      y += 18;

      // Package items (Stückliste)
      if (item.product.packageItems && item.product.packageItems.length > 0) {
        item.product.packageItems.forEach((pkgItem) => {
          const totalQty = pkgItem.quantity * item.quantity;
          totalItems += totalQty;
          doc.font('Helvetica').fontSize(9)
            .text(`  • ${pkgItem.name}`, 50, y)
            .text(`${totalQty} Stück`, 400, y, { width: 120, align: 'right' });
          y += 12;
        });
        doc.fontSize(10);
        y += 5;
      }
    });

    // Total items line
    doc.moveTo(50, y).lineTo(545, y).stroke();
    y += 15;

    doc.font('Helvetica-Bold')
      .text('Gesamtanzahl Einzelartikel:', 50, y)
      .text(`${totalItems} Stück`, 400, y, { width: 120, align: 'right' });
    y += 30;

    // Important notice
    doc.fontSize(11)
      .font('Helvetica-Bold')
      .text('KEINE PREISE AUF DEM LIEFERSCHEIN!', 50, y, { align: 'center', width: 495 });
    y += 40;

    // Signature fields
    doc.fontSize(10).font('Helvetica');
    doc.text('Empfangen am: _______________', 50, y);
    y += 25;
    doc.text('Unterschrift: _______________', 50, y);

    // Footer
    doc.fontSize(8)
      .font('Helvetica')
      .text(
        'Commercehelden GmbH | FN 626972 v, LG Innsbruck | office@commercehelden.com',
        50,
        750,
        { align: 'center', width: 495 }
      );
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private formatAmount(amount: number): string {
    return amount.toFixed(2).replace('.', ',');
  }
}
