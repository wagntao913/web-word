# vue 父子组件间传值、方法调用

### 1. provide/inject
### 2. props  
- 向子组件传递参数，单向数据流
- 子组件使用`inheritAttrs:false`和`$attrs`,可以手动决定这些 attribute 会被赋予哪个元素
```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```
### 3. .sync
- 实现双向数据绑定
```js
// 子组件
this.$emit('update:title', newTitle)
// 父组件
<text-document :title.sync="doc.title"></text-document>
```
### 3. this.$parents / this.$refs[child]
### 4. this.$emit('functionName', value) 
### 5. v-model 
- 子组件定义的prop变量名必须为 `value`,事件为`input`,或者使用model
```js
<base-checkbox v-model="lovingVue"></base-checkbox>
···
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```


