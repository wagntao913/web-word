---
title: commitLint
date: '2022-04-28'
tags:
 - lint
---

安装 CommitLint

```
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

安装 Husky

```
npm install --save-dev husky
```

### commitlint 配置

commit-lint 的配置位于项目根目录下 生成 commitlint.config.js

```
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

:::tip  
注意 commitlint.config.js 文件的编码格式应该时 UTF-8
:::

```js
module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'perf',
        'style',
        'docs',
        'test',
        'refactor',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
}
```

### Husky 配置

生成 .husky 文件夹

```
npx husky install
```

在 .husky 文件夹下创建 commit-msg

```sh
#!/bin/sh

# shellcheck source=./_/husky.sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

### Git 提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范

  - `feat` 增加新功能
  - `fix` 修复问题/BUG
  - `style` 代码风格相关无影响运行结果的
  - `perf` 优化/性能提升
  - `refactor` 重构
  - `revert` 撤销修改
  - `test` 测试相关
  - `docs` 文档/注释
  - `chore` 依赖更新/脚手架配置修改等
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `mod` 不确定分类的修改
  - `wip` 开发中
  - `types` 类型修改

- 提交示例

```
git commit -m 'feat(home): add home page'
```

### 关闭校验

在.husky/commit-msg 内注释以下代码

```
# npx --no-install commitlint --edit "$1"
```