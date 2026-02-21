import { Controller, Post, Get, Body, Headers, Query, HttpCode, Logger, UnauthorizedException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AiAgentService } from './ai-agent.service';
import { VerifyCustomerDto } from './dto/verify-customer.dto';
import { OrderStatusDto } from './dto/order-status.dto';
import { AiAgentCreateLeadDto } from './dto/create-lead.dto';
import { BookCallbackDto } from './dto/book-callback.dto';

@Controller('ai-agent')
@SkipThrottle()
export class AiAgentController {
  private readonly logger = new Logger(AiAgentController.name);

  constructor(private readonly aiAgentService: AiAgentService) {}

  private validateAgentSecret(headers: any) {
    const secret = headers['x-agent-secret'] || headers['X-Agent-Secret'];
    const expectedSecret = process.env.AI_AGENT_SECRET;
    if (!expectedSecret) { this.logger.warn('AI_AGENT_SECRET not set — dev mode'); return; }
    if (secret !== expectedSecret) throw new UnauthorizedException('Invalid agent secret');
  }

  @Post('verify-customer')
  @HttpCode(200)
  async verifyCustomer(@Body() dto: VerifyCustomerDto, @Headers() headers: any) {
    this.validateAgentSecret(headers);
    this.logger.log(`Tool: verify-customer | email: ${dto.email}`);
    return this.aiAgentService.verifyCustomer(dto);
  }

  @Post('order-status')
  @HttpCode(200)
  async orderStatus(@Body() dto: OrderStatusDto, @Headers() headers: any) {
    this.validateAgentSecret(headers);
    this.logger.log(`Tool: order-status | user_id: ${dto.user_id}`);
    return this.aiAgentService.getOrderStatus(dto);
  }

  @Post('create-lead')
  @HttpCode(200)
  async createLead(@Body() dto: AiAgentCreateLeadDto, @Headers() headers: any) {
    this.validateAgentSecret(headers);
    this.logger.log(`Tool: create-lead | ${dto.contact_name} from ${dto.company_name}`);
    return this.aiAgentService.createLead(dto);
  }

  @Post('book-callback')
  @HttpCode(200)
  async bookCallback(@Body() dto: BookCallbackDto, @Headers() headers: any) {
    this.validateAgentSecret(headers);
    this.logger.log(`Tool: book-callback | lead_id: ${dto.lead_id}`);
    return this.aiAgentService.bookCallback(dto);
  }

  @Post('post-call')
  @HttpCode(200)
  async postCallWebhook(@Body() body: any) {
    this.logger.log('Post-call webhook received');
    this.aiAgentService.handlePostCall(body).catch((err) => this.logger.error('Post-call error:', err));
    return { status: 'ok' };
  }

  @Get('admin/calls')
  async getPhoneCalls(@Headers() headers: any, @Query('callerType') callerType?: string, @Query('outcome') outcome?: string, @Query('limit') limit?: string) {
    if (!headers['authorization']) throw new UnauthorizedException();
    return this.aiAgentService.getPhoneCalls({ callerType, outcome, limit: limit ? parseInt(limit) : 50 });
  }

  @Get('admin/stats')
  async getPhoneCallStats(@Headers() headers: any) {
    if (!headers['authorization']) throw new UnauthorizedException();
    return this.aiAgentService.getPhoneCallStats();
  }

  @Get('health')
  @HttpCode(200)
  async health() {
    return { status: 'ok', service: 'ai-agent', timestamp: new Date().toISOString() };
  }
}
