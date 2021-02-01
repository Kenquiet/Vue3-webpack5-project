// 接口返回值data 不能为这个，否则会判断请求失败
export const ERROR_RESULT = '__ERROR_RESULT__'

// 接口返回
export enum ResultEnum {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT = 401,
  TYPE = 'success',
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}


// 接口返回的message 类型
export const ErrorMessageModel = 'error'