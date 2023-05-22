declare global {
  /* 登录请求参数 */
  interface LoginData {
    /* 用户名 */
    username: string
    /* 密码 */
    password: string
  }

  /* 登录响应 */
  interface LoginRsult {
    /* 访问token */
    accessToken?: string
    /* token类型 */
    tokenType?: string
  }
}

export {}
