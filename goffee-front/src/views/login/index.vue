<template>
  <div class="container">
    <div class="loginPage wrapper">
      <div class="top">
        <router-link to="/home" v-tooltip="'返回首页'"> 一切都是命运石之门的选择 </router-link>
      </div>
      <h2>LOGIN</h2>
      <div class="input-box">
        <span class="icon">
          <User style="width: 1em; height: 1em" />
        </span>
        <input
          v-model="loginData.username"
          type="text"
          required
          @keyup.enter.prevent="handleLogin"
        />
        <label>Username</label>
      </div>
      <div class="input-box">
        <span class="icon" @click="isVisible">
          <Lock class="lock-icon" style="width: 1em; height: 1em" />
          <Unlock class="lock-icon invisible" style="width: 1em; height: 1em" />
        </span>
        <input
          ref="passwordInput"
          v-model="loginData.password"
          type="password"
          required
          @keyup.enter.prevent="handleLogin"
        />
        <label>Password</label>
      </div>
      <el-button @click.prevent="handleLogin" :loading="loading" type="primary">登 录</el-button>
    </div>
    <div class="login-bg"></div>
  </div>
</template>

<script setup lang="ts">
import { User, Unlock, Lock } from '@element-plus/icons-vue'
/* useUserStore */
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { type LocationQuery, type LocationQueryValue, useRoute } from 'vue-router'
import router from '@/router'

const userStore = useUserStore()
const route = useRoute()
const loginData = ref<LoginData>({ username: '', password: '' })
const loading = ref(false)
/* 登录 */
const handleLogin = () => {
  if (loginData.value.password.trim().length == 0 || loginData.value.username.trim().length == 0) {
    ElMessage({
      message: '用户名或密码不能为空',
      type: 'error'
    })
  } else {
    loading.value = true
    userStore
      .login(loginData.value)
      .then(async () => {
        await userStore.getInfo()
        const query: LocationQuery = route.query
        const redirect = (query.redirect as LocationQueryValue) ?? '/home'
        const otherQueryParams = Object.keys(query).reduce((acc: any, cur: string) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
        router.push({ path: redirect, query: otherQueryParams })
        ElMessage.success('登录成功')
      })
      .finally(() => {
        loading.value = false
      })
  }
}

const passwordInput = ref<HTMLInputElement>()
const isVisible = () => {
  const element = document.querySelectorAll('.lock-icon')
  element.forEach((el) => {
    el.classList.toggle('invisible')
  })
  passwordInput.value!.type = passwordInput.value?.type === 'password' ? 'text' : 'password'
}
</script>
<script lang="ts">
export default {
  name: 'Login'
}
</script>

<style lang="less" scoped>
@import url(./style/index.less);
</style>
