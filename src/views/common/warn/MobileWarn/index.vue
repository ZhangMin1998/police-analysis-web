<template>
  <div class="phone-warn-out">
    <el-container class="phone-warn">
      <!-- 排行榜 top10 -->
      <el-aside class="top-ten" width="23vw" style="min-width: 380px">
        <el-container>
          <el-header height="100">
            <span :class="{ isActive: state == 5 }" @click="machineOfCards">一机多卡TOP10</span>
            <el-divider direction="vertical"></el-divider>
            <span :class="{ isActive: state == 4 }" @click="machineOfNums">一机多号TOP10</span>
          </el-header>
          <el-main>
            <template v-if="topsList.length > 0">
              <div
                class="progress-item"
                v-for="(item, idx) in topsList"
                :key="idx + '_' + item.mac"
              >
                <CustomProgress
                  :progress="progress"
                  :numbers="item.score"
                  :val="'MAC/' + item.mac"
                  :index="idx + 1"
                />
              </div>
            </template>
            <template v-else>
              <div class="empty">暂无数据</div>
            </template>
          </el-main>
        </el-container>
      </el-aside>

      <!-- 预警表格-->
      <el-container class="warn-right">
        <!-- <el-header>
          <div>
            <span class="totles-row"
              ><span class="totles-numbers">{{ totals.phoneCount }}</span
              ><span>监控设备数</span></span
            >
            <span class="totles-row"
              ><span class="totles-numbers">{{ totals.infoCount }}</span
              ><span>预警次数</span></span
            >
          </div>
          <div @click="navigationToRules">
            <NavigationCard title="规则列表" />
          </div>
        </el-header> -->
        <el-main>
          <div class="align-boths">
            <list-title title="预警历史" />
          </div>

          <div>
            <Tabs :tabs.sync="tabs" @handleClick="handleClick">
              <template v-slot:right>
                <div style="width: 300px">
                  <el-input
                    v-model="table.params.searchKey"
                    placeholder="请输入MAC"
                    @keyup.enter.native="handleSearch"
                  >
                    <i slot="suffix" class='iconfont icon-sousuo' @click="handleSearch"></i>
<!--                    <img-->
<!--                      slot="suffix"-->
<!--                      src="@/assets/img/search.png"-->
<!--                      alt=""-->
<!--                      @click="handleSearch"-->
<!--                      style="margin-top: 7px; cursor: pointer"-->
<!--                    />-->
                  </el-input>
                </div>
              </template>
            </Tabs>
          </div>

          <div class="table-content-wrap">
            <template-table
              :tableData="table.tableData"
              :columns="table.columns"
              :tableHeight="tableHeight-15"
              :rowHeight="rowHeight"
              :pageData="table.pageData"
              :isLoading="table.isLoading"
              :showColumns="table.showColumns"
              @handleCurrentChange="handleCurrentChange"
            >
              <template v-slot:cusMain="slotProps">
                <ul>
                  <li
                    v-for="(classifyCur, classifyCurIndex) in slotProps.item"
                    :key="classifyCurIndex"
                  >
                      <CusTitle :title="classifyCur.typeName"  :curStyle="{ 'margin-bottom': '0px' }"></CusTitle>
                    <ul class="classifyCur_item">
                      <li
                        v-for="(classifyItem, classifyIndex) in classifyCur.childs"
                        :key="classifyIndex"
                      >
                        <div class="value">
                          {{ classifyItem.attrValue }}
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </template>
            </template-table>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CustomProgress from '@/components/BasicComponents/CustomProgress'
// import NavigationCard from '@/components/BasicComponents/NavigationCard'

import TemplateTable from '@/components/VisualComponents/Table/tableOpen'
import autoTableHeight from '@/mixins/autoTableHeight'
import Tabs from '@/components/BasicComponents/CustomTab'

import { mobileTops, mobilePager, mobileGetTotal } from '@/api/warn'

// const warnLevels = {
//   1: '轻微预警',
//   2: '一般预警',
//   3: '严重预警'
// }
// const warnTsypes = {
//   4: '一机多号',
//   5: '一机多卡'
// }

