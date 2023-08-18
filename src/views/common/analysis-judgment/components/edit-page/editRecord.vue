<template>
<div class='edit_record_wrap'>
  <div class='title'>操作记录</div>
  <div id='recordWrap' class='record_wrap' @scroll='scrollRecord'>
    <div
      v-for='(item, index) in recordInfo'
      :key='index'
      class='record_item'
    >
      <div class='item'>
        <div
          :class='{
            "item_info": true,
            "is_read": item.status === "read_only",
            "is_active": item.id === activeRecordId,
            "is_running": runningRecord.includes(item.id),
            "is_success": completedRecord.includes(item.id),
            "is_error": item.status === "error" || afterErrorOpera.includes(item.id)
          }'
          @click='handleResult(item, index)'
        >
          <i :class='[ "iconfont", item.icon ]'></i>
          <div class='name'>
            <div class='record_name'>{{ item.recordName }}</div>
            <i
              v-if='item.status === "normal" && completeList.includes(item.id) && !runningRecord.includes(item.id)'
              class='iconfont icon-xiangqingchenggong'
              title='运行完成'
            ></i>
            <i v-if='runningRecord.includes(item.id)' class='el-icon-loading'></i>
          </div>
        </div>
        <i
          v-if='item.type !== "add_datasource" && (item.status === "normal" || item.status === "error") && !afterErrorOpera.includes(item.id) && isInDevops(item)'
          class='iconfont icon-gengduo'
          title='更多'
          @mouseover='mouseOn($event, item)'
          @mouseout='mouseOut'
        ></i>
      </div>
<!--      <div v-if='item.type === "link"' class='link_info'>
        <div
          v-for='link in item.linkInfo'
          :key='link.id'
          class='link_item'
        >
          <div class='link_base'>
            <span>{{ link.linkName }}</span>
            <span>{{ `（${link.iconName}）` }}</span>
          </div>
          <div class='link_page_module'>
            <div class='tip'>页面：</div>
            <div class='page_module_item'>
              <div class='current'>{{ currentPage }}</div>
              <i class='iconfont icon-a-zu5303'></i>
              <div class='target'>{{ link.targetPage }}</div>
            </div>
          </div>
          <div class='link_page_module'>
            <div class='tip'>容器：</div>
            <div class='page_module_item'>
              <div class='current'>{{ currentModule }}</div>
              <i class='iconfont icon-a-zu5303'></i>
              <div class='target'>{{ link.targetModule }}</div>
            </div>
          </div>
          <div class='tip field_tip'>字段：</div>
          <div
            v-for='field in link.itemInfo'
            :key='field.id'
            class='page_module_item field_item'
          >
            <div class='current'>{{ field.currentItem }}</div>
            <i class='iconfont icon-a-zu5303'></i>
            <div class='target'>{{ field.targetItem }}</div>
          </div>
        </div>
      </div>-->
    </div>
  </div>
  <div @mouseover='dialogMouseOn' @mouseout='mouseOut' class='more_dialog' v-show='showDialog' :style='{ "top": operaTop }'>
    <div class='more_opera' :class='{ "disabled": !isDevopsOver || editRecord.status === "error" }' @click='appDevops'>运行</div>
    <div v-if='showEditBtn' class='more_opera' @click='editOpera'>编辑</div>
    <div class='more_opera' @click='delOpera'>删除</div>
  </div>
</div>
</template>

<script>
import {
  delModuleOperaApi,
  appDevopsApi,
  getDevopsStatusApi
} from '@/api/analysisJudgment'
import { OPERA_TYPE } from './config.js'
import { mapState } from 'vuex'

