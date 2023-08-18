<template>
<div class='trail_editor_wrap'>
  <OperaHeader :breadcrumbData='breadcrumbList' @callBack='cancelOpera'></OperaHeader>
  <div
    class='wrap_content'
    v-p-loading="loading"
    :element-loading-text="loadText"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="$themeColor(loadBg)"
  >
    <div class='opera_btn'>
      <div class='btn' @click='addItem' :class='{ "is_disabled": noneAttr }'>
        <i class='iconfont icon-tianjia'></i>
        <div class='tip'>添加</div>
      </div>
      <div class='btn' @click='delItem'>
        <i class='iconfont icon-shanchu'></i>
        <div class='tip'>删除</div>
      </div>
    </div>
    <div class='editor_content'>
      <div class='editor_table'>
        <div class='item_table'>
          <div class='item_table_header'>
            <div class='item' :style='{ "width": "9.462%" }'>
              <div class='checkbox' :class='{ "active": isCheckAll }' @click='checkAll'></div>
              <div class='label'>序号</div>
            </div>
            <div
              class='item'
              v-for='(value, key) in tableColumns'
              :key='key'
              :style='{ "width": value.width }'
            >
              <div class='label'>{{ value.label }}</div>
            </div>
          </div>
          <div class='item_table_content' id='table_content'>
            <div :id='`content_row_${index}`' class='content_row' v-for='(item, index) in editorList' :key='index'>
              <div class='content content_index' :style='{ "width": "9.462%" }'>
                <div class='checkbox' :class='{ "active": item.isCheck }' @click='checkItem(item)'></div>
                <div class='value'>{{ index + 1 }}</div>
              </div>
              <div class='content' :style='{ "width": tableColumns.person.width }'>
                <el-select
                  v-model='item.person'
                  placeholder="请选择"
                  :class='{ "is_empty": (item.person === "" && !item.canSubmit) || item.isRepeat }'
                >
                  <el-option
                    v-for="opt in attrData['attrFields'].data"
                    :key="opt.id"
                    :label="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    :value="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    @click.native='handlePerson(item, index, opt)'
                  >
                  </el-option>
                </el-select>
              </div>
              <div class='content' :style='{ "width": tableColumns.imageField.width }'>
                <el-select
                  v-model='item.imageFieldId'
                  placeholder="请选择"
                  :class='{ "is_empty": item.isRepeat }'
                  :disabled='!item.imgCanChange'
                >
                  <el-option
                    v-for="opt in attrData['imageFields'].data"
                    :key="opt.id"
                    :label="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    :value="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    @click.native='isRepeat(item, index)'
                  >
                  </el-option>
                </el-select>
              </div>

              <div class='content' :style='{ "width": tableColumns.time.width }'>
                <el-select
                  v-model='item.time'
                  placeholder="请选择"
                  :class='{ "is_empty": (item.time === "" && !item.canSubmit) || item.isRepeat }'
                >
                  <el-option
                    v-for="opt in attrData['timeFields'].data"
                    :key="opt.id"
                    :label="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    :value="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    @click.native='isRepeat(item, index)'
                  >
                  </el-option>
                </el-select>
              </div>
              <div class='content' :style='{ "width": tableColumns.place.width }'>
                <el-select
                  v-model='item.place'
                  placeholder="请选择"
                  :class='{ "is_empty": (item.place === "" && !item.canSubmit) || item.isRepeat }'
                >
                  <el-option
                    v-for="opt in attrData['placeFields'].data"
                    :key="opt.id"
                    :label="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    :value="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    @click.native='placeClick(item, index)'
                  >
                  </el-option>
                </el-select>
              </div>

              <div class='content' :style='{ "width": tableColumns.longitudeFieldId.width }'>
                <el-select
                  v-model='item.longitudeFieldId'
                  placeholder="请选择"
                  :class='{ "is_empty": item.isRepeat }'
                >
                  <el-option
                    v-for="opt in attrData['longitudeFields'].data"
                    :key="opt.id"
                    :label="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    :value="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    @click.native='lngClick(item, index)'
                  >
                  </el-option>
                </el-select>
              </div>
              <div class='content' :style='{ "width": tableColumns.latitudeFieldId.width }'>
                <el-select
                  v-model='item.latitudeFieldId'
                  placeholder="请选择"
                  :class='{ "is_empty": item.isRepeat }'
                >
                  <el-option
                    v-for="opt in attrData['latitudeFields'].data"
                    :key="opt.id"
                    :label="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    :value="`${opt.fieldNameCn}（${opt.fieldNameEn}）`"
                    @click.native='latClick(item, index)'
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </div>
        <div class='floor'>
          <div class='blank_button' @click='cancelOpera'>取消</div>
          <el-button type="primary" v-debounce='submit' :disabled='submitDisabled'>提交</el-button>
        </div>
      </div>
