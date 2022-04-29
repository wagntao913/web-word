---
title: 函数柯里化、函数组合
date: '2022-04-28'
categories:
  - 前端
tags:
  - javascript
---

## 函数柯里化定义

::: theorem
In mathematics and computer science, currying is the technique of translating the evaluation of a function that takes multiple arguments (or a tuple of arguments) into evaluating a sequence of functions, each with a single argument.
::: right
[维基百科](https://en.wikipedia.org/wiki/Currying)
:::
在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

```js
function add(a,b,c) {
  return a+b+c
}

function curry(fn,args){
  let length = fn.length // 获取函数fn参数的个数
  let _args = []
  return function(){
    let arg  =[].slice.call(arguments)
    let args = _args.concat(arg)
    return args.length >= fn.length ? fn.apply(this,args) : curry(fn,args)
  }
}

let curryAdd = curry(add)

==> curryAdd(1)(2)(3)  // 6
==> curryAdd(1)(2,3)  // 6
```

:::tip
柯里化：用闭包把参数保存起来，当参数的数量足够执行函数了，就开始执行函数
:::

## 函数组合

函数组合就是将两个或多个函数结合起来形成一个新函数。实际上就是把处理的函数数据像管道一样连接起来，然后让数据穿过管道连接起来，得到最终的结果。

```js
const add = (x) => x + 1
const multi = (x) => x * 3
const except = (x) => x / 2
let res = except(multi(add(2)))

const compose = function (...funcs){
  return function(x){
    funcs.length === 0  return x
    funcs.length === 1 return fns[0](x)
     return funcs.reduce((a, b) => (...args) => a(b(...args)))
  }
}
```
