import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  // Step 1: Kontaktdaten
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  position?: string;

  // Step 2: Qualifizierung
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  budget: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ecommerceExperience: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companySize: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  source: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeframe: string;

  // Tracking (optional)
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  affiliateRef?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  utmSource?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  utmMedium?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  utmCampaign?: string;
}
