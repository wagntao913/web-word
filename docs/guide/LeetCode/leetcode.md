---
title: leetCode Hot 100
date: '2022-04-28'
tags:
  - javascript
---

## 有效的括号

```
给定一个只包括 '('，')'，'{'，'}'，'['，']'  的字符串 s ，判断字符串是否有效。
有效字符串需满足：
左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。

输入：s = "()[]{}"
输出：true

输入：s = "(]"
输出：false

输入：s = "([)]"
输出：false

输入：s = "{[]}"
输出：true

提示：
  1 <= s.length <= 104
  s 仅由括号 '()[]{}' 组成
```

题解

```js
const isValid = function(s) {
  if (s.length % 2 === 1) return false
  let stack = []
  for (let i = 0; i < s.length; i++) {
    console.log(stack)
    let val = s[i]
    if (val === '(') {
      stack.push(')')
    } else if (val === '[') {
      stack.push(']')
    } else if (val === '{') {
      stack.push('}')
    } else if (stack.length === 0 || val !== stack.pop()) {
      return false
    }
  }
  return stack.length === 0
}
```
