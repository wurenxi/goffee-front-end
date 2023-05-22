<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <div class="search">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="用户名/昵称/UID"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 200px"
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery"
                ><i-ep-search />搜索</el-button
              >
              <el-button @click="resetQuery">
                <i-ep-refresh />
                重置</el-button
              >
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button
                  type="success"
                  @click="openDialog()"
                  v-hasPerm="['sys:user:add']"
                  ><i-ep-plus />新增</el-button
                >
                <el-button
                  type="danger"
                  :disabled="ids.length === 0"
                  @click="handleDelete()"
                  v-hasPerm="['sys:user:delete']"
                  ><i-ep-delete />删除</el-button
                >
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="memberList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              label="UID"
              align="center"
              prop="uid"
              width="100"
            />
            <el-table-column
              v-if="false"
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />
            <el-table-column
              key="username"
              label="用户名"
              align="center"
              prop="username"
              width="300"
            />
            <el-table-column
              label="用户昵称"
              width="120"
              align="center"
              prop="nickname"
            />

            <el-table-column
              label="性别"
              width="100"
              align="center"
              prop="gender"
            />

            <el-table-column
              label="手机号码"
              align="center"
              prop="mobile"
              width="300"
            />

            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :inactive-value="0"
                  :active-value="1"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="gmtCreate"
              width="180"
            ></el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  link
                  @click="resetPassword(scope.row)"
                  ><i-ep-refresh-left />重置密码</el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="openDialog(scope.row.id)"
                  v-hasPerm="['sys:user:edit']"
                  ><i-ep-edit />编辑</el-button
                >
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id, scope.row.username)"
                  v-hasPerm="['sys:user:delete']"
                  ><i-ep-delete />删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 表单弹窗 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="600px"
      append-to-body
      @close="closeDialog"
    >
      <el-form
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            :readonly="!!formData.id"
            v-model="formData.username"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item v-if="!formData.id" label="用户密码" prop="password">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender" placeholder="请选择">
            <el-option label="未知" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'user'
};
</script>

<script setup lang="ts">
import {
  getMemberPage,
  getMemberForm,
  deleteMembers,
  addMember,
  updateMember,
  updateMemberStatus,
  updateMemberPassword,
} from '@/api/user';
import { listRoleOptions } from '@/api/role';

import { MemberForm, MemberQuery, MemberPageVO } from '@/api/user/types';

const queryFormRef = ref(ElForm); // 查询表单
const userFormRef = ref(ElForm); // 用户表单

const loading = ref(false);
const ids = ref([]);
const total = ref(0);
const dialog = reactive<DialogOption>({
  visible: false
});

const queryParams = reactive<MemberQuery>({
  pageNum: 1,
  pageSize: 10
});
const memberList = ref<MemberPageVO[]>();

const formData = reactive<MemberForm>({
  status: 1
});

const rules = reactive({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  roleIds: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur'
    }
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
      required: false,
    }
  ]
});

const roleList = ref<OptionType[]>();

/**
 * 获取角色下拉列表
 */
async function getRoleOptions() {
  listRoleOptions().then(response => {
    roleList.value = response.data;
  });
}

/**
 * 修改用户状态
 */
function handleStatusChange(row: { [key: string]: any }) {
  const text = row.status === 1 ? '启用' : '停用';
  ElMessageBox.confirm('确认要' + text + row.username + '用户吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      return updateMemberStatus(row.id, row.status);
    })
    .then(() => {
      ElMessage.success(text + '成功');
    })
    .catch(() => {
      row.status = row.status === 1 ? 0 : 1;
    });
}

/**
 * 查询
 */
function handleQuery() {
  loading.value = true;
  getMemberPage(queryParams)
    .then(({ data }) => {
      memberList.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 重置密码
 */
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt(
    '请输入用户「' + row.username + '」的新密码',
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'password',
    }
  )
    .then(({ value }) => {
      if (!value) {
        ElMessage.warning('请输入新密码');
        return false;
      }
      updateMemberPassword(row.id, value).then(() => {
        ElMessage.success('密码重置成功，新密码是：' + value);
      });
    })
    .catch(() => {});
}

/**
 * 打开弹窗
 *
 * @param memberId 用户ID
 */
async function openDialog(memberId?: number) {
  await getRoleOptions();
  dialog.visible = true;
  if (memberId) {
    dialog.title = '修改用户';
    getMemberForm(memberId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = '新增用户';
  }
}

/**
 * 关闭用户弹窗
 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**
 * 重置表单
 */
function resetForm() {
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}

/**
 * 表单提交
 */
function handleSubmit() {
  userFormRef.value.validate((valid: any) => {
    if (valid) {
      const memberId = formData.id;
      loading.value = true;
      if (memberId) {
        updateMember(memberId, formData)
          .then(() => {
            ElMessage.success('修改用户成功');
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addMember(formData)
          .then(() => {
            ElMessage.success('新增用户成功');
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/**
 * 删除用户
 */
function handleDelete(id?: string, username?: string) {
  const memberIds = [id || ids.value].join(',');
  if (!memberIds) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  ElMessageBox.confirm(`确认删除用户${username == undefined ? '' : username + '吗'}?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    deleteMembers(memberIds).then(() => {
      ElMessage.success('删除成功');
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery(); // 初始化用户列表数据
});
</script>
