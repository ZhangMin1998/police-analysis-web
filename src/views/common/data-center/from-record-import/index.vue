<template>
<div
  id='wrap'
  class='wrap'
  v-p-loading="loading"
  :key='componentKey'
  element-loading-text="数据正在加载中"
  element-loading-spinner="el-icon-loading"
  :element-loading-background="'--bg-color-3'"
>
  <TotalData
    v-if='haveRecordType'
    v-show='!loading'
    class="data"
    :showType="'text'"
    :dataType='recordType'
    :tipImgContent='activeLabTitle'
    @changeTotalDataLoad='changeTotalLoad'
  ></TotalData>

  <!--    数据统计-->
  <TotalDataChartLine
    v-if='haveRecordType'
    v-show='!loading'
    :dataType='recordType'
    @changeChartLineLoad='changeChartLoad'
  ></TotalDataChartLine>

  <div id="list" class='wrap-list' v-if='showTable' v-show='!loading'>
    <div class='title'>
      <span>数据列表 -</span>
      <span>{{ activeLabTitle }}</span>
    </div>
    <div class='wrap_table' id='wrapTable'>
      <TableGrid
        ref='myTable'
        :url='"/configurable/data/search/datacenter/list"'
        :reqMethod='"post"'
        :exportUrl='"/police/configurable/data/search/datacenter/export"'
        :exportColumns='exportColumns'
        :exportFileName='recordParams.srcNameCn'
        :pageMyself='true'
        :haveSearchInput='false'
        :isSearchTime='false'
        @getSpecialParams='handleBeforeLoad'
      >
<!--        <el-table-column
          v-for="(value, key) in recordParams.fileRules"
          :key="key"
          :prop="value.field_name_en"
          :label="value.field_name_cn"
          :show-overflow-tooltip="true"
          :min-width='value.width'
          :resizable="true"
        >
          <template slot-scope="{ row }">
            <div class="item">
              {{ row[value.field_name_en] || '&#45;&#45;' }}
            </div>
          </template>
        </el-table-column>-->
        <el-table-column
          v-for="item in recordParams.fileRules"
          :key="item.id"
          :prop="item.fieldNameEn"
          :label="item.fieldNameCn"
          :show-overflow-tooltip="true"
          :min-width='item.width'
          :resizable="true"
        >
          <template slot-scope="{ row }">
            <div v-if='[21, 9].includes(item.entityLabelId)' class='item'>
              <el-image
                class="el-image"
                :src="origin + row[item.fieldNameEn]"
                :preview-src-list="[ origin + row[item.fieldNameEn] ]"
                fit="cover"
              >
                <div slot="error" class="image-slot">
                  <img :src='$themeColor("--car-default-pic")' alt=''>
                </div>
              </el-image>
            </div>
            <div v-else class="item">
              {{ item.dataStandardId && item.dataStandardId.length && standardList.length ? getChangeData(item.dataStandardId, row[item.fieldNameEn]) : (row[item.fieldNameEn] || '--') }}
            </div>
          </template>
        </el-table-column>
        <div class='search_input' slot='dateLeft'>
          <el-input
            v-for='item in searchIList'
            :key='item.field'
            v-model.trim="item.value"
            @keyup.enter.native="searchData"
            :placeholder="`请输入${item.name}`"
            clearable
          ></el-input>
          <div
            v-for='item in timeSearchList'
            :key='item.timeField'
            class='time_select'
          >
            <span>{{ item.name + '：' }}</span>
            <DateTimeSelect
              :pStartTime.sync='item.startTime'
              :pEndTime.sync='item.endTime'
            ></DateTimeSelect>
          </div>
        </div>
      </TableGrid>
    </div>
  </div>

</div>
</template>

<script>
import TotalData from '../components/total-data'
import TotalDataChartLine from  '../components/total-data-chart-line'
import TableGrid from '@/components/VisualComponents/TableGrid'

