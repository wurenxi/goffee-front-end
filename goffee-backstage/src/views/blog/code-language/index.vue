<template>
    <div class="app-container">
      <div class="search">
        <el-form ref="queryFormRef" :model="queryParams" :inline="true">
          <el-form-item prop="keywords" label="关键字">
            <el-input v-model="queryParams.keyword" placeholder="语言" clearable @keyup.enter="handleQuery" />
          </el-form-item>
  
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 200px">
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
  
          <el-form-item>
            <el-button type="primary" @click="handleQuery"><i-ep-search />搜索</el-button>
            <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  
      <el-card shadow="never">
        <template #header>
          <el-button type="success" @click="openDialog()"><i-ep-plus />新增</el-button>
          <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
        </template>
  
        <el-table ref="dataTableRef" v-loading="loading" :data="codeLanguagePage.list" @selection-change="handleSelectionChange"
          highlight-current-row border>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="Language text" prop="text" min-width="100" />
          <el-table-column label="Language value" prop="value" min-width="100" />
          <el-table-column label="状态" align="center" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
              <el-tag v-else type="info">禁用</el-tag>
            </template>
          </el-table-column>
  
          <el-table-column label="排序" align="center" width="80" prop="sort" />
          <el-table-column label="创建时间" align="center" prop="gmtCreate" />
          <el-table-column label="修改时间" align="center" prop="gmtModified" />
  
          <el-table-column fixed="right" label="操作" width="220">
            <template #default="scope">
              <el-button type="primary" size="small" link @click="openDialog(scope.row.id)">
                <i-ep-edit />编辑
              </el-button>
              <el-button type="primary" size="small" link @click="handleDelete(scope.row.id, scope.row.tagName)">
                <i-ep-delete />删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <pagination v-if="codeLanguagePage.total > 0" v-model:total="codeLanguagePage.total" v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
      </el-card>
  
      <!-- 标签弹窗 -->
      <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" @close="closeDialog" draggable>
        <el-form ref="articleTagFormRef" :model="formData" :rules="rules" label-width="130px">
          <el-form-item label="Language Text" prop="text">
            <el-input v-model="formData.text" placeholder="please input language text" @keyup.enter="handleSubmit" />
          </el-form-item>
          <el-form-item label="Language Value" prop="value">
            <el-input v-model="formData.value" placeholder="please input language value" @keyup.enter="handleSubmit" />
          </el-form-item>
  
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
  
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formData.sort" controls-position="right" :min="0" style="width: 100px" />
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

<script setup lang='ts'>
import { CodeLanguageQuery, CodeLanguagePage, CodeLanguageVO } from '@/api/blog/codeLanguage/types';
import { queryCodeLanguagePage, queryCodeLanguageForm, updateCodeLanguage, addCodeLanguage, deleteCodeLanguage } from '@/api/blog/codeLanguage'

const queryFormRef = ref(ElForm);
const articleTagFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);

const dialog = reactive<DialogOption>({
  visible: false
});

/**
 * 行checkbox change事件
 */
 function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 删除
 */
 function handleDelete(codeLanguageId?: number, codeLanguageText?: string) {
  const articleTagsIds = [codeLanguageId || ids.value].join(',');
  if (!articleTagsIds) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  ElMessageBox.confirm(`确认删除已选中的${codeLanguageText == undefined ? '' : '【' + codeLanguageText + '】'}语言吗?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true;
    deleteCodeLanguage(articleTagsIds)
      .then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      })
      .finally(() => (loading.value = false));
  });
}

/**
 * 打开标签表单弹窗
 */
 const formData = reactive<CodeLanguageVO>({
  text: '',
  value: '',
  status: 1,
});
const rules = reactive({
  text: [{ required: true, message: 'please input language text', trigger: 'blur' }],
  value: [{ required: true, message: 'please input language value', trigger: 'blur' }]
});
function openDialog(languageId?: number) {
  dialog.visible = true;
  if (languageId) {
    dialog.title = '修改标签';
    queryCodeLanguageForm(languageId).then(({ data }) => {
      Object.assign(formData, data);
      formData.gmtCreate = undefined
      formData.gmtModified = undefined
    });
  } else {
    dialog.title = '新增标签';
  }
}

/**
 * 标签表单提交
 */
 function handleSubmit() {
  loading.value = true;
  articleTagFormRef.value.validate((valid: any) => {
    if (valid) {
      const articleTagId = formData.id;
      if (articleTagId) {
        updateCodeLanguage(formData)
          .then(() => {
            ElMessage.success('修改成功');
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addCodeLanguage(formData)
          .then(() => {
            ElMessage.success('新增成功');
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/* 查询条件 */
const queryParams = reactive<CodeLanguageQuery>({
    pageNum: 1,
    pageSize: 10,
})

/* code language page result */
const codeLanguagePage = ref<CodeLanguagePage>({
    list: [],
    total: 0,
})
const handleQuery = async () => {
    loading.value = true
    let result = await queryCodeLanguagePage(queryParams)
    if(result) {
        Object.assign(codeLanguagePage.value, result.data)
    }
    loading.value = false
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
 * 关闭弹窗
 */
 function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**
 * 重置表单
 */
 function resetForm() {
  articleTagFormRef.value.resetFields();
  articleTagFormRef.value.clearValidate();

  formData.id = undefined;
  formData.text = ''
  formData.value = ''
  formData.status = 1;
}

onMounted(() => {
    handleQuery()
})
</script>
<script lang="ts">
export default {
    name: 'CodeLanguage'
}
</script>

<style lang='less' scoped>

</style>