export default {
  components: {
    CustomProgress,
    // NavigationCard,
    TemplateTable,
    Tabs
  },
  mixins: [autoTableHeight],
  data () {
    return {
      subHeight: 280,
      state: 5,
      topsList: [],
      progress: {
        maxNumbers: 100
      },
      table: {
        showColumns: [
          { prop: 'index', width: '40' },
          { label: '数据源', prop: 'mac', minWidth: '220' },
          { label: ' 绑定数量', prop: 'score', minWidth: '180' }
        ],
        columns: [{ prop: 'classifyList', type: 'cusMain' }],
        tableData: [],
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0
        },
        isLoading: false,
        params: {
          pageNum: 1,
          pageSize: 10,
          searchKey: '',
          type: 5
        }
      },
      oldTableParams: {
        pageNum: 1,
        pageSize: 10,
        searchKey: '',
        type: 5
      },

      totals: {},
      tabs: {
        list: [
          {
            label: '一机多卡',
            name: 5
          },
          {
            label: '一机多号',
            name: 4
          }
        ],
        activeName: 5
      }
    }
  },

  created () {
    this.bus.$on('WSMessage', this.getAll)
    this.getAll()
  },

  beforeDestroy () {
    this.bus.$off('WSMessage')
  },

  methods: {
    handleClick (tab) {
      this.tabs.activeName = tab.name

      this.oldTableParams.type = tab.name
      this.table.params.type = tab.name
      this.table.params.pageNum = 1
      this.oldTableParams.pageNum = 1
      this.table.pageData.curPage = 1
      this.queryMobilePager()
    },
    getAll () {
      Promise.all([mobileTops(this.state), mobilePager(this.table.params), mobileGetTotal()])
        .then(res => {
          this.table.isLoading = false

          this.topsList = [...res[0]]
          this.progress.maxNumbers = 0
          res[0].forEach(element => {
            this.progress.maxNumbers += parseInt(element.score)
          })

          this.table.pageData.total = res[1].totalSize
          this.table.tableData = res[1].content.map(_c => {
            _c.classifyList = this.classify(_c.macInfoVoList)
            return _c
          })

          this.totals = { ...res[2] }
        })
        .catch(() => {
          this.table.isLoading = false
        })
    },
    /** tops 一机多卡 */
    machineOfCards () {
      this.state = 5
      this.queryMobileTops()
    },

    /** tops 一机多号 */
    machineOfNums () {
      this.state = 4
      this.queryMobileTops()
    },

    queryMobilePager () {
      this.table.isLoading = true
      mobilePager(this.oldTableParams)
        .then(res => {
          this.table.pageData.totol = res.totalSize
          this.table.tableData = res.content.map(_c => {
            _c.classifyList = this.classify(_c.macInfoVoList)
            return _c
          })
        })
        .finally(() => {
          this.table.isLoading = false
        })
    },

    classify (list) {
      const arr = []
      list.forEach(item => {
        const parentIndex = arr.findIndex(cur => cur.typeCode === item.typeCode)
        if (parentIndex !== -1) {
          arr[parentIndex].childs.push(item)
        } else {
          const obj = {
            typeName: item.typeName,
            typeCode: item.typeCode,
            childs: [item]
          }
          arr.push(obj)
        }
      })
      return arr
    },

    /** tops 请求 */
    queryMobileTops () {
      mobileTops(this.state).then(res => {
        this.topsList = [...res]
        this.progress.maxNumbers = 0
        res.forEach(element => {
          this.progress.maxNumbers += parseInt(element.score)
        })
      })
    },

    /** 搜索 */
    handleSearch () {
      this.oldTableParams.searchKey = this.table.params.searchKey
      this.table.params.pageNum = 1
      this.oldTableParams.pageNum = 1
      this.table.pageData.curPage = 1
      this.queryMobilePager()
    },

    /** 跳转 规则 */
    navigationToRules () {
      this.$router.push({ name: 'MobileWarnRules' })
    },

    /**  表格 -》 分页切换操作 */
    handleCurrentChange (val) {
      this.table.params.pageNum = val
      this.oldTableParams.pageNum = val

      this.queryMobilePager()
    }
  }
}
</script>

<style lang="less" scoped>
.phone-warn-out {
  height: 100%;
  .phone-warn.el-container {
    height: 100%;
    .top-ten.el-aside {
      background-color: var(--table-head-bg-color);
      color: #b1c1d7;
      .el-header {
        height: 90px;
        line-height: 90px;
        text-align: center;
        white-space: nowrap; //强制不换行
        .el-divider {
          background-color: #6c727a;
        }
        .el-divider--vertical {
          height: 22px;
          width: 2px;
        }
        span {
          cursor: pointer;
          padding: 0 10px;
          font-size: 20px;
          color: #6c727a;
          font-weight: 600;

          &:hover {
            color: #177fdc;
          }
          &.isActive {
            color: #177fdc;
          }
        }
      }
      .el-main {
      }
    }
    .warn-right.el-container {
      margin-left: 4px;
      .el-header {
        background-color: var(--table-head-bg-color);
        color: var(--base-text-color-1);
        height: auto !important;
        padding: 16px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 32px;
        flex-wrap: wrap;
        .totles-row {
          font-size: 20px;
          color: #7586a9;
          padding-left: 35px;
          letter-spacing: 1px;
          .totles-numbers {
            font-size: 32px;
            color: var(--base-text-color-1);
            margin-right: 10px;
          }
        }
      }
      .el-main {
        .table-content-wrap {
          padding-top: 16px;
        }
      }
    }
  }
}

.align-boths {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty {
  height: 40vh;
  line-height: 40vh;
  text-align: center;
  color: #8b929b;
  font-size: 20px;
}
.progress-item {
  margin-bottom: 24px;
}

.classifyCur_item {
  display: flex;
  line-height: 30px;
  margin-bottom: 16px;
  &:last-child{
    margin-bottom: 0px;
  }
  & > li {
    margin-right: 40px;
  }
}
.icon-sousuo {
  font-size: 16px;
  color: var(--base-text-color-to-999999);
}
</style>
