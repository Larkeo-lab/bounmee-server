import { type ErrorCode, type ErrorMessages, HttpException } from "./root";

export class ForbiddenException extends HttpException {
  constructor(message: ErrorMessages, errorCode: ErrorCode) {
    super(message, 403, errorCode, null);
  }
}
