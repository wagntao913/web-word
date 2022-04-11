# Vue 3 后台管理系统搭建

:white_check_mark: UI 库 -- Element Plus
:white_check_mark: 图标库 -- Iconify
:white_check_mark: 路由 -- Vue Router
:white_check_mark: 网络请求 -- Axios

#### 升级内容

- 使用 Vue3 重构框架
- 使用 Typescript 编写
- 使用 Vite 作为打包工具
- 实现脚手架 yesway-cli

#### 实施计划

## 1. Vite 基础配置

#### 环境变量设置

根目录创建 `.env.dev`、`.env.production`、`.env.test`文件,以 `VITE_` 为前缀创建环境变量

```js
// .env.dev
NODE_ENV = dev

VITE_APP_TITLE = 'BMS后台管理平台'

VITE_OUT_DIR = 'bms-dev'

VITE_API_BASE_URL = 'http://10.1.11.197:40001/bms'
```

同时创建 `/src/types/end.d.ts`文件,用于 Ts 提示

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_OUT_DIR: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

配置打包命令 ` vite build --mode xxxx`

```json
// package.json
{
  ......
  "scripts":{
     "dev": "vite --mode dev",
      "build:dev": "vite build --mode dev",
      "build:test": "vite build --mode test",
      "build:prod": "vite build --mode production",
  },
  .....
}
```

#### vite 插件配置

###### [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)

1.安装`unplugin-auto-import`,自动导入 Vite、Webpack、Rollup 和 esbuild 的 API。

```bash
yarn add unplugin-auto-import -D
```

2.使用与配置
在 vite.config.ts 中引入与使用

```ts
import AutoImport from 'unplugin-auto-import/vite'

{
  plugins: [
    AutoImport({
      imports: ['vue'], // 全局引入Vue3和注册
      resolvers: [ElementPlusResolver()],//三方组件库引入
      dts: './auto-imports.d.ts',  // 自动引入文件存放位置
    }),
  ],
}
```

###### [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html/blob/main/README.zh_CN.md)

1.安装`vite-plugin-compression`,针对 index.html，提供压缩和基于 ejs 模板功能

```bash
yarn add vite-plugin-html -D
```

2.使用与配置
修改`index.html`文件，在其中增加 ejs 标签

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><%- title %></title>
</head>
```

在`vite.config.ts`中配置

```ts
import { createHtmlPlugin } from 'vite-plugin-html'
{
  ......
  plugins: [
    createHtmlPlugin ({
      minify: true, // 是否压缩html
      entry:'src/main.ts', // 入口文件
      template:'index.html',// 模板相对路径
      inject:{ // 注入HTML数据
        title: env.VITE_TITLE
      }
    }),
  ],
  ......
}
```

###### [vite-plugin-compression](https://github.com/vbenjs/vite-plugin-compression/blob/main/README.zh_CN.md)

1.安装 `vite-plugin-compression`,使用 gzip 或者 brotli 来压缩资源.

```bash
yarn add vite-plugin-compression -D
```

2.使用与配置
在 vite.config.ts 文件中，引入与配置插件

```ts
// vite.config.ts
import viteCompression from 'vite-plugin-compression'

{
  ......
  plugins: [
    viteCompression({
      verbose: true, //在控制台输出压缩结果
      filter: /\.(js|mjs|json|css|html)$/i, // 制定不压缩资源
      disable: false, // 是否禁用
      threshold: 10240, //体积大于threshold才会被压缩，单位b
      algorithm:	'gzip', //	压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      deleteOriginFile: false, // 压缩完是否删除源文件
    }),
  ],
  ......
}
```

## 2. Element-Plus 引入

1.安装 [Element-Plus](https://element-plus.org/zh-CN/component/button.html)

```bash
yarn add element-plus
```

2.组件按需引入
使用 vite 插件 `unplugin-vue-components` 和 `unplugin-auto-import`实现组件的自动按需引入,并在 vite.config.ts 中配置插件

```
npm install -D unplugin-vue-components unplugin-auto-import
```

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

{
  ......
  plugins: [
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-import.d.ts',
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ]
    })
  ],
  ......
}
```

3.针对 message、messageBox 等组件的引入
在 src 目录下创建`gloable`文件夹，在该文件夹下引入一些全局配置

```ts
// gloable/index.ts
import { App } from 'vue'
import { ElMessageBox, ElMessage, IElMessageBox, Message } from 'element-plus'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $message: Message
    $msgbox: IElMessageBox
  }
}
export function globalRegister(app: App): void {
  app.config.globalProperties.$msgbox = ElMessageBox
  app.config.globalProperties.$message = ElMessage

  app.use(ElMessageBox)
  app.use(ElMessage)
}
```

4.Element-Plus 按需引入时，相关的配置
在根组件`App.vue`中使用`el-config-provider`来进行 element-plus 的全局配置

