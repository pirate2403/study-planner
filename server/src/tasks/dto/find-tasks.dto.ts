import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  MaxLength,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class FindTasksDto {
  @ApiPropertyOptional({
    default: 1,
    minimum: 1,
    maximum: 1000000,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000000)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100, type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({
    description: 'Поиск по названию без учёта регистра',
    maxLength: 200,
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MaxLength(200)
  search?: string;

  @ValidateIf((_, value) => value !== undefined)
  @ApiPropertyOptional({
    description: 'Идентификатор предмета',
    minimum: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  subjectId?: number;
}
