import {
  Alert,
  Button,
  Flex,
  Popconfirm,
  Space,
  Spin,
  Typography,
  message,
} from 'antd';
import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { TaskDetails } from '../components/task-details';
import { tasksApi } from '../../../shared/api/tasks-api';
import { useAsyncResource } from '../../../shared/hooks/use-async-resource';
import { getApiErrorMessage } from '../../../shared/lib/api-error';

export const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageApi, messageContext] = message.useMessage();
  const loadTask = useCallback(
    () => tasksApi.findOne(Number(taskId)),
    [taskId],
  );
  const task = useAsyncResource(loadTask);

  const remove = async () => {
    setIsDeleting(true);
    try {
      await tasksApi.remove(Number(taskId));
      messageApi.success('Задача удалена');
      void navigate('/');
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, 'Не удалось удалить задачу'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (task.isLoading) {
    return (
      <Spin size="large" style={{ display: 'block', margin: '96px auto' }} />
    );
  }

  if (task.error || !task.data) {
    return (
      <Alert
        description={getApiErrorMessage(
          task.error,
          'Проверьте идентификатор задачи',
        )}
        message="Задача не найдена"
        showIcon
        type="error"
      />
    );
  }

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
            {task.data.title}
          </Typography.Title>
          <Link to="/">К списку задач</Link>
        </div>
        <Space wrap>
          <Button>
            <Link to={`/tasks/${task.data.id}/edit`}>Редактировать</Link>
          </Button>
          <Popconfirm
            cancelText="Отмена"
            description="Это действие нельзя отменить."
            okButtonProps={{ danger: true, loading: isDeleting }}
            okText="Удалить"
            onConfirm={() => void remove()}
            title="Удалить задачу?"
          >
            <Button danger>Удалить</Button>
          </Popconfirm>
        </Space>
      </Flex>
      <TaskDetails task={task.data} />
    </>
  );
};
