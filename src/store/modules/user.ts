import store from '../index';
import { ElMessageBox } from 'element-plus';
import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';
import {
  LoginParams,
  GetUserInfoByUserIdModel,
  GetUserInfoByUserIdParams,
} from '../../model/userModel'

import { PageEnum } from '../../enums/pageEnum'
import { RoleEnum } from '../../enums/roleEnum';

import { loginApi, getUserInfoById } from '../../api/sys/user';

import router from '../../router';
import { ErrorMessageMode } from '../../utils/axios/types';

export type UserInfo = Omit<GetUserInfoByUserIdModel, 'roles'>;

const NAME = 'user';
@Module({ namespaced: true, name: NAME, dynamic: true, store })
class User extends VuexModule {
  private userInfoState: UserInfo | null = null

  private tokenState = '';
  private roleListState: RoleEnum[] = [];
  

  get getUserInfoState(): UserInfo | null {
    return this.userInfoState
  }
  get getTokenState(): string {
    return this.tokenState
  }

  get getRoleListState(): RoleEnum[] {
    return this.roleListState
  }

  @Mutation
  commitUserInfoState(info: UserInfo): void {
    this.userInfoState = info
  }

  @Mutation
  commitTokenState(token: string): void {
    this.tokenState = token
  }

  @Mutation
  commitRoleListState(roleList: RoleEnum[]): void {
    this.roleListState = roleList;
  }

  @Action
  async getUserInfoAction({userId}: GetUserInfoByUserIdParams) {
    const userInfo = await getUserInfoById({ userId });
    const { role } = userInfo;
    const roleList = [role.value] as RoleEnum[];
    this.commitUserInfoState(userInfo);
    this.commitRoleListState(roleList);
    return userInfo;
  }

  @Action
  async login(
    params: LoginParams & { 
      goHome?: boolean, 
      mode?:ErrorMessageMode 
    }): Promise<GetUserInfoByUserIdModel | null>{
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);

        const { token, userId } = data;

        this.commitTokenState(token);
        const userInfo = await this.getUserInfoAction({ userId });

        goHome && ( await router.replace(PageEnum.BASE_HOME))
        return userInfo
      } catch(err) {
        return null
      }
  }

  /**
   * @description: login out
   */
  @Action
  async loginOut(goLogin = false) {
    goLogin && router.push(PageEnum.BASE_LOGIN);
  }

  /**
   * @description: Confirm before logging out
   */
  @Action
  async configrmLoginOut() {
    ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      await this.loginOut(true);
    })
  }
}

export const userStore = getModule<User>(User);