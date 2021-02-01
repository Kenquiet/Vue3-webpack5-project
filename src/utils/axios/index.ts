import type { CreateAxiosOptions, RequestOptions, Result } from './types';
import type { AxiosResponse } from 'axios';
import { VAxios } from './Axios';
import { AxiosHook } from './axiosTransform';
import { isString } from '../is'
import { ERROR_RESULT, ResultEnum, ErrorMessageModel, RequestEnum } from './const';
import { ElMessage, ElMessageBox } from 'element-plus'
import { errMsg } from '../../locales/zh_CN/sys/api'
import { createNow, formatRequestDate } from './helper'
import { setObjToUrlParams, deepMerge } from '../../utils'
import { getToken } from '../auth'
import { checkStatus } from './checkStatus';
import { useGlobSetting } from '../../hooks/setting';


const globSetting = useGlobSetting();
const prefix = globSetting.urlPrefix;
const apiUrl = globSetting.apiUrl;
/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosHook = {
  transformRequestData: ( res: AxiosResponse<Result>, options: RequestOptions ) => {
    const { isTransformRequestResult } = options;
    if(!isTransformRequestResult) return res.data

    const { data } = res;
    if(!data) return ERROR_RESULT

    // 这个code result message 为后端统一返回字段，如果修改，则需要在 types.ts 中修改为项目统一返回的接口格式
    const { code, result, message } = data;
    
    // 根据项目逻辑处理
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    if(!hasSuccess) {
      if(message) {
        if (options.errorMessageMode === ErrorMessageModel) {
          ElMessage.error(message)
        } else if (options.errorMessageMode === 'modal') {
          // 这里是一些非常严重的错误，需要弹窗显示
          ElMessageBox.alert(message, '错误消息')
        }
      }
      Promise.reject(new Error(message));
      return ERROR_RESULT;
    }

    // 接口返回成功
    if(code === ResultEnum.SUCCESS)  return result

    // 接口请求错误，统一的错误信息
    if(code === ResultEnum.ERROR) {
      if(message) {
        ElMessage.error(message)
        Promise.reject(new Error(message));
      } else {
        ElMessage.error(errMsg.errorMessage);
        Promise.reject(new Error(errMsg.errorMessage));
      }
      return ERROR_RESULT;
    }

    // 登录超时
    if(code === ResultEnum.TIMEOUT) {
      ElMessageBox.alert(errMsg.timeoutMessage, errMsg.operationFailed)
      Promise.reject(new Error(errMsg.timeoutMessage));
      return ERROR_RESULT;
    }
    return ERROR_RESULT;
  },

  // 请求前处理
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true } = options;
    if (joinPrefix) {
      config.url = `${prefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    if(config.method?.toUpperCase() === RequestEnum.GET) {
      if(!isString(params)) {
        config.params = Object.assign(params|| {}, createNow(joinTime, false))
      }else {
        // 兼容restful其他风格，自己定义
        config.url = config.url + params + `${createNow(joinTime, false)}`
        config.params = undefined
      }
    }else {
      if(!isString(params)){
        formatDate && formatRequestDate(params);
        config.data = params;
        config.params = undefined;
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, config.data);
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config) => {
    const token = getToken();
    if(token) {
      config.headers.Authorization = token
    }
    return token
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message } = error || {};
    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    try{
      if(code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        ElMessage.error(errMsg.apiTimeoutMessage);
      }
      if(err.includes('Network Error')) {
        ElMessageBox.alert(errMsg.networkExceptionMsg, errMsg.networkException)
      }
    }catch (err) {
      throw new Error(err);
    }
    checkStatus(error?.response?.status, msg);
    return Promise.reject(error);
  }
  
}

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        timeout: 10 * 1000,
        perfixUrl: prefix,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },

        // 数据处理方式
        transform,
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 需要对放回数据进行处理
          isTrensformRequestResult: true,
          // post 请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formData: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口
          apiUrl: apiUrl,
          // 是否加入时间戳
          joinTime: true

        }
      },
      opt || {}
    )
  )
}
export const Http = createAxios();