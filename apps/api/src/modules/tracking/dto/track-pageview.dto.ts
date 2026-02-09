import { IsString, IsOptional, MaxLength, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackPageViewDto {
  @ApiProperty({ example: '/products' })
  @IsString()
  @MaxLength(500)
  path: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referrer?: string;

  @ApiProperty({ example: 'v123abc' })
  @IsString()
  sessionId: string;

  @ApiProperty({ required: false, enum: ['mobile', 'tablet', 'desktop'] })
  @IsOptional()
  @IsString()
  device?: string;

  @ApiProperty({ required: false, description: 'Duration in seconds' })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;
}
