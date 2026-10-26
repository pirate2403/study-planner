# Клиент планировщика

## Локальный запуск

Из `client`: `npm install`, затем `npm run dev`.
Общие настройки загружаются из `.env` в корне проекта.

```dotenv
CLIENT_PORT=5173
SERVER_PORT=4321
VITE_API_URL=/api
```

Запросы делайте к `${import.meta.env.VITE_API_URL}/tasks` и `/subjects`.
Vite направляет `/api` на `http://localhost:SERVER_PORT`, удаляя префикс.
При необходимости адрес backend можно переопределить через `API_PROXY_TARGET`.
В браузер попадают только переменные с префиксом `VITE_`, поэтому пароль базы
не должен иметь этот префикс.

## Docker

Из корня: `docker compose up -d --build --wait`.
Клиент: http://localhost:5173. Nginx проксирует `/api` в backend.
После изменения `VITE_API_URL` требуется пересборка клиента.

## Форматирование

`npm run format` — отформатировать, `npm run format:check` — проверить.
Настройки `.prettierrc` совпадают с сервером.

## Статический макет

http://localhost:5173/mockup.html — отдельные HTML и CSS из `public`,
без React и бизнес-логики; образец для последующей вёрстки.
