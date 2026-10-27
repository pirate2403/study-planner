import { Button, Form, Input, Select, Space } from 'antd';
import type { Subject } from '../../../shared/api/types';

export interface TaskFilterValues {
  search?: string;
  subjectId?: number;
}

interface TaskFiltersProps {
  subjects: Subject[];
  isLoading: boolean;
  onApply: (values: TaskFilterValues) => void;
  onReset: () => void;
}

export const TaskFilters = ({
  subjects,
  isLoading,
  onApply,
  onReset,
}: TaskFiltersProps) => {
  const [form] = Form.useForm<TaskFilterValues>();

  const reset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onApply}
      style={{ marginBottom: 24 }}
    >
      <Form.Item name="search" style={{ minWidth: 240 }}>
        <Input allowClear placeholder="Поиск по названию" />
      </Form.Item>
      <Form.Item name="subjectId" style={{ minWidth: 220 }}>
        <Select
          allowClear
          loading={isLoading}
          options={subjects.map((subject) => ({
            label: subject.name,
            value: subject.id,
          }))}
          placeholder="Все предметы"
        />
      </Form.Item>
      <Form.Item>
        <Space wrap>
          <Button htmlType="submit" type="primary">
            Найти
          </Button>
          <Button htmlType="button" onClick={reset}>
            Сбросить
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
