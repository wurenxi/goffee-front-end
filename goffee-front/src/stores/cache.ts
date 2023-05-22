import { defineStore } from 'pinia'

export const useCacheStore = defineStore('cache', () => {
  const cachePages = ref<Array<string>>([])
  const setCachePage = (page: string) => {
    if (!cachePages.value.includes(page)) {
      cachePages.value.push(page)
    }
  }
  const removeCachePages = (page: string) => {
    if (cachePages.value.indexOf(page) !== -1) {
      cachePages.value.splice(cachePages.value.indexOf(page), 1)
    }
  }

  return {
    cachePages,
    setCachePage,
    removeCachePages
  }
})
