declare global {
  /* 简易用户信息 */
  interface UserEasy {
    userId: string
    uid: string
    nickname: string
    avatar: string
    introduction: string
  }
  /* 登录用户信息 */
  interface UserInfo {
    userId: string
    username: string
    uid: string
    password: string
    gender: number
    nickname: string
    avatar?: string
    introduction: string
    email: string
    roles: string[]
    gmtCreate?: Date
  }

  /* 更新用户信息的表单 */
  interface UserFormInfo {
    userId: string
    gender?: number
    nickname?: string
    introduction?: string
    email?: string
  }

  /* 更新用户密码的表单 */
  interface UpdatePwdForm {
    oldPwd: string
    newPwd: string
    newPwdRepeat: string
  }

  /* 更新用户头像 */
  interface UserAvatarVO {
    id: string
    avatar: string
  }
}

export {}
