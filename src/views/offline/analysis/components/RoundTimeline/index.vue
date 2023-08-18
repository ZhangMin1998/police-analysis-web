<template>
<!-- ${item.placeName || item.placeAddress} -->
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in activities"
        :key="index"
        @click.native="itemClick(item, index)"
        :class="{
          bgc: isClick &&  currentIndex === index
        }"
        :timestamp="isShowAdd ? (item.placeAddress ? item.placeAddress : '--') : (item.placeName ? item.placeName : '--')"
        placement="top"
      >
        <ul>
          <div v-if='needInd' class='have_index'>
            <div>{{ index + 1 }}</div>
          </div>
          <li v-for="(timestamp, timestampIndex) in item.timestamp" :key="timestampIndex">
            <div class="text_box">
              <span>{{ timestamp }}</span>
              <span v-if="isShowDataTypeStr">{{getDataType(item) || '--'}}</span>
            </div>
          </li>
        </ul>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    activities: Array,
    isClick:{
      type:Boolean,
      default:false
    },
    isShowDataTypeStr:{
      type:Boolean,
      default: false
    },
    isShowAdd: { // 显示placeAddress还是placeName
      type:Boolean,
      default: false
    },
    needInd: {
      type:Boolean,
      default: false
    },
    // isFlashback: {
    //   type:Boolean,
    //   default: false
    // }
  },
  computed: {
    ...mapState('Common', {
      dataTypeList: 'dataTypeList'
    })
  },
  data (){
    return{
      currentIndex : -1
    }
  },
  // created () {
  //   console.log(this.activities)
  // },
  // mounted(){
  //   this.$nextTick(()=>{
  //     console.log(this.activities);
  //   })
  // },
  mounted () {
    if (this.needInd) {
      let fun = () => {
        this.$nextTick(() => {
          let timestamp =  Array.prototype.slice.call(document.querySelectorAll('.el-timeline-item__timestamp'), 0)
          let fontSize = 16 * document.documentElement.style.fontSize.split('px')[0] / 192
          let marginLeft = this.$pxToRem(fontSize * (this.activities.length + '').length + 4)
          timestamp.forEach(item => {
            item.style.marginLeft = marginLeft
          })
        })
      }
      this.$nextTick(() => {
        fun()
      })
      this.$watch('activities', (newVal) => {
        if (newVal) {
          fun()
        }
      })
    }
  },
  methods:{
    itemClick (activity,index){
      this.currentIndex = index
      this.$emit('itemClick',activity,index)
      // if(this.isClick){
      //   this.currentIndex = index
      //   this.$emit('itemClick',activity,index)
      // }
    },
    getDataType (item) {
      let type = ''
      this.dataTypeList.forEach(e => {
        if (e.srcNameEn === item.srcName) {
          type = e.srcNameCn
        }
      })
      return type
    }
  }
}
</script>

<style lang="less" scoped>
.text_box{
  display: flex;
  justify-content:space-between;
  padding-right: 18px;
}
/deep/.el-timeline-item {
  position: relative;
  padding-bottom: 10px;
}
/deep/.el-timeline-item__node {
  background-color: var(--base-text-color-to-999999);
  left: 6px;
  top: 3px;
}
/deep/.el-timeline-item__timestamp {
  height: max-content !important;
  color: var(--base-text-color-1);
}
/deep/.el-timeline-item__content {
  color: var(--base-text-color-to-999999);
}
/deep/ .el-timeline-item__wrapper{
  height: max-content !important;
  cursor: pointer;
  position: relative;
}
.bgc{
  /deep/ .el-timeline-item__wrapper{
    cursor: pointer;
    // background: #2E3754;
    background: var(--bg-leftDrawer-click);
    opacity: 0.9;
  }
}
.have_index {
  position: absolute;
  top: 0;
  left: 27px;
  background: @active-color;
  color: @font-color-1;
  font-size: 16px;
  border-radius: 4px;
  text-align: center;
  padding: 0 2px;
}
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .RoundTimeline.el-timeline-item__timestamp.is-top {
    margin-left: 20px !important;
  }
}
</style>
