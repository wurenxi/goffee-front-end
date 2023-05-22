<template>
  <div class="out">
    <el-upload
      class="upload"
      :show-file-list="false"
      :limit="1"
      accept=".png, .jpg, .jpeg"
      :before-upload="beforeUpload"
      :http-request="uploadAvatar"
      ref="uploadEl"
      title="点击上传头像"
    >
      <div class="upload-banner">
        <div class="tw-h-full tw-w-full">
          <div class="tip" v-if="loading">
            <div class="loading_percent">{{ loadingPercent }}%</div>
          </div>
          <CustomElImage :img="avatar ? avatar : defaultAvatar" />
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { updateUserAvatar } from '@/api/user'
import { uploadImage } from '@/api/file'
import { useUserInfoStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import defaultAvatar from '@/assets/img/steinsgate/defaultAvatar.jpg'
import {
  ElMessage,
  type UploadInstance,
  type UploadProps,
  type UploadRawFile,
  type UploadRequestOptions
} from 'element-plus'

withDefaults(
  defineProps<{
    avatar?: string
    isShow?: boolean
  }>(),
  {
    avatar: () => '',
    isShow: true
  }
)

const userInfoStore = useUserInfoStore()
const { userInfo } = storeToRefs(userInfoStore)

/* 上传之前检查 */
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isImg) {
    ElMessage.error('请上传jpg或png格式的图片')
  }
}

/* 上传头像 */
const loadingPercent = ref(0)
const uploadEl = ref<UploadInstance>()
const loading = ref(false)
const uploadAvatar = async (options: UploadRequestOptions) => {
  const { file } = options
  loading.value = true
  let result = await uploadImage(
    { file, bucketName: 'images', userId: userInfo.value.userId },
    loadingPercent
  )
  if (result) {
    result = await updateUserAvatar({ id: userInfo.value.userId, avatar: result.data.url })
    if (result) {
      userInfoStore.getInfo()
      ElMessage.success('修改头像成功')
    }
  } else {
    ElMessage.error('头像上传失败')
  }
  // 清空图片历史记录
  loading.value = false
  uploadEl.value?.clearFiles()
}
</script>
<script lang="ts">
export default {
  name: 'CustomUploadAvatar'
}
</script>

<style lang="less" scoped>
.out {
  width: 100%;
  height: 100%;
  .flexbox(column, flex-start);
  .upload {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    flex-shrink: 0;

    .upload-banner {
      border: 0.2rem dashed var(--border-color);
      .flexbox();
      border-radius: 50%;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: rgb(160, 160, 160);
      position: relative;
      overflow: hidden;
      &:hover {
        border: 0.2rem dashed rgb(14, 136, 250);
        background-color: var(--common-bg);
      }

      .tip {
        position: absolute;
        .flexbox(column);
        z-index: 5;
        height: 100%;
        width: 100%;
        backdrop-filter: blur(3px);
        border-radius: 50%;

        .loading_percent {
          color: @themeColor2;
          .flexbox(column);
          padding: 1rem;
          width: 100%;
          height: 100%;
        }
      }
    }

    :deep(.el-upload) {
      width: 100%;
      height: 100%;
    }
  }

  p {
    cursor: default;
  }
}
</style>
