<template>
  <div class="app-container">
    <div class="search">
      <el-form ref="queryFormRef" :model="articleTagPageQParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input v-model="articleTagPageQParams.keywords" placeholder="标签名称" clearable @keyup.enter="getArticleTagPage" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getArticleTagPage"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <template #header>
        <el-button type="success" @click="openDialog()"><i-ep-plus />新增</el-button>
        <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
      </template>

      <el-table ref="dataTableRef" v-loading="loading" :data="articleTagPageInfo.list" @selection-change="handleSelectionChange"
        highlight-current-row border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标签名称" prop="tagName" min-width="100" />
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

      <pagination v-if="total > 0" v-model:total="total" v-model:page="articleTagPageQParams.pageNum"
        v-model:limit="articleTagPageQParams.pageSize" @pagination="getArticleTagPage" />
    </el-card>

    <!-- 标签弹窗 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" @close="closeDialog" draggable>
      <el-form ref="articleTagFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="文章标签名称" prop="tagName">
          <el-input v-model="formData.tagName" placeholder="请输入标签名称" />
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
import { ElForm } from 'element-plus';
import { useBlogStore } from '@/store/blog';
import { storeToRefs } from 'pinia';
import { getArticleTagForm,addArticleTag,deleteArticleTags,updateArticleTag} from '@/api/blog/articleTags'
import { ArticleTagForm } from '@/api/blog/articleTags/types';

const blogStore = useBlogStore()
const { loading, articleTagPageInfo, articleTagPageQParams } = storeToRefs(blogStore)
const { getArticleTagPage } = blogStore

const queryFormRef = ref(ElForm);
const articleTagFormRef = ref(ElForm);

const ids = ref<number[]>([]);
const total = ref(0);

const dialog = reactive<DialogOption>({
  visible: false
});

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  articleTagPageQParams.value.pageNum = 1;
  getArticleTagPage();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开标签表单弹窗
 *
 * @param articleTagId
 */
 const formData = reactive<ArticleTagForm>({
  sort: 1,
});
const rules = reactive({
  tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
});
function openDialog(articleTagId?: number) {
  dialog.visible = true;
  if (articleTagId) {
    dialog.title = '修改标签';
    getArticleTagForm(articleTagId).then(({ data }) => {
      Object.assign(formData, data);
      console.log(formData);
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
        updateArticleTag(formData)
          .then(() => {
            ElMessage.success('修改成功');
            closeDialog();
            getArticleTagPage();
          })
          .finally(() => (loading.value = false));
      } else {
        addArticleTag(formData)
          .then(() => {
            ElMessage.success('新增成功');
            closeDialog();
            getArticleTagPage();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
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
  formData.sort = 1;
}

/**
 * 删除
 */
function handleDelete(articleTagId?: number, articleTagName?: string) {
  const articleTagsIds = [articleTagId || ids.value].join(',');
  if (!articleTagsIds) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  ElMessageBox.confirm(`确认删除已选中的${articleTagName == undefined ? '' : '【' + articleTagName + '】'}数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true;
    deleteArticleTags(articleTagsIds)
      .then(() => {
        ElMessage.success('删除成功');
        getArticleTagPage();
      })
      .finally(() => (loading.value = false));
  });
}

onMounted(() => {
  getArticleTagPage();
});
</script>
<script lang="ts">
export default {
  name: "ArticleTags"
}
</script>