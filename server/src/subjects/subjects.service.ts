import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';
import { Ensure } from '../common/ensure.js';
import { DatabaseService } from '../database/database.service.js';
import type { CreateSubjectDto } from './dto/create-subject.dto.js';
import type { UpdateSubjectDto } from './dto/update-subject.dto.js';
import {
  createSubjectQuery,
  deleteSubjectQuery,
  findAllSubjectsQuery,
  updateSubjectQuery,
} from './subjects.queries.js';

export interface Subject {
  id: number;
  name: string;
}

@Injectable()
export class SubjectsService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Promise<Subject[]> {
    return this.db.query<Subject>(findAllSubjectsQuery);
  }

  async create(dto: CreateSubjectDto): Promise<Subject> {
    try {
      const [subject] = await this.db.query<Subject>(createSubjectQuery, [
        dto.name,
      ]);
      return subject;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: number, dto: UpdateSubjectDto): Promise<Subject> {
    try {
      const [subject] = await this.db.query<Subject>(updateSubjectQuery, [
        id,
        dto.name,
      ]);
      Ensure.against(!subject, NotFoundException, `Subject ${id} not found`);
      return subject;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const [deleted] = await this.db.query<{ id: number }>(
        deleteSubjectQuery,
        [id],
      );
      Ensure.against(!deleted, NotFoundException, `Subject ${id} not found`);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    if (error instanceof DatabaseError) {
      if (error.code === '23505') {
        throw new ConflictException('Subject with this name already exists');
      }
      if (error.code === '23503') {
        throw new ConflictException(
          'Cannot delete subject with existing tasks',
        );
      }
    }
    throw error;
  }
}
