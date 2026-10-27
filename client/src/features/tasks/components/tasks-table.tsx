import { Button, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { Link } from 'react-router';
import type { Task } from '../../../shared/api/types';
import { formatDate } from '../../../shared/lib/date';

interface TasksTableProps {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  onPageChange: (page: number, limit: number) => void;
}

const columns: TableProps<Task>['columns'] = [
  {
    dataIndex: 'title',
    key: 'title',
    title: 'Задача',
    render: (title: string, task) => (
      <Link to={`/tasks/${task.id}`}>{title}</Link>
    ),
  },
  {
    dataIndex: 'subjectName',
    key: 'subjectName',
    title: 'Предмет',
    render: (subjectName: string) => <Tag color="blue">{subjectName}</Tag>,
  },
  {
    dataIndex: 'dueDate',
    key: 'dueDate',
    title: 'Срок',
    render: (dueDate: string) => formatDate(dueDate),
  },
  {
    key: 'actions',
    render: (_, task) => (
      <Button type="link">
        <Link to={`/tasks/${task.id}/edit`}>Изменить</Link>
      </Button>
    ),
    title: 'Действия',
  },
];

export const TasksTable = ({
  tasks,
  total,
  page,
  limit,
  isLoading,
  onPageChange,
}: TasksTableProps) => (
  <Table<Task>
    columns={columns}
    dataSource={tasks}
    loading={isLoading}
    pagination={{
      current: page,
      pageSize: limit,
      pageSizeOptions: [10, 20, 50],
      showSizeChanger: true,
      showTotal: (count) => `Всего задач: ${count}`,
      total,
      onChange: onPageChange,
    }}
    rowKey="id"
    scroll={{ x: 720 }}
  />
);
