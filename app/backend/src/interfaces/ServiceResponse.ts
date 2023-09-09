export type ServiceMessage = { message: string };

type ServiceResponseErrorType =
  | 'INVALID_DATA'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY';

type ServiceResponseSuccessType =
  | 'SUCCESSFUL'
  | 'CREATED'
  | 'NOT_FOUND'
  | 'CONFLICT';

export type ServiceResponseError = {
  status: ServiceResponseErrorType,
  data: ServiceMessage
};

export type ServiceResponseSuccess<T> = {
  status: ServiceResponseSuccessType,
  data: T
};

export type ServiceResponse<T> = ServiceResponseError | ServiceResponseSuccess<T>;
