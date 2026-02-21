import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { VerifyCustomerDto } from './dto/verify-customer.dto';
import { OrderStatusDto } from './dto/order-status.dto';
import { AiAgentCreateLeadDto } from './dto/create-lead.dto';
import { BookCallbackDto } from './dto/book-callback.dto';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // ===== TOOL 1: VERIFY CUSTOMER =====
  async verifyCustomer(dto: VerifyCustomerDto) {
    this.logger.log(`AI-Agent: Verifying customer - email: ${dto.email}, id: ${dto.customer_id}`);
    try {
      let user = null;
      if (dto.email) {
        user = await this.prisma.user.findUnique({
          where: { email: dto.email.toLowerCase().trim() },
          select: { id: true, name: true, firstName: true, lastName: true, company: true, companyName: true, email: true, customerStatus: true },
        });
      } else if (dto.customer_id) {
        user = await this.prisma.user.findUnique({
          where: { id: dto.customer_id },
          select: { id: true, name: true, firstName: true, lastName: true, company: true, companyName: true, email: true, customerStatus: true },
        });
      }
      if (!user) {
        return { verified: false, message: 'Kein Konto mit diesen Daten gefunden.' };
      }
      const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'Kunde';
      const companyName = user.company || user.companyName || 'Nicht angegeben';
      return { verified: true, user_id: user.id, name: displayName, company: companyName, email: user.email, status: user.customerStatus || 'active', message: `Kunde verifiziert: ${displayName} von ${companyName}.` };
    } catch (error) {
      this.logger.error('Verify customer error:', error);
      return { verified: false, message: 'Technischer Fehler bei der Verifizierung.' };
    }
  }

  // ===== TOOL 2: ORDER STATUS =====
  async getOrderStatus(dto: OrderStatusDto) {
    this.logger.log(`AI-Agent: Getting order status - user_id: ${dto.user_id}`);
    try {
      if (dto.order_id) {
        const order = await this.prisma.order.findFirst({
          where: { id: dto.order_id, userId: dto.user_id },
          include: { items: { include: { product: true } } },
        });
        if (!order) return { found: false, message: 'Bestellung nicht gefunden.' };
        return { found: true, orders: [this.formatOrder(order)], message: `Bestellung ${order.id.substring(0, 8)}: ${this.translateStatus(order.status)}.` };
      }
      const orders = await this.prisma.order.findMany({
        where: { userId: dto.user_id },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      if (orders.length === 0) return { found: false, orders: [], message: 'Keine Bestellungen gefunden.' };
      return { found: true, total_orders: orders.length, orders: orders.map((o) => this.formatOrder(o)), message: `${orders.length} Bestellung(en). Letzte: ${this.translateStatus(orders[0].status)}.` };
    } catch (error) {
      this.logger.error('Order status error:', error);
      return { found: false, message: 'Technischer Fehler beim Abrufen der Bestellungen.' };
    }
  }

  // ===== TOOL 3: CREATE LEAD =====
  async createLead(dto: AiAgentCreateLeadDto) {
    this.logger.log(`AI-Agent: Creating lead - ${dto.contact_name} from ${dto.company_name}`);
    try {
      const budgetNum = this.parseBudgetFromAgent(dto.budget);
      const budgetRange = this.toBudgetRange(budgetNum);
      const isQualified = budgetNum >= 10000;
      const nameParts = dto.contact_name.trim().split(' ');
      const firstName = nameParts[0] || dto.contact_name;
      const lastName = nameParts.slice(1).join(' ') || '';

      let consultant = null;
      if (isQualified) {
        consultant = await this.assignConsultantRoundRobin();
      }

      const lead = await this.prisma.funnelLead.create({
        data: {
          firstName, lastName,
          email: dto.email || 'phone-lead@ecommercerente.com',
          phone: dto.phone || '',
          company: dto.company_name,
          budget: budgetRange,
          industry: dto.industry || 'Nicht angegeben',
          ecommerceExperience: 'none',
          companySize: '1',
          source: dto.source || 'phone',
          timeframe: 'immediate',
          isQualified,
          consultantId: consultant?.id || null,
          sourceChannel: 'phone',
          notes: `Lead erstellt durch AI-Telefonagent. Budget: ${dto.budget || 'nicht angegeben'}`,
        },
        include: { consultant: true },
      });

      if (isQualified && consultant) {
        try { await this.emailService.sendConsultantLeadNotification(consultant.email, lead); }
        catch (e) { this.logger.error('Email error:', e); }
      }

      return {
        success: true, lead_id: lead.id, is_qualified: isQualified,
        consultant_name: consultant?.name || null,
        message: isQualified
          ? `Lead erstellt. Berater ${consultant?.name || 'wird zugewiesen'} übernimmt.`
          : `Lead erstellt. Ein Berater wird sich melden.`,
      };
    } catch (error) {
      this.logger.error('Create lead error:', error);
      return { success: false, message: 'Daten konnten nicht gespeichert werden.' };
    }
  }

  // ===== TOOL 4: BOOK CALLBACK =====
  async bookCallback(dto: BookCallbackDto) {
    this.logger.log(`AI-Agent: Booking callback for lead ${dto.lead_id}`);
    try {
      const lead = await this.prisma.funnelLead.findUnique({ where: { id: dto.lead_id }, include: { consultant: true } });
      if (!lead) return { success: false, message: 'Lead nicht gefunden.' };

      const callbackNote = `Rückruf gewünscht: ${dto.preferred_date || 'flexibel'} um ${dto.preferred_time || 'flexibel'}. ${dto.notes || ''}`;
      await this.prisma.funnelLead.update({
        where: { id: dto.lead_id },
        data: { notes: lead.notes ? `${lead.notes}\n\n${callbackNote}` : callbackNote, status: 'CONTACTED' },
      });

      const consultant = lead.consultant;
      if (consultant) {
        try { await this.emailService.sendConsultantLeadNotification(consultant.email, { ...lead, notes: callbackNote } as any); }
        catch (e) { this.logger.error('Email error:', e); }
      }

      return {
        success: true, callback_date: dto.preferred_date || 'Wird vereinbart',
        callback_time: dto.preferred_time || 'Wird vereinbart',
        consultant_name: consultant?.name || 'Wird zugewiesen',
        message: `Rückruf vorgemerkt${consultant ? ` für ${consultant.name}` : ''}. Bestätigung per E-Mail.`,
      };
    } catch (error) {
      this.logger.error('Book callback error:', error);
      return { success: false, message: 'Termin konnte nicht gebucht werden.' };
    }
  }

  // ===== POST-CALL WEBHOOK =====
  async handlePostCall(body: any) {
    this.logger.log('AI-Agent: Processing post-call webhook');
    try {
      const conversationId = body?.conversation_id || body?.id;
      const agentId = body?.agent_id;
      const transcript = body?.transcript || body?.conversation?.transcript;
      const analysis = body?.analysis || body?.data_collection;
      const duration = body?.metadata?.call_duration_secs || body?.call_duration_secs;
      const callerPhone = body?.metadata?.caller_phone || body?.phone_number;

      const sentiment = analysis?.customer_satisfied === 'success' ? 'positive' : analysis?.customer_satisfied === 'failure' ? 'negative' : 'neutral';

      const phoneCall = await this.prisma.phoneCall.create({
        data: {
          conversationId: conversationId || `manual-${Date.now()}`,
          agentId, callerPhone, callerType: analysis?.caller_type || null,
          duration: duration ? Math.round(Number(duration)) : null,
          outcome: analysis?.follow_up_needed ? 'transferred' : 'info_given',
          transcript: typeof transcript === 'string' ? transcript : JSON.stringify(transcript),
          summary: analysis?.caller_intent || null,
          sentiment, analysisData: analysis || null,
        },
      });
      this.logger.log(`PhoneCall saved: ${phoneCall.id}`);
      return { success: true, phone_call_id: phoneCall.id };
    } catch (error) {
      this.logger.error('Post-call error:', error);
      return { success: false };
    }
  }

  // ===== ADMIN =====
  async getPhoneCalls(filters?: { callerType?: string; outcome?: string; sentiment?: string; limit?: number }) {
    const where: any = {};
    if (filters?.callerType) where.callerType = filters.callerType;
    if (filters?.outcome) where.outcome = filters.outcome;
    if (filters?.sentiment) where.sentiment = filters.sentiment;
    return this.prisma.phoneCall.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, company: true } },
        funnelLead: { select: { id: true, firstName: true, lastName: true, company: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
    });
  }

  async getPhoneCallStats() {
    const [total, today, leads, callbacks] = await Promise.all([
      this.prisma.phoneCall.count(),
      this.prisma.phoneCall.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      this.prisma.phoneCall.count({ where: { outcome: 'lead_created' } }),
      this.prisma.phoneCall.count({ where: { outcome: 'callback_booked' } }),
    ]);
    const avgDuration = await this.prisma.phoneCall.aggregate({ _avg: { duration: true } });
    return { total, today, leads_created: leads, callbacks_booked: callbacks, avg_duration_seconds: Math.round(avgDuration._avg.duration || 0) };
  }

  // ===== HELPERS =====
  private formatOrder(order: any) {
    return {
      order_id: order.id.substring(0, 8), status: this.translateStatus(order.status),
      total: `€${Number(order.totalAmount).toFixed(2)}`, date: order.createdAt.toLocaleDateString('de-DE'),
      products: order.items?.map((item: any) => ({ name: item.product?.name || 'Produkt', quantity: item.quantity })) || [],
    };
  }

  private translateStatus(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Ausstehend — wartet auf Zahlung', PAID: 'Bezahlt — wird vorbereitet',
      PROCESSING: 'In Bearbeitung', SHIPPED: 'Versendet — unterwegs',
      DELIVERED: 'Zugestellt', CANCELLED: 'Storniert',
    };
    return map[status] || status;
  }

  private parseBudgetFromAgent(budget?: string): number {
    if (!budget) return 0;
    const cleaned = budget.replace(/[€$\s.]/g, '').replace(',', '.').toLowerCase();
    if (cleaned.endsWith('k')) return parseFloat(cleaned.replace('k', '')) * 1000;
    return parseFloat(cleaned) || 0;
  }

  private toBudgetRange(amount: number): string {
    if (amount >= 100000) return '100k+';
    if (amount >= 50000) return '50k-100k';
    if (amount >= 25000) return '25k-50k';
    if (amount >= 10000) return '10k-25k';
    return '5k-10k';
  }

  private async assignConsultantRoundRobin() {
    const consultants = await this.prisma.consultant.findMany({ where: { isActive: true }, orderBy: { assignedLeads: 'asc' } });
    if (consultants.length === 0) return null;
    const consultant = consultants[0];
    await this.prisma.consultant.update({ where: { id: consultant.id }, data: { assignedLeads: { increment: 1 } } });
    return consultant;
  }
}
