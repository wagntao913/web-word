---
title: Prettier 风格规范
date: '2022-04-28'
tags:
 - lint
---

用于统一项目代码风格，统一的缩进，单双引号，尾逗号等

prettier 配置文件位于项目根目录下 prettier.config.js
:::tip
使用 vscode 编辑器安装 Prettier - Code formatter 插件
:::

```js
module.exports = {
  printWidth: 100, // 单行长度
  tabWidth: 2, // tab缩进大小,默认为2
  useTabs: false, // 使用tab缩进，默认false
  semi: false, // 使用分号, 默认true
  vueIndentScriptAndStyle: true, // 对vue中的script及style标签缩进
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', // 仅在必需时为对象的key添加引号
  bracketSpacing: true, // 在对象前后添加空格-eg: { foo: bar }
  trailingComma: 'all', // 多行时尽可能打印尾随逗号
  jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
  jsxSingleQuote: false, // jsx中使用单引号
  arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
  insertPragma: false, // 在已被preitter格式化的文件顶部加上标注
  requirePragma: false, // 无需顶部注释即可格式化
  proseWrap: 'never', // 文章换行,默认情况下会对你的markdown文件换行进行format会控制在printwidth以内
  htmlWhitespaceSensitivity: 'strict', //对HTML全局空白敏感
  endOfLine: 'auto', //结束行形式
}
```
