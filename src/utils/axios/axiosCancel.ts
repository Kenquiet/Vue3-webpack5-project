import type { AxiosRequestConfig, Canceler } from 'axios';
import axios from 'axios';
import { isFn } from '../is';

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
let pendingMap = new Map<string, Canceler>();

export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

export class AxiosCanceler {
  /**
   * @description：添加请求
   * @param { Object } config
   */
  addPanding(config: AxiosRequestConfig) {
    this.removePending(config);// 先删除
    const url = getPendingUrl(config);
    config.cancelToken =
     config.cancelToken ||
     new axios.CancelToken(cancel => {
       if(!pendingMap.has(url)) {
         pendingMap.set(url, cancel);
       }
     })
  }
    /**
   * 移除请求
   * @param {Object} config
   */
  removePending(config: AxiosRequestConfig ) {
    const url = getPendingUrl(config);
    if(pendingMap.has(url)) {
      const cancel = pendingMap.get(url);
      cancel && cancel(url);
      pendingMap.delete(url);
    }
  }

  /**
   * @description: 清空所有pending
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && isFn(cancel) && cancel();
    });
    pendingMap.clear();
  }

  /**
   * @description: 重置
   */
  reset(): void {
    pendingMap = new Map<string, Canceler>();
  }
}

