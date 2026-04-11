import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { GhlService } from '../ghl/ghl.service';
import { CreateSellerApplicationDto } from './dto/create-seller-application.dto';
import { UpdateSellerApplicationDto } from './dto/update-seller-application.dto';

@Injectable()
export class SellerApplicationsService {
  private readonly logger = new Logger(SellerApplicationsService.name);
  private readonly adminEmail = 'info@ecommercerente.com';

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly ghlService: GhlService,
  ) {}

  async create(dto: CreateSellerApplicationDto) {
    this.logger.log(`Neue Verkäufer-Bewerbung: ${dto.email} (${dto.company})`);

    const application = await this.prisma.sellerApplication.create({
      data: dto,
    });

    // GHL Sync — fire and forget
    const nameParts = application.contactName.trim().split(' ');
    this.ghlService.upsertContact({
      firstName: nameParts[0] || application.contactName,
      lastName: nameParts.slice(1).join(' ') || '',
      email: application.email,
      phone: application.phone || undefined,
      companyName: application.company,
      tags: ['seller-application', `category-${application.productCategory}`],
      source: 'markenware-bewerbung',
    }).then((contactId) => {
      if (contactId) {
        this.ghlService.addNote(
          contactId,
          `Verkäufer-Bewerbung:\nFirma: ${application.company}\nKategorie: ${application.productCategory}\nProdukte: ${application.productCount || 'k.A.'}\nSortiment: ${application.message}`,
        ).catch(() => {});
      }
    }).catch(() => {});

    // Emails asynchron versenden — Fehler sollen den Request nicht blockieren
    this.sendEmails(application).catch((err) =>
      this.logger.error(`Email-Versand fehlgeschlagen: ${err.message}`),
    );

    return { success: true, id: application.id };
  }

  private async sendEmails(application: any) {
    await Promise.all([
      this.emailService.sendSellerApplicationConfirmation(
        application.email,
        application.company,
        application.contactName,
      ),
      this.emailService.sendSellerApplicationAdminNotification(
        this.adminEmail,
        application,
      ),
    ]);
  }

  async findAll(status?: string) {
    return this.prisma.sellerApplication.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.sellerApplication.findUnique({
      where: { id },
    });
    if (!application) {
      throw new NotFoundException(`Bewerbung ${id} nicht gefunden`);
    }
    return application;
  }

  async update(id: string, dto: UpdateSellerApplicationDto) {
    await this.findOne(id); // 404 wenn nicht vorhanden
    return this.prisma.sellerApplication.update({
      where: { id },
      data: {
        ...dto,
        reviewedAt: dto.status ? new Date() : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.sellerApplication.delete({ where: { id } });
    return { success: true };
  }
}
