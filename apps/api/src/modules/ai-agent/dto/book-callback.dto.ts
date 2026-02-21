import { IsOptional, IsString } from 'class-validator';

export class BookCallbackDto {
  @IsString()
  lead_id: string;

  @IsOptional()
  @IsString()
  preferred_date?: string;

  @IsOptional()
  @IsString()
  preferred_time?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
