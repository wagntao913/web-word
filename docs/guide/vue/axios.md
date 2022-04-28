---
title: axios 封装
date: '2022-04-28'
tags:
  - vue
---

## axios 安装

```bash
//yarn
yarn add axios

// npm
npm install axios

```

## axios API

#### 发起请求

```js
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```

#### 并发请求

```js
axios.all(iterable) // 进行多个请求
axios.spread(callback) // 分割多个返回参数
// 实例
axios.all([axios.get('url'), axios.get('url2')]).then(
  axios.spread((url1Resp, url2Resp) => {
    console.log(url1Resp, url2Resp)
  })
)
```

## 项目中 axios 封装

项目中新建 utils/http.ts 文件

```ts
//  utils/http.ts
import axios from axios
import router from '@/routers'
import NProgress from 'NProgress'
import 'nprogress/nprogress.css'
import { ElMessage } from 'element-plus'

interface ResponseData<T> {
  code: number
  desc: string
  msg: string
  data: T
}

const SUCCESS_CODE = 20000
const AUTH_CODE = 40001
// 取消重复请求
const pendingMap = new Map()
const createPendingKey = (config) => {
  let {url,method,params,data} = config
  if(typeOf data === 'string') data = JSON.parse(data)
  return [url,method,JSON.stringify(params),JSON.stringify(data)].join('&')
}

const addPendKey = (config) =>{
  const key = createPendingKey(config)
  config.cancelToken = config.cancelToken || new axios.cancelToken((cancel) =>{
    if(!pendingMap.has(key)){
      pendingMap.set(key,cancel)
    }
  })
}

const removePending = (config) =>{
  const key = createPendingKey(config)
  if(pendMap.has(key)){
    const cancelToken = pendingMap.get(key)
    cancelToken(key)
    pendingMap.delete(key)
  }
}

// 创建axios实例
const service = axios.create({
  baseUrl: '',
  timeout: 8000,
  withCredentials: true
})

// 请求拦截
service.interceptors.request.use(
  <T>(config:AxiosRequestConfig:AxiosResponse<ResponseData<T>>) => {
    config.headers = {}
    NProgress.start()
    removePending(config)
    addPending(config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    removePending(response.config)
    NProgress.done()
    const { code, data, msg } = response
    if (code === SUCCESS_CODE) {
      return Promise.resolve(response)
    } else if (code === AUTH_CODE) {
      ElMessage.error(msg || '登录超时，请重新登陆')
      router.push('/login')
      return Promise.reject(response)
    } else {
      ElMessage.error(msg || '接口请求异常，请稍后重试')
      return Promise.reject(msg)
    }
  },
  (error) => {
    NProgress.done()
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message);
    }else if (error.response) {
      let msg = ''
      switch (error.response.status) {
        case 302:
          message = '接口重定向了！'
          break
        case 400:
          message = '参数不正确！'
          break
        case 401:
          message = '您未登录，或者登录已经超时，请先登录！'
          break
        case 403:
          message = '您没有权限操作！'
          break
        case 404:
          message = `请求地址出错: ${error.response.config.url}`
          break // 在正确域名下
        case 408:
          message = '请求超时！'
          break
        case 409:
          message = '系统已存在相同数据！'
          break
        case 500:
          message = '服务器内部错误！'
          break
        case 501:
          message = '服务未实现！'
          break
        case 502:
          message = '网关错误！'
          break
        case 503:
          message = '服务不可用！'
          break
        case 504:
          message = '服务暂时无法访问，请稍后再试！'
          break
        case 505:
          message = 'HTTP版本不受支持！'
          break
        default:
          message = '异常问题，请联系管理员！'
          break
      }
      ElMessage.error(response.msg || msg)
    } else if (error.request) {
      ElMessage.error(error.request)
    } else {
      ElMessage.error('网络连接异常')
    }
    return Promise.reject(error)
  }
)

export default service
```

## 项目中使用

在 api/request.ts 封装使用

```ts
import service from '@/utils/http'
import { AxiosRequestConfig, Method } from 'axios'

interface HTTPConfig extends AxiosRequestConfig {
  url: string
  method: Method
  data?: { [key: string]: any }
  params?: { [key: string]: any }
}

export const request = <T>(config: HTTPConfig): Promise<T> => {
  return new Promise((resolve, reject) => {
    service({
      data: config.data || {},
      params: config.params || {},
      ...config
    })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
```

```ts
import { request } from './request'

interface ResponseData<T> {
  code: number
  desc: string
  msg: string
  data: T
}

type LoginParams = {
  username: string
  password: string
}

type LoginResp = {
  account: string
  token: string
}

export const userLogin = (data: LoginParams) => {
  return request<ResponseData<LoginResp>>({
    url: '/login',
    method: 'POST',
    data
  })
}
```

#### 参考文档

[完整的 Axios 封装](https://juejin.cn/post/6968630178163458084)

[Axios 中文文档](http://www.axios-js.com/zh-cn/docs/)
