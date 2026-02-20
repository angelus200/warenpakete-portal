import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLeadDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  calendlyBooked?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  consultantId?: string;
}
