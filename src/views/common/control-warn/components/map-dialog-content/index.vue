<template>
<div class='map_dialog_wrap' @click='$emit("dialogClick")' :class='{ "region_info": currentUnitInfo.unitType === "region" }'>
  <i class='iconfont icon-xiangqingguanbi' @click='$emit("closeDialog")'></i>
  <div class='warn_event' v-if='currentUnitInfo.unitType !== "region" && showCarousel'>
    <i v-if='eventList.length > 5' class='el-icon-caret-left' @click='moveRight'></i>
    <div class='event_bar' ref="toolbarContent">
      <div ref="toolbarItem" class='bar'>
        <div ref="toolbarInfo" class='event' v-for='(item, index) in eventList' :key='index' @click='pointClick(item, index)'>
          <img class='img_icon' :src='item.icon ? origin + item.icon : require(`@/assets/img/${$themeColor("--atlis-default-img")}.png`)' alt=''>
          <div class='event_name'>
            <EllipsisPop :content="item.controlInfo.name"></EllipsisPop>
          </div>
          <img v-if='activePoint === index' :src='require("@/assets/img/current_warn.png")' alt=''>
        </div>
      </div>
    </div>
    <i v-if='eventList.length > 5' class='el-icon-caret-right' @click='moveLeft'></i>
  </div>
  <div class='popover_content' :class='{ "region_popover": currentUnitInfo.unitType === "region" }'>
    <div class='content_left' v-if='currentUnitInfo.unitType !== "region" && currentInfo.triggerLabelNameEn === "avatar_url"'>
      <el-image
        class="el-image"
        :src="origin + currentInfo.triggerAttr"
        :preview-src-list="[origin + currentInfo.triggerAttr]"
        fit="cover"
      >
        <div slot="error" class="image-slot">
          <img :src='require(`@/assets/img/${$themeColor("--person-default-pic-name")}.png`)' alt=''>
        </div>
      </el-image>
    </div>
    <div class='content_right'>
      <div class='touch_warn_info' v-if='currentUnitInfo.unitType !== "region"'>
        <div v-for='item in touchParams' :key='item.prop' class='info'>
          <div class='label'>{{ item.label + '：' }}</div>
          <div class='value'>{{ currentInfo[item.prop] || '--' }}</div>
        </div>
        <div class='info'>
          <div class='label'>触警数据：</div>
          <div class='value touch_data' @click='viewSource'>{{ currentInfo.triggerRecord || '--' }}</div>
        </div>
        <div class='info'>
          <div class='label'>联系警员：</div>
          <div class='value'>{{ currentInfo.triggerPoliceInfo || '--' }}</div>
        </div>
        <div class='info'>
          <div class='label'>触警处理：</div>
          <div class='value'>
            <div class='switch' @click='handleWarn'></div>
            <el-switch
              v-model="currentInfo.flag"
              active-color="#3D6EFF"
            ></el-switch>
          </div>
        </div>
      </div>
      <div class='control_info'>
        <div class='info'>
          <div class='label'>布控名称：</div>
          <div class='value' :class='{ "value_region": currentUnitInfo.unitType === "region" }'>{{ currentInfo.controlInfo.name || '--' }}</div>
        </div>
        <div class='info'>
          <div class='label'>布控级别：</div>
          <div class='value level' :class='[currentInfo.controlInfo.level || "", currentUnitInfo.unitType === "region" ? "value_region" : ""]'>
            {{ levelObj[currentInfo.controlInfo.level] || '--' }}
          </div>
        </div>
        <div v-for='item in controlParams' :key='item.prop' class='info'>
          <div class='label'>{{ item.label + '：' }}</div>
          <div class='value' :class='{ "value_region": currentUnitInfo.unitType === "region" }'>{{ currentInfo.controlInfo[item.prop] || '--' }}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import { updateWarnStatus } from '@/api/warnControl.js'

