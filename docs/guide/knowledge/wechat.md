# :mailbox_with_mail: 微信JS-SDK集成与使用

## 绑定域名
- 登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”

## Vue项目引入微信JS-sdk
- 方式一：使用`npm install weixin-js-sdk`
- 方式二：在vue项目下public文件夹下的index.html页面，引入微信配置文件
```html
····
 <!-- 引入微信配置文件 -->
<script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
····
```
## 权限配置
1. 通过`config` 接口注入权限验证配置
所有需要使用 JS-SDK 的页面必须先注入配置信息，否则将无法调用（同一个 url 仅需调用一次，对于变化 url 的 SPA 的 web app 可在每次 url 变化时进行调用,目前 Android 微信客户端不支持 pushState 的 H5 新特性，所以使用 pushState 来实现 web app 的页面会导致签名失败，此问题会在 Android6.2 中修复）。
```js
wx.config({
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，在pc端时会打印。
  appId: '', // 必填，公众号的唯一标识
  timestamp: , // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '', // 必填，签名
  jsApiList: [], // 必填，需要使用的JS接口列表
  openTagList: ['wx-open-launch-weapp'] // 微信开放标签 
})
```
2. 通过 `ready `接口处理成功验证
```js
wx.ready(function(){
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
  // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
  // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});
```
3. 通过 `error` 接口处理失败验证
```js
wx.error(function(res){
  // config信息验证失败会执行error函数，
  // 如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});
```




## 项目中封装JS-SDK config 方法

