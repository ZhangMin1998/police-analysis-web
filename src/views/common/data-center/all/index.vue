<template>
  <div class='wrap'>
    <!--    数据总量-->
    <DataCenterAll v-if='dataAll' :haveResult='haveResult'></DataCenterAll>
    <div v-else>
      <router-view />
    </div>
<!--    <TotalData-->
<!--      class="data"-->
<!--      v-show='!isLoading'-->
<!--      :showType="showType"-->
<!--      :dataType='dataType'-->
<!--      @changeTotalDataLoad='changeTotalDataLoad'-->
<!--    ></TotalData>-->
    <!--    数据统计-->
<!--    <TotalDataChartLine-->
<!--      v-show='!isLoading'-->
<!--      :dataType='dataType'-->
<!--      @changeChartLineLoad='changeChartLineLoad'-->
<!--    ></TotalDataChartLine>-->

<!--    &lt;!&ndash;    数据细分&ndash;&gt;-->
<!--    <DataStackedLineChart-->
<!--      v-show='!isLoading'-->
<!--      :dataType='dataType'-->
<!--      v-if='showType === "chart"'-->
<!--      @changeStackLineLoad='changeStackLineLoad'-->
<!--    ></DataStackedLineChart>-->

<!--    &lt;!&ndash;    数据列表&ndash;&gt;-->
<!--    <div class='wrap-list' v-if='showType !== "chart" && !isLoading'>-->
<!--      <div class='title'>-->
<!--        <span>数据列表 -</span>-->
<!--        <span>{{ title }}</span>-->
<!--      </div>-->
<!--      <router-view />-->
<!--    </div>-->
<!--    <DataBoard v-if='showType === "chart" && !isLoading'></DataBoard>-->
  </div>
</template>

<script>
import { getRecordsListApi } from '@/api/dataCenter'
import DataCenterAll from './data-cennter-all.vue'
// import customType from './customTypeInfo'
// import dataCenterRoutePath from '@/components/layout/dataCenterRouter.js'
// import dataType from '@/components/layout/dataType.js'
export default {
  name: 'DataCenterIndex',
  components: {
    DataCenterAll
  },
  provide () {
    return {
      choicePanel: this.choicePanel,
      fromImport: this.fromImport
    }
  },
  data () {
    return {
      dataAll: true,
      choicePanel: {
        TYPE_TO_TITLE: {},
        TITLE_TO_TYPE: {}
      },
      haveResult: false,
      fromImport: []
    }
  },
  watch: {
    '$route.path': {
      handler (newVal) {
        if (newVal !== '/ol/dataCenterAll') {
          this.dataAll = false
        } else {
          this.dataAll = true
        }
      },
      immediate: true
    }
  },
  mounted () {
    getRecordsListApi({
      fieldRules: false
    }).then(res => {
      let result = res.content || []
      result.forEach(item => {
        this.choicePanel['TITLE_TO_TYPE'][item.srcNameCn] = item.srcNameEn
        if (item.status === 'normal') {
          this.fromImport.push(item.srcNameEn)
        }
        /*if (item.status === 'normal') {
          let colList = []
          let minWidth = '160px'
          this.fromImport[item.srcNameEn] = {}
          this.fromImport[item.srcNameEn]['url'] = '/configurable/data/search/datacenter/list'
          this.fromImport[item.srcNameEn]['getMethod'] = 'post'
          this.fromImport[item.srcNameEn]['isWarning'] = false
          // if (Object.keys(item.fileRules).length < 11) {
          //   minWidth = (1774 / Object.keys(item.fileRules).length) + 'px'
          // }
          if (item.fileRules.length < 11) {
            minWidth = (1774 / item.fileRules.length) + 'px'
          }
          // for (let key in item.fileRules) {
          //   colList.push({
          //     label: item.fileRules[key].field_name_cn,
          //     prop: item.fileRules[key].field_name_en,
          //     minWidth: minWidth
          //   })
          // }
          item.fileRules.forEach(rules => {
            colList.push({
              label: rules.fieldNameCn,
              prop: rules.fieldNameEn,
              minWidth: minWidth
            })
          })
          this.fromImport[item.srcNameEn]['colList'] = colList
        }*/
      })
    }).finally(() => {
      /*for (let key in customType) {
        this.choicePanel['TITLE_TO_TYPE'][key] = customType[key]
      }*/
      for (let key in this.choicePanel['TITLE_TO_TYPE']) {
        this.choicePanel['TYPE_TO_TITLE'][this.choicePanel['TITLE_TO_TYPE'][key]] = key
      }
      this.haveResult = true
    })
  }
}
</script>

<style lang='less' scoped>
  .wrap {
    min-height: calc(100vh - 236px);
  }
  .wrap-list {
    margin-top: 24px;
    position: relative;
    padding: 24px 8px;
    background: var(--bg-color-2);
    min-height: 60px;
    .title {
      padding: 0 16px;
      margin-bottom: 24px;
      font-size: 16px;
      font-weight: bold;
      color: var(--base-text-color-1);
      span:nth-child(2) {
        margin-left: 8px;
        font-weight: 400;
      }
    }
  }
</style>
