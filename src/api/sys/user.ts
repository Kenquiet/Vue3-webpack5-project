import { Http } from '../../utils/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  GetUserInfoByUserIdModel,
} from '../../model/userModel';
import { ErrorMessageMode } from '../../utils/axios/types';

enum Api {
  Login = '/login',
  GetUserInfoById = '/getUserInfoById',
  GetPermCodeByUserId = '/getPermCodeByUserId',
}

export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return Http.request<LoginResultModel>(
    { url: Api.Login, method: 'POST', params },
    { errorMessageMode: mode }
  )
}

export function getUserInfoById(params: GetUserInfoByUserIdParams) {
  return Http.request<GetUserInfoByUserIdModel> ({
    url: Api.GetUserInfoById,
    method: 'GET',
    params,
  })
}

export function getPermCodeByUserId(params: GetUserInfoByUserIdParams) {
  return Http.request<string[]>({
    url: Api.GetPermCodeByUserId,
    method: 'GET',
    params,
  });
}