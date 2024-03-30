import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'

// axios实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 7000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

//请求拦截器  发请求之前，拦截器可以监测到
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //config 配置对象
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data
    if (code === '200') {
      return response.data
    }
    if (response.data instanceof ArrayBuffer) {
      return response
    }

    ElMessage.error(msg || '系统出错')
    return Promise.reject(new Error(msg || 'Error'))
  },
  async (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data
      // token 过期，重新登录
      if (code === 'A0230') {
        localStorage.clear()
        await ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false
        }).finally(() => {
          window.location.href = '/login'
        })
      } else if (code === '10001') {
        ElMessage.error(msg)
      } else {
        ElMessage.error(msg || '系统出错')
      }

      return Promise.reject(error.message)
    }
  }
)

export default request
