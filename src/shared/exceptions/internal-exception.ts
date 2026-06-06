import { type ErrorMessages, HttpException } from "./root";

export class InternalException extends HttpException {
  constructor(message: ErrorMessages, errors: unknown, errorCode: number) {
    super(message, 500, errorCode, errors);
  }
}
