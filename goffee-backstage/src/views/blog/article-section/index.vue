<template>
  <div class="app-container">
    <div class="search">
      <el-form ref="queryFormRef" :model="articleSectionQParams" :inline="true">
        <el-form-item prop="keywords" label="关键字">
          <el-input v-model="articleSectionQParams.keywords" placeholder="版块名称" clearable @keyup.enter="getArticleSectionPage" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="articleSectionQParams.status" placeholder="全部" clearable style="width: 200px">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getArticleSectionPage"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <template #header>
        <el-button type="success" @click="openDialog()"><i-ep-plus />新增</el-button>
        <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
      </template>

      <el-table ref="dataTableRef" v-loading="loading" :data="articleSectionPageInfo.list" @selection-change="handleSelectionChange"
        highlight-current-row border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="版块名称" prop="sectionName" min-width="100" />
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
            <el-button type="primary" size="small" link @click="handleDelete(scope.row.id, scope.row.sectionName)">
              <i-ep-delete />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="articleSectionQParams.pageNum"
        v-model:limit="articleSectionQParams.pageSize" @pagination="getArticleSectionPage" />
    </el-card>

    <!-- 版块弹窗 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" @close="closeDialog" draggable>
      <el-form ref="sectionFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="文章版块名称" prop="sectionName">
          <el-input v-model="formData.sectionName" placeholder="请输入版块名称" />
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
import { useBlogStore } from '@/store/blog';
import { getSectionForm,addSection,deleteSections,updateSection} from '@/api/articleSection'
import { ArticleSectionForm } from '@/api/articleSection/types';
import { storeToRefs } from 'pinia';
import { ElForm, ElMessage } from 'element-plus';

const blogStore = useBlogStore()
const { loading, articleSectionPageInfo, articleSectionQParams } = storeToRefs(blogStore)
const { getArticleSectionPage } = blogStore

const queryFormRef = ref(ElForm);
const sectionFormRef = ref(ElForm);

const ids = ref<number[]>([]);
const total = ref(0);

const dialog = reactive<DialogOption>({
  visible: false
});

const menuDialogVisible = ref(false);

const menuList = ref<OptionType[]>([]);

interface CheckedRole {
  id?: number;
  name?: string;
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  articleSectionQParams.value.pageNum = 1;
  getArticleSectionPage();
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开版块表单弹窗
 *
 * @param sectionId
 */
 const formData = reactive<ArticleSectionForm>({
  sort: 1,
  status: 1,
});
const rules = reactive({
  sectionName: [{ required: true, message: '请输入版块名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
});
function openDialog(sectionId?: number) {
  dialog.visible = true;
  if (sectionId) {
    dialog.title = '修改版块';
    getSectionForm(sectionId).then(({ data }) => {
      Object.assign(formData, data);
      console.log(formData);
    });
  } else {
    dialog.title = '新增版块';
  }
}

/**
 * 版块表单提交
 */
function handleSubmit() {
  loading.value = true;
  sectionFormRef.value.validate((valid: any) => {
    if (valid) {
      const sectionId = formData.id;
      if (sectionId) {
        updateSection(formData)
          .then(() => {
            ElMessage.success('修改成功');
            closeDialog();
            getArticleSectionPage();
          })
          .finally(() => (loading.value = false));
      } else {
        addSection(formData)
          .then(() => {
            ElMessage.success('新增成功');
            closeDialog();
            getArticleSectionPage();
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
  sectionFormRef.value.resetFields();
  sectionFormRef.value.clearValidate();

  formData.id = undefined;
  formData.sort = 1;
  formData.status = 1;
}

/**
 * 删除
 */
function handleDelete(sectionId?: number, sectionName?: string) {
  const sectionIds = [sectionId || ids.value].join(',');
  if (!sectionIds) {
    ElMessage.warning('请勾选删除项');
    return;
  }

  ElMessageBox.confirm(`确认删除已选中的${sectionName == undefined ? '' : '【' + sectionName + '】'}数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    loading.value = true;
    deleteSections(sectionIds)
      .then(() => {
        ElMessage.success('删除成功');
        getArticleSectionPage();
      })
      .finally(() => (loading.value = false));
  });
}

onMounted(() => {
  getArticleSectionPage();
});
</script>
<script lang="ts">
export default {
  name: "ArticleSection"
}
</script>