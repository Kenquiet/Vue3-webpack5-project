import type { AxiosRequestConfig } from 'axios';
import { AxiosHook } from './axiosTransform';
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // 请求参数拼接到url
  joinParamsToUrl?: boolean;
  // 格式化请求参数时间
  formatDate?: boolean;
  //  是否处理请求结果
  isTransformRequestResult?: boolean;
  // 是否加入url
  joinPrefix?: boolean;
  // 接口地址， 不填则使用默认apiUrl
  apiUrl?: string;
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode;
  // 是否加入时间戳
  joinTime?: boolean;
}

export interface CreateAxiosOptions extends AxiosRequestConfig{
  perfixUrl: string;
  transform: AxiosHook;
  requestOptions?: RequestOptions
}

export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  result: T;
}

/**
 * @description： 上传文件
 */
export interface UploadFileParams {
  data?: any;   // 其它参数
  name?: string;      // 文件参数的接口字段
  file: File | Blob;  // 文件
  filename?: string;  // 文件名
  [key: string]: any
}