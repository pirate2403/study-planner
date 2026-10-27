import { Alert, Button, Card, Empty, Flex, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { TaskFilters } from '../components/task-filters';
import { TasksTable } from '../components/tasks-table';
import { subjectsApi } from '../../../shared/api/subjects-api';
import { tasksApi } from '../../../shared/api/tasks-api';
import type { TaskQuery } from '../../../shared/api/types';
import { useAsyncResource } from '../../../shared/hooks/use-async-resource';
import { getApiErrorMessage } from '../../../shared/lib/api-error';

const initialQuery: TaskQuery = { limit: 10, page: 1 };

export const TasksPage = () => {
  const [query, setQuery] = useState<TaskQuery>(initialQuery);
  const loadTasks = useCallback(() => tasksApi.findAll(query), [query]);
  const loadSubjects = useCallback(() => subjectsApi.findAll(), []);
  const tasks = useAsyncResource(loadTasks);
  const subjects = useAsyncResource(loadSubjects);

  const changeQuery = (nextQuery: Partial<TaskQuery>) => {
    setQuery((currentQuery) => ({ ...currentQuery, ...nextQuery }));
  };

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: 24 }}
        wrap
      >
        <div>
          <Typography.Title level={2} style={{ marginBottom: 4 }}>
            Задачи
          </Typography.Title>
          <Typography.Text type="secondary">
            Управляйте заданиями и сроками выполнения
          </Typography.Text>
        </div>
        <Link to="/tasks/new">
          <Button type="primary">Добавить задачу</Button>
        </Link>
      </Flex>

      {subjects.error ? (
        <Alert
          action={
            <Button onClick={() => void subjects.reload()}>Повторить</Button>
          }
          description={getApiErrorMessage(
            subjects.error,
            'Не удалось загрузить предметы',
          )}
          message="Фильтр по предмету недоступен"
          showIcon
          style={{ marginBottom: 24 }}
          type="warning"
        />
      ) : null}

      <Card>
        <TaskFilters
          isLoading={subjects.isLoading}
          onApply={({ search, subjectId }) =>
            setQuery({
              ...initialQuery,
              search: search?.trim() || undefined,
              subjectId,
            })
          }
          onReset={() => setQuery(initialQuery)}
          subjects={subjects.data ?? []}
        />

        {tasks.error ? (
          <Alert
            action={
              <Button onClick={() => void tasks.reload()}>Повторить</Button>
            }
            description={getApiErrorMessage(
              tasks.error,
              'Проверьте подключение к серверу',
            )}
            message="Не удалось загрузить задачи"
            showIcon
            type="error"
          />
        ) : tasks.data?.items.length === 0 && !tasks.isLoading ? (
          <Empty
            description={
              query.search || query.subjectId
                ? 'Задачи по выбранным условиям не найдены'
                : 'Задач пока нет'
            }
          >
            <Button type="primary">
              <Link to="/tasks/new">Создать задачу</Link>
            </Button>
          </Empty>
        ) : (
          <TasksTable
            isLoading={tasks.isLoading}
            limit={query.limit}
            onPageChange={(page, limit) => changeQuery({ limit, page })}
            page={query.page}
            tasks={tasks.data?.items ?? []}
            total={tasks.data?.total ?? 0}
          />
        )}
      </Card>
    </>
  );
};
