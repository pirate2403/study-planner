import type { TasksPageDto } from './dto/task-response.dto.js';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ensure } from '../common/ensure.js';
import { DatabaseService } from '../database/database.service.js';
import type { CreateTaskDto } from './dto/create-task.dto.js';
import { FindTasksDto } from './dto/find-tasks.dto.js';
import type { UpdateTaskDto } from './dto/update-task.dto.js';
import {
  createTaskQuery,
  countTasksQuery,
  deleteTaskQuery,
  findAllTasksQuery,
  findSubjectByIdQuery,
  findTaskByIdQuery,
  updateTaskQuery,
} from './tasks.queries.js';

export interface TaskListItem {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  subjectId: number;
  subjectName: string;
  createdAt: Date;
}

@Injectable()
export class TasksService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(query: FindTasksDto): Promise<TasksPageDto> {
    const filters = [query.search ?? null, query.subjectId ?? null];
    const [items, counts] = await Promise.all([
      this.db.query<TaskListItem>(findAllTasksQuery, [
        ...filters,
        query.limit,
        (query.page - 1) * query.limit,
      ]),
      this.db.query<{ total: number }>(countTasksQuery, filters),
    ]);
    const total = counts[0].total;
    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }

  async findOne(id: number): Promise<TaskListItem> {
    const [task] = await this.db.query<TaskListItem>(findTaskByIdQuery, [id]);

    Ensure.against(!task, NotFoundException, `Task ${id} not found`);

    return task;
  }

  async create(dto: CreateTaskDto): Promise<TaskListItem> {
    const [created] = await this.db.query<{ id: number }>(createTaskQuery, [
      dto.title,
      dto.description,
      dto.dueDate,
      dto.subjectId,
    ]);

    Ensure.against(
      !created,
      BadRequestException,
      `Subject ${dto.subjectId} does not exist`,
    );

    return this.findOne(created.id);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<TaskListItem> {
    await this.findOne(id);

    Ensure.against(
      dto.isEmpty(),
      BadRequestException,
      'Provide at least one field',
    );

    if (dto.subjectId !== undefined) {
      const [subject] = await this.db.query<{ id: number }>(
        findSubjectByIdQuery,
        [dto.subjectId],
      );

      Ensure.against(
        !subject,
        BadRequestException,
        `Subject ${dto.subjectId} does not exist`,
      );
    }

    const [updated] = await this.db.query<{ id: number }>(updateTaskQuery, [
      id,
      dto.title ?? null,
      dto.description ?? null,
      dto.dueDate ?? null,
      dto.subjectId ?? null,
    ]);

    Ensure.against(!updated, NotFoundException, `Task ${id} not found`);

    return this.findOne(updated.id);
  }

  async remove(id: number): Promise<void> {
    const [deleted] = await this.db.query<{ id: number }>(deleteTaskQuery, [
      id,
    ]);

    Ensure.against(!deleted, NotFoundException, `Task ${id} not found`);
  }
}
