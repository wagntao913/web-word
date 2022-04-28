---
title: Vue编写规范
date: '2022-04-05'
tags:
 - lint
---
## 单文件组件文件名称
- 单文件组件的文件名使用小驼峰
```
// bad
mycomponent.vue

// good
myComponent.vue
```
:::tip
- 创建全局通用组件时，组件文件命名 单词首字母全大写 `MyComponent.vue`
:::

## 紧密耦合的组件名
- 和父组件紧密耦合的子组件应该以父组件名作为前缀命名。
```
// bad
components/
|- TodoList.vue
|- TodoItem.vue
└─ TodoButton.vue

// good
components/
|- todoList.vue
|- todoListItem.vue
└─ todoListItemButton.vue
```
## 组件数据
组件的data 必须是一个函数
```js
// bad
export default {
  data: {
    foo: 'bar'
  }
}
// good
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
```
## 指令缩写
用`:`表示`v-bind:` ，用`@`表示`v-on`
```html
<!-- bad -->
<input v-bind:value="value" v-on:input="onInput">

<!-- good -->
<input :value="value" @input="onInput">
```

## props命名
使用小驼峰命名；内容尽量详细，至少有默认值
```js
// bad
greeting-text: String
// good
greetingText: { 
  type: String, 
  default: ''
}
```
:::tip
  - type取值 `String`,`Number`,`Boolean`,`Array`,`Object`,`Date`,`Function`,`Symbol` 或自定义构造函数  
  - default常用取值 `''`,`0`,`true`,`()=> []`,`() => {}`
:::


## 单文件组件顶级标签的顺序
单文件组件应该总是让顶级标签的顺序保持一致，且标签之间留有空行。
```html
<template>
  ...
</template>

<script>
  export default {
    /* ... */
  }
</script>

<style>
  /* ... */
</style>
```

## 组件选项的顺序
组件选项应该有统一的顺序。
```js
export default {
  name: '',
  /*1. Vue扩展 */
  extends: '', // extends和mixins都扩展逻辑，需要重点放前面
  mixins: [],   
  components: {},
  /* 2. Vue数据 */
  props: {},
  model: { prop: '', event: '' }, // model 会使用到 props
  data () {
    return {}
  },
  computed: {},
  watch:{}, // watch 监控的是 props 和 data，有必要时监控computed
  /* 3. Vue资源 */
  filters: {},
  directives: {},
  /* 4. Vue生命周期 */
  created () {},
  mounted () {},
  destroy () {},
  /* 5. Vue方法 */
  methods: {}, // all the methods should be put here in the last
};
```
:::tip
1. Vue扩展: extends, mixins, components
2. Vue数据: props, model, data, computed, watch
3. Vue资源: filters, directives
4. Vue生命周期: created, mounted, destroy...
5. Vue方法: methods
:::

## props 顺序
标签的 Props 应该有统一的顺序，依次为指令、属性和事件
```html
<my-component
  v-if="if"
  v-show="show"
  v-model="value"
  ref="ref"
  :key="key"
  :text="text"
  @input="onInput"
  @change="onChange"
/>
```
## Vue-Router写法
使用路由懒加载，实现方式是结合Vue异步组件和Webpack代码分割功能。

- 减小包体积，提高加载速度
- 当页面>20个时，组件定义需要拉到编辑器顶部才知道具体路径
:::danger bad
```js
import IntentionList from '@/pages/intention/list'
import Variable from '@/pages/variable'
...

{
    path: '/intention/list',
    name: 'ilist',
    component: IntentionList
},
{
    path: '/variable',
    name: 'variable',
    component: Variable
}
```
:::
::: tip good
```js
{
    path: '/intention/list',
    name: 'ilist',
    component: () => import('@/pages/intention/list')
},
{
    path: '/variable',
    name: 'variable',
    component: () => import('@/pages/variable')
}
```
:::

[Vue官方风格指南](https://cn.vuejs.org/v2/style-guide/index.html)