import {
  Alert,
  Button,
  Card,
  Empty,
  Flex,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import type { TableProps } from 'antd';
import { useCallback, useState } from 'react';
import { SubjectFormModal } from '../components/subject-form-modal';
import { subjectsApi } from '../../../shared/api/subjects-api';
import type { Subject } from '../../../shared/api/types';
import { useAsyncResource } from '../../../shared/hooks/use-async-resource';
import { getApiErrorMessage } from '../../../shared/lib/api-error';

export const SubjectsPage = () => {
  const loadSubjects = useCallback(() => subjectsApi.findAll(), []);
  const subjects = useAsyncResource(loadSubjects);
  const [editingSubject, setEditingSubject] = useState<Subject>();
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number>();
  const [messageApi, messageContext] = message.useMessage();
  const isModalOpen = isCreating || editingSubject !== undefined;

  const closeModal = () => {
    setIsCreating(false);
    setEditingSubject(undefined);
  };

  const saveSubject = async (name: string) => {
    try {
      if (editingSubject) {
        await subjectsApi.update(editingSubject.id, name.trim());
        messageApi.success('Название предмета обновлено');
      } else {
        await subjectsApi.create(name.trim());
        messageApi.success('Предмет добавлен');
      }
      closeModal();
      await subjects.reload();
      return true;
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, 'Не удалось сохранить предмет'),
      );
      return false;
    }
  };

  const removeSubject = async (subject: Subject) => {
    setDeletingId(subject.id);
    try {
      await subjectsApi.remove(subject.id);
      messageApi.success('Предмет удалён');
      await subjects.reload();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, 'Не удалось удалить предмет'));
    } finally {
      setDeletingId(undefined);
    }
  };

  const columns: TableProps<Subject>['columns'] = [
    { dataIndex: 'name', key: 'name', title: 'Название' },
    {
      key: 'actions',
      render: (_, subject) => (
        <Space wrap>
          <Button onClick={() => setEditingSubject(subject)} type="link">
            Переименовать
          </Button>
          <Popconfirm
            cancelText="Отмена"
            description="Удалить можно только предмет без задач."
            okButtonProps={{ danger: true, loading: deletingId === subject.id }}
            okText="Удалить"
            onConfirm={() => void removeSubject(subject)}
            title={`Удалить «${subject.name}»?`}
          >
            <Button danger type="link">
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
      title: 'Действия',
    },
  ];

  return (
    <>
      {messageContext}
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: 24 }}
        wrap
      >
        <div>
          <Typography.Title level={2} style={{ marginBottom: 4 }}>
            Предметы
          </Typography.Title>
          <Typography.Text type="secondary">
            Справочник для задач и фильтров
          </Typography.Text>
        </div>
        <Button onClick={() => setIsCreating(true)} type="primary">
          Добавить предмет
        </Button>
      </Flex>

      {subjects.error ? (
        <Alert
          action={
            <Button onClick={() => void subjects.reload()}>Повторить</Button>
          }
          description={getApiErrorMessage(
            subjects.error,
            'Проверьте подключение к серверу',
          )}
          message="Не удалось загрузить предметы"
          showIcon
          type="error"
        />
      ) : (
        <Card>
          {subjects.data?.length === 0 && !subjects.isLoading ? (
            <Empty description="Предметов пока нет" />
          ) : (
            <Table<Subject>
              columns={columns}
              dataSource={subjects.data ?? []}
              loading={subjects.isLoading}
              pagination={false}
              rowKey="id"
            />
          )}
        </Card>
      )}

      <SubjectFormModal
        onClose={closeModal}
        onSubmit={saveSubject}
        open={isModalOpen}
        subject={editingSubject}
      />
    </>
  );
};
