import request from '@/utils/request'
import type { AxiosPromise, AxiosProgressEvent } from 'axios'

export const uploadImage = (data: UploadFileType, cb?: Ref<number>) =>
  request({
    url: '/api/oss/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (e: AxiosProgressEvent) => {
      if (cb) {
        cb.value = Number(((e.loaded / e.total!) * 100).toFixed(2))
      }
    },
    timeout: 60000
  }) as AxiosPromise<ResFileType>