<!--      选项预览-->
      <div class='options_preview'>
        <div class='preview_tip'>选项预览</div>
        <div class='options_list'>
          <div class='options' v-for='(value, key) in attrData' :key='key'>
            <div class='options_title'>
              <EllipsisPop :content='value.name'></EllipsisPop>
            </div>
            <div class='options_item' v-for='item in value.data' :key='item.id'>
              <EllipsisPop :content='`${item.fieldNameCn}（${item.fieldNameEn}）`'></EllipsisPop>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import OperaHeader from '../opera-header/index.vue'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'

import { getTrailDetail, getTrailAttrApi, operaTrail, delTrail } from '@/api/sysSetting'

export default {
  name: 'TrailEditor',
  components: {
    OperaHeader,
    EllipsisPop
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    const TABLE_COLUMNS = {
      person: { label: '人/物', width: '15.648%' },
      imageField: { label: '图片', width: '14%' },
      time: { label: '时间', width: '15.445%' },
      place: { label: '地点', width: '15.445%' },
      longitudeFieldId: { label: '经度', width: '15%' },
      latitudeFieldId: { label: '纬度', width: '15%' }
    }
    return {
      // 面包屑的数据
      breadcrumbList: [
        { tabName: '数据轨迹', canOpera: true }
      ],
      loading: true,
      tableColumns: Object.freeze(TABLE_COLUMNS),
      editorList: [], // 列表的数据
      attrData: {
        'attrFields': {
          name: '人/物',
          data: []
        },
        'timeFields': {
          name: '时间',
          data: []
        },
        'placeFields': {
          name: '地点',
          data: []
        },
        'longitudeFields': {
          name: '经度',
          data: []
        },
        'latitudeFields': {
          name: '纬度',
          data: []
        },
        'imageFields': {
          name: '图片',
          data: []
        },
        'otherFields': {
          name: '其他',
          data: []
        }
      }, // 选项预览的数据
      delOldData: [], // 删除的数据
      mountStopLoad: 0,
      subStopLoad: 0,
      loadText: '数据加载中',
      loadBg: '--bg-color-3',
      listValue: {}, // 列表数据值和下标的对象
      optCntoEn: {}
    }
  },
  computed: {
    // 是否选中全部
    isCheckAll () {
      return this.editorList.length && this.editorList.every(item => item.isCheck)
    },
    // 提交时，调用接口的次数
    submitLength () {
      let upAddDataLength = this.editorList.filter(item => {
        return item.isAdd ||
          (!item.isAdd &&
            (item['person'] !== item['oldPerson'] ||
              item['time'] !== item['oldTime'] ||
              item['place'] !== item['oldPlace'] ||
              item['longitudeFieldId'] !== item['oldLongitudeFieldId'] ||
              item['latitudeFieldId'] !== item['oldLatitudeFieldId'] ||
              item['imageFieldId'] !== item['oldImageFieldId']
            ))
      }).length
      return this.delOldData.length + upAddDataLength
    },
    // 是否存在重复的轨迹项
    // haveRepeat () {
    //   return this.editorList.some(item => item.isRepeat)
    // },
    // 选项”人/物“，时间，地点列表是否为空
    noneAttr () {
      return !this.attrData['attrFields'].data.length ||
        !this.attrData['timeFields'].data.length ||
        !this.attrData['placeFields'].data.length
    },
    submitDisabled () {
      if (this.delOldData.length) {
        return this.editorList.some(item => item.isRepeat)
      } else {
        return this.editorList.some(item => item.isRepeat) ||
          this.noneAttr ||
          !this.editorList.length
      }
    }
  },
  watch: {
    mountStopLoad: {
      handler (newVal) {
        if (newVal === (this.row.traceStandard ? 2 : 1)) {
          this.loading = false
          this.loadText = '提交中'
          this.loadBg = '--loading-color-1'
        }
      }
    },
    subStopLoad: {
      handler (newVal) {
        if (newVal === this.submitLength) {
          this.loading = false
          this.$message.success('提交成功！')
          this.$emit('toList', 'list', {})
        }
      }
    }
  },
  created () {
    this.breadcrumbList = [
      ...this.breadcrumbList,
      ...[
        { tabName: this.row.srcNameCn || '' },
        { tabName: '编辑' }
      ]
    ]
  },
  mounted () {
    if (this.row.id) {
      if (this.row.traceStandard) {
        this.getTrailData(this.row.id)
      }
      this.getTrailAttr(this.row.id)
    }
  },
  methods: {
    handlePerson (item, ind, opt) {
      let list = this.attrData.imageFields.data.map(img => img.id)
      if (list.includes(opt.id)) {
        item.imageFieldId = item.person
        item.imgCanChange = false
      } else {
        item.imgCanChange = true
      }
      this.isRepeat(item, ind)
    },
    placeClick (item, ind) {
      let sameInd = this.editorList.findIndex((same, index) => same.place === item.place && index !== ind)
      if (sameInd > -1) {
        item.longitudeFieldId = this.editorList[sameInd].longitudeFieldId
        item.latitudeFieldId = this.editorList[sameInd].latitudeFieldId
      }
      this.isRepeat(item, ind)
    },
    lngClick (item, ind) {
      if (item.place) {
        let sameList = []
        this.editorList.forEach((same, sameInd) => {
          if (same.place === item.place) {
            same.longitudeFieldId = item.longitudeFieldId
            sameList.push(sameInd)
          }
        })
        sameList.forEach(same => {
          this.isRepeat(this.editorList[same], same)
        })
      } else {
        this.isRepeat(item, ind)
      }
    },
    latClick (item, ind) {
      if (item.place) {
        let sameList = []
        this.editorList.forEach((same, sameInd) => {
          if (same.place === item.place) {
            same.latitudeFieldId = item.latitudeFieldId
            sameList.push(sameInd)
          }
        })
        sameList.forEach(same => {
          this.isRepeat(this.editorList[same], same)
        })
      } else {
        this.isRepeat(item, ind)
      }
    },
    // 获取已有的轨迹项
    getTrailData (id) {
      getTrailDetail({
        srcId: id
      }).then(res => {
        let result = res || []
        result.forEach((item, index) => {
          let data = {
            id: item.id,
            person: `${item.attrField.fieldNameCn}（${item.attrField.fieldNameEn}）`,
            time: `${item.timeField.fieldNameCn}（${item.timeField.fieldNameEn}）`,
            place: `${item.placeField.fieldNameCn}（${item.placeField.fieldNameEn}）`,
            longitudeFieldId: item.longitudeField ? `${item.longitudeField.fieldNameCn}（${item.longitudeField.fieldNameEn}）` : '',
            latitudeFieldId: item.latitudeField ? `${item.latitudeField.fieldNameCn}（${item.latitudeField.fieldNameEn}）` : '',
            imageFieldId: item.imageField ? `${item.imageField.fieldNameCn}（${item.imageField.fieldNameEn}）` : '',
            oldPerson: `${item.attrField.fieldNameCn}（${item.attrField.fieldNameEn}）`,
            oldTime: `${item.timeField.fieldNameCn}（${item.timeField.fieldNameEn}）`,
            oldPlace: `${item.placeField.fieldNameCn}（${item.placeField.fieldNameEn}）`,
            oldLongitudeFieldId: item.longitudeField ? `${item.longitudeField.fieldNameCn}（${item.longitudeField.fieldNameEn}）` : '',
            oldLatitudeFieldId: item.latitudeField ? `${item.latitudeField.fieldNameCn}（${item.latitudeField.fieldNameEn}）` : '',
            oldImageFieldId: item.imageField ? `${item.imageField.fieldNameCn}（${item.imageField.fieldNameEn}）` : '',
            isCheck: false,
            isAdd: false,
            canSubmit: true,
            isRepeat: false,
            imgCanChange: item.imageFieldId ? item.imageFieldId !== item.attrFieldId : true
          }
          let repeatValue = `${data.person},${data.time},${data.place}`
          data.longitudeFieldId && (repeatValue += `,${data.longitudeFieldId}`)
          data.latitudeFieldId && (repeatValue += `,${data.latitudeFieldId}`)
          data.imageFieldId && (repeatValue += `,${data.imageFieldId}`)
          data['repeatValue'] = repeatValue
          this.editorList.push(data)
          this.listValue[repeatValue] = [index]
        })
      }).finally(() => {
        this.mountStopLoad += 1
      })
    },
    // 获取选项预览的数据
    getTrailAttr (id) {
      getTrailAttrApi({
        srcId: id
      }).then(res => {
        let result = res || {}
        for (let key in this.attrData) {
          this.attrData[key].data = result[key] || []
          this.attrData[key].data.forEach(item => {
            this.optCntoEn[`${item.fieldNameCn}（${item.fieldNameEn}）`] = item.id
          })
        }
      }).finally(() => {
        this.mountStopLoad += 1
      })
    },
    cancelOpera () {
      this.$emit("toList", "list", {})
    },
    // 当行数据的选择
    checkItem (item) {
      item.isCheck = !item.isCheck
    },
    // 全选
    checkAll () {
      let check = !this.isCheckAll
      this.editorList.forEach(item => {
        item.isCheck = check
      })
    },
    // 添加字段
    addItem () {
      if (this.noneAttr) return
      this.editorList.push({
        person: '',
        time: '',
        place: '',
        longitudeFieldId: '',
        latitudeFieldId: '',
        imageFieldId: '',
        repeatValue: '',
        isCheck: false,
        isAdd: true,
        canSubmit: true,
        isRepeat: false,
        imgCanChange: true
      })
      if (document.getElementById('table_content').scrollHeight > document.getElementById('table_content').clientHeight) {
        this.$nextTick(() => {
          document.getElementById(`content_row_${this.editorList.length - 1}`).scrollIntoView()
        })
      }
    },
    // 删除字段
    delItem () {
      if (this.isCheckAll) {
        this.editorList.forEach(item => {
          if (!item.isAdd) {
            this.delOldData.push(item)
          }
        })
        this.editorList = []
        this.listValue = {}
      } else if (this.editorList.some(item => item.isCheck)) {
        this.listValue = {}
        this.editorList = this.editorList.filter(item => {
          if (item.isCheck && !item.isAdd) {
            this.delOldData.push(item)
          }
          return !item.isCheck
        })
        this.editorList.forEach((item, index) => {
          item.isRepeat = false
          if (item.repeatValue) {
            if (this.listValue[item.repeatValue]) {
              this.listValue[item.repeatValue].push(index)
              this.listValue[item.repeatValue].forEach(ind => {
                this.editorList[ind].isRepeat = true
              })
            } else {
              this.listValue[item.repeatValue] = [index]
            }
          }
        })
      } else {
        this.$message.warning('请选择字段！')
      }
    },
    // 选择选项时判断是否有重复的轨迹项
    isRepeat (item, index) {
      if (!item.person || !item.time || !item.place) return
      let value = `${item.person},${item.time},${item.place}`
      item.longitudeFieldId && (value += `,${item.longitudeFieldId}`)
      item.latitudeFieldId && (value += `,${item.latitudeFieldId}`)
      item.imageFieldId && (value += `,${item.imageFieldId}`)
      let oldValue = item.repeatValue
      if (value === oldValue) return
      if (this.listValue[value]) {
        this.listValue[value].push(index)
        item.repeatValue = value
      } else {
        this.listValue[value] = [index]
        item.repeatValue = value
      }
      if (oldValue) {
        this.listValue[oldValue] = this.listValue[oldValue].filter(item => item !== index)
        if (this.listValue[oldValue].length === 1) {
          this.editorList[this.listValue[oldValue]].isRepeat = false
        }
      }
      if (this.listValue[value].length > 1) {
        this.listValue[value].forEach(item => {
          this.editorList[item].isRepeat = true
        })
      }
      if (this.listValue[value].length === 1) {
        item.isRepeat = false
      }
    },
    submit () {
      this.loading = true
      let noWriteNum = 0
      this.editorList.forEach(item => {
        if (!item.person || !item.time || !item.place) {
          item.canSubmit = false
          noWriteNum += 1
        } else {
          item.canSubmit = true
        }
      })
      if (noWriteNum > 0) {
        this.$policeComfirm('请将表信息补充完整！', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        this.loading = false
        return
      }
      // this.delOldData = this.delOldData.filter(item => !(item.repeatValue in this.listValue))
      if (!this.submitLength) {
        this.$emit('toList', 'list', {})
        this.loading = false
        return
      }
      let callApi = (params, way) => {
        operaTrail(params, way).finally(() => {
          this.subStopLoad += 1
        })
      }
      this.editorList.forEach(item => {
        let params = {
          srcId: this.row.id,
          attrFieldId: this.optCntoEn[item.person],
          timeFieldId: this.optCntoEn[item.time],
          placeFieldId: this.optCntoEn[item.place],
          longitudeFieldId: item.longitudeFieldId ? this.optCntoEn[item.longitudeFieldId] : '',
          latitudeFieldId: item.latitudeFieldId ? this.optCntoEn[item.latitudeFieldId] : '',
          imageFieldId: item.imageFieldId ? this.optCntoEn[item.imageFieldId] : ''
        }
        let way = 'insert'
        if (!item.isAdd) {
          if (
            item['person'] !== item['oldPerson'] ||
            item['time'] !== item['oldTime'] ||
            item['place'] !== item['oldPlace'] ||
            item['longitudeFieldId'] !== item['oldLongitudeFieldId'] ||
            item['latitudeFieldId'] !== item['oldLatitudeFieldId'] ||
            item['imageFieldId'] !== item['oldImageFieldId']
          ) {
            params['id'] = item.id
            way = 'update'
            callApi(params, way)
          }
        } else {
          callApi(params, way)
        }
      })
      this.delOldData.forEach(item => {
        delTrail({
          id: item.id
        }).finally(() => {
          this.subStopLoad += 1
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.trail_editor_wrap {
  height: 100%;
  .wrap_content {
    height: calc(100% - 52px);
    padding: 24px;
    background: var(--bg-color-3);
    margin-top: 1px;
    .opera_btn {
      display: flex;
      margin-bottom: 16px;
      .btn {
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 19px;
        color: var(--active-color);
        margin-right: 24px;
        cursor: pointer;
        i {
          font-size: 16px;
          margin-right: 8px;
        }
        &.is_disabled {
          color: #434B5F;
          cursor: not-allowed;
        }
      }
    }
    .editor_content {
      display: flex;
      height: calc(100% - 35px);
      .editor_table {
        width: 100%;
        height: 100%;
        flex: 1;
        .floor {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
          .blank_button {
            margin-right: 16px;
          }
        }
      }
      .item_table {
        width: 100%;
        height: calc(100% - 48px);
        .item_table_header {
          width: 100%;
          display: flex;
          padding: 12px 22px;
          background: var(--table-head-bg-color);
          flex: none;
          .item {
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 24px;
            color: var(--base-text-color-to-666666);
            padding: 0 18px;
            border-right: 1px solid var(--table-row-border-bottom-color);
            &:last-child {
              border-right: 0;
            }
          }
        }
        .item_table_content {
          flex: 1;
          height: calc(100% - 48px);
          overflow-y: auto;
          .content_row {
            display: flex;
            padding: 8px 22px;
            //background: rgba(20, 20, 20, 0.04);
            border-bottom: 1px solid var(--table-row-border-bottom-color);
            .content {
              display: flex;
              align-items: center;
              padding: 0 18px;
              font-size: 16px;
              color: var(--base-text-color-1);
              /deep/.el-select {
                width: 100%;
                .el-input {
                  width: 100%;
                  .el-input__inner {
                    height: 32px;
                    line-height: 30px;
                  }
                  //.el-input__inner {
                  //  border-color: rgba(81, 92, 124, 0.4) !important;
                  //  &:hover {
                  //    border-color: #3D4C75 !important;
                  //  }
                  //}
                  .el-input__suffix {
                    height: 30px;
                    .el-select__caret {
                      height: 30px;
                      line-height: 30px;
                    }
                  }
                }
                &.is_empty {
                  .el-input {
                    .el-input__inner {
                      border-color: rgba(255, 16, 110, .4) !important;
                    }
                  }
                }
              }
              &:last-child {
                padding-right: 0;
              }
            }
            .content_index {
              padding: 0 18px;
            }
          }
        }
        .checkbox {
          position: relative;
          width: 16px;
          height: 16px;
          border: 1px solid var(--checkbox-border);
          border-radius: 2px;
          margin-right: 12px;
          cursor: pointer;
          &.active {
            background: var(--active-color);
            border: 1px solid var(--active-color);
            &::after {
              content: '';
              box-sizing: content-box;
              border: 1px solid #FFFFFF;
              border-left: 0;
              border-top: 0;
              height: 7px;
              width: 3px;
              transform: rotate(45deg) scaleY(1);
              position: absolute;
              top: 2px;
              left: 5px;
            }
          }
        }
      }
      .options_preview {
        width: 290px;
        height: 100%;
        background: var(--bg-color-6);
        font-size: 16px;
        line-height: 21px;
        color: var(--base-text-color-to-333333);
        margin-left: 16px;
        .preview_tip {
          padding: 16px 0 12px;
          margin: 0 16px 12px;
          border-bottom: 1px solid rgba(81, 92, 124, .5);
        }
        .options_list {
          width: 100%;
          height: calc(100% - 74px);
          padding: 0 16px;
          margin-bottom: 12px;
          overflow-y: auto;
          /deep/.value_box {
            .value {
              color: var(--base-text-color-to-333333);
            }
          }
          .options {
            width: 100%;
            margin-bottom: 8px;
            .options_title {
              width: 100%;
              color: var(--record-track-color);
              margin-bottom: 12px;
              /deep/.value_box {
                .value {
                  color: var(--record-track-color);
                }
              }
            }
            .options_item {
              width: 100%;
              margin-bottom: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
