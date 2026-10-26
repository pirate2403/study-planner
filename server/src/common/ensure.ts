import type { HttpException } from '@nestjs/common';

type ExceptionClass = new (message: string) => HttpException;

export class Ensure {
  static against(
    condition: boolean,
    Exception: ExceptionClass,
    message: string,
  ): void {
    if (condition) {
      throw new Exception(message);
    }
  }
}