import { mapState } from 'vuex'
import { getRecordsListApi } from '@/api/dataCenter'
import { getStandardListApi } from '@/api/sysSetting'
import DateTimeSelect from '@/components/VisualComponents/QuickTimeSelect'

export default {
  name: 'FromRecordImport',
  components: {
    TotalData,
    TotalDataChartLine,
    TableGrid,
    DateTimeSelect
  },
  data () {
    return {
      totalLoad: true,
      chartLoad: true,
      haveRecordType: false,
      recordLabList: [],
      recordParams: {},
      recordType: '',
      searchIList: [],
      showTable: false,
      exportColumns: [
        {
          label: '事件项',
          list: []
        }
      ],
      componentKey: new Date().getTime(),
      standardList: [],
      sGetStandard: false,
      timeSearchList: []
    }
  },
  computed: {
    ...mapState('DataCenter', {
      activeLabTitle: 'activeLabTitle'
    }),
    loading () {
      return this.totalLoad || this.chartLoad || !this.haveRecordType || !this.sGetStandard
    },
    origin () {
      return window.location.origin + '/'
    }
  },
  watch: {
    activeLabTitle: {
      handler () {
        if (!this.recordLabList.length) return
        this.componentKey = new Date().getTime()
        this.showTable = false
        this.haveRecordType = false
        this.totalLoad = true
        this.chartLoad = true
        this.getRecordsParams()
        this.$nextTick(() => {
          this.$refs.myTable?.refresh()
        })
      }
    }
  },
  mounted () {
    this.getRecordsList()
    this.getStandard()
  },
  methods: {
    changeTotalLoad (bool) {
      this.totalLoad = bool
    },
    changeChartLoad (bool) {
      this.chartLoad = bool
    },
    // 获取全部的数据列表
    getRecordsList () {
      getRecordsListApi({
        fieldRules: false
      }).then(res => {
        this.recordLabList = res.content || []
        this.getRecordsParams()
      }).catch(() => {

      })
    },
    getStandard () {
      getStandardListApi({}, false).then(res => {
        this.standardList = res || []
      }).finally(() => {
        this.sGetStandard = true
      })
    },
    getChangeData (standardId, value) {
      if (!value) return '--'
      standardId.forEach(stand => {
        let standard = this.standardList.find(item => +item.id === +stand)
        if (standard) {
          let result = standard.dataStandardRules.find(item => item.standardName === value)
          if (result && result.standardDescription) {
            return result.standardDescription
          }
        }
      })
      // let standard = this.standardList.find(item => +item.id === +standardId)
      // if (standard) {
      //   let result = standard.dataStandardRules.find(item => item.standardName === value)
      //   if (result && result.standardDescription) {
      //     return result.standardDescription
      //   }
      // }
      return value
    },
    // 获取当前数据的相关配置
    getRecordsParams () {
      this.recordParams = {}
      this.recordType = ''
      this.searchIList = []
      this.timeSearchList = []
      this.exportColumns[0].list = []
      let targetInd = this.recordLabList.findIndex(item => item.srcNameCn === this.activeLabTitle)
      if (targetInd > -1) {
        getRecordsListApi({
          fieldRules: true,
          srcNameEn: this.recordLabList[targetInd].srcNameEn
        }).then(res => {
          this.recordParams = res.content[0] || {}
          this.recordType = this.recordParams.srcNameEn
          let fontSize = 16 * document.documentElement.style.fontSize.split('px')[0] / 192
          this.recordParams.fileRules.forEach(item => {
            item['width'] = fontSize * (item['fieldNameCn'].length + 3)
            if (item.hashPartition) {
              this.searchIList.push({
                field: item.fieldNameEn,
                name: item.fieldNameCn,
                fieldType: item.fieldType || '',
                value: ''
              })
            }
            if (item.timePartition) {
              this.timeSearchList.push({
                startTime: '',
                endTime: '',
                timeField: item.fieldNameEn,
                name: item.fieldNameCn
              })
            }
            this.exportColumns[0].list.push({
              label: item.fieldNameCn,
              prop: item.fieldNameEn
            })
          })
        }).finally(() => {
          this.showTable = true
          this.haveRecordType = true
          // if (this.recordType) {
          //   this.haveRecordType = true
          // }
        })

        /*this.recordParams = this.recordLabList[targetInd]
        this.recordType = this.recordParams.srcNameEn
        let fontSize = 16 * document.documentElement.style.fontSize.split('px')[0] / 192*/
        // for (let key in this.recordParams.fileRules) {
        //   this.recordParams.fileRules[key]['width'] = fontSize * (this.recordParams.fileRules[key]['field_name_cn'].length + 3)
        //   if (this.recordParams.fileRules[key].main_field === 'true') {
        //     this.searchIList.push({
        //       field: this.recordParams.fileRules[key].field_name_en,
        //       name: this.recordParams.fileRules[key].field_name_cn,
        //       value: ''
        //     })
        //   }
        //   this.exportColumns[0].list.push({
        //     label: this.recordParams.fileRules[key].field_name_cn,
        //     prop: this.recordParams.fileRules[key].field_name_en
        //   })
        // }
        /*this.recordParams.fileRules.forEach(item => {
          item['width'] = fontSize * (item['fieldNameCn'].length + 3)
          if (item.mainField) {
            if (item.attrType !== 'transformation_date_stamp' && item.attrType !== 'transformation_time_stamp') {
              this.searchIList.push({
                field: item.fieldNameEn,
                name: item.fieldNameCn,
                value: ''
              })
            } else {
              this.timeSearchList.push({
                startTime: '',
                endTime: '',
                timeField: item.fieldNameEn,
                name: item.fieldNameCn
              })
            }
          }
          this.exportColumns[0].list.push({
            label: item.fieldNameCn,
            prop: item.fieldNameEn
          })
        })*/
      }
      /*this.showTable = true
      if (this.recordType) {
        this.haveRecordType = true
      }*/
    },
    handleBeforeLoad (req, callback) {
      req.data.tableName = this.recordType
      // if (req.data.startTime && req.data.endTime) {
      //   req.data.timeField = 'create_time'
      // }
      if (this.searchIList.length) {
        req.data.searchConditions = []
        this.searchIList.forEach(item => {
          if (item.value) {
            req.data.searchConditions.push({
              field: item.field,
              fieldType: item.fieldType,
              key: item.value
            })
          }
        })
      }
      if (this.timeSearchList.length) {
        req.data.searchTimeParamList = []
        this.timeSearchList.forEach(item => {
          if (item.startTime && item.endTime) {
            req.data.searchTimeParamList.push({
              startTime: item.startTime,
              endTime: item.endTime,
              timeField: item.timeField
            })
          }
        })
      }
      callback(req)
    },
    searchData () {
      this.$nextTick(() => {
        this.$refs.myTable.refresh()
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../common-style";
</style>
<style lang='less' scoped>
.wrap_table {
  height: 924px;
  padding: 0 8px;
  // 荣成特异性更改
  // ::v-deep .w_table .el-table__body-wrapper::-webkit-scrollbar {
  //   height: 16px !important; /* 横向滚动条 */
  // }
}
/deep/.w_table_grid_header {
  .header_left {
    .el-input {
      width: 216px;
    }
    .el-input__suffix {
      .el-icon-circle-close {
        right: 0 !important;
      }
    }
  }
}
.no_height {
  height: 0;
}
/deep/.el-table__empty-block {
  width: calc(100vw - 156px) !important;
}
.item {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  height: 21px;
}
.search_input {
  display: flex;
  flex-wrap: wrap;
  .time_select {
    display: flex;
    align-items: center;
    margin-right: 16px;
  }
}
/deep/.el-image {
  height: 21px;
  img {
    width: 21px;
    height: 21px;
  }
}
</style>
