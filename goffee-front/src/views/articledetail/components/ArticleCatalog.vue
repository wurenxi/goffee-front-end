<script lang="ts" setup>
import { useBlogStore } from '@/stores/blog'
import { storeToRefs } from 'pinia'
import { useScroll } from '@vueuse/core'

const { container, titles, currentTitle, progress } = storeToRefs(useBlogStore())

watch(container, (newVal) => {
  getTitles(newVal!)
})

/* 获取目录的标题 */
const getTitles = (container: HTMLElement) => {
  titles.value = []
  let levels = ['h1', 'h2', 'h3']
  let elements = Array.from(container.querySelectorAll('*')) as Array<HTMLElement>

  // 调整标签等级
  let tagNames = new Set(elements.map((el) => el.tagName.toLowerCase()))
  for (let i = levels.length - 1; i >= 0; i--) {
    if (!tagNames.has(levels[i])) {
      levels.splice(i, 1)
    }
  }
  let serialNumbers = levels.map(() => 0)
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]

    let tagName = element.tagName.toLowerCase()
    let level = levels.indexOf(tagName)
    if (level == -1) continue

    let id = tagName + '-' + element.innerText + '-' + i
    let node: Title = {
      id,
      level,
      rawName: element.innerText,
      children: [],
      scrollTop: element.offsetTop,
      isVisible: true,
      name: ''
    }

    if (titles.value.length > 0) {
      const lastNode = titles.value.at(-1) as Title

      // 遇到子标题
      if (lastNode.level < node.level) {
        node.parent = lastNode!
        node.isVisible = false
        lastNode.children?.push(node)
      }

      // 遇到上一级标题
      else if (lastNode.level > node.level) {
        serialNumbers.fill(0, level + 1)
        let parent = lastNode.parent
        while (parent) {
          if (parent.level < node.level) {
            node.isVisible = false
            parent?.children?.push(node)
            node.parent = parent
            break
          }
          parent = parent.parent
        }
      }

      // 遇到平级
      else if (lastNode.parent) {
        node.parent = lastNode.parent
        node.isVisible = false
        lastNode.parent?.children?.push(node)
      }
    }

    serialNumbers[level] += 1
    let serialNumber = serialNumbers.slice(0, level + 1).join('.')

    node.name = serialNumber + ' ' + element.innerText
    titles.value.push(node)
  }
}

/* 目录滚轮配置 */
const content = ref<HTMLElement | null>(null)
const { y } = useScroll(content, { behavior: 'smooth' })

/* 监听滚动事件并更新样式 */
window.addEventListener('scroll', () => {
  progress.value = Math.floor((window.scrollY / document.documentElement.scrollHeight) * 100) + '%'

  let visibleTitles: Array<Title> = []

  for (let i = titles.value.length - 1; i >= 0; i--) {
    const title = titles.value[i]
    if (title.scrollTop <= window.scrollY) {
      if (currentTitle.value.id === title.id) {
        // 目录滚轮自动追踪高亮文章标题
        y.value = currentTitle.value.scrollTop
        return
      }

      Object.assign(currentTitle.value, title)

      // 展开节点
      setChildrenVisible(title, true)
      visibleTitles.push(title)

      // 展开父节点
      let parent = title.parent
      while (parent) {
        setChildrenVisible(parent, true)
        visibleTitles.push(parent)
        parent = parent.parent
      }

      // 折叠其余节点
      for (const t of titles.value) {
        if (!visibleTitles.includes(t)) {
          setChildrenVisible(t, false)
        }
      }

      return
    }
  }
})

/* 设置子节点的可见性 */
const setChildrenVisible = (title: Title, isVisible: boolean) => {
  if (title.children) {
    for (const child of title.children) {
      child.isVisible = isVisible
    }
  }
}

// 滚动到指定的位置
const scrollToView = (scrollTop: number) => {
  window.scrollTo({ top: scrollTop, behavior: 'smooth' })
}
</script>

<template>
  <div v-if="Object.keys(titles).length > 0" class="catalog affix-container" id="catalog">
    <el-affix target=".affix-container" :offset="80" :z-index="1">
      <div class="catalog-card">
        <div class="catalog-card-header">
          <div>
            <span><font-awesome-icon :icon="['fas', 'bars-staggered']" class="catalog-icon" /></span>
            <span>目录</span>
          </div>
          <span class="progress">{{ progress }}</span>
        </div>

        <div class="catalog-content" ref="content">
          <div
            v-for="title in titles"
            :key="title.id"
            @click="scrollToView(title.scrollTop)"
            :class="['catalog-item', currentTitle.id == title.id ? 'active' : 'not-active']"
            :style="{ marginLeft: title.level * 20 + 'px' }"
            v-show="title.isVisible"
            :title="title.rawName"
          >
            {{ title.name }}
          </div>
        </div>
      </div>
    </el-affix>
  </div>
</template>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .catalog {
    width: 20%;
    margin: 0 1rem;
    display: none;
  }

  .catalog-card {
    background: var(--common-bg);
    border-radius: 8px;
    box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
    padding: 20px 24px;
    margin-top: 1rem;
  }

  .catalog-card-header {
    text-align: left !important;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .catalog-icon {
    font-size: 18px;
    margin-right: 10px;
    color: dodgerblue;
  }

  .catalog-card-header div > span {
    font-size: 17px;
    color: #4c4948;
  }

  .progress {
    color: #a9a9a9;
    font-style: italic;
    font-size: 140%;
  }

  .catalog-content {
    max-height: 75vh;
    overflow: auto;
    margin-right: -24px;
    padding-right: 20px;
  }

  .catalog-item {
    color: #666261;
    margin: 5px 0;
    line-height: 28px;
    .cursor-pointer();
    transition: all 0.2s ease-in-out;
    font-size: 14px;
    padding: 2px 6px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;

    &:hover {
      color: #1892ff;
    }
  }

  .active {
    background-color: deepskyblue;
    color: white;

    &:hover {
      background-color: #0c82e9;
      color: white;
    }
  }
}

@media screen and (min-width: 1200px) {
  .catalog {
    display: block;
  }
}
</style>
