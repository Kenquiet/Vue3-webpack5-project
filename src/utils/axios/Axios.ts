import type { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { cloneDeep } from 'lodash-es'; 

import axios from 'axios';
import { isFn } from '../is';
import { AxiosCanceler } from './axiosCancel'
import type { RequestOptions, CreateAxiosOptions, Result, UploadFileParams } from './types';
export * from './axiosTransform';

export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors()
  }

  private getTransform() {
    const { transform } = this.options;
    return transform
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  /**
   * @description:  创建axios实例
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config);
  }

  /**
   * @description: 重新配置axios
   */
  configAxios(config: CreateAxiosOptions) {
    if(!this.axiosInstance) {
      return
    }
    this.createAxios(config);
  }

  /**
   * @description: 设置通用header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }


  /**
   * @description： 拦截的配置
   */
  private setupInterceptors() {
    const transform = this.getTransform()
    if(!transform) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = transform

    const axiosCanceler = new AxiosCanceler();

    /**
     * @description: 请求拦截器配置处理
     */
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const { headers: { ignoreCancelToken } = { ignoreCancelToken: false } } = config
      !ignoreCancelToken && axiosCanceler.addPanding(config); // 添加记录
      if(requestInterceptors && isFn(requestInterceptors)) {
        config = requestInterceptors(config);
      }

      return config
    }, undefined)

    /**
     * @description: 请求拦截错误捕获
     */
    requestInterceptorsCatch && 
      isFn(requestInterceptorsCatch) && this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);

    /**
     * @description: 响应拦截处理
     */
    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config);
      if(responseInterceptors && isFn(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res
    }, undefined)

    /**
     * @description: 响应结果拦截器错误捕获
     */
    responseInterceptorsCatch &&
     isFn(responseInterceptorsCatch) && this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
  }

  /**
   * @description: 文件上传
   */
  uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData();

    if(params.data) {
      Object.keys(params.data).forEach(key => {
        if(!params.data) return
        const value = params.data[key];
        if(Array.isArray(value)) {
          value.forEach(item => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, params.data[key]);
      })
    }

    formData.append(params.name || 'file', params.file, params.filename);

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': 'multipart/form-data;charset=UTF-8',
        ignoreCancelToken: true,
      }
    })
  }

  /**
   * @description: 请求方法
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: AxiosRequestConfig = cloneDeep(config);

    const transform  = this.getTransform()
    const { requestOptions } = this.options;

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatch, transformRequestData } = transform || {};

    if(beforeRequestHook && isFn(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>> (conf)
        .then((res: AxiosResponse<Result>) => {
          if(transformRequestData && isFn(transformRequestData)) {
            const ret = transformRequestData(res, opt)
            ret !== '__ERROR_RESULT__' ? resolve(ret) : reject(new Error('request error!'));
            return
          }
          resolve((res as unknown) as Promise<T>);
        })
        .catch( (e: Error) => {
          if(requestCatch && isFn(requestCatch)) {
            reject(requestCatch(e))
            return
          }
          reject(e);
        })
    })

  }
}

