import { HttpResponse, ApiResponse, HttpStatusCode, ErrorCode } from './types';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
};

export class HttpResponseBuilder {
  private response: HttpResponse;

  constructor() {
    this.response = {
      statusCode: HttpStatusCode.OK,
      headers: { ...DEFAULT_HEADERS },
      body: '',
    };
  }

  setStatusCode(statusCode: HttpStatusCode): this {
    this.response.statusCode = statusCode;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    this.response.headers = { ...this.response.headers, ...headers };
    return this;
  }

  setBody<T>(data: T): this {
    const apiResponse: ApiResponse<T> = {
      success: this.response.statusCode < 400,
      data,
    };
    this.response.body = JSON.stringify(apiResponse);
    return this;
  }

  setError(code: ErrorCode, message: string, details?: unknown): this {
    const apiResponse: ApiResponse<null> = {
      success: false,
      error: {
        code,
        message,
        details,
      },
    };
    this.response.body = JSON.stringify(apiResponse);
    return this;
  }

  build(): HttpResponse {
    return this.response;
  }
}

// Helper functions for common responses
export const httpResponse = {
  ok: <T>(data: T): HttpResponse => {
    return new HttpResponseBuilder()
      .setStatusCode(HttpStatusCode.OK)
      .setBody(data)
      .build();
  },

  created: <T>(data: T): HttpResponse => {
    return new HttpResponseBuilder()
      .setStatusCode(HttpStatusCode.CREATED)
      .setBody(data)
      .build();
  },

  badRequest: (message: string, details?: unknown): HttpResponse => {
    return new HttpResponseBuilder()
      .setStatusCode(HttpStatusCode.BAD_REQUEST)
      .setError(ErrorCode.VALIDATION_ERROR, message, details)
      .build();
  },

  notFound: (message: string = 'Resource not found'): HttpResponse => {
    return new HttpResponseBuilder()
      .setStatusCode(HttpStatusCode.NOT_FOUND)
      .setError(ErrorCode.NOT_FOUND, message)
      .build();
  },

  unauthorized: (message: string = 'Unauthorized'): HttpResponse => {
    return new HttpResponseBuilder()
      .setStatusCode(HttpStatusCode.UNAUTHORIZED)
      .setError(ErrorCode.UNAUTHORIZED, message)
      .build();
  },

  forbidden: (message: string = 'Forbidden'): HttpResponse => {
    return new HttpResponseBuilder()
      .setStatusCode(HttpStatusCode.FORBIDDEN)
      .setError(ErrorCode.FORBIDDEN, message)
      .build();
  },

  conflict: (message: string, details?: unknown): HttpResponse => {
    return new HttpResponseBuilder()
      .setStatusCode(HttpStatusCode.CONFLICT)
      .setError(ErrorCode.CONFLICT, message, details)
      .build();
  },

  internalError: (message: string = 'Internal server error', details?: unknown): HttpResponse => {
    return new HttpResponseBuilder()
      .setStatusCode(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .setError(ErrorCode.INTERNAL_ERROR, message, details)
      .build();
  },
}; 