// import qiniu from 'qiniu'
//
// const accessKey: string = ""
// const secretKey: string = ""
//
// const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
// const config = new qiniu.conf.Config()
// const bucketManager = new qiniu.rs.BucketManager(mac, config)
// const privateBucketDomain: string = 'https://oss.goffee.cn'
// const deadline = parseInt(String(Date.now() / 1000)) + 180
//
// /**
//  * 从 OSS 中获取头像资源
//  * @param fileName 图片全路径
//  */
// const getAvatar = (fileName: string) => {
//   fileName = fileName.substring(fileName.indexOf("avatar"))
//   return bucketManager.privateDownloadUrl(privateBucketDomain, fileName, deadline)
// }
//
// /**
//  * 从 OSS 中获取图片资源
//  * @param fileName 图片全路径
//  */
// const getImage = (fileName: string) => {
//   fileName = fileName.substring(fileName.indexOf("images"))
//   return bucketManager.privateDownloadUrl(privateBucketDomain, fileName, deadline)
// }