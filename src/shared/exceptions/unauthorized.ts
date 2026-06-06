import { type ErrorCode, type ErrorMessages, HttpException } from "./root";

export class UnauthorizedException extends HttpException {
  constructor(message: ErrorMessages, errorCode: ErrorCode) {
    super(message, 401, errorCode, null);
  }
}
