import { ApiProperty } from '@nestjs/swagger';

export class SubjectResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;
  @ApiProperty({ example: 'Математика' })
  name!: string;
}
