import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { AppLayout } from './features/app-layout/components/app-layout';
import { SubjectsPage } from './features/subjects/pages/subjects-page';
import { TaskDetailsPage } from './features/tasks/pages/task-details-page';
import { TaskFormPage } from './features/tasks/pages/task-form-page';
import { TasksPage } from './features/tasks/pages/tasks-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <TasksPage /> },
      { path: 'tasks/new', element: <TaskFormPage /> },
      { path: 'tasks/:taskId', element: <TaskDetailsPage /> },
      { path: 'tasks/:taskId/edit', element: <TaskFormPage /> },
      { path: 'subjects', element: <SubjectsPage /> },
    ],
  },
]);

export const App = () => (
  <ConfigProvider
    locale={ruRU}
    theme={{
      token: {
        borderRadius: 10,
        colorPrimary: '#225bca',
        fontSize: 15,
      },
    }}
  >
    <RouterProvider router={router} />
  </ConfigProvider>
);
