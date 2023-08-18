<template>
  <div class="map_con">
    <!-- 离线地图 -->
    <ol-map class="map" :style="curStyle">
      <!-- 标题栏 -->
      <header>
        <list-title title="轨迹详情"></list-title>

        <div @click="$router.push({ name: 'PornographicWarn' })">
          <!-- <nav-title title="预警列表"></nav-title> -->
          <BackPrevious></BackPrevious>
        </div>
      </header>

      <drawer
        :drawer.sync="drawer"
        :cusStyle="{ top: '64px', height: '90%' }"
        :canTraction="true"
        moveLeft="-400px"
        width="400px"
        @handleClick="DrawerHandleClick"
      >
        <TrackInfo :dataObj="personData" :inAndOut="inAndOut" :tracksList="tracksList"></TrackInfo>
      </drawer>

      <!-- 图例 -->
      <map-control :list="iconMiniData" />

      <!-- 轨迹线 -->
      <RouteMarker ref="routeMarkerRef" v-if="tracksList.length > 0" :list="tracksList" />
      <!-- 控件 -->
    </ol-map>
  </div>
</template>

<script>
import RouteMarker from '@/components/Map/OfflineMap/route-path'
import mapMixin from '@/mixins/omap'
// import dayjs from '@/utils/filters'
import { queryPornographicListByPersonId } from '@/api/warn'
import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import TrackInfo from '@/views/common/warn/PornographicWarn/TrackInfo'
const { _pos } = require('@/config/user.js')

export default {
  mixins: [mapMixin],
  components: {
    RouteMarker,
    Drawer,
    TrackInfo
  },
  data () {
    return {
      curStyle: 'height:100%',
      tracksList: [],
      iconMiniData: [
        { type: 'wifi', text: '轨迹点', url: 'icon-route-by.png' },
        { type: 'wifi', text: '最早出现时间', url: 'icon-route-start.png' },
        { type: 'wifi', text: '最后出现时间', url: 'icon-route-end.png' }
      ],
      drawer: {
        isShow: true
      },
      personData: {},
      inAndOut: {
        inTime1: '',
        inAddress1: '',
        inTime2: '',
        inAddress2: ''
      }
    }
  },
  computed: {
    CertificateNumber () {
      return this.$route.query.certificateNumber
    },
    Person () {
      return JSON.parse(this.$route.query.person)
    },
    headPicUrl () {
      return window.location.origin + '/' + this.personData.headPic
    }
  },

  async created () {
    const res = await this.obtainInfo()

    // 人物信息
    this.personData = { ...(res?.content?.[0] ?? {}), ...this.Person, headPicUrl: this.headPicUrl }

    // 轨迹线生成
    this.getRound(res?.content ?? [])

    this.inAndOut.inTime1 = res?.content[0]?.inTime ?? '--'
    this.inAndOut.inAddress1 = res?.content[0]?.address ?? '--'
    const length = res?.content?.length ?? 0
    if (length > 1) {
      this.inAndOut.inTime2 = res?.content[length - 1]?.inTime ?? '--'
      this.inAndOut.inAddress2 = res?.content[length - 1]?.address ?? '--'
    }
  },

  methods: {
    DrawerHandleClick () {
      console.log(this.drawer.isShow);
      this.drawer.isShow = !this.drawer.isShow
    },
    /** 数据 - 基础信息 */
    async obtainInfo () {
      const mData ={
        certificateNumber: this.CertificateNumber,
        pageNum: 1,
        pageSize: 1000
      }
      return await queryPornographicListByPersonId(mData)
    },

    // 点击具体某一项 callback
    getRound (res) {
      this.$nextTick(() => {
        this.tracksList = this.formatTrackData(res)
      })
    },

    /** ----------------- 轨迹搜索 ------------------- */
    /**
     * 格式化轨迹数据
     * @param Array<Object> list
     * @return Array<Object>
     */
    formatTrackData (list) {
      const findWhich = (item, elist) => {
        for (let index = 0; index < elist.length; index++) {
          const element = elist[index]
          if (item.address === element.address) {
            // const date1 = dayjs.formatDate(item.inTime, 'YYYY-MM-DD')
            // const date2 = dayjs.formatDate(item.inTime, 'HH:MM')
            // const dateOut = dayjs.formatDate(item.outTime, 'HH:MM')
            let inTime = new Date(item.inTime)
            let outTime = new Date(item.outTime)
            const date1 = inTime.toLocaleDateString()
            const date2 = (inTime.getHours() < 10 ? '0' + inTime.getHours() : inTime.getHours()) + ':' + (inTime.getMinutes() < 10 ? '0' + inTime.getMinutes() : inTime.getMinutes())
            const dateOut = (outTime.getHours() < 10 ? '0' + outTime.getHours() : outTime.getHours()) + ':' + (outTime.getMinutes() < 10 ? '0' + outTime.getMinutes() : outTime.getMinutes())

            const timeS = item.outTime
              ? `${date1} ${date2}${dateOut ? '~' + dateOut : ''}`
              : item.inTime
            const timeS2 = item.outTime ? `${date2}${dateOut ? '~' + dateOut : ''}` : date2

            element.timeList.push(timeS)
            element.timeList2.push(timeS2)
          }
        }
      }

      const results = []
      const existCodes = [] // 已经 push 的 code
      if (list && list.length) {
        list.forEach(item => {
          const { address } = item
          if (!existCodes.includes(address)) {
            // const date1 = dayjs.formatDate(item.inTime, 'YYYY-MM-DD')
            // const date2 = dayjs.formatDate(item.inTime, 'HH:MM')
            // const dateOut = dayjs.formatDate(item.outTime, 'HH:MM')
            let inTime = new Date(item.inTime)
            let outTime = new Date(item.outTime)
            const date1 = inTime.toLocaleDateString()
            const date2 = (inTime.getHours() < 10 ? '0' + inTime.getHours() : inTime.getHours()) + ':' + (inTime.getMinutes() < 10 ? '0' + inTime.getMinutes() : inTime.getMinutes())
            const dateOut = (outTime.getHours() < 10 ? '0' + outTime.getHours() : outTime.getHours()) + ':' + (outTime.getMinutes() < 10 ? '0' + outTime.getMinutes() : outTime.getMinutes())

            const timeS = item.outTime
              ? `${date1} ${date2}${dateOut ? '~' + dateOut : ''}`
              : item.inTime
            const timeS2 = item.outTime ? `${date2}${dateOut ? '~' + dateOut : ''}` : date2

            results.push({
              address,
              title: item.address,
              location: _pos(item.longitude, item.latitude),
              date1: date1,
              date2: `${date2}${dateOut ? '~' + dateOut : ''}`,
              timeList: [timeS],
              timeList2: [timeS2]
            })
            existCodes.push(address)
          } else {
            findWhich(item, results)
          }
        })
      }
      return results || []
    }
  }
}
</script>

<style lang="less" scoped>
.map_con {
  position: relative;
}

header {
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: var(--fangkongyujing-xinjian-bianji-header-bg);
  border: 2px solid rgba(255, 255, 255, 0.06);
  opacity: 0.9;
  box-sizing: border-box;
}
</style>
