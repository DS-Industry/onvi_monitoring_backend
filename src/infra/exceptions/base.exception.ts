export abstract class BaseException extends Error {
  public readonly type: string;
  public readonly innerCode: number;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;

  constructor(
    type: string,
    innerCode: number,
    message: string,
    metadata?: Record<string, any>,
  ) {
    super(message);
    this.type = type;
    this.innerCode = innerCode;
    this.timestamp = new Date();
    this.metadata = metadata;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  abstract getHttpStatus(): number;

  toResponse(): Record<string, any> {
    return {
      statusCode: this.getHttpStatus(),
      message: this.message,
      type: this.type,
      innerCode: this.innerCode,
      timestamp: this.timestamp,
      ...(this.metadata && { metadata: this.metadata }),
    };
  }
}