export default {
  name: 'EditRecord',
  inject: ['editModuleInfo'],
  props: {
    activeRecordId: {
      type: Number
    },
    currentPage: {
      type: String,
      default: '案件列表'
    }, // 当前编辑页面名称， 以上default为测试静态页面用
    currentModule: {
      type: String,
      default: '案件列表'
    }, // 当前编辑容器名称， 以上default为测试静态页面用
    recordInfo: {
      type: Array,
      default: () => []
      /*default: () => [
        { id: '1', recordName: '复工复产', icon: 'icon-a-zu5741', type: 'source' },
        { id: '2', recordName: '链接', icon: 'icon-lianjie', type: 'link',
          linkInfo: [
            { id: '1', linkName: '链接1', linkType: 'icon', iconName: '详情', targetPage: '档案表档案表档案表档案表档案表', targetModule: '档案列表',
              itemInfo: [
                { id: '1', currentItem: '案件编号 ', targetItem: '档案编号' },
                { id: '2', currentItem: '报警人身份证 ', targetItem: '档案人身份证' },
              ]
            },
            { id: '2', linkName: '链接2', linkType: 'text', iconName: '文字按键', targetPage: '档案表', targetModule: '档案列表',
              itemInfo: [
                { id: '1', currentItem: '案件编号 ', targetItem: '档案编号' },
                { id: '2', currentItem: '报警人身份证 ', targetItem: '档案人身份证档案人身份证档案人身份证' },
              ]
            }
          ]
        },
        { id: '3', recordName: '排序', icon: 'icon-paixu', type: 'sort' },
        { id: '4', recordName: '左右合并', icon: 'icon-zuoyouhebing', type: 'merge' },
      ]*/
    }, // 操作记录数据，以上default为测试静态页面用
  },
  data () {
    return {
      operaTop: '', // 更多弹窗定位
      operaDialogShow: false,
      noScroll: true,
      editRecord: {},
      time: null,
      devopsList: [],
      clickDevopsTime: null,
      devopsStateList: [], // 更新状态列表
      completeList: [], // 运行完成的操作记录Id
    }
  },
  computed: {
    showDialog () {
      return this.noScroll && this.operaDialogShow
    },
    // 在状态为“error”后的操作
    afterErrorOpera () {
      let errorIndex = this.recordInfo.findIndex(item => item.status === 'error')
      if (errorIndex === -1) return []
      return this.recordInfo.slice(errorIndex + 1).map(item => item.id)
    },
    // 判断是否显示编辑按钮
    showEditBtn () {
      return !['detail', 'list'].includes(this.editRecord.type)
    },
    ...mapState('User', {
      userInfo: 'userInfo',
    }),
    // 正在运行中的操作记录
    runningRecord () {
      return this.devopsList.filter(item => item.state === 'running').map(item => item.id)
    },
    // 运行完成的操作记录
    completedRecord () {
      return this.devopsList.filter(item => item.state === 'completed').map(item => item.id)
    },
    // 判断运行是否结束
    isDevopsOver () {
      return this.devopsList.every(item => item.state === 'completed')
    },
    afterAlgNoRun () {
      return this.recordInfo.findIndex(item =>
        item.status === 'normal' &&
        item.type === 'algorithm'
      )
    }
  },
  watch: {
    isDevopsOver: {
      handler (newVal) {
        if (newVal) {
          clearInterval(this.time)
          this.time = null
          this.devopsStateList = []
          this.clickDevopsTime = null
          const isInRun = this.devopsList.find(item => item.id === this.activeRecordId)
          if (!isInRun) return
          let currentIndex = this.recordInfo.findIndex(item => item.id === isInRun.id)
          currentIndex > -1 && this.handleResult(this.recordInfo[currentIndex], currentIndex)
          // this.$emit('getResultData', +this.editModuleInfo.i, this.activeRecordId, false)
        }
      }
    },
    recordInfo: {
      handler (newVal) {
        this.completeList = []
        newVal.forEach(item => {
          if (item.state === 'completed') this.completeList.push(item.id)
        })
      }
    }
  },
  mounted () {
    const unWatch = this.$watch('recordInfo', () => {
      let ind = this.recordInfo.findLastIndex(item => item.state === 'running')
      if (ind !== -1) {
        let devopsRange = this.recordInfo.slice(0, ind + 1)
        devopsRange.forEach(item => {
          this.devopsList.push({
            id: item.id,
            state: item.state === 'completed' ? item.state : 'running'
          })
        })
        this.clickDevopsTime = 0
        this.recordInfo.forEach(item => {
          if (item.updateTime && new Date(item.updateTime).getTime() > this.clickDevopsTime)
            this.clickDevopsTime = new Date(item.updateTime).getTime()
        })
        this.updateState()
      }
      unWatch()
    })
  },
  methods: {
    // 更多鼠标移入事件
    mouseOn (e, item) {
      if (!this.noScroll) return
      if (this.editRecord !== item.id) {
        const boxScrollTop = document.getElementById('recordWrap').scrollTop
        this.operaTop = e.target.offsetTop - boxScrollTop + 12 + 'px'
        this.editRecord = item
      }
      this.operaDialogShow = true
    },
    // 更多和弹窗鼠标移出事件
    mouseOut () {
      this.operaDialogShow = false
    },
    // 操作记录滚动事件
    scrollRecord () {
      if (!this.noScroll) return
      this.noScroll = false
      this.operaDialogShow = false
      setTimeout(() => {
        this.noScroll = true
      }, 200)
    },
    // 弹窗鼠标移入事件
    dialogMouseOn () {
      if (!this.noScroll) return
      this.operaDialogShow = true
    },
    // 点击编辑的时候
    editOpera () {
      this.$emit('editOpera', this.editRecord)
    },
    // 点击删除时
    delOpera () {
      this.$policeComfirm('删除操作会将该节点及后方所有节点同步删除，且不可恢复，是否继续？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = new FormData()
        params.append('containerId', this.editRecord.containerId)
        params.append('recordId', this.editRecord.id)
        delModuleOperaApi(OPERA_TYPE[this.editRecord.type].delApi, params).then(() => {
          this.$message.success('删除成功！')
          this.$emit('getRecord')
        })
      })
    },
    // 点击操作记录查看对应操作记录的数据
    handleResult (record, ind) {
      if (record.status !== 'normal' || this.afterErrorOpera.includes(record.id)) return
      this.$emit('needRunTip', this.afterAlgNoRun !== -1 && ind >= this.afterAlgNoRun && !this.completeList.includes(record.id))
      this.$emit('getResultData', record.containerId, record.id, false)
    },
    // 运行
    appDevops () {
      if (!this.isDevopsOver || this.editRecord.status === "error") return
      this.devopsList = []
      appDevopsApi({
        record_id: this.editRecord.id,
        operator: this.userInfo.username
      }).then(() => {
        this.clickDevopsTime = new Date().getTime()
        let ind = this.recordInfo.findIndex(item => item.id === this.editRecord.id)
        let devopsRange = this.recordInfo.slice(0, ind + 1)
        devopsRange.forEach(item => {
          this.devopsList.push({
            id: item.id,
            state: 'running'
          })
        })
        this.updateState()
      })
    },
    // 更新运行状态轮询
    updateState () {
      this.time = setInterval(() => {
        let time = 0
        this.devopsStateList.forEach(item => {
          if (item.updateTime && new Date(item.updateTime).getTime() > time)
            time = new Date(item.updateTime).getTime()
        })
        if (!time) {
          time = this.clickDevopsTime
        } else {
          this.clickDevopsTime = time
        }
        this.upDateDevopsState(time)
      }, 10000)
    },
    // 更新运行状态
    upDateDevopsState (time) {
      getDevopsStatusApi({
        containerId: +this.editModuleInfo.i,
        updateTime: time
      }).then(res => {
        this.devopsStateList = res || []
        this.devopsStateList.forEach(item => {
          if (item.state === 'completed') {
            let ind = this.devopsList.findIndex(devops => devops.id === item.id)
            if (ind !== -1) {
              this.devopsList[ind].state = 'completed'
              this.completeList.push(this.devopsList[ind].id)
            }
          }
        })
      })
    },
    // 判断是否在运行列表中且运行列表都运行完成，是的话才可进行编辑
    isInDevops (info) {
      const findItem = this.devopsList.find(item => item.id === info.id)
      if (!findItem) return true
      return !this.devopsList.some(item => item.state === 'running')
    }
  },
  beforeDestroy () {
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.edit_record_wrap {
  width: 100%;
  height: 100%;
  padding: 8px 0;
  .title {
    font-size: 18px;
    font-weight: bold;
    line-height: 24px;
    color: var(--base-text-color-to-666666);
    padding-left: 16px;
    margin-bottom: 18px;
  }
  .record_wrap {
    width: 100%;
    height: calc(100% - 42px);
    overflow-y: auto;
    padding: 0 24px 0 16px;
    .record_item {
      width: 100%;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .item_info {
          flex: 1;
          display: flex;
          align-items: center;
          i {
            font-size: 16px;
            line-height: 16px;
            color: var(--base-text-color-to-666666);
            margin-right: 8px;
          }
          .name {
            display: flex;
            align-items: center;
            flex: 1;
            font-size: 16px;
            line-height: 21px;
            color: var(--base-text-color-1);
            i {
              font-size: 14px;
              line-height: 21px;
              margin-left: 8px;
            }
          }
        }
        .is_success {
          i {
            color: var(--app-record-success-color);
          }
          .name {
            color: var(--app-record-success-color);
          }
        }
        .is_active {
          i {
            color: var(--active-color);
          }
          .name {
            color: var(--active-color);
          }
        }
        .is_running {
          i {
            color: var(--record-atlas-color);
          }
          .name {
            color: var(--record-atlas-color);
          }
        }
        .is_read {
          cursor: not-allowed;
          i {
            color: var(--base-text-color-9);
          }
          .name {
            color: var(--base-text-color-9);
          }
        }
        .is_error {
          cursor: not-allowed;
          i {
            color: @font-color-4;
          }
          .name {
            color: @font-color-4;
          }
        }
        .icon-gengduo {
          flex: none;
          font-size: 16px;
          line-height: 16px;
          color: var(--base-text-color-to-666666);
          cursor: pointer;
        }
      }
      .link_info {
        width: 100%;
        padding-left: 24px;
        margin-top: 12px;
        .link_item {
          width: 100%;
          font-size: 14px;
          line-height: 19px;
          color: var(--base-text-color-1);
          margin-bottom: 16px;
          &:last-child {
            margin-bottom: 0;
          }
          .link_base {
            color: var(--base-text-color-to-666666);
            margin-bottom: 8px;
          }
          .link_page_module {
            display: flex;
            margin-bottom: 8px;
            .tip {
              flex: none;
            }
            .page_module_item {
              flex: 1;
            }
          }
          .tip {
            color: var(--base-text-color-to-666666);
          }
          .field_tip {
            margin-bottom: 8px;
          }
          .page_module_item {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            i {
              font-size: 12px;
              line-height: 12px;
              color: var(--base-text-color-to-666666);
              margin: 0 8px;
            }
          }
          .field_item {
            margin-bottom: 8px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      &::after {
        display: block;
        content: '';
        width: 1px;
        height: 12px;
        margin: 2px 0 2px 8px;
        background: var(--border-color-1);
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
  .more_dialog {
    position: fixed;
    min-width: 72px;
    right: 48px;
    background: var(--datapicker-shijian-xiala-bg-color);
    border: 1px solid var(--border-color-1);
    z-index: 10;
    .more_opera {
      padding: 0 20px;
      line-height: 32px;
      font-size: 14px;
      white-space: nowrap;
      color: var(--base-text-color-2);
      cursor: pointer;
      &:hover {
        background: var(--datapicker-in-range-bg-color);
        color: var(--base-text-color-1);
      }
      &.disabled {
        cursor: not-allowed;
      }
    }
  }
}
</style>
