import { type ErrorCode, type ErrorMessages, HttpException } from "./root";

export class NotFoundException extends HttpException {
  constructor(message: ErrorMessages, errorCode: ErrorCode, errors: unknown = null) {
    super(message, 404, errorCode, errors);
  }
}

