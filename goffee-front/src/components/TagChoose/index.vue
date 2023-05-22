<template>
  <div class="tw-my-3">
    <!-- 选择的菜单 可以删除 -->
    <div class="tw-flex">
      <p class="label-width tw-flex-shrink-0">已选标签</p>
      <div
        class="tw-border-2 tw-rounded-lg tw-flex-1 tw-flex tw-items-center tw-p-2 tw-justify-between"
      >
        <div class="tw-flex tw-flex-wrap">
          <el-tag
            v-for="tag in choosedTag"
            :key="tag"
            @close="removeTag(tag)"
            class="tw-m-1"
            effect="dark"
            closable
          >
            {{ typeof tag === 'object' ? tag.tagName : tag }}
          </el-tag>
        </div>
        <p class="tw-flex-shrink-0 limit">{{ choosedTag.length }}/{{ limit }}</p>
      </div>
    </div>
    <!-- 待选 -->
    <div class="tw-flex tw-my-4">
      <p class="label-width tw-flex-shrink-0">可选标签</p>
      <div class="tw-flex tw-flex-wrap" :key="'div'">
        <transition-group
          mode="out-in"
          name="anime-class"
          tag="ul"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <el-tag
            effect="dark"
            class="tw-cursor-pointer tw-m-1 tag-item-class"
            v-for="(tag, index) in chooseOptionsFilter"
            :data-index="index"
            :key="tag.name || tag.tagName"
            @click="setTag(tag)"
          >
            {{ tag.name || tag.tagName }}<span v-if="tag.count">{{ tag.count }}</span>
          </el-tag>
          <div v-if="canAdd" class="add-label tw-my-3">
            <el-input
              v-if="inputVisible"
              v-model="inputValue"
              ref="inputref"
              placeholder="标签名"
              size="small"
              style="width: 5em"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
              + 新增标签
            </el-button>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap'
import { ElMessage, ElInput } from 'element-plus'
import type { RendererElement } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * 接收一个数组 待选择标签的数组
     * 如果是一个对象数组 只选择里面的那么
     */
    chooseOptions?: Array<any>
    /**
     * 传入数据 已经选好的tag 应该是一个字符串数组
     */
    choosedTag?: Array<any>
    /**
     * 限制最大能够选择的标签数
     */
    limit?: number
    /**
     * 默认不分页，分页绑定一个分页按钮，而且发送一个事件 @page
     */
    isPage?: boolean
    /**
     * 如果可以新增标签，则传入true 发送事件 @newTag
     */
    canAdd?: boolean
  }>(),
  {
    chooseOptions: () => [],
    choosedTag: () => [],
    limit: 5,
    isPage: false,
    canAdd: false
  }
)
const emit = defineEmits(['changeTag', 'addTag'])
let chooseOptionsFilter = computed(() => {
  return props.chooseOptions.filter((item) => {
    return props.choosedTag.indexOf(typeof item === 'object' ? item.name : item) === -1
  })
})
// const {inputValue, inputref, showInput, handleInputConfirm } = useAddtag(emit);
/* 新增文章标签 */
const inputVisible = ref(false)
const inputValue = ref('')
const inputref = ref<InstanceType<typeof ElInput>>()
// 展示标签input框
const showInput = () => {
  inputVisible.value = true
  // 由于dom还没渲染，在下一个异步任务队列当中 nextTick直接
  // 跳到下一个异步任务
  nextTick(() => {
    inputref.value?.input?.focus()
  })
}
// doAddTag
const handleInputConfirm = async () => {
  if (inputValue.value) {
    emit('addTag', inputValue.value)
    inputVisible.value = false
    inputValue.value = ''
  }
}
const setTag = (tag: any) => {
  if (props.choosedTag.length >= props.limit) {
    ElMessage.error('选择标签达到上限')
    return
  }
  props.choosedTag.push(tag.name ? tag.name : tag)
}
const removeTag = (tag: any) => {
  let index = props.choosedTag.indexOf(tag)
  if (index !== -1) {
    props.choosedTag.splice(index, 1)
  }
}
// 延迟动画 TODO:封装起来 统一调用
const beforeEnter = (el: RendererElement) => {
  el.style.opacity = 0
  el.style.transform = 'translateY(-10px)'
}
const enter = (el: RendererElement, done: () => void) => {
  gsap.to(el, {
    opacity: 1,
    y: '0',
    // delay: el.dataset.index * 0.05,
    onComplete: done
  })
}
const leave = (el: RendererElement, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    y: '-20px',
    ease: 'power4.out',
    // delay: el.dataset.index * 0.05,
    onComplete: done
  })
}
</script>
<script lang="ts">
export default {
  name: 'TagChoose'
}
</script>

<style lang="less" scoped>
.label-width {
  width: 100px;
  font-weight: 600;
}

.add-label {
  width: 100%;
}
</style>
