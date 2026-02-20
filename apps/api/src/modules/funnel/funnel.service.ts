import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateConsultantDto } from './dto/create-consultant.dto';
import { UpdateConsultantDto } from './dto/update-consultant.dto';

@Injectable()
export class FunnelService {
  private readonly logger = new Logger(FunnelService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // ===== LEADS =====

  async createLead(createLeadDto: CreateLeadDto) {
    this.logger.log(`Creating new lead: ${createLeadDto.email}`);

    // Qualifizierung: Budget >= 10k?
    const budgetValue = this.parseBudget(createLeadDto.budget);
    const isQualified = budgetValue >= 10000;

    let consultant = null;
    let consultantId = null;

    // Wenn qualifiziert → Berater zuweisen (Round-Robin)
    if (isQualified) {
      consultant = await this.assignConsultantRoundRobin();
      consultantId = consultant?.id || null;
    }

    // Lead erstellen
    const lead = await this.prisma.funnelLead.create({
      data: {
        ...createLeadDto,
        isQualified,
        consultantId,
      },
      include: {
        consultant: true,
      },
    });

    // Emails versenden
    try {
      // 1. Lead-Bestätigung
      await this.emailService.sendLeadThankYou(
        lead.email,
        lead,
        consultant,
      );

      // 2. Berater-Benachrichtigung (nur bei qualifizierten Leads)
      if (isQualified && consultant) {
        await this.emailService.sendConsultantLeadNotification(
          consultant.email,
          lead,
        );
      }
    } catch (error) {
      this.logger.error('Failed to send emails:', error);
    }

    return lead;
  }

  async getLeads(filters?: {
    status?: string;
    isQualified?: boolean;
    consultantId?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.isQualified !== undefined) {
      where.isQualified = filters.isQualified;
    }

    if (filters?.consultantId) {
      where.consultantId = filters.consultantId;
    }

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.funnelLead.findMany({
      where,
      include: {
        consultant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLeadById(id: string) {
    const lead = await this.prisma.funnelLead.findUnique({
      where: { id },
      include: {
        consultant: true,
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return lead;
  }

  async updateLead(id: string, updateLeadDto: UpdateLeadDto) {
    const lead = await this.getLeadById(id);

    const updateData: any = { ...updateLeadDto };

    if (updateLeadDto.calendlyBooked) {
      updateData.bookedAt = new Date();
    }

    return this.prisma.funnelLead.update({
      where: { id },
      data: updateData,
      include: {
        consultant: true,
      },
    });
  }

  async getLeadStats() {
    const [total, qualified, contacted, converted] = await Promise.all([
      this.prisma.funnelLead.count(),
      this.prisma.funnelLead.count({ where: { isQualified: true } }),
      this.prisma.funnelLead.count({ where: { status: 'CONTACTED' } }),
      this.prisma.funnelLead.count({ where: { status: 'CONVERTED' } }),
    ]);

    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    return {
      total,
      qualified,
      contacted,
      converted,
      conversionRate: Math.round(conversionRate * 10) / 10,
    };
  }

  // ===== CONSULTANTS =====

  async createConsultant(createConsultantDto: CreateConsultantDto) {
    return this.prisma.consultant.create({
      data: createConsultantDto,
    });
  }

  async getConsultants() {
    return this.prisma.consultant.findMany({
      include: {
        _count: {
          select: { leads: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getConsultantById(id: string) {
    const consultant = await this.prisma.consultant.findUnique({
      where: { id },
      include: {
        leads: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!consultant) {
      throw new NotFoundException(`Consultant with ID ${id} not found`);
    }

    return consultant;
  }

  async updateConsultant(id: string, updateConsultantDto: UpdateConsultantDto) {
    await this.getConsultantById(id);

    return this.prisma.consultant.update({
      where: { id },
      data: updateConsultantDto,
    });
  }

  async deleteConsultant(id: string) {
    await this.getConsultantById(id);

    // Soft delete: Deaktivieren statt löschen
    return this.prisma.consultant.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ===== ROUND-ROBIN LOGIC =====

  private async assignConsultantRoundRobin() {
    const consultants = await this.prisma.consultant.findMany({
      where: { isActive: true },
      orderBy: { assignedLeads: 'asc' }, // Wer hat am wenigsten?
    });

    if (consultants.length === 0) {
      this.logger.warn('No active consultants available for assignment');
      return null;
    }

    // Erster Berater mit den wenigsten Leads
    const consultant = consultants[0];

    // Increment counter
    await this.prisma.consultant.update({
      where: { id: consultant.id },
      data: { assignedLeads: { increment: 1 } },
    });

    this.logger.log(`Assigned consultant ${consultant.name} (ID: ${consultant.id})`);

    return consultant;
  }

  // ===== HELPERS =====

  private parseBudget(budgetString: string): number {
    const budgetMap: Record<string, number> = {
      '5k-10k': 5000,
      '10k-25k': 10000,
      '25k-50k': 25000,
      '50k-100k': 50000,
      '100k+': 100000,
    };

    return budgetMap[budgetString] || 0;
  }
}
