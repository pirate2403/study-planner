import { http } from './http';
import type { Subject } from './types';

export const subjectsApi = {
  async findAll(): Promise<Subject[]> {
    const { data } = await http.get<Subject[]>('/subjects');
    return data;
  },

  async create(name: string): Promise<Subject> {
    const { data } = await http.post<Subject>('/subjects', { name });
    return data;
  },

  async update(id: number, name: string): Promise<Subject> {
    const { data } = await http.patch<Subject>(`/subjects/${id}`, { name });
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/subjects/${id}`);
  },
};
