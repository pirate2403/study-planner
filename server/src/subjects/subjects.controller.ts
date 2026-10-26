import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { SubjectResponseDto } from './dto/subject-response.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import type { Subject } from './subjects.service.js';
import { SubjectsService } from './subjects.service.js';

@ApiTags('subjects')
@ApiBadRequestResponse({
  description: 'Некорректные параметры или тело запроса',
})
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Список предметов' })
  @ApiOkResponse({ type: SubjectResponseDto, isArray: true })
  findAll(): Promise<Subject[]> {
    return this.subjectsService.findAll();
  }

  @Post()
  @ApiConflictResponse({
    description: 'Название занято или предмет используется в задачах',
  })
  @ApiOperation({ summary: 'Создать предмет' })
  @ApiCreatedResponse({ type: SubjectResponseDto })
  create(@Body() dto: CreateSubjectDto): Promise<Subject> {
    return this.subjectsService.create(dto);
  }

  @Patch(':id')
  @ApiConflictResponse({
    description: 'Название занято или предмет используется в задачах',
  })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNotFoundResponse({ description: 'Запись не найдена' })
  @ApiOperation({ summary: 'Изменить предмет' })
  @ApiOkResponse({ type: SubjectResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiConflictResponse({
    description: 'Название занято или предмет используется в задачах',
  })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNotFoundResponse({ description: 'Запись не найдена' })
  @ApiOperation({ summary: 'Удалить предмет' })
  @ApiNoContentResponse({ description: 'Удалено' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.subjectsService.remove(id);
  }
}
