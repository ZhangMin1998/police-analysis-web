<template>
  <div class="search">
    <div
      :class="isChecked || isActive ? 'serach-inner isActive' : 'serach-inner'"
      @mouseenter="entreSearchs"
      @mouseleave="leaveSearchs"
    >
      <el-select
        v-model="type"
        placeholder="请选择搜索类型"
        @change="changeType"
        @blur="leaveSearch"
        @focus="entreSearch"
      >
        <el-option
          v-for="item in popList"
          :key="item.typeName"
          :label="item.typeName"
          :value="item.type"
        >
        </el-option>
        <!-- 1.地址api搜索  2.设备搜索 3.场所搜索 -->
      </el-select>

      <div class="search-list-click" v-show="canChoosePannel">
        <div
          :class="clickPioIdex == poiIdx ? 'search-item search-item-active' : 'search-item'"
          @click="searchPoit(poiIdx, poiItem.location)"
          v-for="(poiItem, poiIdx) in poiList"
          :key="poiIdx"
        >
          <div class="borderBottom">
            <div class="search-item-name">{{ poiItem.name }}</div>
            <div class="search-item-address">{{ poiItem.address }}</div>
          </div>
        </div>
      </div>

      <div class="search-input-wrapper">
        <input
          type="text"
          id="tipInput"
          :placeholder="inputPlaceholder"
          autocomplete="off"
          @input="debounce"
          @keyup.enter="enter"
          @focus="entreSearch"
          @blur="leaveSearch"
          :value="searchText"
        />
        <div id="search-list" class="search-list" v-if="showSearchList || isPlaceSearch">
          <template v-if="currentSearchList.length > 0">
            <div
              class="search-list-item"
              v-for="(item, index) in currentSearchList"
              @click="autocomplete(item)"
              :key="index"
            >
              {{ item.name }}
            </div>
          </template>
          <template v-else>
            <div class="search-empty">
              {{ emptyWords }}
            </div>
          </template>
        </div>
      </div>
      <i class='iconfont icon-sousuo' @click="search(true)"></i>
<!--      <img src="@/assets/img/search.png" alt="" @click="search(true)" />-->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { findPageBySearchKeyAndType } from '@/api/equipMap'
const { _pos } = require('@/config/user.js')