```js
// /utils/wechat.js
import wx from 'weixin-js-sdk'
import getSignature from '@/api'

/**
 * @description 微信config方法封装
 * @param {string} url  授权网页链接
 * @param {array} apiList 使用的JS接口列表
 * @param {array} openTagList 使用的开放标签列表
 * @returns Promise
 */
export function weixinAuth (  url,  apiList = ['wx-open-launch-weapp', 'getLocation', 'openLocation']  openTagList = ['wx-open-launch-weapp']) {
  if (!is_weixn()) {
    return
  }
  return new Promise((resolve,reject) => {
    getSignature({ url }).then(res => {
      if (res.appId) {
        wx.config({
          debug: false, 
          appId: res.appId, 
          timestamp: res.timeStamp, 
          nonceStr: res.nonceStr, 
          signature: res.signature, 
          jsApiList: apiList, 
          openTagList: openTagList 
        })
        wx.ready(res => {
          resolve(res, wx)
        })
      }
    }).catch(err => {
      reject(err)
    })
  })
}



/**
 * @description 判断使用终端是否为IOS
 * @returns Boolean
 */
export function isIOS () {
  const isIphone = navigator.userAgent.includes('iPhone')
  const isIpad = navigator.userAgent.includes('iPad')
  return isIphone || isIpad
}
```
## 页面中调用
- 单独页面的使用
```js
import { weixinAuth } from '@/utils/wechat'

export default {
  create(){
    const url = window.location.href
    weixinAuth(url)
  }
}
```
- 全局引用
```js
// 
import { weixinAuth, isIOS } from '@/utils/wechat'

router.beforeEach(async (to, from, next) => {
  if (isIOS()) {
    if (from.path === '/') {
      weixinAuth，isIOS({ url: location.href.split('#')[0] })
    }
  }
})

```
## JS-SDK签名算法--后端生成
- appId 和 appsecret 只需登录“微信公众平台”--“开发”--“基本设置”
- url则是前台传过来的当前页面的地址值
1. access_token获取
```java
public String getAccessToken(String appId , String appSecret){
    // 网页授权接口
    String GetPageAccessTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appSecret;
 
    HttpClient client = null;
    String access_token = null;
    int expires_in = 0;
    try {
        client = new DefaultHttpClient();
        HttpGet httpget = new HttpGet(GetPageAccessTokenUrl);
        ResponseHandler<String> responseHandler = new BasicResponseHandler();
        String response = client.execute(httpget, responseHandler);
        JSONObject OpenidJSONO = JSONObject.fromObject(response);
        access_token = String.valueOf(OpenidJSONO.get("access_token"));//获取access_token 
        expires_in = Integer.parseInt(String.valueOf(OpenidJSONO.get("expires_in")));//获取时间
    } catch (Exception e) {
        throw new CommonRuntimeException("获取AccessToken出错！");
    } finally {
        client.getConnectionManager().shutdown();
    }
    return access_token;
}
```
2. 获取jsapi_ticket
```java
public String getTicket(String accessToken) {
  // 网页授权接口
  String GetPageAccessTokenUrl = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+accessToken+"&type=jsapi";
  HttpClient client = null;
  String ticket = "";
  int expires_in = 0;
  try {
    client = new DefaultHttpClient();
    HttpGet httpget = new HttpGet(GetPageAccessTokenUrl);
    ResponseHandler<String> responseHandler = new BasicResponseHandler();
    String response = client.execute(httpget, responseHandler);
    JSONObject OpenidJSONO = JSONObject.fromObject(response);
    ticket = String.valueOf(OpenidJSONO.get("ticket"));//获取ticket
    expires_in = Integer.parseInt(String.valueOf(OpenidJSONO.get("expires_in")));//获取时间
  } catch (Exception e) {
    throw new CommonRuntimeException("获取Ticket出错！");
  } finally {
    client.getConnectionManager().shutdown();
  }
  return ticket;
}
```
3. SHA1加密，参数是由url、jsapi_ticket、noncestr、timestamp组合而成
```java
public String SHA1(String str) {
  try {
    MessageDigest digest = java.security.MessageDigest.getInstance("SHA-1"); //如果是SHA加密只需要将"SHA-1"改成"SHA"即可
    digest.update(str.getBytes());
    byte messageDigest[] = digest.digest();
    // Create Hex String
    StringBuffer hexStr = new StringBuffer();
    // 字节数组转换为 十六进制 数
    for (int i = 0; i < messageDigest.length; i++) {
        String shaHex = Integer.toHexString(messageDigest[i] & 0xFF);
        if (shaHex.length() < 2) {
            hexStr.append(0);
        }
        hexStr.append(shaHex);
    }
    return hexStr.toString();
  } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
  }
  return null;
}
```
4.获取 Signature
```java
public String getSignature(String url) {
  String signature = "";
  String appid = *********;//微信公众号的appid
  String appsecret = ***********;//微信公众号的appsecret
  //获取noncestr
  String noncestr = UUID.randomUUID().toString();
  //获取timestamp
  String timestamp = Long.toString(System.currentTimeMillis() / 1000);
  //获取access_token
  String access_token = getAccessToken(appid , appsecret);
  //获取jspai_ticket
  String jsapi_ticket = getTicket(access_token);
  //将四个数据进行组合，传给SHA1进行加密
  String str = "jsapi_ticket=" + jsapi_ticket +
               "&noncestr=" + noncestr +
               "&timestamp=" + timestamp +
               "&url=" + url;
  //sha1加密
  signature = SHA1(str);
  return signature ;
}
```
## JS-SDK 接口、开放标签使用
####  自定义“分享给朋友”及“分享到QQ”按钮的分享内容
```js
import weixinAuth from '@/utils/wechat'
export default {

  methods:{
    shareFriends () {
      weixinAuth().then((res, wx) => {
        wx.updateAppMessageShareData({ 
          title: '', // 分享标题
          desc: '', // 分享描述
          link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: '', // 分享图标
          success: function () {
            // 设置成功
          }
        })
      })
    }
  }
}
```
####  公众号打开小程序
##### 基本用法
```html
<template>
  <wx-open-launch-weapp
    id="launch-btn"
    :username="weapp.username"
    :path="weapp.path"
    @launch="handleLaunchFn"
    @error="handleErrorFn"
  >
    <script type="text/wxtag-template">
      <style>
        .test-btn{
          width:100%;
          background: #f24f45;
          border-radius: 20px;
          padding:0 10px;
          color:#fff;
          font-size:16px;
          border:none;
        }
      </style>
      <button class="test-btn">点我跳转小程序</button>
    </script>
  </wx-open-launch-weapp>
</template>
<script>
import { weixinAuth } from '@/utils/wechat'
export default {
  created () {
    const url = window.location.href
    wechatUtil.initWechat({ url })
  },
}
</script>

```
##### 使用动态生成标签
- 封装 动态生成微信开放标签(wx-open-launch-weapp)方法
```js
/**
 * @description 动态生成微信发放标签
 * @param { object：{
 *  appid  {string} 小程序原始id(gh_xxxxxxx)
 *  url {string} 小程序跳转路径 例 pages/home/home.html - (后面必须带上.html后缀 否则IOS跳转时出现小程序页面未配置)
 *  eleId {string} 元素id
 *  content {string} html字符串
 * }} info
 **/
export function openLaunchWeapp(info) {
  if(!is_weixin()){
    return false
  }
  if(is_version()){
    var btn = document.getElementById(info.eleId)
    let script = document.createElement('script')
    script.type = "text-wxtag-template"
    script.text = info.content
    let html = `
    <wx-open-launch-weapp style="width:100%;display:block;" username="${info.appid}" path="${info.url}">
      ${script.outerHTML}
    </wx-open-launch-weapp>`
    btn.innerHTML = html
    btn.addEventlistener('launch', function (e) {
      console.log('success')
    })
    btn.addEventListener('error',function (e) {
      console.log('fail',e.detail)
      alert(`跳转异常-${e.detail}`)
    })
  } else {
    alert(`您的版本不支持跳转小程序`)
  }
}

// 判断是否微信环境
function is_weixn() {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  };
};
// 判断当前微信版本号是否支持--使用微信开放标签
export function is_version(){
  let client = false; // 当前版本号是否支持 (默认不支持)
  let wxInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i); // 微信浏览器信息
  // 微信版本号 wxInfo[1] = "7.0.18.1740" (示例)
  //进行split转成数组进行判断 [7,0,18,1740] (示例)
  let version = wxInfo[1].split(".");
  // 判断版本在7.0.12及以上的版本
  if (version[0] >= 7) {
    if (version[1] >= 0) {
      if (version[2] >= 12) {
        client = true; // 当前版本支持
      }
    }
  }
  return client;
}
```
- 页面中使用
```html
<template>
   <div id="launch-btn"></div>
</template>
<script>
import { openLaunchWeapp } from '@/utils/wechat'

export default {
  mounted(){
    const weappDom = this.$el.querySelector('.weapp-cover')
    openLaunchWeapp({
      eleId:"launch-btn", // 元素id
      appid: 'gh_xxxx', // 小程序原始id
      url: 'pages/home/home.html', // 小程序跳转路径
      content: `
          <button class="test-btn">点我跳转小程序</button>
          <style>
            .test-btn{
              width:100%;
              background: #f24f45;
              border-radius: 20px;
              padding:0 10px;
              color:#fff;
              font-size:16px;
              border:none;
            }
          </style>`
    })
  }
}
</script>

```

#### 参考文档
- [JS-SDK说明文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)  
- [微信公众号JSSDK获取signature签名](https://blog.csdn.net/wang_97/article/details/91991954)
- [微信开放标签 - wx-open-launch-weapp (vue动态生成)](https://www.jianshu.com/p/dd28ae14cd93)
- [公众号打开小程序最佳解决方案（Vue）](https://www.vue-js.com/topic/602f819896b2cb0032c389d4)