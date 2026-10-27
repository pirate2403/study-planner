import { Alert, Card, Empty, Spin, message } from 'antd';
import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { subjectsApi } from '../../../shared/api/subjects-api';
import { tasksApi } from '../../../shared/api/tasks-api';
import type { Task, TaskPayload } from '../../../shared/api/types';
import { useAsyncResource } from '../../../shared/hooks/use-async-resource';
import { getApiErrorMessage } from '../../../shared/lib/api-error';
import { TaskForm } from '../components/task-form';

const toPayload = (task: Task): TaskPayload => ({
  description: task.description,
  dueDate: task.dueDate,
  subjectId: task.subjectId,
  title: task.title,
});

export const TaskFormPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageApi, messageContext] = message.useMessage();
  const isEditing = taskId !== undefined;
  const loadTask = useCallback(
    () =>
      taskId ? tasksApi.findOne(Number(taskId)) : Promise.resolve(undefined),
    [taskId],
  );
  const loadSubjects = useCallback(() => subjectsApi.findAll(), []);
  const task = useAsyncResource(loadTask);
  const subjects = useAsyncResource(loadSubjects);

  const submit = async (values: TaskPayload) => {
    setIsSubmitting(true);
    try {
      const savedTask = isEditing
        ? await tasksApi.update(Number(taskId), values)
        : await tasksApi.create(values);
      messageApi.success(isEditing ? 'Изменения сохранены' : 'Задача создана');
      void navigate(`/tasks/${savedTask.id}`);
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, 'Не удалось сохранить задачу'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && task.isLoading) {
    return (
      <Spin size="large" style={{ display: 'block', margin: '96px auto' }} />
    );
  }

  if (isEditing && task.error) {
    return (
      <Alert
        description={getApiErrorMessage(
          task.error,
          'Проверьте идентификатор задачи',
        )}
        message="Не удалось открыть задачу"
        showIcon
        type="error"
      />
    );
  }

  if (!subjects.isLoading && !subjects.data?.length) {
    return (
      <Empty description="Сначала добавьте хотя бы один предмет">
        <Link to="/subjects">Перейти к предметам</Link>
      </Empty>
    );
  }

  return (
    <>
      {messageContext}
      {subjects.error ? (
        <Alert
          description={getApiErrorMessage(
            subjects.error,
            'Проверьте подключение к серверу',
          )}
          message="Не удалось загрузить предметы"
          showIcon
          type="error"
        />
      ) : subjects.isLoading ? (
        <Spin size="large" style={{ display: 'block', margin: '96px auto' }} />
      ) : (
        <Card
          title={isEditing ? 'Редактирование задачи' : 'Новая задача'}
          style={{ maxWidth: 760, width: '100%', margin: '0 auto' }}
        >
          <TaskForm
            initialValues={task.data ? toPayload(task.data) : undefined}
            isSubmitting={isSubmitting}
            onCancel={() => void navigate(isEditing ? `/tasks/${taskId}` : '/')}
            onSubmit={submit}
            subjects={subjects.data ?? []}
          />
        </Card>
      )}
    </>
  );
};
