<template>
  <div class="TableCom">
    <div class="set-box">
      <!-- <div class="set">
        <span v-if="!isShowSetting">设置</span>
        <i class='iconfont icon-shezhi' :title='"设置"' @click="showSetting" v-if="isShowSetting"></i>
        <i class="el-icon-close" :title='"关闭"' @click="showSetting" v-if="!isShowSetting"></i>
      </div> -->
    </div>
    <div class="main-box">
      <div class="cardInfo">
        <Loading :isLoading.sync="isLoading">
          <div v-if="!isEmpty">
            <template-table
              :isShowPagination="true"
              :tableData="table.tableData"
              :columns="table.columns"
              :pageData="table.pageData"
              :isLoading="false"
              :header-row-style='() => "height: 48px"'
              :header-cell-style="() => 'background-color: rgba(255, 255, 255, .04) !important;color:#8799BF;font-size:16px;font-weight:400'"
              :newRowColor='true'
              @handleCurrentChange="handleCurrentChange"
            ></template-table>
            <!-- <TableGrid
              :haveIndex="true"
              :haveHeader="false"
              :data="table.tableData"
              :tableColumns="table.columns"
              :dataTotal="table.pageData.total"
            ></TableGrid> -->
          </div>
          <div class="empty_div" v-else>
            <EmptyData />
          </div>
        </Loading>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { dataSearchList, dataSearchOtherList } from '@/api/allArchives'
