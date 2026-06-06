import { type ErrorCode, type ErrorMessages, HttpException } from "./root";

export class BadRequestException extends HttpException {
  constructor(message: ErrorMessages, errorCode: ErrorCode, errors: unknown) {
    super(message, 400, errorCode, errors);
  }
}
