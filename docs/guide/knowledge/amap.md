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
  export function loadAMap () {
    // AMap 地图引入
    const aMap = new Promise((reslove, reject) => {
      if(window.AMap){
        reslove(window.AMap)
      } else {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = '//webapi.amap.com/maps?v=1.4.15&key=申请的key&plugin=用到的服务&callback=init'
        script.onerror = reject
        document.head.appendChild(script)
      }

      window.init = funciton (){
        reslove(window.AMap)
      }
    })

    //  AMapUI动态引入 
    const aMapUI = new Promise((resolve, reject) => {
      if (window.AMapUI) {
        resolve(window.AMapUI)
      } else {
        var scriptUI = document.createElement('script')
        scriptUI.type = 'text/javascript'
        scriptUI.src = '//webapi.amap.com/ui/1.1/main-async.js'
        scriptUI.onerror = reject

        scriptUI.onload = function (su) {
          resolve(window.AMapUI)
        }
        document.head.appendChild(scriptUI)
      }
    })

    return Promise.all([aMap, aMapUI]).then(res => {
      return res
    }).catch(err => {
      console.log(err)
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
### 1.点击地图增加标记点，并展示信息弹框  

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

### 2.集成高德地图POI查询功能
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
 

### 3. 手机H5实现高德地图地理位置选择

> 使用插件: [AMap.PlaceSearch](https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.PlaceSearch),[AMap.Autocomplete](https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.Autocomplete),[AMapUI-拖拽选址](https://lbs.amap.com/api/amap-ui/reference-amap-ui/other/positionpicker),[AMap.Geolocation](https://lbs.amap.com/api/javascript-api/reference/location#m_AMap.Geolocation)

#### 实现效果
<img src="https://persongitbook.oss-cn-beijing.aliyuncs.com/position-picker.png">

#### 实现逻辑及代码
- 目录结构
```js
└── src                     # 静态资源
    ├── utils                  # 全局公用方法
    │   └── loadAMap.js            # 高德地图异步加载
    ├── components             # 组件
    │   └── AutoComplete.vue       # autocomplete 组件
    └── views                  # 页面
        └── postionSearch.vue      # search页面

```
- 实现逻辑与代码
1. 封装头部autocomplete组件
::: tip 遇到问题
1. 当页面加载高德地图是，高德地图的定位图标 z-index：9999 没有被 van-popup遮盖问题
  手动设置遮罩层的z-index
  ```html
  <van-popup :overlay-style="{zIndex: 99999}"></van-popup>
  ......
  <style>
    .van-popup, .van-overlay{
      z-index: 999999 !important;
    }
  </style>
  ```
2.van-search 失焦后自动隐藏autocomplete面板，若选择了提示项无影响，若未选择提示项，面板未消失
```js
 mounted () {
    this.$nextTick(vm => {
      document.addEventListener('click', (e) => {
        const targetSearch = this.$refs.search
        const targetPanel = this.$refs.panel
        if (!(targetSearch.contains(e.target) || targetPanel.contains(e.target))) {
          console.log('外部点击')
          this.showAutoComplete = false
        }
      })
    })
  },
```
:::
```html
<!-- AutoComplete.vue 实现头部搜索集成高德的autoComplete -->
<template>
  <div class="auto-complete-main">
    <!-- 搜索 -->
    <div class="search-content">
      <van-cell class="province-search van-ellipsis" is-link arrow-direction="down" @click="cityPickerShow"> {{ cityName }} </van-cell>
      <van-search
        v-model="keyword"
        show-action
        class="auto-complete"
        placeholder="请输入搜索地点"
        @focus="onfocus"
        @blur.native="onblur"
        @clear="clearSearchKey"
        @input="oninput"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </div>
    <!-- 高德autocomplete展示面板 -->
    <div v-show="showAutoComplete" class="auto-complete-panel" :style="{'height': panelHeight+'px'}">
      <van-list v-if="autocompleteList.length >0" :finished="true" finished-text="没有更多了">
        <van-cell
          v-for="item in autocompleteList"
          :key="item.id"
          class="panel-item"
          @click="selectAddress(item)"
        >
          <template #default>
            <p class="panel-item-title">{{ item.name }}</p>
            <p class="panel-item-label">{{ item.label }}</p>
          </template>
        </van-cell>
      </van-list>
      <van-empty
        v-else
        description="没有更多了~"
        class="empty"
        image-size="70"
        image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
      />
    </div>
    <!--  省市区选择弹框 -->
    <van-popup v-model="showCityPicker" round position="bottom" :overlay-style="{zIndex: 99999}">
      <van-picker
        show-toolbar
        value-key="cityName"
        style="z-index: 999999"
        position="bottom"
        :default-index="0"
        :columns="cityList"
        @cancel="showCityPicker = false"
        @confirm="citySelectClick"
      />
    </van-popup>
  </div>
</template>
```
``` js
<script>
import { areaList } from '@vant/area-data' //使用vant提供的省市信息
export default {
  data () {
    return {
      keyword: '',
      cityName: '北京市',
      cityCode: '110100',
      showCityPicker: false,
      showAutoComplete: false,
      autocompleteList: []
    }
  },
  computed: {
    panelHeight () {
      return (document.documentElement.clientHeight) * 0.4
    },
    cityList () {
      const cityObj = areaList.city_list
      const list = Object.getOwnPropertyNames(cityObj).map((city) => {
        return { code: city, cityName: cityObj[city] }
      })
      return list
    }
  },
  watch: {
    keyword (newValue) {
      if (!newValue) { this.clearVal() }
    }
  },
  mounted () {
    this.$nextTick(vm => {
      document.addEventListener('click', (e) => {
        const targetSearch = this.$refs.search
        const targetPanel = this.$refs.panel
        if (!(targetSearch.contains(e.target) || targetPanel.contains(e.target))) {
          console.log('外部点击')
          this.showAutoComplete = false
        }
      })
    })
  },
  methods: {
    onblur (event) {
      console.log('onblur', event)
      this.showAutoComplete = false
    },
    onfocus (event) {
      console.log('onfocus', event)
      if (this.keyword) {
        this.showAutoComplete = true
        this.autocomplete(this.keyword, this.cityCode)
      }
    },
    oninput (key) {
      this.autocomplete(key, this.cityCode)
    },
    // 清空关键字
    clearSearchKey () {
      this.clearVal()
      this.$emit('clearKeyword')
    },
    // 展示城市选择弹框
    cityPickerShow () {
      this.clearVal()
      this.showCityPicker = true
    },
    // 城市选择确认
    citySelectClick (city) {
      console.log(arguments)
      this.cityName = city.cityName
      this.cityCode = city.code
      this.showCityPicker = false
    },
    // 点击搜索
    onSearch () {
      console.log(arguments)
      this.clearVal()
      this.$emit('searchAddress', this.keyword, this.cityCode)
    },
    // 选择提示地址
    selectAddress (address) {
      this.keyword = address.name
      this.clearVal()
      this.$emit('selectAddress', address)
    },
    // 回恢复默认设置，关闭autocomplete面板以及查询数据
    clearVal () {
      this.showAutoComplete = false
      this.autocompleteList = []
    },
    // 高德地图 autocomplete 地址自动提示
    autocomplete (keyword, adcode = '') {
      if (!keyword) return false
      const _this = this
      AMap.plugin('AMap.Autocomplete', function () {
        var autocomplete = new AMap.Autocomplete({
          city: adcode,
          citylimit: true
        })
        autocomplete.search(keyword, function (status, result) {
          if (status === 'complete') {
            result.tips = result.tips && result.tips.map(item => {
              item.label = `${item.district}${item.address}`
              return item
            })
            _this.showAutoComplete = true
            _this.autocompleteList = [...result.tips]
          } else {
            _this.showAutoComplete = true
            _this.autocompleteList = []
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.auto-complete-main{
  position: relative;
  text-align: center;
  .search-content{
    display: flex;
    .province-search{
      width: 23%;
      flex-shrink: 1;
    }
    .auto-complete{
      width: 77%;
      flex-shrink:0;
    }
  }
  .auto-complete-panel{
    position: absolute;
    overflow-y: scroll;
    background-color: #fff;
    top: 90px;
    left: 0;
    right: 0px;
    z-index: 99999;
    .panel-item{
      background: #fff;
      border-bottom: .5px solid #eee;
      padding: 20px;
      line-height: 30px;
      &-title{
        font-size: 28px;
      }
      &-label{
        font-size: 24px;
        color:#969799
      }
    }
  }
  .van-cell{
    padding-right: 2px;
  }
}
.van-popup, .van-overlay{
  z-index: 999999 !important;
}
</style>
```
2.positionSearch.vue 页面
```html
<template>
  <div class="position-search-main">
    <map-auto-complete @selectAddress="selectAddress" @searchAddress="searchAddress" />
    <div id="map" class="map-content" :style="{'height': mapHeight+'px'}" />
    <van-cell class="current-position-content" @click="confirmPosition(currentPosition)">
      <van-icon slot="icon" name="aim" size="18px" class="icon" />
      <template #default>
        <p class="title">我的位置</p>
        <p class="sub-title">{{ currentPosition.formattedAddress ? currentPosition.formattedAddress :'定位中....' }}</p>
      </template>
    </van-cell>
    <div class="address-content" :style="{'height': contentHeight+'px'}">
      <van-list finished-text="没有更多了">
        <template v-if="POIList.length">
          <van-cell v-for="item in POIList" :key="item.id" class="item" icon="location-o" @click="confirmPosition(item)">
            <template #default>
              <p class="title">{{ item.name }}</p>
              <p class="sub-title">{{ item.formattedAddress }}</p>
            </template>
          </van-cell>
        </template>
        <van-empty
          v-else
          description="没有更多了~"
          class="empty"
          image-size="70"
          image="https://img01.yzcdn.cn/vant/custom-empty-image.png"
        />
      </van-list>
    </div>
  </div>
</template>
```
```js
<script>
import { loadAMap } from '@/utils/loadAMap'
import MapAutoComplete from './mapAutoComplete.vue'

export default {
  components: {
    MapAutoComplete
  },
  mixins: [navBar],
  data () {
    return {
      map: null,
      geolocation: null,
      placeSearch: null,
      positionPicker: null,
      currentPosition: { // 当前定位
        formattedAddress: ''
      },
      POIList: [], // 高德POI查询 地点数据
      resucuePosition: require('@/assets/rescuePosition.png')
    }
  },
  computed: {
    mapHeight () {
      return (document.documentElement.clientHeight) * 0.45
    },
    contentHeight () {
      return document.documentElement.clientHeight * 0.3
    }
  },
  mounted () {
    const _this = this
    loadAMap().then(() => {
      setTimeout(() => {
        initAMapUI()
        // 初始化地图
        _this.map = new AMap.Map('map', {
          resizeEnable: true,
          zoomEnable: true,
          zoom: 14
        })
        // 加载AMapUI - 拖拽选址
        this.loadAmapUI()
        // 定位个人位置
        this.getCurrentPosition()
      }, 1000)
    }).catch(err => {
      console.log('err', err)
      console.log('高德地图加载失败')
    })
  },
  methods: {
    // 点击选择 autoComplete 提示地址
    selectAddress (item) {
      console.log('autoComplete', item)
      this.map.setCenter([item.location.lng, item.location.lat])
    },
    // 地址搜索
    searchAddress (keyword, adCode) {
      console.log('searchAddress', arguments)
      this.searchPOIs(keyword, adCode)
    },
    // 获取当前位置
    getCurrentPosition () {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        extensions: 'all'
      })
      this.map.addControl(this.geolocation)
      this.geolocation.getCurrentPosition(this.setCurrentPosition)
    },
    // 设置当前位置
    setCurrentPosition (res, address) {
      if (res === 'complete') {
        this.currentPosition = address
      } else {
        this.$toast('获取当前位置失败')
      }
    },
    // 加载AMapUI - 拖拽选址
    loadAmapUI () {
      const _this = this
      AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
        _this.positionPicker = new PositionPicker({
          mode: 'dragMap',
          iconStyle: {// 自定义外观
            url: _this.resucuePosition, // 图片地址
            size: [30, 30], // 要显示的点大小，将缩放图片
            ancher: [15, 28] // 锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
          },
          map: _this.map
        })
        _this.positionPicker.on('success', _this.positionPickerSucc)
        _this.positionPicker.on('fail', (res) => {
          this.$toast('获取当前位置信息失败')
        })
        _this.positionPicker.start()
      })
    },
    // 地图拖动点位置信息成功
    positionPickerSucc (res) {
      console.log('positionPicker', res)
      if (res.info === 'OK') {
        const addressComponent = res.regeocode.addressComponent
        this.POIList = res.regeocode.pois.map(poi => {
          poi.adcode = addressComponent.adcode || ''
          poi.province = addressComponent.province || ''
          poi.city = addressComponent.city || ''
          poi.area = addressComponent.district || ''
          poi.formattedAddress = `${poi.province}${poi.city}${poi.area} ${poi.address}`
          return poi
        })
      } else {
        this.$toast('获取当前位置信息失败')
      }
    },
    // 查询POI信息
    searchPOIs (address, adcode = '010') {
      if (!address) return
      const _this = this
      // 构造地点查询类
      _this.placeSearch = new AMap.PlaceSearch({
        pageSize: 40, // 单页显示结果条数
        pageIndex: 1, // 页码
        city: adcode,
        children: 0, // 不展示子节点数据
        citylimit: true, // 是否强制限制在设置的城市内搜索
        autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        extensions: 'all' // 返回基本地址信息
      })
      // 查询方法
      _this.placeSearch.search(address, function (status, result) {
        console.log('placeSearch', result)
        if (status === 'complete') {
          _this.POIList = result.poiList.pois
        } else {
          console.log(status)
        }
      })
    },
    // 确认地址选择
    confirmPosition (item) {
      console.log('confirmAddress', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.position-search-main{
  position: relative;
  overflow: hidden;
  padding-top: 46PX;
  .current-position-content{
    .icon{
      vertical-align: middle;
      margin-right:10px;
      margin-top: 20px;
    }
  }
  .address-content,.current-position-content{
    overflow-y: scroll;
    .item{
      padding: 20px;
      line-height: 30px;
      .title{
        font-size: 28px;
      }
      .sub-title{
        font-size: 24px;
        color:#969799
      }
    }
  }
}
</style>

```

参考文章
1. [高德地图自定义消息窗体](https://blog.csdn.net/as849167276/article/details/108708746)
2. [高德官网](https://lbs.amap.com/api/javascript-api/summary)