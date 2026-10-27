export interface Subject {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  subjectId: number;
  subjectName: string;
  createdAt: string;
}

export interface TasksPage {
  items: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskPayload {
  title: string;
  description: string;
  dueDate: string;
  subjectId: number;
}

export interface TaskQuery {
  search?: string;
  subjectId?: number;
  page: number;
  limit: number;
}
