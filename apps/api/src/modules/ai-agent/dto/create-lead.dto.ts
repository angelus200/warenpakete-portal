import { IsOptional, IsString } from 'class-validator';

export class AiAgentCreateLeadDto {
  @IsString()
  company_name: string;

  @IsString()
  contact_name: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  source?: string;
}
