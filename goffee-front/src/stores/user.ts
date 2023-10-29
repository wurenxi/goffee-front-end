import { loginAPI, logoutAPI } from '@/api/auth'
import { getUserInfo } from '@/api/user'
import { resetRouter } from '@/router'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  /* 登录调用 */
  const token = useLocalStorage('accessToken', '')
  const login = async (loginData: LoginData) => {
    const result = await loginAPI(loginData)
    if (result) {
      const { tokenType, accessToken } = result.data
      // Bearer xxxxxxx
      token.value = tokenType + ' ' + accessToken
    } else {
      Promise.reject('登录失败')
    }
  }

  /* 注销 */
  const logout = async (userId: string, msg?: string) => {
    const result = await logoutAPI(userId)
    if (result) {
      resetLoginInfo()
      token.value = ''
      resetRouter(msg)
    } else {
      Promise.reject('logout fail')
    }
  }

  /* 获取用户信息 */
  const userInfo = ref<UserInfo>({
    userId: '',
    username: '',
    uid: '',
    password: '',
    gender: 0,
    nickname: '',
    introduction: '',
    roles: [],
    email: ''
  })
  const getInfo = async () => {
    const result = await getUserInfo()
    if (result) {
      const { data } = result
      if (!data) {
        Promise.reject('Verification failed, please Login again.')
      }
      if (!data.roles || data.roles.length <= 0) {
        Promise.reject('getUserInfo: roles must be a non-null array!')
      }
      Object.assign(userInfo.value, data)
    } else {
      Promise.reject('获取用户信息fail')
    }
  }

  /* 重置 */
  function resetLoginInfo() {
    userInfo.value = {
      userId: '',
      username: '',
      uid: '',
      password: '',
      gender: 0,
      nickname: '',
      avatar: undefined,
      introduction: '',
      roles: [],
      gmtCreate: undefined,
      email: ''
    }
  }

  return {
    token,
    login,
    userInfo,
    logout,
    getInfo,
    resetLoginInfo
  }
})

/* 持久化用户信息 */
// export const useUserInfoStore = defineStore(
//   'userInfo',
//   () => {
//     /* 获取信息 */
//     const userInfo = ref<UserInfo>({
//       userId: '',
//       username: '',
//       uid: '',
//       password: '',
//       gender: 0,
//       nickname: '',
//       introduction: '',
//       roles: [],
//       email: ''
//     })
//     const getInfo = async () => {
//       const result = await getUserInfo()
//       if (result) {
//         const { data } = result
//         if (!data) {
//           Promise.reject('Verification failed, please Login again.')
//         }
//         if (!data.roles || data.roles.length <= 0) {
//           Promise.reject('getUserInfo: roles must be a non-null array!')
//         }
//         Object.assign(userInfo.value, data)
//       } else {
//         Promise.reject('获取用户信息fail')
//       }
//     }

//     /* 重置 */
//     function resetLoginInfo() {
//       userInfo.value = {
//         userId: '',
//         username: '',
//         uid: '',
//         password: '',
//         gender: 0,
//         nickname: '',
//         avatar: undefined,
//         introduction: '',
//         roles: [],
//         gmtCreate: undefined,
//         email: ''
//       }
//     }

//     return {
//       userInfo,
//       getInfo,
//       resetLoginInfo
//     }
//   },
//   {
//     persist: {
//       enabled: true,
//       strategies: [
//         {
//           key: 'userInfo',
//           storage: localStorage
//         }
//       ]
//     }
//   }
// )
