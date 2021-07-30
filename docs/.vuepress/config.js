module.exports = {
  title: '前端知识栈',
  base: '/web-word/',
  descritption: '前端知识栈',
  host:'localhost',
  port: '9000',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ]
  ],
  themeConfig:{
    // 导航栏配置
    logo: '/logo.png',
    nav: [
      // { text: 'Home', link: '/' },
      { text: 'web知识体系', link: '/guide/' },
      { text: '组件库', link: '/components/Dialogs/' },
      { text: '面试', link: '/question/base/' },
      { text: '框架', link: '/framework/BMS/' },
      {
        text: '前端技术',
        items:[
          { text: 'TypeScript', link: 'https://www.tslang.cn/' },
          { text: 'Vue.js', link: 'https://cn.vuejs.org/' },
          { text: 'React', link: 'https://react.docschina.org/' },
          { text: 'Vuepress', link: 'https://vuepress.vuejs.org/zh/' },
        ]
      },{
        text: 'UI组件库',
        items: [
          { text: 'Element UI', link: 'https://element.eleme.cn/#/zh-CN' },
          { text: 'Element Plus', link: 'https://element-plus.gitee.io/#/zh-CN/' },
          { text: 'Ant Design Vue', link: 'https://www.antdv.com/docs/vue/introduce-cn/' },
          { text: 'Vant', link: 'https://vant-contrib.gitee.io/vant/#/zh-CN/' },
        ]
      }
    ],
    // 侧边栏配置
    sidebar: {
      '/guide/':[
        {
          title: '代码规范',
          children:[
            '/guide/specification/',
            '/guide/specification/js',
            '/guide/specification/vue'
          ]
        },{
          title: '质量标准',
          children:[
            '/guide/quality/',
          ]
        },{
          title: '知识汇总',
          children:[
            // '/guide/knowledge/axios',
            '/guide/knowledge/nvm',
            '/guide/knowledge/wechat',
            '/guide/knowledge/amap',
            '/guide/knowledge/websocket',
            '/guide/knowledge/dataType',
          ]
        }
      ],
      '/components/':[
        {
          title: '组件',
          children:['Dialogs']
        }
      ],
      '/framework/':[
        {
          title: 'BMS框架',
          children:['BMS']
        },
        {
          title: '移动端框架',
          children:['H5']
        }
      ],
      '/question/':[
        {
          title: '每日一题',
          children:['base']
        }
      ]
    },
    markdown:{
      lineNumbers: true,
      toc:{includeLevel:[2,3]}
    },
    lastUpdated: 'Last Updated',
    plugins: ['@vuepress/back-to-top']

  }
}