import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  @ApiProperty({ example: 'Лабораторная работа', minLength: 1, maxLength: 200 })
  title!: string;

  @IsString()
  @Length(1, 10000)
  @Matches(/\S/)
  @ApiProperty({ example: 'Подготовить отчёт', minLength: 1, maxLength: 10000 })
  description!: string;

  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dueDate must have format YYYY-MM-DD',
  })
  @ApiProperty({ example: '2026-11-15', format: 'date' })
  dueDate!: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, minimum: 1 })
  subjectId!: number;
}
