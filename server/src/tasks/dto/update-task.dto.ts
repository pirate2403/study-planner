import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsString,
  Length,
  Matches,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateTaskDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  @ApiPropertyOptional({
    example: 'Новое название',
    minLength: 1,
    maxLength: 200,
  })
  title?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @Length(1, 10000)
  @Matches(/\S/)
  @ApiPropertyOptional({
    example: 'Новое описание',
    minLength: 1,
    maxLength: 10000,
  })
  description?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dueDate must have format YYYY-MM-DD',
  })
  @ApiPropertyOptional({ example: '2026-11-15', format: 'date' })
  dueDate?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  subjectId?: number;

  isEmpty(): boolean {
    return (
      this.title === undefined &&
      this.description === undefined &&
      this.dueDate === undefined &&
      this.subjectId === undefined
    );
  }
}
