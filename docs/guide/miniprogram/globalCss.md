---
title: 小程序中使用全局样式
date: '2022-04-28'
tags:
  - miniProgram
---

## css 自定义属性

### 1.语法

- `--*`来声明变量名
- `var(--*)`来使用变量

> css 自定义属性使用中，var()允许接受第二个参数，当做缺省值，在使用时最好都填写一个缺省值，
> 第二个参数也可以是另一个自定义属性

```css
body {
  --default-color: pink;
  --font-base: 12px;
  background-color: var(--default-color);
}
.button {
  background-color: var(--theme-color, pink);
  font-size: var(--font-ls, --font-base);
}
```

### 2.全局变量和局部变量

在:root 代码块中声明全局变量，在选择器中声明的为局部变量,局部变量会覆盖全局变量

```css
:root {
  --font-base: 14px;
  --tet-color: #666666;
}
.section-one {
  --font-size: 16px;
  font-size: var(--fonr-size);
  color: var(--text-color);
}
```

![](https://img-blog.csdnimg.cn/img_convert/2b0cae366b455801ab5a197716a02cbb.png)

### 3.css 计算

calc() 函数常常被用于跨单位的计算,css 自定义属性也可以参与到 calc 的计算中

```css
.section-two {
  --text-title-color: lightBlue;
  font-size: calc(2 * var(--font-base));
  color: var(--text-title-color);
}
```

![](https://img-blog.csdnimg.cn/img_convert/0e5cce074f440f440c107ac30399817f.png)

### 4.与 javascript 共同使用

自定义属性也可以通过 getPropertyValue 和 setProperty 方法操作，可以动态改变自定义属性的值

```js
// 获取DOM
const section = document.querySelector('.section-two')
const styles = getComputedStyle(section)
console.log('styles =>', styles)
// 读取变量值
const oldColor = styles.getPropertyValue('--text-title-color').trim()
console.log('oldColor =>', oldColor)
// 设置变量值
section.style.setProperty('--text-title-color', 'green')
```

![](https://img-blog.csdnimg.cn/img_convert/31ea445bfc44c9868aee0316cb87f44b.png)

## 小程序中使用

### 1.基础用法

- web 开发中全局变量是定义在:root，小程序使用时，在 page 中定义变量,
- 在 app.acss 中的变量可以在全局各个页面中使用，同样也可以在各个页面独立定义页面专属的 css 变量

```css
/* /app.acss --> */
page {
  --base-color: #409eff;
  --warning: #e6a23c;
  --danger: #f56c6c;
  --info: #909399;
  --success: #67c23a;
  ......;
}
```

### 2.小程序中动态设置 css 属性

```js
// 在js中设置css变量
let myStyle = `
--bg-color:red; 
--border-radius:50%;
--wid:200px;
--hgt:200px;
`

let chageStyle = `
--bg-color:red; 
--border-radius:50%;
--wid:300px;
--hgt:300px;
`
Page({
  data: {
    viewData: {
      style: myStyle
    }
  },
  onLoad() {
    setTimeout(() => {
      this.setData({ 'viewData.style': chageStyle })
    }, 2000)
  }
})
```

```html
<!--将css变量(js中设置的那些)赋值给style-->
<view class="container">
  <view class="my-view" style="{{viewData.style}}">
    <image src="/images/abc.png" mode="widthFix" />
  </view>
</view>
```

```css
/* 使用var */
.my-view {
  width: var(--wid);
  height: var(--hgt);
  border-radius: var(--border-radius);
  padding: 10px;
  box-sizing: border-box;
  background-color: var(--bg-color);
  transition: all 0.3s ease-in;
}

.my-view image {
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius);
}
```

## 参考文档

- [CSS 变量(自定义属性)实用指南及注意事项](https://www.html.cn/archives/9587)
- [CSS 自定义属性](https://zhuanlan.zhihu.com/p/25714131)
- [css 自定义属性和简单效果](https://www.cnblogs.com/cangqinglang/p/11384703.html)
- [小程序中使用 css var 变量(使 js 可以动态设置 css 样式属性)](https://www.jb51.net/article/183860.htm)
