---
title: 命名规则
date: '2022-04-05'
isShowComments: false
tags:
 - lint
---

##  变量
- 命名方式：小驼峰
- 命名规则：前缀名词
::: tip
- boolean 类型的变量使用 is 或 has 开头  
- 逻辑复杂时，建议使用变量名自解释，而不是晦涩难懂的简写
:::
```js
// bad
let setCount = 10 
// good
let maxCount = 10
```
##  常量

- 命名方式：全部大写
- 命名规则：多个单词时使用分隔符`_`
```js
// bad
const errorCode = 400 
// good
const ERROR_CODE = 400
```

##  接口
- 命名方式： 小驼峰
- 命名规则： 常以动作+名称拼接而成
:::tip
常用动词：add、get、update、delete、export
:::
```
    例如：消息任务页面
    1. 获取分页列表数据 getMessageTasksPageList
    2. 获取列表数据(不分页) getMessageTasksList
    2. 添加 addMessageTasks
    3. 修改 updateMessageTasks
    4. 删除 deleteMessageTasks
    5. 导出 exportMessageTasks
    6. 通过id获取信息 getMessageTasksById
```
##  方法
- 命名方式：小驼峰
- 命名规则：以事件名结尾
:::tip  
-  常用事件名：click、change、list  
-  遵循单一职责的基础上，可以把逻辑隐藏在函数中，同时使用准确的函数名自解释。
:::
```
    例如：
    1. getList 获取列表数据 
    2. editClick 添加/修改 
    3. submitClick 提交
    4. pageChange 分页 
    5. sizeChange 每页条数  
    6. exportClick 导出
```

##  类
- 命名方式：大驼峰
- 命名规则：前缀名词
```js
// bad
class person {}
// good
class Person {}
```

##  注释
#### 单行
 必须独占一行。`//` 后跟一个空格，缩进与下一行被注释说明的代码一致。
```js
// 单行注释，注意前面的空格
let maxCount = 123
```
#### 多行
避免使用 `/*...*/` 这样的多行注释。有多行注释内容时，使用多个单行注释。
```js
/**
 * 多行注释
 * /
```