const TOUCH_PARAMS = [
  { label: '触警特征', prop: 'triggerTrait' },
  { label: '触警时间', prop: 'triggerTime' },
  { label: '触警地址', prop: 'triggerAddress' },
]
const CONTROL_PARAMS = [
  { label: '布控时间', prop: 'controlTime' },
  { label: '布控区域', prop: 'controlRegion' },
  { label: '布控数据', prop: 'controlRecord' },
]
const LEVEL = {
  'normal': '普通',
  'general': '一般',
  'serious': '严重'
}

export default {
  name: 'MapContent',
  components: {
    EllipsisPop
  },
  props: {
    currentUnitInfo: {
      type: Object,
      default: () => {}
    },
    pointEventList: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      levelObj: Object.freeze(LEVEL),
      touchParams: Object.freeze(TOUCH_PARAMS),
      controlParams: Object.freeze(CONTROL_PARAMS),
      activePoint: null,
      currentInfo: {
        controlInfo: {}
      },
      eventList: [],
      showCarousel: false
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    },
    areaLayers () {
      const layers = this.$store.state.Ol.oMap?.getLayers().getArray()
      return layers || []
    }
  },
  mounted () {
    if (this.pointEventList.length > 1) {
      this.activePoint = 0
      this.showCarousel = true
    }
    if (this.currentUnitInfo.unitType !== "region") {
      if (this.showCarousel) {
        this.$nextTick(() => {
          let toolbarItemBox = this.$refs.toolbarItem
          toolbarItemBox.style.transform = 'translateX(0px)'
        })
      }
      this.currentInfo = this.pointEventList[0]
    } else {
      this.currentInfo = this.currentUnitInfo
    }
    this.eventList = this.pointEventList
  },
  methods: {
    moveLeft () {
      let toolbarItemBox = this.$refs.toolbarItem
      let reg = /(translateX\(+|-)(\d+)(px\))/g
      let tranNum = +reg.exec(toolbarItemBox.style.transform)[2]
      let toolbarInfoBox = this.$refs.toolbarInfo
      let toolbarContentBox = this.$refs.toolbarContent
      let scrollWidth = toolbarContentBox.scrollWidth
      let clientWidth = toolbarContentBox.clientWidth
      if ((scrollWidth - clientWidth) > tranNum) {
        if ((scrollWidth - clientWidth - tranNum) >= toolbarInfoBox[0].clientHeight) {
          tranNum += toolbarInfoBox[0].clientWidth
          toolbarItemBox.style.transform = 'translateX(-' + tranNum + 'px)'
        } else {
          tranNum += scrollWidth - clientWidth - tranNum
          toolbarItemBox.style.transform = 'translateX(-' + tranNum + 'px)'
        }
      }
    },
    moveRight () {
      let toolbarItemBox = this.$refs.toolbarItem
      let reg = /(translateX\(+|-)(\d+)(px\))/g
      let tranNum = +reg.exec(toolbarItemBox.style.transform)[2]
      let toolbarInfoBox = this.$refs.toolbarInfo
      if (tranNum > 0) {
        if (tranNum >= toolbarInfoBox[0].clientWidth) {
          tranNum -= toolbarInfoBox[0].clientWidth
          toolbarItemBox.style.transform = 'translateX(-' + tranNum + 'px)'
        } else {
          tranNum = 0
          toolbarItemBox.style.transform = 'translateX(-' + tranNum + 'px)'
        }
      }
    },
    handleWarn () {
      this.$emit('changeLoad', true)
      updateWarnStatus({
        messageId: this.currentInfo.id
      }).then(() => {
        let delInfo = JSON.parse(JSON.stringify(this.currentInfo))
        this.$message.success('处理成功！')
        this.bus.$emit('updateList', +delInfo.id)
        if (delInfo.latitude && delInfo.longitude) {
          let handlePoint = this.activePoint
          if (this.eventList.length > 1) {
            this.eventList = this.eventList.filter(item => {
              return +item.id !== +delInfo.id
            })
            if (this.activePoint === this.eventList.length) {
              this.activePoint = 0
            }
            this.currentInfo = this.eventList[this.activePoint]
          }
          this.$emit('updateCoordinateList', delInfo.id, handlePoint)
          // this.$emit('updateCoordinateList', delInfo.id, handlePoint)
        } else {
          this.$emit('updateNoCoordinateList', delInfo.id)
        }
        this.$emit('changeLoad', false)
        /*let layerIndex = this.areaLayers.findIndex(_c => _c.className_ === 'warn_point' + this.currentInfo.id)
        layerIndex > -1 && this.$store.state.Ol.oMap.removeLayer(this.areaLayers[layerIndex])*/
      }).catch(() => {
        this.$emit('changeLoad', false)
        this.$message.error('处理失败！')
      })
    },
    viewSource () {
      this.$emit('handleWarnSource', true, this.currentInfo)
    },
    pointClick (item, index) {
      this.activePoint = index
      this.currentInfo = item
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.map_dialog_wrap {
  width: 430px;
  position: relative;
  padding: 12px 12px;
  &.region_info {
    width: auto;
  }
  .icon-xiangqingguanbi {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 24px;
    line-height: 24px;
    color: var(--button-plain-border-color);
    cursor: pointer;
    z-index: 10;
    &:hover {
      color: var(--active-color);
    }
  }
  .warn_event {
    display: flex;
    .el-icon-caret-left,
    .el-icon-caret-right {
      height: 14px;
      font-size: 14px;
      line-height: 14px;
      margin-top: 6px;
      color: var(--base-text-color-to-666666);
      cursor: pointer;
    }
    .el-icon-caret-left {
      margin-right: 8px;
    }
    .el-icon-caret-right {
      margin-left: 8px;
    }
    .event_bar {
      display: flex;
      width: 330px;
      overflow-x: hidden;
      .bar {
        display: flex;
        transition: all 0.5s;
      }
      .event {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 12px;
        width: 69px;
        cursor: pointer;
        .img_icon {
          width: 24px;
          height: 24px;
        }
        .event_name {
          width: 100%;
          font-size: 12px;
        }
        img {
          width: 14px;
          height: 14px;
        }
      }
      .event:last-child {
        width: 45px;
        padding-right: 0;
      }
    }
  }
  .popover_content {
    display: flex;
    &.region_popover {
      padding-right: 64px;
    }
    .content_left {
      margin-right: 8px;
      /deep/.el-image {
        width: 70px;
        height: 86px;
      }
      img {
        width: 70px;
        height: 86px;
      }
    }
    .content_right {
      .touch_warn_info {
        margin-bottom: 16px;
      }
      .control_info {
        .info:last-child {
          margin-bottom: 0;
        }
      }
      .info {
        display: flex;
        line-height: 19px;
        margin-bottom: 8px;
        .label {
          font-size: 12px;
          color: var(--base-text-color-to-666666);
        }
        .value {
          position: relative;
          font-size: 14px;
          color: var(--base-text-color-1);
          width: 268px;
          text-align: left;
          white-space: pre-wrap;
          .switch {
            position: absolute;
            width: 34px;
            height: 20px;
            z-index: 10;
            cursor: pointer;
          }
          &.value_region {
            width: auto;
          }
          &.level {
            width: 64px;
            height: 19px;
            &.normal {
              background: linear-gradient(91deg, #62ADF4 0%, rgba(98, 173, 244, 0.07) 100%);
            }
            &.general {
              background: linear-gradient(91deg, #F8BC3C 0%, rgba(248, 188, 60, 0.07) 100%);
            }
            &.serious {
              background: linear-gradient(91deg, #DD3F48 0%, rgba(221, 63, 72, 0.07) 100%);
            }
          }
        }
        .touch_data {
          color: var(--active-color);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
