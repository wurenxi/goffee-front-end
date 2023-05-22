<template>
    <div class="app-container">
        <div class="search">
            <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item prop="keyword" label="关键字">
                    <el-input v-model="queryParams.keyword" placeholder="标题" clearable @keyup.enter="handleQuery" />
                </el-form-item>

                <el-form-item prop="author" label="作者">
                    <el-input v-model="queryParams.author" placeholder="作者昵称/用户名" clearable @keyup.enter="handleQuery" />
                </el-form-item>

                <el-form-item label="文章版块" prop="articleSectionId">
                    <el-select v-model="queryParams.articleSectionId" placeholder="全部" clearable style="width: 200px">
                        <el-option v-for="articleSection in articleSectionList" :label="articleSection.sectionName"
                            :value="articleSection.id!" />
                    </el-select>
                </el-form-item>

                <el-form-item label="文章标签" prop="articleSectionTagIds">
                    <el-select multiple collapse-tags collapse-tags-tooltip v-model="queryParams.articleTagIds"
                        placeholder="全部" clearable style="width: 200px" filterable>
                        <el-option v-for="articleTag in articleTagList" :label="articleTag.tagName"
                            :value="articleTag.id!" />
                    </el-select>
                </el-form-item>

                <el-form-item label="文章状态" prop="articleSectionTagIds">
                    <el-select v-model="queryParams.deleted" placeholder="全部" clearable style="width: 100px" filterable>
                        <el-option label="正常" value="0" />
                        <el-option label="已删除" value="1" />
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
                <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
            </template>

            <el-table ref="dataTableRef" v-loading="loading" :data="articlePageInfo.list"
                @selection-change="handleSelectionChange" highlight-current-row border>
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="文章标题" prop="title" min-width="130" />
                <el-table-column label="用户名" prop="username" align="center" />
                <el-table-column label="昵称" prop="nickname" align="center" />
                <el-table-column label="版块" prop="articleSectionName" align="center" />
                <el-table-column label="标签" align="center" min-width="300">
                    <template #default="scope">
                        <el-tag style="margin: 5px;" effect="dark" v-for="tag in scope.row.articleTags">{{ tag }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="文章状态" align="center" width="100">
                    <template #default="scope">
                        <el-tag v-if="scope.row.deleted === 1" type="danger">已删除</el-tag>
                        <el-tag v-else type="success">正常</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="创建时间" align="center" prop="gmtCreate" />
                <el-table-column label="修改时间" align="center" prop="gmtModified" />

                <el-table-column fixed="right" label="操作" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" link @click="handleDelete(scope.row.id, scope.row.title)">
                            <i-ep-delete />删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-if="articlePageInfo.total > 0" v-model:total="articlePageInfo.total"
                v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import type { ArticleQuery, ArticlePageVOB } from '@/api/blog/article/types'
import { queryArticlePage, deleteArticle } from '@/api/blog/article'
import { useBlogStore } from '@/store/blog';
import { storeToRefs } from 'pinia';

const blogStore = useBlogStore()
const { loading, articleSectionList, articleTagList } = storeToRefs(blogStore)
const { getArticleSectionList, getArticleTagList } = blogStore
const ids = ref<number[]>([]);

/**
 * 删除
 */
function handleDelete(articleId?: number, title?: string) {
    const articleIds = [articleId || ids.value].join(',');
    if (!articleIds) {
        ElMessage.warning('请勾选删除项');
        return;
    }

    ElMessageBox.confirm(`此操作不可逆，确认物理删除已选中的${title == undefined ? '' : '【' + title + '】'}文章吗?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
    }).then(() => {
        loading.value = true;
        deleteArticle(articleIds)
            .then(() => {
                ElMessage.success('删除成功');
                handleQuery();
            })
            .finally(() => (loading.value = false));
    });
}

/**
 * 行checkbox change事件
 */
function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id);
}

const articlePageInfo = ref<ArticlePageVOB>({
    list: [],
    total: 0,
})

/* 查询条件 */
const queryParams = ref<ArticleQuery>({
    pageNum: 1,
    pageSize: 10,
})
const resetQuery = () => {
    queryParams.value.articleSectionId = undefined
    queryParams.value.articleTagIds = undefined
    queryParams.value.author = undefined
    queryParams.value.keyword = undefined
    queryParams.value.deleted = undefined
    handleQuery()
}
const handleQuery = async () => {
    loading.value = true
    try {
        let result = await queryArticlePage(queryParams.value)
        if (result) {
            Object.assign(articlePageInfo.value, result.data)
        }
    } finally {
        loading.value = false
    }

}
onMounted(() => {
    handleQuery()
    getArticleSectionList()
    getArticleTagList()
})
</script>
<script lang="ts">
export default {
    name: 'Article'
}
</script>