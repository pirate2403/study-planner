import { Button, Form, Input, Select, Space } from 'antd';
import type { Subject, TaskPayload } from '../../../shared/api/types';

interface TaskFormProps {
  initialValues?: TaskPayload;
  isSubmitting: boolean;
  subjects: Subject[];
  onCancel: () => void;
  onSubmit: (values: TaskPayload) => Promise<void>;
}

const validateText = (_: unknown, value: string): Promise<void> =>
  /\S/.test(value ?? '')
    ? Promise.resolve()
    : Promise.reject(new Error('Введите непустое значение'));

export const TaskForm = ({
  initialValues,
  isSubmitting,
  subjects,
  onCancel,
  onSubmit,
}: TaskFormProps) => (
  <Form<TaskPayload>
    initialValues={initialValues}
    layout="vertical"
    onFinish={onSubmit}
    requiredMark="optional"
  >
    <Form.Item
      label="Название"
      name="title"
      rules={[
        { required: true, message: 'Укажите название задачи' },
        { max: 200, message: 'Максимум 200 символов' },
        { validator: validateText },
      ]}
    >
      <Input maxLength={200} placeholder="Например, подготовить отчёт" />
    </Form.Item>
    <Form.Item
      label="Описание"
      name="description"
      rules={[
        { required: true, message: 'Добавьте описание' },
        { max: 10000, message: 'Максимум 10 000 символов' },
        { validator: validateText },
      ]}
    >
      <Input.TextArea
        autoSize={{ minRows: 5, maxRows: 12 }}
        maxLength={10000}
        placeholder="Что нужно сделать"
        showCount
      />
    </Form.Item>
    <Form.Item
      label="Предмет"
      name="subjectId"
      rules={[{ required: true, message: 'Выберите предмет' }]}
    >
      <Select
        options={subjects.map((subject) => ({
          label: subject.name,
          value: subject.id,
        }))}
        placeholder="Выберите предмет"
      />
    </Form.Item>
    <Form.Item
      label="Срок выполнения"
      name="dueDate"
      rules={[{ required: true, message: 'Укажите срок выполнения' }]}
    >
      <Input type="date" />
    </Form.Item>
    <Space wrap>
      <Button htmlType="submit" loading={isSubmitting} type="primary">
        {initialValues ? 'Сохранить изменения' : 'Создать задачу'}
      </Button>
      <Button htmlType="button" onClick={onCancel}>
        Отмена
      </Button>
    </Space>
  </Form>
);