```ts
// app.vue
<template>
  <el-config-provider
    :size="elConfig.size"
    :z-index="elConfig.zIndex"
    :locale="elConfig.locale"
  >
    <router-view />
  </el-config-provider>
</template>
<script setup lang="ts">
  import en from 'element-plus/es/locale/lang/en'
  import zhCn from 'element-plus/es/locale/lang/zh-cn'
  import { useSystemStore } from './store/system'
  import { ElConfigAttr } from './types/type'

  const systemStore = useSystemStore()
  const elConfig: ElConfigAttr = reactive({
    zIndex: 3000,
    size: '',
    autoInsertSpace: false,
    message: 10,
    locale: systemStore.language === 'zhCn' ? zhCn : en
  })
</script>
```

## 3. 图标库引入与封装

##### iconify 组件库

1.管理系统使用[iconify](https://icon-sets.iconify.design/?query=language)图标库

```bash
yarn add @iconify/iconify
```

2.使用 vite 插件 `vite-plugin-purge-icons` 处理图标的引入，将我们所使用的 Iconify 图标都已 html 的 dom 节点形式保存在 html 中，这样我们就可以不发送 http 请求就可以使用图标了

```bash
yarn add vite-plugin-purge-icons @iconify/json --dev
```

```ts
// vite.config.ts
import PurgeIcons from 'vite-plugin-purge-icons';

{
  ......
  plugins: [
    PurgeIcons({})
  ],
  ......
}
```

3.封装 [Icon 组件](/src/components/Icon.vue)

##### elementPlus 组件库

1.安装 elementPlus 图标组件库

```bash
yarn add @element-plus/icons-vue
```

2.全局按需引入

```ts
// gloable/index.ts
import { AddLocation, Edit, Search, SwitchButton } from '@element-plus/icons-vue'
import Icon from '../components/Icon.vue'
import SvgIcon from '../Components/SvgIcon.vue'

export const icons = [Edit, Search, AddLocation, SwitchButton]

export function globalRegister(app: App): void {
  ......
  app.component('icon', Icon)
  app.component('svg-icon', SvgIcon)
  for (const icon of icons) {
    app.component(icon.name, icon)
  }
  .....
}
```

##### 自定义 SVG 图标

1.使用 vite 插件`vite-plugin-svg-icons`生成 svg 雪碧图

```bash
yarn add vite-plugin-svg-icons -D
```

2.在 vite.config.ts 中配置插件,main.ts 中引入

```ts
// vite.config.ts
{
  ......
  plugins: [
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(root, 'src/assets/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]'
    }),
  ],
  ......
}
// main.ts
import 'virtual:svg-icons-register'
```

3.封装[SvgIcon](/src/components/SvgIcon.vue)

4.图标使用

```html
<el-icon color="skyblue"> <edit /></el-icon>
<svg-icon name="alipay"></svg-icon>
<icon :icon="`mdi:content-copy`"></icon>
```

## 4. Axios 的封装

1.安装 axios

```bash
  yarn add axios
```

2.封装 [axios](/src/utils/http.ts)
请求取消封装[文档说明](http://www.axios-js.com/zh-cn/docs/#%E5%8F%96%E6%B6%88)

```ts
// 请求重复取消
const pendingMap = new Map()
// 生成唯一的每个请求的唯一key
const getPendingKey = (config: AxiosRequestConfig) => {
  let { url, method, params, data } = config
  if (typeof data === 'string') data = JSON.parse(data)
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 储存每个请求的唯一cancel回调, 以此为标识
function addPending(config: AxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}

// 取消重复请求
function removePending(config: AxiosRequestConfig) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}
```

3.api 请求使用[request](/src/api/request.ts)
增加接口请求参数、返回数据的类型泛型的传入

```ts
export interface HTTPConfig extends AxiosRequestConfig {
  url: string
  method: Method
  data?: { [key: string]: any }
  params?: { [key: string]: any }
}

export interface ResponseData<T> {
  code: number
  desc: string
  msg: string
  data: T | any
}
```

## 5.Pinia 状态管理

1.安装[Pinia](https://pinia.vuejs.org/)

```bash
yarn add pinia

```

2.引入注册
在 main.ts 中引入并使用 pinia

```ts
// main.ts

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from pinia

const store = createPinia()
const app = createApp(App)

app.use(store)
```

3.创建 store 文件夹，创建不同模块的 store,以 user 模块为例

```ts
// store/user.ts
import { defineStore } from pinia

const useUserStore = defineStore('USER', {
  state: () => {
    return {
      username: '',
      sex: 0
    }
  },
  getter: {},
  actions: {
    changeUsername(username) {
      this.username = username
    }
  }
})
```

4.在页面中使用

```html
<template>
  <div>{{username}}</div>
  <div>{{userStore.username}}</div>
  <button @click="updateUser">update</button>
</template>
<script lang="ts" setup>
  import { useUserStore, storeToRefs } from '@/store/user'

  const userStore = useUserStore()
  // 结构出来的数据都是响应式数据
  const { username, sex } = storeToRefs(userStore)

  const updateUser = () => {
    userStore.username = 'yesway update'
    userStore.$patch((state) => {
      state.username = 'yesway update'
    })
    userStore.$patch({
      username: 'yesway update'
    })
    userStore.changeUsername('yesway update')
  }
</script>
```

5.自定义 Pinia 持久化存储
在`src/plugins`文件中创建 `piniaPlugin.ts`,在`main.ts`中引入并使用

```ts
import { PiniaPluginContext } from 'pinia'

const __piniaKey = '__PINIAKEY__'

type OptPinia = {
  key?: string // storage中的prefix
  storage: 'localStorage' | 'sessionStorage' // 存储位置
}

const piniaPlugin = (options: OptPinia) => {
  return (context: PiniaPluginContext) => {
    const { store } = context
    const itemKey = `${options?.key ?? __piniaKey}${store.$id}`

    const data = window[options.storage].getItem(itemKey)
      ? JSON.parse(window[options.storage].getItem(itemKey) as string)
      : {}

    store.$subscribe(() => {
      window[options.storage].setItem(itemKey, JSON.stringify(toRaw(store.$state)))
    })

    return {
      ...store.$state,
      ...data
    }
  }
}

export default piniaPlugin
```

```ts
import piniaPlugin from './plugins/piniaPlugin'
import {createPinia} from pinia

const store = createPinia()
store.use(piniaPlugin({ storage: 'sessionStorage' }))
······
```

## 6. 国际化配置

## 7.问题汇总

###### Sass 全局变量在 vue+ts 中的使用

1.创建变量定义文件`styles/variables.module.css`文件,结尾以**.module.scss,并创建 **.module.scss.d.ts 声明文件

```ts
// variables.module.css.d.ts
export interface IGlobalScss {
  headerHeight: string
  hoverBg: string
  menuBg: string
  menuTextColor: string
  menuTextActive: string
}
export const variables: IGlobalScss
export default variables
```

2.在`.vue`文件中使用

```html
<template>
  <el-menu
    :background-color="variables.menuBg"
    :active-text-color="variables.menuTextActive"
    :text-color="variables.menuTextColor"
  >
    <menuitem
      v-for="item in userStore.allRoutes"
      :activeColor="variables.menuTextActive"
      :text-color="variables.menuTextColor"
    ></menuitem>
  </el-menu>
</template>
<script>
  import variables from '@/styles/variables.module.scss'
</script>
```

3.在使用 sass 全局变量,不能在 vite 中引入 scss 预配置,

- 处理方式 : 将需要用到的全局变量单独放置一个文件，不在 vite 引入的文件中使用，这样会导致重复的数据要在两个 scss 文件声明  
  更优的方式，待研究

###### 面包屑导航递归函数

```ts
描述：
const arr = [
  {
    path: '/system',
    name: '系统',
    children: [
      {
        path: '/system/role',
        name: '角色',
        children: [
          {
            path: '/system/role/list',
            name: '列表'
          },
          {
            path: '/system/role/detail',
            name: '详情',
            children:[
              {path:'/system/role/detail/list',name:'tst'}
            ]
          },
          { path: '/system/role/table', name: '表格' }
        ]
      }
    ]
  },
  {
    path: '/task',
    name: '任务',
    children: [
      {
        path: '/task/platform',
        name: '待办任务',
        children: [
          {
            path: '/task/platform/detail',
            name: '任务详情'
          }
        ]
      }
    ]
  }
]


查找dart在数组arr的层级关系并输出：
例如：'/system/role/detail'
输出：[
  { path: '/system', name: '系统' },
  { path: '/system/role', name: '角色' },
  { path: '/system/role/detail', name: '列表' }
]

解答：
  interface BreadcrumbItem {
    title: string
    to: string
  }

  let target: BreadcrumbItem[] = []

  const getBreadcrumbList = (routeList: any[], dart: string) => {
    const targetList = dart.replaceAll('/', ',').split(',')
    targetList.shift()
    routeList.forEach((item, index) => {
      const str = item.path.replaceAll('/', ',').split(',')[1]
      if (item.path === dart) {
        target.push({ title: routeList[index].name, to: routeList[index].path })
      }
      if (item.children && item.children.length > 0 && targetList.includes(str)) {
        target.push({ title: routeList[index].name, to: routeList[index].path })
        getBreadcrumbList(item.children, dart)
      }
    })
  }


```

#### 服务器部署

##### 使用 [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) 安装 node 环境

1. 运行命令,安装 nvm

```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

![](https://persongitbook.oss-cn-beijing.aliyuncs.com/nvm-install.png?versionId=CAEQIxiBgMCD28nGgBgiIGRiZjc1YjRhODE4NzQ2YWZhMDRhMzcxNjlkMTdkM2Qw)

2. 查看 nvm 配置文件是生成，可以查看 .bash_profile / .bashrc 文件，查看下配置信息写入了那个文件，然后运行命令，是配置生效,运行命令安装相应的node版本即可

```
source .bashrc
```

![](https://persongitbook.oss-cn-beijing.aliyuncs.com/nvm-test.png?versionId=CAEQIxiBgMDM4NnGgBgiIGFmYzU3OTJlOWQ0NTRhYjJiYjFkZWFlNWU1OTM0ZTFk)
