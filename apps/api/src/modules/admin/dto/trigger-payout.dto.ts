import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriggerPayoutDto {
  @ApiProperty({ required: false, example: 'Auszahlung via SEPA am 02.02.2026' })
  @IsOptional()
  @IsString()
  notes?: string;
}
