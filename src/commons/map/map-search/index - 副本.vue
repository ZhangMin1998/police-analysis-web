<template>
  <div class="search" @click="$emit('clickSearch')">
    <div
      :class="isChecked || isActive ? 'serach-inner isActive' : 'serach-inner'"
      @mouseenter="entreSearchs"
      @mouseleave="leaveSearchs"
    >
      <div class="search-header">{{ curSearchName }}</div>
      <div class="search-input-wrapper">
        <input
          type="text"
          id="tipInput"
          :placeholder="
            isShowDevice ? '请输入设备Mac或设备名称查询' : '请输入场所名称或场所编码或详细地址查询'
          "
          autocomplete="off"
          @input="debounce"
          @keyup.enter="enter"
          @focus="entreSearch"
          @blur="leaveSearch"
          :value="searchText"
        />
        <div id="search-list" class="search-list" v-if="showSearchList">
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
          <!-- 当搜索结果为空  -->
          <template v-else>
            <div class="search-empty">
              {{ isShowDevice ? '无此设备记录' : '无此场所记录' }}
            </div>
          </template>
        </div>
      </div>
      <i class='iconfont icon-sousuo' @click="search"></i>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { findPageBySearchKeyAndType } from '@/api/equipMap'

export default {
  inject: ['setViewCenter', 'clearMarkerLayer', 'generateOverlay'],
  data () {
    return {
      searchText: '',
      currentSearchList: [],
      showSearchList: false,
      timeout: null,
      curMap: null,
      placeSearchC: null, // placesearch 构造函数
      selectedVal: '1',
      isActive: false,
      isChecked: false,
      allDeviceList: [], // 所有的设备，当前只渲染了部分
      isGetAllDevice: false // 只请求一次
    }
  },
  computed: {
    ...mapState('Map', {
      roomOverlayActiveIndex: 'roomOverlayActiveIndex',
      roomListData: 'roomListData',
      isShowDevice: 'isShowDevice',
      roomDeviceList: 'roomDeviceList'
    }),
    curSearchName () {
      return this.isShowDevice ? '设备名称' : '场所名称'
    }
  },
  watch: {
    isShowDevice () {
      this.showSearchList = false
      this.searchText = '' // 清空输入框的文字
    },
    searchText (val) {
      if (!val) {
        this.showSearchList = false
        this.clearMarkerLayer()
      }
    }
  },
  methods: {
    ...mapMutations('Map', {
      setPlaceDataClicked: 'setPlaceDataClicked',
      setDeviceIdsClicked: 'setDeviceIdsClicked'
    }),
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
    // 搜索
    input (isEnter) {
      this.deviceSearch(null, isEnter)
    },
    // 验证经纬度合法性
    validatePos (longitude, latitude, site = '设备') {
      if (!longitude || !latitude) {
        this.$messageTip.error(`${site}没有经纬度！`)
        return
      }
      // 超出中国经纬度
      if (longitude == 0 || latitude == 0) {
        this.$messageTip.error(
          `经纬度有误，该${site}经纬度为 lon: ${longitude}, lat: ${latitude} !`
        )
        return
      }
      return true
    },
    // 点击选中某一项搜索项
    autocomplete (item) {
      const siteText = this.isShowDevice ? '设备' : '场所'
      if (!this.validatePos(item.longitude, item.latitude, siteText)) return

      if (this.isShowDevice) {
        const index = this.roomDeviceList.findIndex(device => device.id === item.id)
        if (index === -1) {
          this.$messageTip.error('抱歉，未找到该设备！')
          return false
        }
        this.setDeviceIdsClicked([item.id])
      } else {
        this.setPlaceDataClicked(item)
      }

      this.showSearchList = false
      this.searchText = item.name || ''

      this.setViewCenter([item.longitude, item.latitude], 18, false)

      item.flag = true
      this.$store.commit('Ol/setSearchObj', item)
    },
    // 输入框在线输入事件
    debounce (e) {
      this.searchText = e.target.value.trim()

      if (this.searchText == '') {
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
      this.input(1)
      clearTimeout(this.timeout)
    },
    // 点击搜索
    search () {
      if (!this.searchText) return
      this.deviceSearch(1, true)
    },
    //设备/场所类型搜索
    deviceSearch (pageNum, isEnter) {
      const curType = this.isShowDevice ? '1' : '2'
      // TODO: 检查，当时接口出问题，还没检查
      findPageBySearchKeyAndType({
        pageNum: pageNum || 1,
        pageSize: 10,
        searchKey: this.searchText,
        type: curType
      }).then(res => {
        this.currentSearchList = res.content.map(item => {
          item.name = this.isShowDevice ? item.deviceName : item.placeName
          return item
        })

        if (this.currentSearchList.length === 1 && isEnter) {
          const markerItem = this.currentSearchList[0]
          this.autocomplete(markerItem)
        }
        this.showSearchList = true
      })
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

.search-header {
  text-align: center;
  color: var(--base-text-color-1);
  font-size: 20px;
  width: 120px;
  line-height: 62px;
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
  margin-top: 23px;
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
</style>
