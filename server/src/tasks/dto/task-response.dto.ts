import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;
  @ApiProperty({ example: 'Лабораторная работа' })
  title!: string;
  @ApiProperty({ example: 'Подготовить отчёт' })
  description!: string;
  @ApiProperty({ example: '2026-11-15', format: 'date' })
  dueDate!: string;
  @ApiProperty({ example: 1 })
  subjectId!: number;
  @ApiProperty({ example: 'Математика' })
  subjectName!: string;
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;
}

export class TasksPageDto {
  @ApiProperty({ type: [TaskResponseDto] })
  items!: TaskResponseDto[];
  @ApiProperty({ example: 42 })
  total!: number;
  @ApiProperty({ example: 1 })
  page!: number;
  @ApiProperty({ example: 20 })
  limit!: number;
  @ApiProperty({ example: 3 })
  totalPages!: number;
}
