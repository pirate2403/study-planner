import { Card, Descriptions, Tag, Typography } from 'antd';
import type { Task } from '../../../shared/api/types';
import { formatDate, formatDateTime } from '../../../shared/lib/date';

interface TaskDetailsProps {
  task: Task;
}

export const TaskDetails = ({ task }: TaskDetailsProps) => (
  <div
    style={{
      display: 'grid',
      gap: 24,
      gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)',
    }}
  >
    <Card title="Описание">
      <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
        {task.description}
      </Typography.Paragraph>
    </Card>
    <Card title="Детали">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Предмет">
          <Tag color="blue">{task.subjectName}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Срок выполнения">
          {formatDate(task.dueDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Создана">
          {formatDateTime(task.createdAt)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </div>
);
