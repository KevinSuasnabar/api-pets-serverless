"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpResponse = exports.HttpResponseBuilder = void 0;
const types_1 = require("./types");
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
};
class HttpResponseBuilder {
    constructor() {
        this.response = {
            statusCode: types_1.HttpStatusCode.OK,
            headers: { ...DEFAULT_HEADERS },
            body: '',
        };
    }
    setStatusCode(statusCode) {
        this.response.statusCode = statusCode;
        return this;
    }
    setHeaders(headers) {
        this.response.headers = { ...this.response.headers, ...headers };
        return this;
    }
    setBody(data) {
        const apiResponse = {
            success: this.response.statusCode < 400,
            data,
        };
        this.response.body = JSON.stringify(apiResponse);
        return this;
    }
    setError(code, message, details) {
        const apiResponse = {
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
    build() {
        return this.response;
    }
}
exports.HttpResponseBuilder = HttpResponseBuilder;
// Helper functions for common responses
exports.httpResponse = {
    ok: (data) => {
        return new HttpResponseBuilder()
            .setStatusCode(types_1.HttpStatusCode.OK)
            .setBody(data)
            .build();
    },
    created: (data) => {
        return new HttpResponseBuilder()
            .setStatusCode(types_1.HttpStatusCode.CREATED)
            .setBody(data)
            .build();
    },
    badRequest: (message, details) => {
        return new HttpResponseBuilder()
            .setStatusCode(types_1.HttpStatusCode.BAD_REQUEST)
            .setError(types_1.ErrorCode.VALIDATION_ERROR, message, details)
            .build();
    },
    notFound: (message = 'Resource not found') => {
        return new HttpResponseBuilder()
            .setStatusCode(types_1.HttpStatusCode.NOT_FOUND)
            .setError(types_1.ErrorCode.NOT_FOUND, message)
            .build();
    },
    unauthorized: (message = 'Unauthorized') => {
        return new HttpResponseBuilder()
            .setStatusCode(types_1.HttpStatusCode.UNAUTHORIZED)
            .setError(types_1.ErrorCode.UNAUTHORIZED, message)
            .build();
    },
    forbidden: (message = 'Forbidden') => {
        return new HttpResponseBuilder()
            .setStatusCode(types_1.HttpStatusCode.FORBIDDEN)
            .setError(types_1.ErrorCode.FORBIDDEN, message)
            .build();
    },
    conflict: (message, details) => {
        return new HttpResponseBuilder()
            .setStatusCode(types_1.HttpStatusCode.CONFLICT)
            .setError(types_1.ErrorCode.CONFLICT, message, details)
            .build();
    },
    internalError: (message = 'Internal server error', details) => {
        return new HttpResponseBuilder()
            .setStatusCode(types_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .setError(types_1.ErrorCode.INTERNAL_ERROR, message, details)
            .build();
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1yZXNwb25zZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9odHRwLXJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUErRTtBQUUvRSxNQUFNLGVBQWUsR0FBRztJQUN0QixjQUFjLEVBQUUsa0JBQWtCO0lBQ2xDLDZCQUE2QixFQUFFLEdBQUc7SUFDbEMsa0NBQWtDLEVBQUUsTUFBTTtDQUMzQyxDQUFDO0FBRUYsTUFBYSxtQkFBbUI7SUFHOUI7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHO1lBQ2QsVUFBVSxFQUFFLHNCQUFjLENBQUMsRUFBRTtZQUM3QixPQUFPLEVBQUUsRUFBRSxHQUFHLGVBQWUsRUFBRTtZQUMvQixJQUFJLEVBQUUsRUFBRTtTQUNULENBQUM7SUFDSixDQUFDO0lBRUQsYUFBYSxDQUFDLFVBQTBCO1FBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUN0QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBK0I7UUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFDakUsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsT0FBTyxDQUFJLElBQU87UUFDaEIsTUFBTSxXQUFXLEdBQW1CO1lBQ2xDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsR0FBRyxHQUFHO1lBQ3ZDLElBQUk7U0FDTCxDQUFDO1FBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBZSxFQUFFLE9BQWUsRUFBRSxPQUFpQjtR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QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBSZXNwb25zZSwgQXBpUmVzcG9uc2UsIEh0dHBTdGF0dXNDb2RlLCBFcnJvckNvZGUgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmNvbnN0IERFRkFVTFRfSEVBREVSUyA9IHtcclxuICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiAnKicsXHJcbiAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogJ3RydWUnLFxyXG59O1xyXG5cclxuZXhwb3J0IGNsYXNzIEh0dHBSZXNwb25zZUJ1aWxkZXIge1xyXG4gIHByaXZhdGUgcmVzcG9uc2U6IEh0dHBSZXNwb25zZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlID0ge1xyXG4gICAgICBzdGF0dXNDb2RlOiBIdHRwU3RhdHVzQ29kZS5PSyxcclxuICAgICAgaGVhZGVyczogeyAuLi5ERUZBVUxUX0hFQURFUlMgfSxcclxuICAgICAgYm9keTogJycsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgc2V0U3RhdHVzQ29kZShzdGF0dXNDb2RlOiBIdHRwU3RhdHVzQ29kZSk6IHRoaXMge1xyXG4gICAgdGhpcy5yZXNwb25zZS5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2V0SGVhZGVycyhoZWFkZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogdGhpcyB7XHJcbiAgICB0aGlzLnJlc3BvbnNlLmhlYWRlcnMgPSB7IC4uLnRoaXMucmVzcG9uc2UuaGVhZGVycywgLi4uaGVhZGVycyB9O1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzZXRCb2R5PFQ+KGRhdGE6IFQpOiB0aGlzIHtcclxuICAgIGNvbnN0IGFwaVJlc3BvbnNlOiBBcGlSZXNwb25zZTxUPiA9IHtcclxuICAgICAgc3VjY2VzczogdGhpcy5yZXNwb25zZS5zdGF0dXNDb2RlIDwgNDAwLFxyXG4gICAgICBkYXRhLFxyXG4gICAgfTtcclxuICAgIHRoaXMucmVzcG9uc2UuYm9keSA9IEpTT04uc3RyaW5naWZ5KGFwaVJlc3BvbnNlKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgc2V0RXJyb3IoY29kZTogRXJyb3JDb2RlLCBtZXNzYWdlOiBzdHJpbmcsIGRldGFpbHM/OiB1bmtub3duKTogdGhpcyB7XHJcbiAgICBjb25zdCBhcGlSZXNwb25zZTogQXBpUmVzcG9uc2U8bnVsbD4gPSB7XHJcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgICBlcnJvcjoge1xyXG4gICAgICAgIGNvZGUsXHJcbiAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICBkZXRhaWxzLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICAgIHRoaXMucmVzcG9uc2UuYm9keSA9IEpTT04uc3RyaW5naWZ5KGFwaVJlc3BvbnNlKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgYnVpbGQoKTogSHR0cFJlc3BvbnNlIHtcclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlO1xyXG4gIH1cclxufVxyXG5cclxuLy8gSGVscGVyIGZ1bmN0aW9ucyBmb3IgY29tbW9uIHJlc3BvbnNlc1xyXG5leHBvcnQgY29uc3QgaHR0cFJlc3BvbnNlID0ge1xyXG4gIG9rOiA8VD4oZGF0YTogVCk6IEh0dHBSZXNwb25zZSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IEh0dHBSZXNwb25zZUJ1aWxkZXIoKVxyXG4gICAgICAuc2V0U3RhdHVzQ29kZShIdHRwU3RhdHVzQ29kZS5PSylcclxuICAgICAgLnNldEJvZHkoZGF0YSlcclxuICAgICAgLmJ1aWxkKCk7XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlZDogPFQ+KGRhdGE6IFQpOiBIdHRwUmVzcG9uc2UgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBIdHRwUmVzcG9uc2VCdWlsZGVyKClcclxuICAgICAgLnNldFN0YXR1c0NvZGUoSHR0cFN0YXR1c0NvZGUuQ1JFQVRFRClcclxuICAgICAgLnNldEJvZHkoZGF0YSlcclxuICAgICAgLmJ1aWxkKCk7XHJcbiAgfSxcclxuXHJcbiAgYmFkUmVxdWVzdDogKG1lc3NhZ2U6IHN0cmluZywgZGV0YWlscz86IHVua25vd24pOiBIdHRwUmVzcG9uc2UgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBIdHRwUmVzcG9uc2VCdWlsZGVyKClcclxuICAgICAgLnNldFN0YXR1c0NvZGUoSHR0cFN0YXR1c0NvZGUuQkFEX1JFUVVFU1QpXHJcbiAgICAgIC5zZXRFcnJvcihFcnJvckNvZGUuVkFMSURBVElPTl9FUlJPUiwgbWVzc2FnZSwgZGV0YWlscylcclxuICAgICAgLmJ1aWxkKCk7XHJcbiAgfSxcclxuXHJcbiAgbm90Rm91bmQ6IChtZXNzYWdlOiBzdHJpbmcgPSAnUmVzb3VyY2Ugbm90IGZvdW5kJyk6IEh0dHBSZXNwb25zZSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IEh0dHBSZXNwb25zZUJ1aWxkZXIoKVxyXG4gICAgICAuc2V0U3RhdHVzQ29kZShIdHRwU3RhdHVzQ29kZS5OT1RfRk9VTkQpXHJcbiAgICAgIC5zZXRFcnJvcihFcnJvckNvZGUuTk9UX0ZPVU5ELCBtZXNzYWdlKVxyXG4gICAgICAuYnVpbGQoKTtcclxuICB9LFxyXG5cclxuICB1bmF1dGhvcml6ZWQ6IChtZXNzYWdlOiBzdHJpbmcgPSAnVW5hdXRob3JpemVkJyk6IEh0dHBSZXNwb25zZSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IEh0dHBSZXNwb25zZUJ1aWxkZXIoKVxyXG4gICAgICAuc2V0U3RhdHVzQ29kZShIdHRwU3RhdHVzQ29kZS5VTkFVVEhPUklaRUQpXHJcbiAgICAgIC5zZXRFcnJvcihFcnJvckNvZGUuVU5BVVRIT1JJWkVELCBtZXNzYWdlKVxyXG4gICAgICAuYnVpbGQoKTtcclxuICB9LFxyXG5cclxuICBmb3JiaWRkZW46IChtZXNzYWdlOiBzdHJpbmcgPSAnRm9yYmlkZGVuJyk6IEh0dHBSZXNwb25zZSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IEh0dHBSZXNwb25zZUJ1aWxkZXIoKVxyXG4gICAgICAuc2V0U3RhdHVzQ29kZShIdHRwU3RhdHVzQ29kZS5GT1JCSURERU4pXHJcbiAgICAgIC5zZXRFcnJvcihFcnJvckNvZGUuRk9SQklEREVOLCBtZXNzYWdlKVxyXG4gICAgICAuYnVpbGQoKTtcclxuICB9LFxyXG5cclxuICBjb25mbGljdDogKG1lc3NhZ2U6IHN0cmluZywgZGV0YWlscz86IHVua25vd24pOiBIdHRwUmVzcG9uc2UgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBIdHRwUmVzcG9uc2VCdWlsZGVyKClcclxuICAgICAgLnNldFN0YXR1c0NvZGUoSHR0cFN0YXR1c0NvZGUuQ09ORkxJQ1QpXHJcbiAgICAgIC5zZXRFcnJvcihFcnJvckNvZGUuQ09ORkxJQ1QsIG1lc3NhZ2UsIGRldGFpbHMpXHJcbiAgICAgIC5idWlsZCgpO1xyXG4gIH0sXHJcblxyXG4gIGludGVybmFsRXJyb3I6IChtZXNzYWdlOiBzdHJpbmcgPSAnSW50ZXJuYWwgc2VydmVyIGVycm9yJywgZGV0YWlscz86IHVua25vd24pOiBIdHRwUmVzcG9uc2UgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBIdHRwUmVzcG9uc2VCdWlsZGVyKClcclxuICAgICAgLnNldFN0YXR1c0NvZGUoSHR0cFN0YXR1c0NvZGUuSU5URVJOQUxfU0VSVkVSX0VSUk9SKVxyXG4gICAgICAuc2V0RXJyb3IoRXJyb3JDb2RlLklOVEVSTkFMX0VSUk9SLCBtZXNzYWdlLCBkZXRhaWxzKVxyXG4gICAgICAuYnVpbGQoKTtcclxuICB9LFxyXG59OyAiXX0=