import TemplateTable from '@/components/VisualComponents/Table'
// import TableGrid from '@/components/VisualComponents/TableGrid'
import EmptyData from '@/components/BasicComponents/EmptyData'
import Loading from '@/components/VisualComponents/Loading'
export default {
  components: {
    TemplateTable,
    EmptyData,
    Loading
  },
  props:{
    value: {
      type: String
    },
    total: {
      type: Number
    }
    // columns: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data () {
    return {
      isEmpty: false,
      isLoading: false,
      isShowSetting: true,
      rowHeight: 52,
      table: {
        pageData: {
          curPage: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        allData: [],
        columns: []
      }
    }
  },
  computed: {
    ...mapState('Common', {
      isShowImgArray: 'isShowImgArray'
    })
  },
  created () {
    this.getData()
    // { label: '备注', prop: 'defaultValue', width: '150', type: 'nor', },
    // { label: '序号',width: '80', type: 'index' },
    // { label: '姓名', prop: 'defaultValue', width: '150', type: 'nor', },
    // { label: '性别', prop: 'defaultValue', width: '150', type: 'nor', },
  },
  methods: {
    showSetting () {
      this.isShowSetting = !this.isShowSetting
    },
    requestPromiseAll (array, requestUrl) {
      const promise = array.map(v => {
        return new Promise((resolve, reject) => {
          requestUrl(v)
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
      })
      return promise
    },
    getData () {
      this.isLoading = true
      let mData = {
        cerNumber: this.$route.query.cerNumber,
        tableName: this.value
      }
      dataSearchList(mData).then(res => {
        if (res.code === 1) {
          // code为1一般情况
          if (!res.header || !res.records.length) {
            this.isEmpty = true
            this.table.tableData = []
            return
          }
          if(res.header.length) {
            res.header.forEach(item => {
              if (item.attrType === 'transformation_picture' || item.attrType === 'transformation_picture_multiple' || this.isShowImgArray.includes(item.entityLabelId)) {
                res.records.forEach(e => {
                  if (e[item.fieldNameEn]) {
                    e[item.fieldNameEn] = window.location.origin + '/' + e[item.fieldNameEn]
                  }
                })
              }
            })
          }
          res.records.forEach(item => {
            if (item.create_time) {
              item.create_time = item.create_time.toString()
            }
          })
          this.table.pageData.total = res.total
          if (res.total !== this.total) {
            this.$emit('updateTotal', this.value)
          }
          this.table.allData = [...res.records]
          if (this.value === 'assets_house') { // 不动产照片特殊处理
            this.table.allData.map(item => {
              if (item.image) {
                let image = item.image.split('"')
                image.forEach(e => {
                  if (e.includes(item.obligee)) {
                    item.image = e
                  } else {
                    item.image = null
                  }
                })
              }
            })
          }
          res.header.forEach(item => {
            if (item.attrType === 'transformation_picture' || item.attrType === 'transformation_picture_multiple' || this.isShowImgArray.includes(item.entityLabelId)) {
              this.rowHeight = 78
              this.table.columns.push({
                label: item.fieldNameCn,
                prop: item.fieldNameEn,
                minWidth: '220',
                type: 'img',
                haveSlot: true
              })
            } else {
              this.table.columns.push({
                label: item.fieldNameCn,
                prop: item.fieldNameEn,
                minWidth: '220',
                type: 'nor'
              })
            }
          })
          let temp = this.table.columns.pop()
          this.table.columns.splice(0,0,temp)
          this.table.columns.splice(1,0,{ label: '序号',width: '90', type: 'index' })
          // 前端分页 先取前10条
          this.table.tableData = this.table.allData.slice(
            (this.table.pageData.curPage - 1) * this.table.pageData.pageSize,
            this.table.pageData.curPage * this.table.pageData.pageSize
          )
        } else if (res.code === 0) {
          // console.log('0000000000000')
          // code为0为有多个身份证的情况
          Promise.all(this.requestPromiseAll(res.field, dataSearchOtherList)).then(res => {
            // console.log(res)
            if (!res.length || res[0].header == null && res[1].header == null || !res[0].records.length && !res[1].records.length) {
              this.isEmpty = true
              this.table.tableData = []
              return
            }
            if (res[0].header.length) {
              res[0].header.forEach(item => {
                this.table.columns.push({
                  label: item.fieldNameCn,
                  prop: item.fieldNameEn,
                  minWidth: '220',
                  type: 'nor'
                })
              })
              let temp = this.table.columns.pop()
              this.table.columns.splice(0,0,temp)
              this.table.columns.splice(1,0,{ label: '序号',width: '90', type: 'index' })
            }
            this.isLoading = false
            let tempdata = res.reduce(
              (obj, cur) => {
                obj.total += cur.total
                obj.list.push(...cur.records)
                return obj
              },
              { total: 0, list: [] }
            )
            if (res[0].header.length) {
              res[0].header.forEach(item => {
                if (item.attrType === 'transformation_picture' || item.attrType === 'transformation_picture_multiple'|| this.isShowImgArray.includes(item.entityLabelId)) {
                  tempdata.list[0].forEach(e => {
                    if (e[item.fieldNameEn]) {
                      e[item.fieldNameEn] = window.location.origin + '/' + e[item.fieldNameEn]
                    }
                  })
                }
              })
            }
            if (!tempdata.list.length) {
              this.table.tableData = []
              return
            }
            tempdata.list.forEach(item => {
              if (item.collect_time) {
                item.collect_time = item.collect_time.toString()
              }
              if (item.create_time) {
                item.create_time = item.create_time.toString()
              }
            })
            this.table.pageData.total = tempdata.total
            if (tempdata.total !== this.total) {
              this.$emit('updateTotal', this.value)
            }
            this.table.allData = tempdata.list

            this.table.tableData = this.table.allData.slice(
              (this.table.pageData.curPage - 1) * this.table.pageData.pageSize,
              this.table.pageData.curPage * this.table.pageData.pageSize
            )
            // console.log(this.table.tableData)
          })
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    handleCurrentChange (val) {
      this.table.tableData = this.table.allData.slice(
        (val - 1) * this.table.pageData.pageSize,
        val * this.table.pageData.pageSize
      )
    }
  }
}
</script>

<style lang="less" scoped>
.TableCom{
  .set-box{
    height: 22px;
  }
  .main-box{
    .cardInfo{
      // width: 100%;
      padding: 16px 8px 0 8px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .empty_div{
      height: 70px;
    }
  }
}
/deep/.el-table{
  height: 100% !important;
}
/deep/.el-table__body-wrapper{
  height: 100% !important;
}
/deep/.is-scrolling-left {
  height: 100% !important;
}
// /deep/ tbody .cell{
//   filter: blur(4px);
// }
// /deep/ .el-loading-mask{
//   background-color: #192035 !important;
// }
</style>
