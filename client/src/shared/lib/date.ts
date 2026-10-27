const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatDate = (value: string): string =>
  dateFormatter.format(new Date(`${value}T00:00:00`));

export const formatDateTime = (value: string): string =>
  dateTimeFormatter.format(new Date(value));
