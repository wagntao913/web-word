# :blue_book: Lint 标准

## ESLint

ESLint 是一个代码规范和错误检查工具，有以下几个特性

- 所有东西都是可以插拔的。你可以调用任意的 rule api 或者 formatter api 去打包或者定义 rule or formatter。
- 任意的 rule 都是独立的
- 没有特定的 coding style，你可以自己配置

### 配置项

项目的 [eslint](https://cn.eslint.org/docs/rules/) 配置位于根目录下 .eslintrc.js 内

```js
module.exports = {
  root: true,
  plugins:["vue"],
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  globals: {
    AMap: true
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    // 风格指南规则
    'array-bracket-spacing': [2, 'never']  // 强制数组括号内的空格的一致性
    'block-spacing': [2, 'always'], // 要求在代码块中开括号前和闭括号后有空格
    'brace-style': [2, '1tbs', { // 大括号风格
      'allowSingleLine': true // 允许块的开括号和闭括号在 同一行
    }],
    'camelcase': [0, {
      'properties': 'always'
    }],
    'comma-dangle': [2, 'never'], // 禁止末尾逗号
    'comma-spacing': [2, {
      'before': false, // 禁止在逗号前使用空格
      'after': true // 要求在逗号后使用一个或多个空格
    }],
    'indent': [2, 2, { // 2 个空格缩进
      'SwitchCase': 1 // switch 语句中的 case 子句的缩进级别 1
    }],
    'comma-style': [2, 'last'], // 要求逗号放在数组元素、对象属性或变量声明之后，且在同一行
    'jsx-quotes': [2, 'prefer-single'], //在 JSX 属性中一致地使用单引号
    'key-spacing': [2, { // 对象属性的冒号左右的空格
      'beforeColon': false, // 禁止在对象字面量的键和冒号之间存在空格
      'afterColon': true // 要求在对象字面量的冒号和值之间存在至少有一个空格
    }],
    'keyword-spacing': [2, {
      'before': true, // 要求在关键字之前至少有一个空格
      'after': true // 要求在关键字之后至少有一个空格
    }],
    'new-cap': [2, {
      'newIsCap': true, //  要求调用 new 操作符时有首字母大小的函数
      'capIsNew': false // 允许调用首字母大写的函数时没有 new 操作符
    }],
    'new-parens': 2, // 禁止调用无参构造函数时有圆括号
    'no-array-constructor': 2, // 禁用 Array 构造函数
    'no-multiple-empty-lines': [2, {
      'max': 2 //最大连续空行数
    }],
    'no-unneeded-ternary': [2, {
      'defaultAssignment': false // 禁止条件表达式作为默认的赋值模式
    }],
    'no-trailing-spaces': 2, // 禁用行尾空格
    'multiline-comment-style':[2,'starred-block'], // 多行注释使用特定风格
    'one-var': [2, {
      'initialized': 'never' // 每个作用域的初始化的变量有多个变量声明
    }],
    'operator-linebreak': [2, 'after', {  // 把换行符放在操作符后面
      'overrides': {
        '?': 'before', // 换行符放在操作符 ? 前面
        ':': 'before'// 换行符放在操作符 : 前面
      }
    }],
    'semi': [2, 'never'], // 禁止在语句末尾使用分号 (除了消除以 [、(、/、+ 或 - 开始的语句的歧义)
    'semi-spacing': [2, {
      'before': false, // 分号之前禁止有空格
      'after': true // 分号之后强制有空格
    }],
    'space-before-blocks': [2, 'always'], // 块语句必须总是至少有一个前置空格
    'space-before-function-paren': [2, 'always'], // 要求在参数的 ( 前面有一个空格
    'space-in-parens': [2, 'never'],// 圆括号内没有空格
    'space-infix-ops': [2,{"int32Hint": false}], // int32Hint 选项为不允许 a|0 不带空格.
    'space-unary-ops': [2, {// 一元操作符之前或之后存在空格
      'words': true,  // 适用于单词类一元操作符之后存在空格
      'nonwords': false // 一元操作符之前或之后不存在空格
    }],
    'spaced-comment': [2, 'always', { // // 或 /* 必须跟随至少一个空白
      'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
    }],
    // ES6 规则
    'arrow-spacing': [2, { // 箭头函数的箭头之前或之后有空格
      'before': true,
      'after': true
    }],
    'constructor-super': 2, // 在构造函数中有 super() 的调用
    'generator-star-spacing': [2, { // generator 函数中 * 号周围有空格
      'before': true,
      'after': true
    }],
    'no-class-assign': 2, // 禁止修改类声明的变量
    'no-const-assign': 2, // 禁止修改 const 声明的变量
    'no-dupe-class-members': 2, // 禁止类成员中出现重复的名称
    'no-new-symbol': 2, // 禁止 Symbolnew 操作符和 new 一起使用
    'no-useless-computed-key': 2, // 禁止在对象中使用不必要的计算属性
    'no-useless-constructor': 2, // 禁用不必要的构造函数
    'prefer-const': 2, // 使用 const 声明那些声明后不再被修改的变量
    'template-curly-spacing': [2, 'never'], // 禁止模板字符串中的嵌入表达式周围空格的使用
    'yield-star-spacing': [2, 'both'], // 在 yield* 表达式中 * 前后使用空格
    // Node.js Common JS
    'handle-callback-err': [2, '^(err|error)$'], // 要求回调函数中有容错处理
    'no-path-concat': 2, // 禁止对 __dirname 和 __filename 进行字符串连接
    // 变量声明相关
    'no-label-var': 2,// 不允许标签与变量同名
    'no-shadow-restricted-names': 2, // 禁止将标识符定义为受限的名字
    'no-undef': 2, // 禁用未声明的变量，除非它们在 /*global */ 注释中被提到
    'no-undef-init': 2, // 禁止将变量初始化为 undefined
    'no-unused-vars': [2, { // 禁止未使用过的变量
      'vars': 'all', // 检测所有变量，包括全局环境中的变量。
      'args': 'none' // 不检查参数
    }],
    // Possible Error
    'no-console': 'off', // 禁用 console 关闭
    'no-cond-assign': 2, // 禁止条件表达式中出现赋值操作符
    'no-const-assign': 2,
    'no-control-regex': 0, // 禁止在正则表达式中使用控制字符
    'no-duplicate-case': 2, // 禁止出现重复的 case 标签
    'no-empty-character-class': 2, // 禁止在正则表达式中使用空字符集
    'no-ex-assign': 2, // 禁止对 catch 子句的参数重新赋值
    'no-inner-declarations': [2, 'functions'], // 禁止在嵌套的块中出现 function 声明
    'no-invalid-regexp': 2, // 禁止 RegExp 构造函数中存在无效的正则表达式字符串
    'no-irregular-whitespace': 2, // 禁止不规则的空白
    'no-regex-spaces': 2, // 禁止正则表达式字面量中出现多个空格
    'no-unsafe-finally': 2, // 禁止在 finally 语句块中出现控制流语句
    'use-isnan': 2, // 要求使用 isNaN() 检查 NaN
    'valid-typeof': 2,// 强制 typeof 表达式与有效的字符串进行比较
    'no-unexpected-multiline': 2, // 禁止出现令人困惑的多行表达式
    'no-sparse-arrays': 2, // 禁用稀疏数组
    // Best Practices
    'no-caller':2, // 禁用 arguments.caller 或 arguments.callee
    'no-empty-pattern': 2, // 禁止使用空解构模式
    'no-eval': 2, // 禁用 eval()
    'no-extend-native': 2, // 禁止扩展原生类型
    'no-extra-bind': 2, // 禁止不必要的 .bind() 调用
    'no-implied-eval': 2, // 禁止使用类似 eval() 的方法
    'no-labels': [2, { // 禁用标签语句
      'allowLoop': false, // 忽略循环语句中的标签
      'allowSwitch': false // 忽略 switch 语句中的标签。
    }],
    'no-multi-spaces': 2, // 禁止使用多个空格
    'no-multi-str': 2, // 禁止使用多行字符串
    'no-return-assign': [2, 'except-parens'], // 禁止在 return 语句中使用赋值语句 除非使用括号把它们括起来。
    'no-self-assign': 2, // 禁止自我赋值
    'no-self-compare': 2, // 禁止自身比较
    'no-sequences': 2, // 禁用逗号操作符
    // vue
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/name-property-casing': 'off',
    'vue/no-v-html': 'off',
  }
}

```

### 编辑器配合

推荐使用 vscode 进行开发，vscode 自带 eslint 插件，可以自动修改一些错误。

同时项目内也自带了 vscode eslint 配置，具体在 .vscode/setting.json 文件夹内部。只要使用 vscode 开发不用任何设置即可使用

```js
{
  "editor.tabSize": 2, // 配置 Tab 空格数
  "editor.formatOnSave": true, // 保存自动格式化代码
  "editor.formatOnPaste": true,// 粘贴自动格式化
  "eslint.autoFixOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/*.log": true,
    "**/*.log*": true,
    "**/bower_components": true,
    "**/dist": true,
    "**/elehukouben": true,
    "**/.git": true,
    "**/.gitignore": true,
    "**/.svn": true,
    "**/.DS_Store": true,
    "**/.idea": true,
    "**/.vscode": false,
    "**/yarn.lock": true,
    "**/tmp": true,
    "out": true,
    "dist": true,
    "node_modules": true,
    "CHANGELOG.md": true,
    "examples": true,
    "res": true,
    "screenshots": true,
    "yarn-error.log": true,
    "**/.yarn": true
  },
   "files.exclude": {
    "**/.cache": true,
    "**/.editorconfig": true,
    "**/.eslintcache": true,
    "**/bower_components": true,
    "**/.idea": true,
    "**/tmp": true,
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true
  },
   "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/.vscode/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true,
    "**/bower_components/**": true,
    "**/dist/**": true,
    "**/yarn.lock": true
  },
  "stylelint.enable": true,
  "prettier.requireConfig": true,
  "liveServer.settings.donotShowInfoMsg": true,
  "[vue]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": false
    }
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
}
```

## CommitLint + Husky

### 安装

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

## Prettier

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
