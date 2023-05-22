<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginData" :rules="loginRules" class="login-form">
      <div class="flex text-white items-center py-4">
        <span class="text-2xl flex-1 text-center">{{ $t('login.title') }}</span>
        <lang-select style="color: #fff" />
      </div>

      <el-form-item prop="username">
        <div class="p-2 text-white">
          <svg-icon icon-class="user" />
        </div>
        <el-input class="flex-1" ref="username" size="large" v-model="loginData.username"
          :placeholder="$t('login.username')" name="username" />
      </el-form-item>

      <el-tooltip :disabled="isCapslock === false" content="Caps lock is On" placement="right">
        <el-form-item prop="password">
          <span class="p-2 text-white">
            <svg-icon icon-class="password" />
          </span>
          <el-input class="flex-1" v-model="loginData.password" placeholder="密码"
            :type="passwordVisible === false ? 'password' : 'input'" size="large" name="password" @keyup="checkCapslock"
            @keyup.enter="handleLogin" />
          <span class="mr-2" @click="passwordVisible = !passwordVisible">
            <svg-icon :icon-class="passwordVisible === false ? 'eye' : 'eye-open'" class="text-white cursor-pointer" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button size="default" class="w-full" @click.prevent="handleLogin">{{
        $t('login.login') }}
      </el-button>
    </el-form>
    <div id="bg"></div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import LangSelect from '@/components/LangSelect/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { ElForm } from 'element-plus'

// 状态管理依赖
import { useUserStore } from '@/store/modules/user';

// API依赖
import { LocationQuery, LocationQueryValue, useRoute } from 'vue-router';
import { LoginData } from '@/api/auth/types';

const userStore = useUserStore();
const route = useRoute();

const loginFormRef = ref(ElForm);

const loginData = ref<LoginData>({
  username: '',
  password: ''
});

const loginRules = {
  username: [{ required: true, trigger: 'blur' }],
  password: [{ required: true, trigger: 'blur', /* validator: validatePassword  */ }]
};

const passwordVisible = ref(false);

const loading = ref(false);

// function validatePassword(rule: any, value: any, callback: any) {
//   if (value.length < 6) {
//     callback(new Error('The password can not be less than 6 digits'));
//   } else {
//     callback();
//   }
// }

// 是否大写锁定
const isCapslock = ref(false);

function checkCapslock(e: any) {
  const { key } = e;
  isCapslock.value = key && key.length === 1 && key >= 'A' && key <= 'Z';
}

/**
 *  登录
 */
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          const query: LocationQuery = route.query;

          const redirect = (query.redirect as LocationQueryValue) ?? '/';

          const otherQueryParams = Object.keys(query).reduce(
            (acc: any, cur: string) => {
              if (cur !== 'redirect') {
                acc[cur] = query[cur];
              }
              return acc;
            },
            {}
          );

          router.push({ path: redirect, query: otherQueryParams });
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}
</script>

<style lang="scss" scoped>
#bg {
  position: fixed;
  top: 0;
  z-index: -999;
  width: 100%;
  height: 100%;
  background: url("@/assets/bg.jpg") center center / cover no-repeat local;
  background-position: top center;
  background-repeat: no-repeat;
}

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  animation: to_show 2s;

  .login-form {
    position: relative;
    top: 320px;
    width: 460px;
    max-width: 100%;
    height: 250px;
    margin: 0 auto;
    overflow: hidden;
    background-color: rgba(50, 50, 50, 0.3);
    border: 1px solid rgba(255, 255, 255, .9);
    border-right: 1px solid rgba(255, 255, 255, .5);
    border-bottom: 0;
    border-radius: 20px;
    backdrop-filter: blur(5px);
    padding: 1rem;
  }
}

.el-button {
  background-color: transparent;
  border-style: none;
  color: #fff;
  font-size: 1.35rem;
  padding-bottom: 1.35rem;
}

.el-form-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.el-input {
  background: transparent;

  :deep(.el-input__wrapper) {
    padding: 0;
    background: transparent;
    box-shadow: none;

    .el-input__inner {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      color: #fff;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: #fff !important;
      }

      // 设置输入框自动填充的延迟属性
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out,
          background-color 99999s ease-out;
      }
    }
  }
}

:deep(.el-form-item.is-error) {
  .el-input__wrapper {
    box-shadow: none !important;
  }
}

@keyframes to_show {
  from {
    opacity: 0;
    filter: alpha(opacity=0);
  }

  to {
    opacity: 1;
    filter: none;
  }
}
</style>
