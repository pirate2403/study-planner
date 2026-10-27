import { Form, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import type { Subject } from '../../../shared/api/types';

interface SubjectFormValues {
  name: string;
}

interface SubjectFormModalProps {
  open: boolean;
  subject?: Subject;
  onClose: () => void;
  onSubmit: (name: string) => Promise<boolean>;
}

export const SubjectFormModal = ({
  open,
  subject,
  onClose,
  onSubmit,
}: SubjectFormModalProps) => {
  const [form] = Form.useForm<SubjectFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ name: subject?.name ?? '' });
    }
  }, [form, open, subject]);

  const submit = async ({ name }: SubjectFormValues) => {
    setIsSubmitting(true);
    try {
      const isSaved = await onSubmit(name);
      if (isSaved) {
        form.resetFields();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      cancelText="Отмена"
      confirmLoading={isSubmitting}
      okText={subject ? 'Сохранить' : 'Создать'}
      onCancel={onClose}
      onOk={() => form.submit()}
      open={open}
      title={subject ? 'Переименовать предмет' : 'Новый предмет'}
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item
          label="Название"
          name="name"
          rules={[
            { required: true, message: 'Укажите название предмета' },
            { max: 120, message: 'Максимум 120 символов' },
            {
              validator: (_, value: string) =>
                /\S/.test(value ?? '')
                  ? Promise.resolve()
                  : Promise.reject(new Error('Введите непустое значение')),
            },
          ]}
        >
          <Input maxLength={120} placeholder="Например, физика" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
