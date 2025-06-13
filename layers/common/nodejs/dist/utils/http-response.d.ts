import { HttpResponse, HttpStatusCode, ErrorCode } from './types';
export declare class HttpResponseBuilder {
    private response;
    constructor();
    setStatusCode(statusCode: HttpStatusCode): this;
    setHeaders(headers: Record<string, string>): this;
    setBody<T>(data: T): this;
    setError(code: ErrorCode, message: string, details?: unknown): this;
    build(): HttpResponse;
}
export declare const httpResponse: {
    ok: <T>(data: T) => HttpResponse;
    created: <T_1>(data: T_1) => HttpResponse;
    badRequest: (message: string, details?: unknown) => HttpResponse;
    notFound: (message?: string) => HttpResponse;
    unauthorized: (message?: string) => HttpResponse;
    forbidden: (message?: string) => HttpResponse;
    conflict: (message: string, details?: unknown) => HttpResponse;
    internalError: (message?: string, details?: unknown) => HttpResponse;
};
