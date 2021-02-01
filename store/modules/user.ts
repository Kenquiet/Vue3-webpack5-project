import store from '../index';
import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';
import { UserInfo } from 'os';

// 从缓存读取
// function getCache<T>(key: string) {
//   const fn = permissionCacheType === CacheTypeEnum.LOCAL ? getLocal : getSession;
//   return fn(key) as T;
// }

// // 设置缓存
// function setCache(USER_INFO_KEY: string, info: any) {
//   if (!info) return;
//   // const fn = permissionCacheType === CacheTypeEnum.LOCAL ? setLocal : setSession;
//   setLocal(USER_INFO_KEY, info, true);
//   // TODO
//   setSession(USER_INFO_KEY, info, true);
// }

const NAME = 'user';
@Module({ namespaced: true, name: NAME, dynamic: true, store })
class User extends VuexModule {
  private userInfoState: UserInfo | null = null

  private tokenState = '';
  private roleListState = [];
  

  get getUserInfoState(): UserInfo {
    return this.userInfoState
  }
  get getTokenState(): string {
    return this.tokenState
  }

  @Mutation
  commitUserInfoState(info: UserInfo): void {
    this.userInfoState = info
  }

  commitTokenState(token: string): void {
    this.tokenState = token
  }

  @Action
  async getUserInfoAction({userId}: GetUserInfoByUserIdParams) {
    const userInfo = await getUserInfoById({ userId });
    const { role } = userInfo;
    this.commitUserInfoState(userInfo);
    return userInfo;
  }
}