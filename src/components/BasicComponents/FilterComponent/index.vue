<template>
  <div>
    <div class="newFilter">
      <div :class="['newFilter_icon', { isActive: isShowPanel }]" @click="triggerPoint">
        <div class="category_name" v-if="categoryName">
          <span style="margin-right: 12px">{{ categoryName }}</span>
          <i v-if="!isShowPanel" class="el-icon-arrow-down"></i>
          <i v-else class="el-icon-arrow-up"></i>
        </div>
        <div v-else>
          <img class="newFilter_icon_img" src="@/assets/img/icon-filter.png" />
          <span>过滤器</span>
        </div>
      </div>
      <div class="newFilter_main">
        <ul class="newFilter_main_checkeds" v-show="isShowCheckedList">
          <li v-for="(item, index) in checkedList" :key="index + '_' + item.label">
            <span> {{ item.title }}：</span>
            <span class="item-label"> {{ item.label }}</span>
            <i class="content-close el-icon-close" v-if="isShowClose" @click="closeItem(item)"></i>
          </li>
        </ul>
      </div>
    </div>

    <el-collapse-transition>
      <div
        v-show="isShowPanel"
        class="newFilter_mode"
        :class="{ labelml21: categoryName }"
        :style="{ ...cusStyle }"
      >
        <div class="label_list_item" v-for="(item, index) in labelList" :key="index">
          <div class="label">{{ item.label }}：</div>
          <div class="value">
            <div
              :class="['value_item', { isActive: itemValue.isActive }]"
              v-for="(itemValue, itemValueIndex) in item.list"
              :key="itemValueIndex + '_' + itemValue.label"
              @click="addItem(index, itemValueIndex, itemValue, item.prop)"
            >
              {{ itemValue.label }}
            </div>
          </div>
        </div>
        <!-- <div class="label_list_item">
          <div class="label">{{ dataSourceList[0].label }}：</div>
          <div class="value" v-if="buttonText === '多选'">
            <div
              :class="['value_item', { isActive: itemValue.isActive }]"
              v-for="(itemValue, itemValueIndex) in dataSourceList[0].list"
              :key="itemValueIndex + '_' + itemValue.label"
              @click="addItem(0, itemValueIndex, itemValue, dataSourceList[0].prop)"
            >
              {{ itemValue.label }}
            </div>
          </div>
          <div class="value" v-else>
            <el-checkbox-group
              v-model="checkboxList"
              @change="checkboxListChange"
              style="display: flex; align-items: center"
            >
              <el-checkbox
                :label="item.label"
                v-for="(item, index) in dataSourceList[0].list"
                :key="index"
              ></el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="switchButton">
            <div class="p-button" @click="selectChange">{{ buttonText }}</div>
          </div>
        </div> -->
        <div class="label_list_item">
          <div class="label">时间：</div>
          <div class="picks">
            <QuickTimeSelect
              ref="QuickTimeSelect"
              :type="name"
              :pStartTime.sync="condition.startTime"
              :pEndTime.sync="condition.endTime"
              @timeChange="timeChange"
            ></QuickTimeSelect>
          </div>
        </div>
        <div class="filterButtonBox">
          <div class="p-button" @click="startFilter">过滤</div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