const placeholderWords = {
  1: '请输入位置信息查询',
  2: '请输入设备Mac或设备名称查询',
  3: '请输入场所名称或场所编码查询'
}
const emptyWords = {
  1: '没有找到相关地址',
  2: '无此设备记录',
  3: '无此场所记录'
}
export default {
  inject: ['clearOverGroup'],
  props: {
    renderType: {
      type: String,
      default: 'device'
    }
  },
  data () {
    return {
      searchText: '', //搜索内容
      type: 2, //搜索类型 1.高德api地址搜索 2.设备搜索 3.场所搜索
      currentSearchList: [], //搜索下拉
      showSearchList: false, //搜索显示和隐藏
      timeout: null, //定时搜索
      isPlaceSearch: false,
      curMap: null,
      placeSearchC: null, // placesearch 构造函数
      isActive: false,
      isChecked: false,
      isLoadAllDev: false, // 设备总数只加载一次
      allDeviceList: [], // 所有设备列表
      canChoosePannel: false, // 点击 搜索图标才显示的
      poiList: [], // 点击 搜索图标才显示的
      clickPioIdex: -1 //点击 搜索的index
    }
  },
  computed: {
    ...mapState('Map', {
      roomListData: 'roomListData',
      roomDeviceList: 'roomDeviceList'
    }),
    inputPlaceholder () {
      return placeholderWords[this.type]
    },
    emptyWords () {
      return emptyWords[this.type]
    },
    popList () {
      return [
        { typeName: '地址', type: 1 },
        {
          typeName:
            this.renderType === 'device'
              ? '设备名称'
              : this.renderType === 'place'
                ? '场所名称'
                : '',
          type: this.renderType === 'device' ? 2 : this.renderType === 'place' ? 3 : ''
        }
      ]
    }
  },
  watch: {
    renderType (val) {
      if (val === 'device') {
        this.type = 2
      } else if (val === 'place') {
        this.type = 3
      }
      this.searchText = ''
      this.clearSearchList()
    },

    // 当值为空时，清除搜索结果
    isPlaceSearch: function (val) {
      if (val === false) {
        this.placeSearchC.clear()
        this.clearOverGroup()
      }
    },
    searchText: function (val) {
      if (!val) {
        this.isPlaceSearch = false
        this.clearOverGroup()
      }
      this.canChoosePannel = false
      this.clearMarkerMul()
    }
  },
  created () {
    this.bus.$on('mapComplete', map => {
      this.curMap = map
    })
    // 点击地图的任一位置
    this.bus.$on('closeBox', () => {
      this.clearSearchList()
    })
  },
  beforeDestroy () {
    this.bus.$off('closeBox')
    this.bus.$off('mapComplete')
  },

  methods: {
    ...mapMutations('Map', {
      setPlaceDataClicked: 'setPlaceDataClicked'
    }),
    ...mapActions('Map', {
      getDeviceList: 'getDeviceList'
    }),
    // 监听搜索类型下拉
    changeType () {
      this.showSearchList = false
      this.isPlaceSearch = false
      this.canChoosePannel = false
      this.searchText = ''
    },
    entreSearch () {
      this.isActive = true
    },
    leaveSearch () {
      this.isActive = false
    },
    entreSearchs () {
      this.isChecked = true
    },
    leaveSearchs () {
      this.isChecked = false
    },
    // 地址搜索
    addressSearch () {
      // eslint-disable-next-line
      AMap.plugin(['AMap.Autocomplete'], () => {
        // eslint-disable-next-line
        let autocomplete = new AMap.Autocomplete({
          city: this.$store.state.User.searchCity, //默认全国
          citylimit: true // 限制在同一城市搜索
        })
        autocomplete.search(this.searchText, (status, res) => {
          if (status == 'complete') {
            this.currentSearchList = res.tips
            this.showSearchList = true
          } else {
            this.showSearchList = false
          }
        })
      })
    },
    /**
     * 搜索
     * isEnter  是否回车或者点击搜索 icon
     */
    input (isEnter) {
      if (this.type == 1) {
        this.addressSearch(isEnter)
      } else {
        // 设备或者场所搜索
        this.deviceSearch(null, isEnter)
      }
    },
    // 点击选中某一项搜索项
    autocomplete (item) {
      if (this.type === 1) {
        this.showSearchList = false
        this.searchText = item.name.trim() || ''
        this.bus.$emit('setCenter', item.location)
        return false
      }

      if (!item.longitude || !item.latitude) {
        this.$messageTip.error(`抱歉，未找到该${this.type === 2 ? '设备' : '场所'}！`)
        return false
      }

      const numLongitude = parseFloat(item.longitude)
      const numLatitude = parseFloat(item.latitude)
      if (isNaN(numLongitude) || isNaN(numLatitude)) {
        this.$messageTip.error(`抱歉，未找到该${this.type === 2 ? '设备' : '场所'}！`)
        return false
      }

      if (this.type === 2) {
        // 设备
        let index = this.roomDeviceList.findIndex(
          deviceItem => deviceItem.placeCode == item.placeCode
        )
        if (index === -1) {
          this.$messageTip.error('抱歉，未找到该设备！')
          return false
        }
        this.$emit('toggleSelectDevice', this.roomDeviceList[index])
      } else if (this.type === 3) {
        // 场所
        let index = this.roomListData.findIndex(roomItem => roomItem.placeName == item.placeName)
        if (index === -1) {
          this.$messageTip.error('抱歉，未找到该场所！')
          return false
        }

        this.$emit('toggleSelectDevice', this.roomListData[index])
      }

      this.showSearchList = false
      this.searchText = item.name.trim() || ''
      this.bus.$emit('device_setCenter', [item.longitude, item.latitude])
      this.bus.$emit('device_lable', item)
    },
    // 输入框在线输入事件
    debounce (e) {
      this.bus.$emit('closeMapLable')
      this.isPlaceSearch = false
      this.canChoosePannel = false
      this.searchText = e.target.value.trim()
      if (this.type == -1 || this.searchText == '') {
        this.showSearchList = false
        clearTimeout(this.timeout)
        return
      }
      if (this.timeout != null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(this.input, 800)
    },
    // 点击分页按钮
    currentPageChange (pageNum) {
      this.deviceSearch(pageNum)
    },
    // input回车
    enter () {
      this.isPlaceSearch = false
      this.input(1)
      clearTimeout(this.timeout)
    },
    // 点击搜索
    search (isEnter = false) {
      if (!this.searchText) return
      if (this.type == -1) {
        this.$messageTip.error('请选择一种类型再进行搜索!')
      }
      if (this.type == 1) {
        // 高德自带
        this.placeSearch(this.searchText)
      } else if ([2, 3].includes(this.type)) {
        // 设备和场所
        this.deviceSearch(null, isEnter)
      }
    },
    //设备/场所类型搜索
    deviceSearch (pageNum, isEnter = false) {
      // TODO: 这里查询的设备是所有的，但是渲染的设备是部分的，会出现找不到此设备的情况
      findPageBySearchKeyAndType({
        pageNum: pageNum || 1,
        pageSize: 10,
        searchKey: this.searchText,
        type: this.type - 1
      }).then(res => {
        // currentSearchList
        this.currentSearchList = res.content.map(item => {
          item.name = this.type == 2 ? item.deviceName : item.placeName
          ;[item.longitude, item.latitude] = _pos(item.longitude, item.latitude)
          return item
        })
        this.isPlaceSearch = false
        this.showSearchList = true
        // 如果结果只有一条，那么就直接定位
        if (
          Array.isArray(this.currentSearchList) &&
          this.currentSearchList.length === 1 &&
          isEnter
        ) {
          const searchEle = this.currentSearchList[0]
          this.autocomplete(searchEle)
          // this.bus.$emit("setCenter", [
          //   searchEle.longitude,
          //   searchEle.latitude,
          // ]);
        }
      })
    },
    // 位置服务
    placeSearch (keyword) {
      this.bus.$emit('showInfoClick')
      this.clearOverGroup() // 清除之前的结果
      // eslint-disable-next-line
      AMap.service(['AMap.PlaceSearch'], () => {
        if (!this.placeSearchC) {
          //构造地点查询类
          // eslint-disable-next-line
          this.placeSearchC = new AMap.PlaceSearch({
            pageSize: 7, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: '肇庆市', // 兴趣点城市
            citylimit: true, //是否强制限制在设置的城市内搜索
            // map: this.curMap, // 展现结果的地图实例
            // panel: "can-shoose-pannel", // 结果列表将在此容器中进行展示。
            // autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
            renderStyle: 'default'
          })
        }
        //关键字查询
        this.placeSearchC.search(keyword)
        this.placeSearchC.on('complete', e => {
          if (e.info === 'OK') {
            const { pois } = e.poiList
            this.showSearchList = false
            this.isPlaceSearch = false
            this.canChoosePannel = true
            this.poiList = pois
          }
        })
      })
    },

    searchPoit (index, location) {
      this.clickPioIdex = index
      const pos = [location.lng, location.lat]
      this.bus.$emit('setCenter', pos)
    },
    // 清除多重搜索的聚合点
    clearMarkerMul () {
      this.placeSearchC && this.placeSearchC.clear()
    },
    clearSearchList () {
      // 关闭点击搜索的box内容
      this.canChoosePannel = false
      this.clickPioIdex = -1
      // 关闭回车搜索的box内容
      this.isPlaceSearch = false
    }
  }
}
</script>

<style scoped>
.isActive {
  border: 2px solid #5288d8 !important;
}
.search /deep/.el-input__inner {
  text-align: center;
  color: var(--base-text-color-1);
  font-size: 20px;
}
.search {
  position: absolute;
  z-index: 11;
  margin-top: 16px;
  margin-left: 16px;
  width: 560px;
  height: 64px;
}
.search >>> .title {
  padding-left: 24px;
  width: 109px;
}
.search >>> .drop-down-pop-item {
  text-align: left;
  padding-left: 24px;
}
.serach-inner {
  position: relative;
  display: flex;
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647);
  background: #202b3f;
}
input {
  width: 392px;
  height: 64px;
  line-height: 64px;
  color: var(--base-text-color-to-999999);
  padding: 0 17px;
  box-sizing: border-box;
  position: relative;
  font-size: 16px;
  padding-right: 60px;
}
input::placeholder {
  font-size: 16px;
}
.icon-sousuo {
  font-size: 24px;
  color: var(--base-text-color-to-999999);
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.search-input-wrapper {
  position: relative;
  width: 100%;
}
.search-list {
  position: absolute;
  left: 0;
  top: 64px;
  width: 100%;
  background: rgba(32, 43, 63, 0.87);
}

.search-list-item {
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding-left: 17px;
  box-sizing: border-box;
  font-size: 14px;
  color: var(--base-text-color-to-999999);
}
.search-list-item:hover {
  background: rgba(66, 80, 106, 0.87);
  color: var(--base-text-color-1);
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 14px;
  color: var(--base-text-color-to-999999);
  box-sizing: border-box;
  margin-bottom: 20px;
}
.pagination >>> .el-pager li,
.pagination >>> .btn-prev,
.pagination >>> .btn-next {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.14901960784313725);
  border-radius: 2px !important;
  color: var(--base-text-color-to-999999) !important;
  height: 22px !important;
  line-height: 22px !important;
  box-sizing: border-box !important;
  min-width: 22px !important;
}
.pagination >>> .el-pager li:hover {
  color: #fff !important;
}
.pagination >>> .el-pager li.active {
  background: var(--input-placehold-color) !important;
  color: #fff !important;
}

.search /deep/ .el-input--suffix {
  height: 100%;
}

.search /deep/ .el-input__inner {
  height: 100%;
  border-radius: 0;
  background: #202b3f;
  border: none;
}

.search /deep/ .amap_lib_placeSearch {
  background: transparent;
  border: none;
  padding-left: 20px;
  color: #fff;
}

.search-empty {
  padding: 20px;
  color: #a5bbea;
  font-size: 14px;
  font-weight: bold;
}
.search-list-click {
  position: absolute;
  left: 0;
  top: 68px;
  width: 100%;
  background: rgba(32, 43, 63, 0.87);
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647);
}
.search-item {
  padding: 16px 30px 0 30px;
  box-sizing: border-box;
  color: var(--base-text-color-to-999999);
  font-size: 14px;
  line-height: 22px;
}
.search-item:hover,
.search-item-active {
  color: var(--base-text-color-1);
  background-color: rgba(255, 255, 255, 0.1);
}
.borderBottom {
  border-bottom: 1px solid #3e4b63;
  padding-bottom: 16px;
}
.search-item-name {
  font-size: 18px;
  color: rgba(23, 125, 220, 1);
  margin-bottom: 12px;
}
</style>
