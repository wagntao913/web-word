# :mailbox_with_mail: 高德地图在 vue 项目中的使用

## 创建高德账号，申请key  
1. 登陆高德地图的官网，进行登录，如果没有账号的话，就注册账号  
<img src="https://persongitbook.oss-cn-beijing.aliyuncs.com/map_register.png">

2. 注册之后，点击控制台进入，进去之后，我们点击应用管理 -> 我的应用 -> 创建应用
<img src="https://persongitbook.oss-cn-beijing.aliyuncs.com/create_map_app.png" >  

3. 点击添加，增加key
<img src="https://persongitbook.oss-cn-beijing.aliyuncs.com/map_add.png" >

## 高德地图在vue项目中引入
1. 采用异步加载方式，项目中 utils 目录下创建 loadAMap.js
```js
  export fucntion loadAMap () {
    return new Promise((reslove, reject) => {
      if(window.AMap) reslove()
      window.init = funciton (){
        reslove()
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = '//webapi.amap.com/maps?v=1.4.15&key=申请的key&plugin=用到的服务&callback=init'
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
```
2. 在需要使用高德地图的界面，引入loadAMap 方法，在界面初始化时(create,mount...)，调用方法加载地图
```js
import { laodAMap } from '@/utils/loadAMap'
......
mounted () {
  loadAMap().then(() => {
    this.map = new AMap.Map('map',{
      resizeEnable: true,
      zoom:11
    })
  }).catch(err => {
    console.log('err', err)
    console.log('高德地图加载失败')
  })
}
```

## 高德地图常用插件使用
#### 1.点击地图增加标记点，并展示信息弹框  

> 使用插件: [AMap.Marker](https://lbs.amap.com/api/javascript-api/reference/overlay#marker), [AMap.InfoWindow](https://lbs.amap.com/api/javascript-api/reference/infowindow#InfoWindow), [AMap.Geocoder](https://lbs.amap.com/api/javascript-api/reference/lnglat-to-address#m_AMap.Geocoder)   
 
```js
  mounted () {
    ......
    //地图加载完毕后
    // 地理编码与逆地理编码类，用于地址描述与坐标之间的转换
    this.geocoder = new AMap.Geocoder() 
    // 用于在地图上弹出一个详细信息展示窗体
    this.infoWindow = new AMap.InfoWindow({
        isCustom: false,
        autoMove: true,
        offset: new AMap.Pixel(-10, -43)
    })
    // 地图绑定点击事件
    this.map.on('click', (event) => {
        this.addMrker(event.lnglat)
    })
    ......
  },
  methods:{
    // 地图点击增加标记点
    addMrker (position) {
      const _this = this
      // 根据点击位置经纬度查询详细信息
      this.geocoder.getAddress([position.lng, position.lat], (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
          this.map.clearInfoWindow()
          const marker = new AMap.Marker({
          map: _this.map,
          position: new AMap.LngLat(position.lng, position.lat),
          size: new AMap.Size(60, 26),
          offset: new AMap.Pixel(-10, -33),
          extData: result.regeocode // 信息窗展示信息
          })
          // 点击marker展示信息弹框
          marker.on('click', (e) => {
          _this.addInfowindow(marker)
          })
          _this.map.add(marker)
          marker.setMap(_this.map)
      }
      })
    },
    // 添加信息窗
    addInfowindow (marker) {
      console.log(marker)
      const positionInfo = marker.getExtData()
      // 信息窗内容样式（自定义）
      const WindowDOM = Vue.extend({
      render: h => {
          return (<div style='min-width: 220px;'>
          <p style='margin: 10px 0px 0px 0px;font-size:14px;'><b>{positionInfo.formattedAddress}</b></p>
          <p style='margin: 5px 0px 0px 0px;font-size:14px;'><span>{positionInfo.addressComponent.province}{positionInfo.addressComponent.city}{positionInfo.addressComponent.district}{positionInfo.addressComponent.street}</span></p>
          <p style='margin: 5px 0px 0px 0px;font-size:14px;'>
              <a style='color:#1e346e;font-size:14px;text-decoration:underline;' onClick={() => this.infoWindowHandler(positionInfo)}>设为起点</a>
              {positionInfo.type === 'tail' ? <a style='color:#1e346e;font-size:14px;text-decoration:underline;margin-left:10px' onClick={() => this.infoWindowHandler(positionInfo)}>设为目的地</a> : ''}
          </p>
          </div>)
      }
      })
      const component = (new WindowDOM()).$mount()
      this.infoWindow.setContent(component.$el)
      this.infoWindow.open(this.map, marker.getPosition())
      this.map.setCenter(marker.getPosition())
    },
  }
```

#### 2.集成高德地图POI查询功能
 > 使用插件: [AMap.Marker](https://lbs.amap.com/api/javascript-api/reference/overlay#marker), [AMap.InfoWindow](https://lbs.amap.com/api/javascript-api/reference/infowindow#InfoWindow), [AMap.Geocoder](https://lbs.amap.com/api/javascript-api/reference/lnglat-to-address#m_AMap.Geocoder),[AMap.PlaceSearch](https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.PlaceSearch)

 ```js
 ......
 methods:{
   ......
  // 搜索点击事件
  searchClick () {
    console.log('== searchClick ==')
    if (!this.queryForm.address) return false
    this.getPOIList(this.queryForm.address)
  },
  // 调用高德地图 PlaceSearch 方法，获取位置信息列表
  getPOIList (keywords) {
    const _this = this
    // 查询条件可以为动态数据
    this.POISearch = new AMap.PlaceSearch({
      // city: city, // 搜索城市
      // citylimit: true, // 限制搜索城市
      extensions: 'all'
      // type: category, // 服务列表
      // pageSize: page.pageSize, // 每页显示条数
      // pageIndex: params.page.pageNum // 当前页
    })
    this.POISearch.search(keywords, (status, res) => {
      console.log(status, res)
      if (status === 'complete' && res.info === 'OK') {
        _this.POIList = res.poiList.pois
        console.log(_this.POIList)
        _this.addPOIMarker(_this.POIList)
      }
    })
  },
  // POI数据打点
  addPOIMarker (POIList) {
    POIList.forEach((item, index) => {
      // 
      const marker = new AMap.Marker({
        map: this.map,
        icon: require('@/assets/' + (index + 1) + '.png'),
        position: [item.location.lng, item.location.lat],
        size: new AMap.Size(21, 32)
      })
      marker.on('click', () => {
        this.showPOIInfo(item)
      })
      this.POIMarkers.push(marker)
    })
    this.map.setFitView(null, true, [100, 100, 100, 450])
  },
  // 显示POIinfo弹框
  showPOIInfo (value) {
    const address = value.pname + value.cityname + value.adname + value.address
    const content = `
    <div class="title"> ${value.name} </div>
    <div class="content">
      <p>地址: ${address} </p>
      <p>电话: ${value.tel} </p>
    </div>`
    this.POIInfoWindow.setContent(content)
    this.POIInfoWindow.open(this.map, [value.location.lng, value.location.lat])
    this.map.setCenter([value.location.lng, value.location.lat])
    this.map.panBy(-185, 0)
  },
  ......
 }
 ```
 <img src="https://persongitbook.oss-cn-beijing.aliyuncs.com/poi_search.png">

参考文章
1. [高德地图自定义消息窗体](https://blog.csdn.net/as849167276/article/details/108708746)
2. [高德官网](https://lbs.amap.com/api/javascript-api/summary)