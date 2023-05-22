// 包含了全局类型声明，包括Vue组件、Vue插件、Vue路由等
import 'vue-router'
import mitt from 'mitt'

declare module 'vue-router' {
    interface RouteMeta {
        title?: string
        isHome?: boolean
        requireAuth?: boolean,
        keepAlive: boolean,
    }
}

const Mit = mitt()
// 拓展ComponentCustomProperties类型才能获得类型提示
declare module 'vue' {
    export interface ComponentCustomProperties {
        $Bus: typeof Mit
    }
}