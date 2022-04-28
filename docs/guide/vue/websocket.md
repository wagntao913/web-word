---
title: websocket 消息通知
date: '2022-04-28'
tags:
  - vue
  - javascript
---

# :mailbox_with_mail: vue 实现 webSocket 实时信息通知

## :dart: websocket

[WebSocket](http://www.ruanyifeng.com/blog/2017/05/websocket.html) 协议在 2008 年诞生，2011 年成为国际标准。所有浏览器都已经支持了。
它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。
:::tip 特点

- 建立在 TCP 协议之上，服务端的实现比较容易；
- 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器；
- 数据格式比较轻量，性能开销小，通信高效；
- 可以发送文本，也可以发送二进制数据
- 没有同源限制，客户端可以与任意服务器通信
- 协议标识符是 **WS**(如果加密，则为**WSS**)，服务器网址就是 URL  
  :::

![image](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017051503.jpg)

## :dart: VUE + WebSocket 长链接实现

在项目的创建 utils/websocket.js

#### 封装 socket

```js
// 引入store，用于管理socket推送来的消息
import store from '../store'

// 封装websocket对象
const WS = {
  $ws: null, // webscoket实例
  wsUrl: 'ws://xxxxx.com:80/xxx', // websocket链接地址
  timeout: 30000, // 心跳重连时间
  timeoutObj: null, // 定时器
  lockReconnect: false, // 避免重复重连
  reconnectTimes: 0, // 重连次数

  // 初始化webSocket
  createWS: function() {
    if ('WebSocket' in window) {
      this.$ws = new WebSocket(wsURl)
      this.$ws.onopen = this.wsOpen
      this.$ws.onmessage = this.wsMessage
      this.$ws.onerror = this.wsError
      this.$ws.onclose = this.wsClose
    } else {
      alert('Current browser Not support websocket')
    }
  },

  // webSocket 打开
  wsOpen: function() {
    WS.$ws.send('Hello WebSockets!')
    store.commit('SET_WS_CONNECT', true)
    console.log('== websocket open ==')
    // 开始心跳
    heartBeat.start()
  },

  // websocket 接收到服务器消息
  wsMessage: function(msg) {
    console.log('== websocket message ==', msg)
    // 每次接收到服务端消息后 重置websocket心跳
    WS.reset()
    store.commit('SET_WS_MSG', msg.data)
  },

  // websocket 发生错误
  wsError: function(err) {
    console.log('== websocket error ==', err)
    // 发生错误重连socket
    if (WS.reconnectTimes < 10) {
      WS.reconnect()
    }
  },

  // websocket 关闭连接
  wsClose: function(event) {
    console.log('== websocket close ==', event)
    if (WS.$ws && WS.$ws.readyState === 1) {
      WS.$ws.close()
      store.commit('SET_WS_CONNECT', false)
    }
    const token = store.getters.token
    if (token) {
      if (WS.reconnectTimes < 10) {
        // 设置重连次数为10次
        WS.reconnect()
      }
    }
  },

  // socket开始心跳
  wsStartHeart: function() {
    WS.timeoutObj && clearTimeout(WS.timeoutObj)
    WS.timeoutObj = setTimeout(function() {
      // 判断websocket当前状态
      if (WS.$ws.readyState === 1) {
        WS.$ws.send('HeartBeat')
      }
    }, WS.timeout)
  },

  // socket 重置心跳
  wsRset: function() {
    clearTimeout(WS.timeoutObj)
    WS.wsStartHeart()
  },

  // socket 重连
  wsReconnect: function() {
    console.log('Reconnection Socket')
    if (wsConnection.lockReconnect) return
    WS.reconnectTimes++
    WS.lockReconnect = true
    setTimeout(function() {
      // 没连接上会一直重连，设置延迟避免请求过多
      WS.createWS()
      WS.lockReconnect = false
    }, 6000)
  }
}

export default WS
```

在 main.js 中引入 WS，挂载到 Vue 原型上

```js
import Vue from 'vue'
import WS from '@/util/websocket'
Vue.prototype.$ws = WS
```

## socket 全局数据存储

store/index.js

```js
const store= new Vuex.Store({
  modules:{
    user
  },
  state:{
    webSocketMsg:'',
    webSocketConnect: false,
  },
  mutations:{
    // 存储socket推送消息
    SET_WS_MSG (state, msg) =>{
      state.webSocketMsg = msg
    },
    // 设置socket链接状态
    SET_WS_CONNECT (state, msg) {
      state.webSocketConnect = msg
    }
  },
  getters:{
    webSocketConnect: state => state.webSocketConnect,
    webSocketMsg: state => state.webSocketMsg
  }
})
```

## socket 单个组件内使用

```js
  computed:{
    getWsMsg (){
        return this.$store.state.webSocketMsg
    }
  },
  watch:{
    getWsMsg:{
      handler: function(newVal) {
        console.log(newVal)
        alert('接收到webSocket推送'+ newVal)
      }
    }
  }
```

## socket 全局使用

在登陆接口的 callback 中建立 socket 连接,如果系统将登录的处理封装在 store 中,
在 layout 组件中监听 socket 信息推送，并在界面上进行通知
store/user.js

```js
  import WsConnection from '@/utils/socket'
  ......
  const actions = {
      Login({ commit, state, rootState }, params){
          return new Promise((reslove, reject) => {
              login(params).then(res => {
                  const { token } = res
                  commit('SET_TOKEN', token)
                  if(!rootState.webSocketConnect){
                      WsConnection.createWS()
                  }
              })
          })
      }
  }
```

Layout.vue

```js
    computed:{
        wsMsg(){
            return this.$store.getters.webSocketMsg
        }
    },
    watch:{
        wsMsg(new){
            if(val){ // 这里还需要判断socket信息不是心跳信息
                this.showNotify(new)
            }
        }
    },
    methods:{
        showNotify(socketInfo){
            this.$notify({
                title: 'socket消息通知',
                message: socketInfo.msg,
            })
        }
    }
```

参考文档

- [WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)
- [WebSocket 加入心跳包防止自动断开连接](https://www.jianshu.com/p/1141dcf6de3e)
