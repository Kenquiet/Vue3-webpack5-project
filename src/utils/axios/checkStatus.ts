
import { ElMessage } from 'element-plus'
import { errMsg } from '../../locales/zh_CN/sys/api'
export function checkStatus(status: number, msg: string): void {
  switch(status) {
    case 400:
      ElMessage.error(`${msg}`)
      break;
    case 401:
      ElMessage.error(errMsg.errMsg401);
      userStore.loginOut(true);
      break;
    case 403:
      ElMessage.error(errMsg.errMsg403);
      break;
    case 404:
      ElMessage.error(errMsg.errMsg404);
      break;
    case 405:
      ElMessage.error(errMsg.errMsg405);
      break;
    case 408:
      ElMessage.error(errMsg.errMsg408);
      break;
    case 500:
      ElMessage.error(errMsg.errMsg500);
      break;
    case 501:
      ElMessage.error(errMsg.errMsg501);
      break;
    case 502:
      ElMessage.error(errMsg.errMsg502);
      break;
    case 503:
      ElMessage.error(errMsg.errMsg503);
      break;
    case 504:
      ElMessage.error(errMsg.errMsg504);
      break;
    case 505:
      ElMessage.error(errMsg.errMsg505;
      break;
    default:
  }
}