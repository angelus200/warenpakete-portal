import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum NoteType {
  GENERAL = 'general',
  CALL = 'call',
  MEETING = 'meeting',
  ISSUE = 'issue',
}

export class CreateNoteDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: NoteType, default: NoteType.GENERAL })
  @IsOptional()
  @IsEnum(NoteType)
  noteType?: NoteType;
}