// import CusButton from '@/components/BasicComponents/CusButton'
import QuickTimeSelect from '@/components/VisualComponents/QuickTimeSelect/index'
export default {
  name: 'newFilter',
  components: {
    // CusButton,
    QuickTimeSelect
  },
  props: {
    cusStyle: {
      type: Object,
      default: () => {
        return {
          top: '108px'
        }
      }
    },
    isShowClose: {
      type: Boolean,
      default: true
    },
    categoryList: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    defalutList: {
      type: Array,
      default: () => []
    },
    radio: {
      type: Boolean,
      default: true
    },
    categoryName: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      name: 'newFilter',
      checkboxList: [],
      isShowPanel: false,
      isShowCheckedList: false,
      checkedList: [],
      labelList: [],
      dataSourceList: [],
      buttonText: '多选',
      condition: {
        startTime: null,
        endTime: null
      },
      //存数据来源多选时的选择值
      tempList1: [{
        list: []
      }],
      //存时间的选择值
      tempList2: [{
        list: []
      }]
    }
  },
  computed: {

  },
  watch: {
    categoryList: {
      handler (val) {
        this.labelList = [...val]
      },
      deep: true,
      immediate: true
    },
    dataSource: {
      handler (val) {
        this.dataSourceList = [...val]
      },
      deep: true,
      immediate: true
    },
    checkedList: {
      handler (val) {
        // 注释了这里，因为在单选重置的时候，这块如果是单选，就不会重置了
        // if (!this.radio) {
        this.setChecked(val)
        // }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.checkedList = [...this.defalutList]
    this.labelList = [...this.categoryList]
    this.dataSourceList = [...this.dataSource]
    document.addEventListener('click', this.bodyClick)
  },
  destroyed () {
    document.removeEventListener('click', this.bodyClick)
  },
  methods: {
    // 清空过滤器
    clearCheckedList () {
      this.labelList.forEach(element => {
        element.list.forEach(_c => {
          _c.isActive = false
        })
      })
      this.dataSourceList.forEach(element => {
        element.list.forEach(_c => {
          _c.isActive = false
        })
      })
      this.tempList1.forEach(element => {
        element.list.forEach(_c => {
          _c.isActive = false
          this.checkboxList = []
        })
      })
      this.tempList2.forEach(element => {
        element.list.forEach(_c => {
          _c.isActive = false
          this.$refs.QuickTimeSelect.startEndTime = []
        })
      })
      this.checkedList = []
    },
    selectChange () {
      if (this.buttonText === '多选') {
        this.buttonText = '单选'
      } else {
        this.buttonText = '多选'
      }
    },
    checkboxListChange () {
      this.isShowCheckedList = false
      if (this.checkboxList.length) {
        let label = this.checkboxList.toString()
        let temp = {
          label: label,
          isActive: true,
          title: '数据来源',
          prop: 'dataSource',
          value: this.checkboxList
        }
        this.checkedList = []
        this.checkedList.push(...this.formatCheckedList(this.labelList))
        this.dataSourceList[0].list.map(item => {
          item.isActive = false
        })
        this.tempList1[0].list = []
        this.tempList1[0].list.push(temp)
      }

    },
    //该方法用于给日期、时间补零
    addZero (num) {
      if (parseInt(num) < 10) {
        num = "0" + num
      }
      return num
    },
    //把毫秒数转化成具体日期   2021-06-04 00:00:00
    //参数 毫秒数
    formatMsToDate (ms) {
      if (ms) {
        var oDate = new Date(ms),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            // oSen = oDate.getSeconds(),
            oTime = oYear + '/' + this.addZero(oMonth) + '/' + this.addZero(oDay) + ' ' + this.addZero(oHour) + ':' +
              this.addZero(oMin)
        return oTime
      } else {
        return ""
      }
    },
    timeChange () {
      this.isShowCheckedList = false
      if (this.condition.startTime && this.condition.endTime) {
        let startTime = this.formatMsToDate(this.condition.startTime)
        let endTime = this.formatMsToDate(this.condition.endTime)
        let label = startTime + '~' + endTime
        let temp = {
          isActive: true,
          title: '时间',
          label: label,
          prop: 'dataSource',
          startTime: this.condition.startTime,
          endTime: this.condition.endTime
        }
        this.checkedList = []
        this.checkedList.push(...this.formatCheckedList(this.labelList))
        this.tempList2[0].list = []
        this.tempList2[0].list.push(temp)
      } else {
        this.tempList2[0].list = []
      }
    },
    bodyClick (e) {
      // 点击页面其他地方，关闭过滤选择器
      let newFilterDiv = document.querySelector('.filter')

      if (newFilterDiv && !newFilterDiv.contains(e.target)) {
        this.isShowPanel = false
      }
    },
    triggerPoint () {
      if (!this.isShowClose) { return }
      this.isShowPanel = !this.isShowPanel
      // this.$emit('triggerEvent')
    },
    setChecked (val) {
      this.labelList.forEach(element => {
        element.list.forEach(ele => {
          ele.isActive = false
          const item = val.find(_c => {
            return _c.label === ele.label && _c.prop === element.prop
          })
          if (item) {
            ele.isActive = true
          }
        })
      })
    },

    // 关闭选项
    closeItem (item) {
      if (this.buttonText === '多选') {
        // setTimeout(() => {
        this.labelList.forEach(element => {
          element.list.forEach(_c => {
            if (_c.label === item.label && item.prop === element.prop) {
              _c.isActive = false
            }
          })
        })
        this.dataSourceList.forEach(element => {
          element.list.forEach(_c => {
            if (_c.label === item.label && item.prop === element.prop) {
              _c.isActive = false
            }
          })
        })
        this.tempList2.forEach(element => {
          element.list.forEach(_c => {
            if (_c.label === item.label && item.prop === element.prop) {
              _c.isActive = false
              this.$refs.QuickTimeSelect.startEndTime = []
            }
          })
        })
        this.checkedList = []
        this.checkedList.push(...this.formatCheckedList(this.labelList))
        this.checkedList.push(...this.formatCheckedList(this.dataSourceList))
        this.checkedList.push(...this.formatCheckedList(this.tempList2))
        // }, 0)
      } else {
        // setTimeout(() => {
        this.labelList.forEach(element => {
          element.list.forEach(_c => {
            if (_c.label === item.label && item.prop === element.prop) {
              _c.isActive = false
            }
          })
        })
        this.tempList1.forEach(element => {
          element.list.forEach(_c => {
            if (_c.label === item.label && item.prop === element.prop) {
              _c.isActive = false
              this.checkboxList = []
            }
          })
        })
        this.tempList2.forEach(element => {
          element.list.forEach(_c => {
            if (_c.label === item.label && item.prop === element.prop) {
              _c.isActive = false
              this.$refs.QuickTimeSelect.startEndTime = []
            }
          })
        })
        this.checkedList = []
        this.checkedList.push(...this.formatCheckedList(this.labelList))
        this.checkedList.push(...this.formatCheckedList(this.tempList1))
        this.checkedList.push(...this.formatCheckedList(this.tempList2))
        // }, 0)
      }
      this.$emit('starFilter', this.checkedList)
    },

    // 添加选项
    addItem (index, itemValueIndex, itemValue, prop) {
      this.isShowCheckedList = false
      // index:大分类下标 itemValueIndex：小分类下标
      // console.log(index)
      // console.log('itemValueIndex', itemValueIndex)
      // console.log(itemValue)
      // console.log(prop)
      if (prop === 'dataSource') {
        this.dataSourceList[index].list[itemValueIndex].isActive =
          !this.dataSourceList[index].list[itemValueIndex].isActive
        // 单选
        if (this.radio) {
          this.dataSourceList[index].list.forEach((element, idx) => {
            if (idx !== itemValueIndex) {
              element.isActive = false
            }
          })
        }

        this.checkedList.push(...this.formatCheckedList(this.dataSourceList))
      } else {
        this.labelList[index].list[itemValueIndex].isActive =
          !this.labelList[index].list[itemValueIndex].isActive
        // 单选
        if (this.radio) {
          this.labelList[index].list.forEach((element, idx) => {
            if (idx !== itemValueIndex) {
              element.isActive = false
            }
          })
        }
        this.checkedList = [...this.formatCheckedList(this.labelList)]
      }
    },
    formatCheckedList (formatList) {
      let list = []
      formatList.forEach(element => {
        element.list.forEach(_c => {
          if (_c.isActive && _c.label) {
            list.push({ ..._c, prop: element.prop })
          }
        })
      })
      return list
    },
    startFilter () {
      if (this.buttonText === '多选') {
        this.checkedList = []
        this.checkedList.push(...this.formatCheckedList(this.labelList))
        this.checkedList.push(...this.formatCheckedList(this.dataSourceList))
        this.checkedList.push(...this.formatCheckedList(this.tempList2))
      } else {
        this.checkedList = []
        this.checkedList.push(...this.formatCheckedList(this.labelList))
        this.checkedList.push(...this.formatCheckedList(this.tempList1))
        this.checkedList.push(...this.formatCheckedList(this.tempList2))
      }
      this.isShowPanel = false
      this.isShowCheckedList = true
      this.$emit('starFilter', this.checkedList)
    }
  }
}
</script>

<style lang="less" scoped>
.newFilter {
  display: flex;
  align-items: center;
  .newFilter_icon {
    margin-right: 8px;
    cursor: pointer;
    &.isActive,
    &:hover {
      color: var(--active-color);
    }
    .category_name {
      color: var(--base-text-color-to-333333);
      font-size: 14px;
    }
    .newFilter_icon_img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 8px;
    }
  }

  .newFilter_main {
    margin-left: 32px;
    flex: 1 1 auto;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    .newFilter_main_checkeds {
      display: flex;
      > li {
        // min-width: 108px;
        height: 32px;
        line-height: 32px;
        padding-left: 16px;
        box-sizing: border-box;
        background: var(--checked-option-192035-to-f8f8f8);
        // margin-right: 8px;
        margin-right: 8px;
        color: var(--base-text-color-to-999999);
        font-size: 14px;
        // box-shadow: var(--box-shadow);
        // z-index: 11;
        > span {
          display: inline-block;
          // min-width: 30px;
        }
        .item-label {
          color: var(--active-color);
        }
        > i {
          margin-left: 8px;
          margin-right: 8px;
          color: #878d9b;
          cursor: pointer;
          &:hover {
            color: var(--active-color);
          }
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
.newFilter_mode {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: var(--xuanzeqi-bg-color);
  //border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: var(--box-shadow);
  width: 100%;
  padding: 30px 38px 15px 16px;
  box-sizing: border-box;
  .label_list_item {
    display: flex;
    align-items: center;
    // padding: 12px 0 0 0;
    font-size: 14px;
    margin-bottom: 20px;
    .label {
      width: 30px;
      white-space: nowrap;
      margin-right: 50px;
      color: var(--base-text-color-to-333333);
    }
    .value {
      color: var(--base-text-color-to-333333);
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > .value_item {
        margin-right: 47px;
        white-space: nowrap;
        cursor: pointer;
        // margin-bottom: 15px;
        // border-radius: 20px;
        &:hover {
          // color: #fff;
          // color: #409eff;
          color: var(--active-color);
          // box-shadow: 0px 0px 10px rgba(23, 125, 220) inset;
          // border: 1px solid rgba(23, 125, 220, 0.5);
        }
        &.isActive {
          // box-shadow: 0px 0px 10px rgba(23, 125, 220) inset;
          // border: 1px solid rgba(23, 125, 220, 0.5);
          // color: #fff;
          // color: #409eff;
          color: var(--active-color);
        }
      }
    }
    .switchButton {
      flex: 1;
      .p-button {
        float: right;
        padding: 0px 10px;
        border: 1px solid #525d71;
        box-sizing: border-box;
      }
      .p-button:hover {
        background: transparent;
        color: var(--active-color);
        border: 1px solid var(--active-color);
      }
    }
  }
  .filterButtonBox {
    height: 50px;
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    .filterButton {
      padding: 0px 30px;
      border: 1px solid #177ddc;
      box-sizing: border-box;
    }
    .p-button {
      padding: 0px 30px;
      border: 1px solid #525d71;
      box-sizing: border-box;
    }
    .p-button:hover {
      border: 1px solid var(--active-color);
      color: var(--active-color);
      background: transparent;
    }
  }
}
.labelml21 {
  padding-left: 37px;
}
</style>
