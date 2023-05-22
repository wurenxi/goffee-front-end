declare global {
  /* 分页响应对象 */
  interface PageResult<T> {
    /**
     * 数据列表
     */
    list: T

    /**
     * 数据总数
     */
    total: number
  }
}
export {}
