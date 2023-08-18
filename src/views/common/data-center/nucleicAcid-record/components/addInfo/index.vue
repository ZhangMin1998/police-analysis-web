<template>
<div
  class='add_info_wrap'
  id='add_info_wrap'
>
  <div class='header'>
    <div class='tip'>新增情况</div>
    <div class='sort-screen'>
      <div :class='["common-style", "hour", {"no_active": activeSort !== "yesterday"}]' @click='changeSort("yesterday")'>昨</div>
      <div :class='["common-style", "day", {"no_active": activeSort !== "today"}]' @click='changeSort("today")'>今</div>
    </div>
  </div>
  <div
    v-loading="loading"
    element-loading-text="数据正在加载中"
    element-loading-spinner="el-icon-loading"
    class='data'
  >
    <div v-show='!loading'>
      <template v-if='addData[0].length'>
        <div class='content'>
          <div class='box box_one'>
            <div class='item' v-for='(item, index) in addData[0]' :key='index'>
              <div class='index'>{{ 2 * index + 1 + (currentPage - 1) * pageSize + '、' }}</div>
              <div class='info'>{{ item }}</div>
            </div>
          </div>

          <div class='box'>
            <div class='item' v-for='(item, index) in addData[1]' :key='index'>
              <div class='index'>{{ 2 * (index + 1) + (currentPage - 1) * pageSize + '、' }}</div>
              <div class='info'>{{ item }}</div>
            </div>
          </div>
        </div>
        <div class='floor'>
          <div class='total'>
            <span>总数：</span>
            <span>{{ total }}</span>
          </div>
          <el-pagination
            :total='total'
            :current-page.sync='currentPage'
            :page-size='pageSize'
            background
            layout='prev, pager, next, jumper'
            @current-change='currentChange'
          >
          </el-pagination>
        </div>
      </template>
      <div class='no_data' v-else>
        暂无数据
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { getNucleicAddData } from '@/api/dataCenter'
import dayjs from '@/utils/filters'
export default {
  name: 'AddInfo',
  data () {
    return {
      activeSort: 'today',
      addData: [[], []],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      loading: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 切换显示数据的区间
    changeSort (id) {
      this.loading = true
      this.currentPage = 1
      this.addData = [[], []]
      this.activeSort = id
      this.getData()
    },
    // 页码发生变化时
    currentChange () {
      this.loading = true
      this.addData = [[], []]
      this.getData()
      this.$nextTick(() => {
        document.getElementById('add_info_wrap').scrollIntoView()
      })
    },
    formatData (item) {
      let str = ''
      if (item.isFromEpidemic === 'true') {
        str = `${item.name}，${item.gender === 'male' ? '男，' : item.gender === 'female' ? '女，' : ''}${item.id}，
              证件号码：${item.cerNumber}，手机：${item.phone}，居住于${item.liveAddress}${item.srcAddress || item.arrivalTimeStr ? '，' : '。' }${item.srcAddress ? '从' + item.srcAddress + '来，' : ''}
             ${item.arrivalTimeStr?'抵达时间：' + item.arrivalTimeStr +'。' : ''}`
      } else {
        str = `${item.name}，${item.gender === 'male' ? '男，' : item.gender === 'female' ? '女，' : ''}${item.id}，
              证件号码：${item.cerNumber}，手机：${item.phone}，居住于${item.liveAddress}。`
      }
      return str
    },
    getData () {
      this.loading = true
      getNucleicAddData({
        key: this.activeSort,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res);
        res.content.forEach((item, index) => {
          Object.keys(item).forEach(key => {
            if (key.includes('Time')) {
              item[key + 'Str'] = item[key] ? dayjs.filterString(parseInt(item[key])) : ''
            }
          })
          if (index % 2 === 0) {
            this.addData[0].push(this.formatData(item))
          } else {
            this.addData[1].push(this.formatData(item))
          }
        })
        this.total = res.totalSize
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.add_info_wrap {
  padding: 16px;
  background: var(--bg-color-2);
  min-height: 60px;
  font-size: 16px;
  margin-top: 24px;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6.5px;
    .tip {
      color: var(--base-text-color-to-999999);
      font-weight: bold;
    }
    .sort-screen {
      display: flex;
      border-radius: 2px;
      margin-top: 8px;
      margin-right: 8px;
      .common-style {
        display: flex;
        justify-content: center;
        width: 44px;
        height: 28px;
        font-size: 16px;
        line-height: 28px;
        cursor: pointer;
        box-sizing: border-box;
        background: var(--active-color);
        color: @font-color-3;
        border: 1px solid var(--active-color);
        &.no_active {
          background: transparent;
          color: var(--base-text-color-1);
          border: 1px solid var(--border-color-input);
          &:hover {
            border-color: var(--border-color-input);
            color: var(--active-color);
          }
        }
      }
      .hour {
        border-radius: 2px 0 0 2px;
      }
      .day {
        border-radius: 0 2px 2px 0;
      }
    }
  }
  .content {
    display: flex;
    padding: 0 32px;
    width: calc(100% - 64px);
    .box {
      color: var(--base-text-color-1);
      width: 40.1%;
      .item {
        display: flex;
        margin-bottom: 17.5px;
        .index {
          color: var(--base-text-color-to-999999);
          flex: none;
          line-height: 29px;
        }
        .info {
          flex: 1;
          line-height: 29px;
        }
      }
    }
    .box_one {
      margin-right: 9.7%;
    }
  }
  .floor {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }
  .no_data {
    height: 148px;
    text-align: center;
    line-height: 148px;
    color: var(--base-text-color-to-999999);
  }
}
.data {
  padding: 0 8px;
  min-height: 148px;
}
/deep/ .el-input__inner {
  border: 1px solid rgba(53,62,91,0.64) !important;
}
</style>
