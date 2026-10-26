import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @Length(1, 120)
  @Matches(/\S/, { message: 'name must contain non-whitespace characters' })
  @ApiProperty({ example: 'Математика', minLength: 1, maxLength: 120 })
  name!: string;
}
