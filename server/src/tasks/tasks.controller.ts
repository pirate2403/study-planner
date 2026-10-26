import { TaskResponseDto, TasksPageDto } from './dto/task-response.dto.js';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
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
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import type { TaskListItem } from './tasks.service.js';
import { TasksService } from './tasks.service.js';
import { FindTasksDto } from './dto/find-tasks.dto.js';

@ApiTags('tasks')
@ApiBadRequestResponse({
  description: 'Некорректные параметры или тело запроса',
})
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Список задач с поиском, фильтром и пагинацией' })
  @ApiOkResponse({ type: TasksPageDto })
  findAll(@Query() query: FindTasksDto): Promise<TasksPageDto> {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNotFoundResponse({ description: 'Запись не найдена' })
  @ApiOperation({ summary: 'Получить задачу' })
  @ApiOkResponse({ type: TaskResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TaskListItem> {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать задачу' })
  @ApiCreatedResponse({ type: TaskResponseDto })
  create(@Body() dto: CreateTaskDto): Promise<TaskListItem> {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNotFoundResponse({ description: 'Запись не найдена' })
  @ApiOperation({ summary: 'Изменить задачу' })
  @ApiOkResponse({ type: TaskResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskListItem> {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNotFoundResponse({ description: 'Запись не найдена' })
  @ApiOperation({ summary: 'Удалить задачу' })
  @ApiNoContentResponse({ description: 'Удалено' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.remove(id);
  }
}
