<template>
  <div class="opera" :style="curStyle">
    <div class="opera_map_search">
      <map-search
        ref="child"
        v-clickout="clickout"
        :list="poiList"
        :words="words"
        @confimAddress="confimAddressEvent"
      >
        <template v-slot:searchInput>
          <div class="map_search">
            <div class="input">
              <el-input @input="addressSearch" placeholder="请输入场所信息" v-model="words">
                <template v-slot:suffix>
                  <div class="icons">
                    <div class="icons_close">
                      <i
                        v-show="words.length"
                        class="el-icon-close"
                        @click.prevent.stop="hideEvent"
                      ></i>
                    </div>
                    <div class="icons_search">
                      <img
                        class="el-icon-search"
                        :src="
                          require(`@/assets/components/CusAddressSearch_icon_1${
                            isHover ? '_hover' : ''
                          }.png`)
                        "
                        alt="搜索"
                        @click.prevent.stop="addressSearch"
                        @mouseover="isHover = true"
                        @mouseleave="isHover = false"
                      />
                    </div>
                  </div>
                </template>
              </el-input>
            </div>
          </div>
        </template>
      </map-search>
    </div>
  </div>
</template>

<script>
import MapSearch from './components/mapSearch'
// import { deviceFindPage } from '@/api/equipMap'
import { findPageBySearchKeyAndType } from '@/api/equipMap'
import { debounce } from '@/utils'
const { _isOl } = require('@/config/user.js')
export default {
  components: {
    MapSearch
  },

  inject: ['clearMarkerLayer'],

  props: {
    curStyle: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      words: '',
      poiList: [], // 点击 搜索图标才显示的
      placeSearchC: null, // placesearch 构造函数
      isHover: false
    }
  },

  watch: {
    words: function (val) {
      if (!val) {
        // 清空小图标
        this.clearMarkerLayer(['search-marker'])
      }
    }
  },

  mounted () {
    if (!_isOl()) {
      this.addressSearch = debounce(this.addressSearch, 600)
    } else {
      // 点击地图的任一位置
      this.bus.$on('closeBox', () => {
        this.words = ''
      })
    }
  },

  methods: {
    confimAddressEvent (e) {
      console.log('🚀 ~ file: opera.vue ~ line 103 ~ confimAddressEvent ~ e', e)
      this.words = e.name
      if (!_isOl()) {
        this.clearMarkerLayer()
        this.bus.$emit('setViewCenter', {
          position: [e.location.lng, e.location.lat],
          isMark: true
        })
      } else {
        this.bus.$emit('setCenter', [e.location.lng, e.location.lat])
      }
      this.$refs.child.hide()
    },
    hideEvent () {
      this.words = ''
    },
    // 点击输入框以外清除搜索
    clickout () {
      this.words && this.clearMarkerLayer()
    },
    addressSearch () {
      this.$refs.child.hide()
      if (!this.words) return
      if (!_isOl()) {
        findPageBySearchKeyAndType({
          pageNum: 1,
          pageSize: 5,
          type: '2',
          searchKey: this.words
          // device: {
          //   deviceName: this.words
          // }
          // type: '1', //  1 是设备
        }).then(res => {
          console.log(res)
          if (res.content && res.content.length > 0) {
            this.poiList = res.content.map(item => {
              return {
                // name: item.placeName,
                address: item.siteAddress,
                district: '',
                location: {
                  lng: item.longitude,
                  lat: item.latitude
                }
              }
            })
            this.$refs.child.show()
          } else {
            this.poiList = []
            this.$refs.child.show()
          }
        })
      } else {
        /* eslint-disable */
        AMap.plugin(['AMap.Autocomplete'], () => {
          let autocomplete = new AMap.Autocomplete({
            /* eslint-enable */
            city: this.$store.state.User.searchCity, //默认全国
            citylimit: true, // 限制在同一城市搜索
            pageSize: 5,
            pageIndex: 1 // 页码
          })
          autocomplete.search(this.words, (status, res) => {
            if (status == 'complete') {
              if (res.tips && res.tips.length) {
                this.poiList = res.tips.filter((item, index) => {
                  return index < 6
                })
              }
              this.$refs.child.show()
            } else {
              this.poiList = []
              this.$refs.child.show()
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.icons {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 60px;
  .el-icon-search {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }
  .el-icon-close {
    font-size: 18px;
    margin-right: 5px;
    line-height: 40px;
    cursor: pointer;
    &:hover {
      color: #228ffe;
    }
  }
}

.opera {
  display: flex;
  position: absolute;
  z-index: 999;
  right: 16px;
  top: 16px;
  .opera_map_search {
    // background-color: rgba(39, 52, 77, 0.87);
    // background-color: var(--bg-color-2);
    background: var(--car-right-chuangkou-hearder-bg);
    position: relative;
  }
}
.map_search {
  width: 400px;
  height: 40px;
}

/deep/.el-input__inner {
  border-radius: 0 !important;
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647) !important;
  &:hover {
    border-color: rgba(34, 143, 254, 0.6) !important;
  }
  &:focus {
    border-color: #228ffe !important;
  }
}
/deep/.el-input--suffix .el-input__inner {
  padding-right: 60px !important;
}
</style>
