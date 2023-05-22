/* 自定义 改变头部样式 */
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

export const useChangeHeaderStyle = () => {
  const instance = getCurrentInstance()
  const router = useRouter()
  const isHome: boolean = router.currentRoute.value.meta.isHome as boolean
  onMounted(() => {
    instance?.proxy?.$Bus.emit('on-isHome', isHome)
  })
}
