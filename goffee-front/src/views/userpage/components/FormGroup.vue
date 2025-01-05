<template>
  <div class="tw-flex tw-justify-between tw-items-center">
    <p class="head" style="font-size: 32px">详细信息</p>
    <div class="buttongroup">
      <ElButton type="primary" @click="isEdit = !isEdit" v-if="!isEdit">编辑资料</ElButton>
      <ElButton type="primary" @click="giveupEdit" v-else>取消</ElButton>
      <ElButton type="success" v-if="isEdit" @click="formSubmit(userInfoFormInstance)"
        >完成</ElButton
      >
      <ElButton type="success" @click="$router.push('/creation')">内容创作中心</ElButton>
      <ElButton type="warning" @click="pwdDialogVisible = true">修改密码</ElButton>
      <ElButton type="danger" v-if="!userInfo.roles.includes('GUEST')"
        ><a href="https://backstage.goffee.cn" target="_blank">后台</a></ElButton
      >
    </div>
  </div>
  <el-divider />
  <!-- 表单部分 -->
  <div class="form">
    <el-form
      ref="userInfoFormInstance"
      label-position="left"
      label-width="100px"
      style="max-width: 600px"
      :model="userFormInfo"
      :rules="rules"
    >
      <el-form-item label="用户名">
        <p>{{ userInfo.username }}</p>
      </el-form-item>
      <el-form-item label="uid">
        <p>{{ userInfo.uid }}</p>
      </el-form-item>
      <el-form-item label="角色">
        <p>{{ userRoles ? userRoles.replace('ROLE_', '') : 'GUEST' }}</p>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input :disabled="!isEdit" v-model="userFormInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址" prop="email">
        <el-input :disabled="!isEdit" v-model="userFormInfo.email"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group :disabled="!isEdit" v-model="userFormInfo.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="创建时间">
        <p>{{ userInfo.gmtCreate ? userInfo.gmtCreate : '创始人' }}</p>
      </el-form-item>
      <el-form-item label="发表文章数量">
        <p>{{ articleCount }}</p>
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          :disabled="!isEdit"
          v-model="userFormInfo.introduction"
          type="textarea"
          show-word-limit
          maxlength="32"
        />
      </el-form-item>
    </el-form>
  </div>

  <el-dialog v-model="pwdDialogVisible" title="修改密码" width="30%">
    <el-form ref="changePwdFormInstance" :model="willChangedPwd" :rules="changePwdRoles">
      <el-form-item label="原密码：" prop="oldPwd">
        <el-input type="password" v-model="willChangedPwd.oldPwd" />
      </el-form-item>
      <el-form-item label="新密码：" prop="newPwd">
        <el-input type="password" v-model="willChangedPwd.newPwd" />
      </el-form-item>
      <el-form-item
        label="确认密码："
        prop="newPwdRepeat"
        @keyup.enter.native="changePwd(changePwdFormInstance)"
      >
        <el-input type="password" v-model="willChangedPwd.newPwdRepeat" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePwd(changePwdFormInstance)"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { updateUserInfo, updateUserPwd } from '@/api/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getArticleCount } from '@/api/blog'

const { userInfo } = storeToRefs(useUserStore())
const userRoles = userInfo.value.roles.join(',')

/* 获取用户文章数量 */
const articleCount = ref<number>(0)
const getUserArticleCount = async () => {
  const result = await getArticleCount(userInfo.value.userId)
  if (result) {
    articleCount.value = result.data
  }
}

/* 修改个人密码 */
const changePwdRoles = reactive<FormRules>({
  newPwd: [{ required: true, message: '请填写新密码', trigger: 'blur' }],
  oldPwd: [{ required: true, message: '请填写原来的密码', trigger: 'bluer' }],
  newPwdRepeat: [{ required: true, message: '请重复新密码', trigger: 'bluer' }]
})
const pwdDialogVisible = ref(false)
const changePwdFormInstance = ref<FormInstance>()
const willChangedPwd = ref<UpdatePwdForm>({
  newPwd: '',
  oldPwd: '',
  newPwdRepeat: ''
})
const changePwd = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return false
  }
  formEl.validate(async (valid) => {
    if (valid) {
      if (willChangedPwd.value.newPwd !== willChangedPwd.value.newPwdRepeat) {
        ElMessage.error('新密码与重复密码不一致')
        return false
      }
      const { userId } = userInfo.value
      let result = await updateUserPwd(userId, willChangedPwd.value)
      if (result) {
        // 退出登录，清空用户信息
        pwdDialogVisible.value = false
        await useUserStore().logout(userInfo.value.userId, '修改密码成功')
      } else {
        return false
      }
    } else {
      ElMessage.error('请校验表单')
      return false
    }
  })
}

/* 个人信息编辑 */
const rules = reactive<FormRules>({
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { max: 16, message: '昵称不要超过16非字符', trigger: 'blur' }
  ],
  email: [{ type: 'email', message: '请深入正确的邮箱地址', trigger: 'blur' }]
})
const isEdit = ref(false)
// form实例
const userInfoFormInstance = ref<FormInstance>()
const userFormInfo = ref<UserFormInfo>({ userId: '' })
const formSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return false
  }
  await formEl.validate(async (valid) => {
    if (valid) {
      let result = await updateUserInfo(userFormInfo.value)
      if (result) {
        await useUserStore().getInfo()
        isEdit.value = false
        ElMessage.success('修改资料成功')
      } else {
        ElMessage.error('修改资料失败')
      }
    } else {
      ElMessage.error('请校验表单')
      return false
    }
  })
}

/* 取消编辑 */
const giveupEdit = () => {
  Object.assign(userFormInfo.value, userInfo.value)
  isEdit.value = false
}
onMounted(() => {
  Object.assign(userFormInfo.value, userInfo.value)
  getUserArticleCount()
})
</script>

<style lang="less" scoped>
.el-button {
  .cursor-pointer();
}
.head {
  font-family: '楷体';
}
</style>
