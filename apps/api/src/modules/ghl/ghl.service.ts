import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GhlService {
  private readonly logger = new Logger(GhlService.name);
  private readonly baseUrl = 'https://services.leadconnectorhq.com';
  private readonly token = process.env.GHL_API_TOKEN;
  private readonly locationId = process.env.GHL_LOCATION_ID;

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
    };
  }

  private isEnabled(): boolean {
    if (!this.token || !this.locationId) {
      this.logger.warn('GHL sync disabled — GHL_API_TOKEN or GHL_LOCATION_ID not set');
      return false;
    }
    return true;
  }

  async upsertContact(data: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    companyName?: string;
    tags?: string[];
    source?: string;
  }): Promise<string | null> {
    if (!this.isEnabled()) return null;
    try {
      const searchRes = await fetch(
        `${this.baseUrl}/contacts/search/duplicate?locationId=${this.locationId}&email=${encodeURIComponent(data.email)}`,
        { method: 'GET', headers: this.headers },
      );
      const searchData = await searchRes.json() as any;

      if (searchData?.contact?.id) {
        const contactId = searchData.contact.id;
        await fetch(`${this.baseUrl}/contacts/${contactId}`, {
          method: 'PUT',
          headers: this.headers,
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName || '',
            phone: data.phone || undefined,
            companyName: data.companyName || undefined,
            tags: data.tags || [],
            source: data.source || 'ecommercerente.com',
          }),
        });
        this.logger.log(`GHL: Contact updated — ${data.email} (${contactId})`);
        return contactId;
      } else {
        const createRes = await fetch(`${this.baseUrl}/contacts/`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            locationId: this.locationId,
            firstName: data.firstName,
            lastName: data.lastName || '',
            email: data.email,
            phone: data.phone || undefined,
            companyName: data.companyName || undefined,
            tags: data.tags || [],
            source: data.source || 'ecommercerente.com',
          }),
        });
        const createData = await createRes.json() as any;
        const contactId = createData?.contact?.id;
        this.logger.log(`GHL: Contact created — ${data.email} (${contactId})`);
        return contactId || null;
      }
    } catch (error) {
      this.logger.error(`GHL: Failed to upsert contact ${data.email}`, error?.message || error);
      return null;
    }
  }

  async addTags(contactId: string, tags: string[]): Promise<void> {
    if (!this.isEnabled() || !contactId) return;
    try {
      await fetch(`${this.baseUrl}/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ tags }),
      });
      this.logger.log(`GHL: Tags added to ${contactId}: ${tags.join(', ')}`);
    } catch (error) {
      this.logger.error(`GHL: Failed to add tags to ${contactId}`, error?.message || error);
    }
  }

  async addNote(contactId: string, body: string): Promise<void> {
    if (!this.isEnabled() || !contactId) return;
    try {
      await fetch(`${this.baseUrl}/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ body, userId: this.locationId }),
      });
      this.logger.log(`GHL: Note added to ${contactId}`);
    } catch (error) {
      this.logger.error(`GHL: Failed to add note to ${contactId}`, error?.message || error);
    }
  }

  async createOpportunity(data: {
    pipelineId: string;
    stageId: string;
    name: string;
    contactId: string;
    monetaryValue: number;
    status?: string;
  }): Promise<string | null> {
    if (!this.isEnabled()) return null;
    if (!data.pipelineId || !data.stageId) {
      this.logger.warn('GHL: Pipeline/Stage IDs not configured — skipping opportunity');
      return null;
    }
    try {
      const res = await fetch(`${this.baseUrl}/opportunities/`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          locationId: this.locationId,
          pipelineId: data.pipelineId,
          pipelineStageId: data.stageId,
          name: data.name,
          contactId: data.contactId,
          monetaryValue: data.monetaryValue,
          status: data.status || 'open',
        }),
      });
      const resData = await res.json() as any;
      this.logger.log(`GHL: Opportunity created — ${data.name} (${resData?.opportunity?.id})`);
      return resData?.opportunity?.id || null;
    } catch (error) {
      this.logger.error(`GHL: Failed to create opportunity ${data.name}`, error?.message || error);
      return null;
    }
  }
}
