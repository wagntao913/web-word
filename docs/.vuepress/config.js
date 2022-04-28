module.exports = {
  title: '',
  base: '/web-word',
  descritption: '前端知识栈',
  theme: 'reco',
  themeConfig: {
    // 博客配置
  },
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  port: '9000',
  themeConfig: {
    type: 'blog',
    // 导航栏配置
    subSidebar: 'auto',
    nav: [
      { text: '首页', link: '/' },
      { text: '前端框架', link: '/framework/Vue' },
      {
        text: '前端技术',
        items: [
          { text: 'TypeScript', link: 'https://www.tslang.cn/' },
          { text: 'Vue.js', link: 'https://cn.vuejs.org/' },
          { text: 'React', link: 'https://react.docschina.org/' },
          { text: 'Vuepress', link: 'https://vuepress.vuejs.org/zh/' }
        ]
      },
      {
        text: 'UI组件库',
        items: [
          { text: 'Element UI', link: 'https://element.eleme.cn/#/zh-CN' },
          {
            text: 'Element Plus',
            link: 'https://element-plus.gitee.io/#/zh-CN/'
          },
          {
            text: 'Ant Design Vue',
            link: 'https://www.antdv.com/docs/vue/introduce-cn/'
          },
          { text: 'Vant', link: 'https://vant-contrib.gitee.io/vant/#/zh-CN/' }
        ]
      }
    ],
    // 侧边栏配置
    sidebar: {
      '/guide/': [
        {
          title: 'Javascript',
          children: [
            { title: '数据类型', path: '/guide/javascript/dataType' },
            { title: '防抖与节流', path: '/guide/javascript/debounce' },
            { title: '函数柯里化', path: '/guide/javascript/curry' },
          ]
        },
        {
          title: 'Vue',
          children: [
            { title: 'axios封装', path: '/guide/vue/axios' },
            { title: '高德地图应用', path: '/guide/vue/amap' },
            { title: 'websocket消息通知', path: '/guide/vue/websocket' },
            { title: 'node版本管理-nvm', path: '/guide/vue/nvm' }
          ]
        },
        {
          title: '小程序',
          children: [
            { title: '微信JSSDK', path: '/guide/miniprogram/wechat' },
            { title: '小程序全局样式', path: '/guide/miniprogram/globalCss' }
          ]
        },
        {
          title: '代码规范',
          collapsable: true,
          children: [
            { title: '命名规则', path: '/guide/specification/' },
            { title: 'js编写规范', path: '/guide/specification/js' },
            { title: 'Vue编写规范', path: '/guide/specification/vue' },
            { title: 'Eslint规范', path: '/guide/specification/Eslint' },
            { title: '提交规范', path: '/guide/specification/commitLint' },
            { title: 'Prettier', path: '/guide/specification/prettier' }
          ]
        },
        {
          title: '算法',
          children: [{ title: 'leetCode Hot 100', path: '/guide/LeetCode/leetcode' }]
        }
      ],
      '/components/': [
        {
          title: '组件',
          children: ['Dialogs']
        }
      ],
      '/framework/': ['Vue', 'Centos'],
      '/product/': [
        {
          title: '智驾救援',
          children: ['Rescue']
        }
      ],
      '/question/': [
        {
          title: '每日一题',
          children: ['base']
        }
      ]
    },
    markdown: {
      lineNumbers: true,
      toc: { includeLevel: [2, 3] }
    },
    lastUpdated: 'Last Updated',
    plugins: ['@vuepress/back-to-top'],
    blogConfig: {
      // tag: {
      //   location: -1, // 在导航栏菜单中所占的位置，默认3
      //   text: 'Tag' // 默认文案 “标签”
      // }
    },
    valineConfig: {
      appId: '6vo03jHeHlUIU8WjdtuuMWLi-gzGzoHsz',// your appId
      appKey: 'oMaM11IWapIMW4G2JXPa6nxC', // your appKey
    }
  }
}
