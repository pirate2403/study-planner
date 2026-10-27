import { http } from './http';
import type { Task, TaskPayload, TaskQuery, TasksPage } from './types';

export const tasksApi = {
  async findAll(query: TaskQuery): Promise<TasksPage> {
    const { data } = await http.get<TasksPage>('/tasks', { params: query });
    return data;
  },

  async findOne(id: number): Promise<Task> {
    const { data } = await http.get<Task>(`/tasks/${id}`);
    return data;
  },

  async create(payload: TaskPayload): Promise<Task> {
    const { data } = await http.post<Task>('/tasks', payload);
    return data;
  },

  async update(id: number, payload: TaskPayload): Promise<Task> {
    const { data } = await http.patch<Task>(`/tasks/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/tasks/${id}`);
  },
};
