declare global {
  interface UploadFileType {
    file: any
    bucketName?: string
    userId: string
  }

  interface ResFileType {
    name: string
    url: string
  }
}

export {}
