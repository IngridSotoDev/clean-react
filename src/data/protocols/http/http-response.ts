export enum HttpStatusCode {
  noContent = 204,
  ok = 200,
  unauthorized = 401,
}

export type HttpResponse = {
  statusCode: number;
  body?: any;
};
