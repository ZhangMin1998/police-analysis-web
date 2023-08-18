<template>
  <div class='data-check-wrap'>
    <header>
      <PageHeader>
        <template>
          <main>
            <div class="company-type">
              <span>厂商列表：</span>
              <span
                class="item_check"
                :class="{ active: currentCompanyIndex === index }"
                v-for="(item, index) in companyList"
                :key="item.value"
                @click="companyClick(item, index)"
              >{{ item.value }}</span
              >
            </div>
          </main>
          <div class='oper-btn'>
            <el-button type="primary" @click="downData('current')">下载当前数据</el-button>
            <el-button type="primary" @click="downData('all')">下载全部数据</el-button>
          </div>
        </template>
      </PageHeader>
    </header>
    <div class='container-wrap'>
      <div class='data-type'>
        <div class='tip'>数据类型：</div>
        <el-select v-model="dataType" placeholder="请选择" @change='changeType'>
          <el-option
            v-for='item in dataTypeList'
            :key='item.type'
            :label='item.name'
            :value='item.type'
          >
          </el-option>
        </el-select>
      </div>
      <div class='content'>
        <Loading :isLoading.sync="infoLoading">
          <el-table
            v-if='tableData.length'
            :data="tableData"
            style="width: 100%"
            height='680'
          >
            <el-table-column
              type='index'
              label='序号'
              width='50'
            ></el-table-column>
            <el-table-column
              v-for='(item, index) in tableColumnTipData'
              :key='index'
              :label='item'
              width='140'
            >
              <template slot-scope='scope'>
                <template v-if='scope.row.error_name[item]'>
                  <el-popover placement='top-start' trigger='hover' :content='scope.row.error_name[item]'>
                    <div slot="reference" class='item-info error-style'>{{ scope.row.source_data[item] ? scope.row.source_data[item] : '未知字段' }}</div>
                  </el-popover>
                </template>
                <template v-else-if='scope.row.source_data[item]'>
                  <div class='item-info'>{{ scope.row.source_data[item] }}</div>
                </template>
                <template v-else>/</template>
              </template>
            </el-table-column>
            <el-table-column
              prop='position'
              label='错误位置'
            ></el-table-column>
            <el-table-column
              prop='path'
              label='路径'
              width='200'
            ></el-table-column>
          </el-table>
          <div class='no-data' v-else>暂无异常数据</div>
        </Loading>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/BasicComponents/PageHeader'
import Loading from '@/components/VisualComponents/Loading'
import exportUtils from '@/utils/exportUtils.js'
import { searchCompanyList, getDataCheckType, getTypeErrorData } from '@/api/check'

export default {
  name: 'DataCheck',
  components: {
    PageHeader,
    Loading
  },
  data () {
    return {
      currentCompanyIndex: 0, // 公司列表的高亮
      companyList: [], // 公司列表
      company: '', // 用户点击的当前公司
      infoLoading: false,
      dataType: '',
      dataTypeList: [], // 数据类型列表
      tableData: [],
      tableColumnTipData: [] // 表格列名数组
    }
  },
  created () {
    this.getCompanyList()
  },
  methods: {
    downData (id) {
      this.changeLoading(true)
      let title = ''
      id === 'all' ? title = `${this.company}_全部数据效验结果` : title = `${this.company}_${this.dataType}_数据效验结果`
      this.exportReq('/py/devops/validation/export', { data_type: this.dataType, company: this.company, all_type: id === 'all' }, title)
    },
    exportReq (url, params, title) {
      const reqObj = {
        method: 'get',
        url: url,
        fileName: title
      }
      reqObj['params'] = params
      //调用封装方法
      exportUtils.exportMethod(reqObj).finally(() => {
        this.changeLoading(false)
      })
    },
    // 获取厂商数据
    getCompanyList () {
      this.changeLoading(true)
      searchCompanyList().then((res) => {
        let data = res.map((item) => {
          return { label: item, value: item }
        })
        this.companyList = data
        this.company = data[0].value
        // this.searchEvent()
        this.getDataType(this.company)
      })
    },
    // 公司点击事件
    companyClick (item, index) {
      this.currentCompanyIndex = index
      this.company = item.value
      this.dataTypeList = []
      this.changeLoading(true)
      this.getDataType(this.company)
    },
    // 获取数据类型
    getDataType (type) {
      getDataCheckType({ company: type }).then(res => {
        this.dataTypeList = res
        if (this.dataTypeList.length) {
          this.dataType = this.dataTypeList[0].type
          this.changeType(this.dataType)
        } else {
          this.changeLoading(false)
        }
      }).catch(() => {
        this.changeLoading(false)
      })
    },
    // 切换数据类型
    changeType (val) {
      this.changeLoading(true)
      this.tableData = []
      getTypeErrorData({data_type: val, company: this.company}).then(res => {
        res ? this.tableData = res : []
        this.tableColumnTipData = Object.keys(this.tableData[0].source_data)
        this.tableData.forEach(item => {
          let errorName = {}
          item.error.forEach(item => {
            errorName[item.field] = item.error_Msg
          })
          item['error_name'] = errorName
        })
        this.changeLoading(false)
      }).catch(() => {
        this.changeLoading(false)
      })
    },
    changeLoading (Boolean) {
      this.infoLoading = Boolean
    },
  }
}
</script>

<style lang='less' scoped>
.data-check-wrap {
  height: calc(100vh - 104px);
  overflow: scroll;
  .item_check {
    cursor: pointer;
    margin: 0 18px;
    &.active {
      color: #d4b021;
    }
  }
  .container-wrap {
    margin: 16px 16px 0;
    .data-type {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
  }
  .error-style {
    padding: 0 4px;
    background: rgb(168, 79, 79);
    border-radius: 4px;
    text-align: center;
  }
  .no-data {
    background: var(--table-head-bg-color);
    height: 618px;
    text-align: center;
    line-height: 618px;
  }
}
</style>
