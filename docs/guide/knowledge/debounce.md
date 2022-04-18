# :mailbox_with_mail: 防抖与节流

## 防抖函数

高频率的输入时，使用防抖函数，减少和触发次数，从而达到性能优化

游戏回城操作，每次按 B 回城，时间都会重新开始计时

```js
/**
 * @params fn 触发的函数方法
 * @params delay 延迟执行时间
 *
 */
const debounce = function(fn, delay) {
  // 初始化定时器
  let timer = null
  // 返回一个闭包函数，用闭包保存timer
  return function() {
    // 每次执行清空上次的定时器
    clearTimeout(timer)
    // 获取方法的入参
    const args = arguments
    // 开启定时器
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

## 节流函数

函数在一段时间内只能执行一次，也是通过控制触发的次数来达到性能的优化

游戏技能 cd，在 cd 时间内只能执行一次

```js
const throttle = function(fn, delay) {
  const start = 0
  return function() {
    let now = Date.now()
    const args = arguments
    if (now - start >= delay) {
      fn.apply(this, args)
      start = now
    }
  }
}
```

