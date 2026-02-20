import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailAutomationService } from './email-automation.service';

@ApiTags('Email Automation')
@Controller('email-automation')
export class EmailAutomationController {
  constructor(private readonly emailAutomationService: EmailAutomationService) {}

  /**
   * MANUELLER TRIGGER für Email-Sequenzen (nur für Testing/Admin)
   * Dieser Endpoint triggert den Cron-Job manuell
   *
   * Verwendung: POST /email-automation/trigger
   */
  @Post('trigger')
  @ApiOperation({ summary: 'Manually trigger email sequences (Testing/Admin)' })
  async triggerEmailSequences() {
    await this.emailAutomationService.manualTrigger();
    return {
      success: true,
      message: 'Email sequences triggered manually',
      timestamp: new Date().toISOString(),
    };
  }
}
