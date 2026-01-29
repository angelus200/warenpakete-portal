import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate monthly invoice PDF for reseller
   */
  async generateMonthlyInvoice(
    userId: string,
    year: number,
    month: number,
    res: Response,
  ) {
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
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
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
}
