import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailAutomationService {
  private readonly logger = new Logger(EmailAutomationService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Haupt-Cron-Job: Läuft jede Stunde zur vollen Stunde
   * Prüft und versendet alle fälligen Email-Sequenzen
   */
  @Cron('0 * * * *')
  async processEmailSequences() {
    this.logger.log('🚀 Starting email sequence processing...');

    try {
      await this.sendFunnelReminder24h();
      await this.sendFunnelUrgency72h();
      await this.sendFunnelContent7d();
      await this.sendUserOnboarding2();
      await this.sendUserOnboarding3();

      this.logger.log('✅ Email sequence processing complete');
    } catch (error) {
      this.logger.error('❌ Error during email sequence processing:', error);
    }
  }

  /**
   * FUNNEL SEQUENZ 1: 24h Reminder
   * Zielgruppe: Qualifizierte Leads, noch nicht gebucht, 24h nach Bewerbung
   */
  private async sendFunnelReminder24h() {
    try {
      const now = Date.now();
      const windowStart = new Date(now - 25 * 60 * 60 * 1000); // 25h ago
      const windowEnd = new Date(now - 24 * 60 * 60 * 1000); // 24h ago

      const leads = await this.prisma.funnelLead.findMany({
        where: {
          isQualified: true,
          calendlyBooked: false,
          emailOptOut: false,
          createdAt: {
            gte: windowStart,
            lte: windowEnd,
          },
          OR: [
            { lastEmailType: { not: 'reminder_24h' } },
            { lastEmailType: null },
          ],
        },
        include: { consultant: true },
      });

      this.logger.log(`Found ${leads.length} leads for 24h reminder`);

      let successCount = 0;
      let failCount = 0;

      for (const lead of leads) {
        try {
          if (!lead.consultant) {
            this.logger.warn(`Lead ${lead.email} has no consultant assigned, skipping...`);
            continue;
          }

          await this.emailService.sendLeadReminder24h(lead.email, lead, lead.consultant);

          await this.prisma.funnelLead.update({
            where: { id: lead.id },
            data: {
              lastEmailType: 'reminder_24h',
              lastEmailSentAt: new Date(),
              emailsSentCount: { increment: 1 },
            },
          });

          successCount++;
        } catch (error) {
          this.logger.error(`Failed to send 24h reminder to ${lead.email}:`, error);
          failCount++;
        }
      }

      this.logger.log(`✓ 24h reminder: ${successCount} sent, ${failCount} failed`);
    } catch (error) {
      this.logger.error('Error in sendFunnelReminder24h:', error);
    }
  }

  /**
   * FUNNEL SEQUENZ 2: 72h Urgency
   * Zielgruppe: Qualifizierte Leads, noch nicht gebucht, 72h nach Bewerbung
   */
  private async sendFunnelUrgency72h() {
    try {
      const now = Date.now();
      const windowStart = new Date(now - 73 * 60 * 60 * 1000); // 73h ago
      const windowEnd = new Date(now - 72 * 60 * 60 * 1000); // 72h ago

      const leads = await this.prisma.funnelLead.findMany({
        where: {
          isQualified: true,
          calendlyBooked: false,
          emailOptOut: false,
          createdAt: {
            gte: windowStart,
            lte: windowEnd,
          },
          OR: [
            { lastEmailType: { not: 'urgency_72h' } },
            { lastEmailType: null },
          ],
        },
        include: { consultant: true },
      });

      this.logger.log(`Found ${leads.length} leads for 72h urgency`);

      let successCount = 0;
      let failCount = 0;

      for (const lead of leads) {
        try {
          if (!lead.consultant) {
            this.logger.warn(`Lead ${lead.email} has no consultant assigned, skipping...`);
            continue;
          }

          await this.emailService.sendLeadUrgency72h(lead.email, lead, lead.consultant);

          await this.prisma.funnelLead.update({
            where: { id: lead.id },
            data: {
              lastEmailType: 'urgency_72h',
              lastEmailSentAt: new Date(),
              emailsSentCount: { increment: 1 },
            },
          });

          successCount++;
        } catch (error) {
          this.logger.error(`Failed to send 72h urgency to ${lead.email}:`, error);
          failCount++;
        }
      }

      this.logger.log(`✓ 72h urgency: ${successCount} sent, ${failCount} failed`);
    } catch (error) {
      this.logger.error('Error in sendFunnelUrgency72h:', error);
    }
  }

  /**
   * FUNNEL SEQUENZ 3: 7 Tage Content Email
   * Zielgruppe: NICHT-qualifizierte Leads (Budget < 10k), 7 Tage nach Bewerbung
   */
  private async sendFunnelContent7d() {
    try {
      const now = Date.now();
      const windowStart = new Date(now - (7 * 24 + 1) * 60 * 60 * 1000); // 7 days + 1h ago
      const windowEnd = new Date(now - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      const leads = await this.prisma.funnelLead.findMany({
        where: {
          isQualified: false, // Nur nicht-qualifizierte
          emailOptOut: false,
          createdAt: {
            gte: windowStart,
            lte: windowEnd,
          },
          OR: [
            { lastEmailType: { not: 'content_7d' } },
            { lastEmailType: null },
          ],
        },
      });

      this.logger.log(`Found ${leads.length} leads for 7d content email`);

      let successCount = 0;
      let failCount = 0;

      for (const lead of leads) {
        try {
          await this.emailService.sendLeadContentEmail7d(lead.email, lead);

          await this.prisma.funnelLead.update({
            where: { id: lead.id },
            data: {
              lastEmailType: 'content_7d',
              lastEmailSentAt: new Date(),
              emailsSentCount: { increment: 1 },
            },
          });

          successCount++;
        } catch (error) {
          this.logger.error(`Failed to send 7d content email to ${lead.email}:`, error);
          failCount++;
        }
      }

      this.logger.log(`✓ 7d content: ${successCount} sent, ${failCount} failed`);
    } catch (error) {
      this.logger.error('Error in sendFunnelContent7d:', error);
    }
  }

  /**
   * USER SEQUENZ 1: Onboarding Email 2 (48h)
   * Zielgruppe: User ohne Bestellung, 48h nach Registrierung
   */
  private async sendUserOnboarding2() {
    try {
      const now = Date.now();
      const windowStart = new Date(now - 49 * 60 * 60 * 1000); // 49h ago
      const windowEnd = new Date(now - 48 * 60 * 60 * 1000); // 48h ago

      const users = await this.prisma.user.findMany({
        where: {
          emailOptOut: false,
          firstOrderAt: null, // Noch keine Bestellung
          emailSequenceCompleted: false,
          onboardingEmail2SentAt: null, // Noch nicht gesendet
          createdAt: {
            gte: windowStart,
            lte: windowEnd,
          },
        },
      });

      this.logger.log(`Found ${users.length} users for onboarding 2`);

      let successCount = 0;
      let failCount = 0;

      for (const user of users) {
        try {
          await this.emailService.sendUserOnboarding2(user.email, user);

          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              onboardingEmail2SentAt: new Date(),
            },
          });

          successCount++;
        } catch (error) {
          this.logger.error(`Failed to send onboarding 2 to ${user.email}:`, error);
          failCount++;
        }
      }

      this.logger.log(`✓ Onboarding 2: ${successCount} sent, ${failCount} failed`);
    } catch (error) {
      this.logger.error('Error in sendUserOnboarding2:', error);
    }
  }

  /**
   * USER SEQUENZ 2: Onboarding Email 3 (5 Tage)
   * Zielgruppe: User ohne Bestellung, 5 Tage nach Registrierung
   */
  private async sendUserOnboarding3() {
    try {
      const now = Date.now();
      const windowStart = new Date(now - (5 * 24 + 1) * 60 * 60 * 1000); // 5 days + 1h ago
      const windowEnd = new Date(now - 5 * 24 * 60 * 60 * 1000); // 5 days ago

      const users = await this.prisma.user.findMany({
        where: {
          emailOptOut: false,
          firstOrderAt: null, // Noch keine Bestellung
          emailSequenceCompleted: false,
          onboardingEmail3SentAt: null, // Noch nicht gesendet
          createdAt: {
            gte: windowStart,
            lte: windowEnd,
          },
        },
      });

      this.logger.log(`Found ${users.length} users for onboarding 3`);

      let successCount = 0;
      let failCount = 0;

      for (const user of users) {
        try {
          await this.emailService.sendUserOnboarding3(user.email, user);

          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              onboardingEmail3SentAt: new Date(),
              emailSequenceCompleted: true, // Nach Email 3 ist Sequenz komplett
            },
          });

          successCount++;
        } catch (error) {
          this.logger.error(`Failed to send onboarding 3 to ${user.email}:`, error);
          failCount++;
        }
      }

      this.logger.log(`✓ Onboarding 3: ${successCount} sent, ${failCount} failed`);
    } catch (error) {
      this.logger.error('Error in sendUserOnboarding3:', error);
    }
  }

  /**
   * MANUAL TRIGGER (für Testing)
   * Kann über Controller manuell getriggert werden
   */
  async manualTrigger() {
    this.logger.log('🔧 Manual trigger initiated');
    await this.processEmailSequences();
  }
}
