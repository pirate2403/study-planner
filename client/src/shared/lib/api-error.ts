import axios from 'axios';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!axios.isAxiosError(error) || !isRecord(error.response?.data)) {
    return fallback;
  }

  const { message } = error.response.data;
  if (typeof message === 'string') {
    return message;
  }

  if (
    Array.isArray(message) &&
    message.every((item) => typeof item === 'string')
  ) {
    return message.join(', ');
  }

  return fallback;
};
