<template>
  <div>
    <div class="newFilter">
      <div :class="['newFilter_icon', { isActive: isShowPanel }]" @click="triggerPoint">
        <div style="color: #8799bf; font-size: 14px" v-if="categoryName">
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
        <ul class="newFilter_main_checkeds">
          <li v-for="(item, index) in checkedList" :key="index + '_' + item.label">
            <span> {{ item.title }}：</span>
            <span class="item-label"> {{ item.label }}</span>
            <i
              class="content-close el-icon-close"
              v-if="isShowClose"
              @click.prevent="closeItem(item)"
            ></i>
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
          <div class='filter_item' :class='{"other-line-height": item.canChangeWay}'>
            <div class="label">{{ item.label }}：</div>
            <div class="value">
              <div
                :class="['value_item', { isActive: itemValue.isActive }]"
                v-for="(itemValue, itemValueIndex) in item.list"
                :key="itemValueIndex + '_' + itemValue.label"
                @click="addItem(index, itemValueIndex, itemValue, item.prop, item.isRadio)"
              >
                <div class='check_box' v-if='item.canChangeWay && !item.isRadio' :class='{active: itemValue.isActive}'></div>
                <span>{{ itemValue.label }}</span>
              </div>
            </div>
          </div>
          <div class='change_choice_way' v-if='item.canChangeWay' @click='changeChoiceWay(item)'>
            {{ item.isRadio ? '多选' : '单选' }}
          </div>
        </div>
        <div class='label_list_item'>
          <slot name='specialFilter'></slot>
        </div>
        <div class="filterButtonBox">
          <div class="p-button" @click="startFilter">过滤</div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: 'FilterItem',
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
      checkboxList: [],
      isShowPanel: false,
      isShowCheckedList: false,
      checkedList: [],
      labelList: [],
      // 每次点击过滤后保存下选择的状态与选中值
      tempCheckedList: [],
      tempLabelList: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.labelList = JSON.parse(JSON.stringify(this.categoryList))
    })
    document.addEventListener('click', this.bodyClick)
  },
  destroyed () {
    document.removeEventListener('click', this.bodyClick)
  },
  methods: {
    changeChoiceWay (item) {
      item.isRadio = !item.isRadio
      if (item.isRadio) {
        item.list.forEach(info => {
          info.isActive = false
        })
      }
    },
    bodyClick (e) {
      // 点击页面其他地方，关闭过滤选择器
      let newFilterDiv = document.querySelector('.filter')
      if (newFilterDiv && !newFilterDiv.contains(e.target) && this.isShowPanel) {
        this.isShowPanel = false
        this.$nextTick(() => {
          this.labelList = JSON.parse(JSON.stringify(this.tempLabelList))
          this.checkedList = JSON.parse(JSON.stringify(this.tempCheckedList))
          // this.isShowCheckedList = true
        })
      }
    },
    triggerPoint () {
      if (!this.isShowClose) { return }
      this.isShowPanel = !this.isShowPanel
      this.$nextTick(() => {
        // this.labelList = this.tempLabelList.length ? [...this.tempLabelList] : [...this.categoryList]
        this.labelList = this.tempLabelList.length ? JSON.parse(JSON.stringify(this.tempLabelList)) : JSON.parse(JSON.stringify(this.categoryList))
      })
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
      this.labelList.forEach(element => {
        if (element.label === item.title) {
          element.list.forEach(_c => {
            _c.isActive = false
          })
        }
      })
      this.tempLabelList = JSON.parse(JSON.stringify(this.labelList))

      let temp = this.checkedList.filter(_c => {
        return _c.title !== item.title
      })

      this.checkedList = JSON.parse(JSON.stringify(temp))
      this.tempCheckedList = JSON.parse(JSON.stringify(this.checkedList))
      this.$emit('startFilter', this.checkedList)
    },

    // 添加选项
    addItem (index, itemValueIndex, itemValue, prop, isRadio) {
      if (isRadio) {
        if (this.labelList[index].list[itemValueIndex].isActive) {
          this.labelList[index].list[itemValueIndex].isActive = false
        } else {
          this.labelList[index].list.forEach(item => {
            item.isActive = false
          })
          this.labelList[index].list[itemValueIndex].isActive = true
        }
      } else {
        this.labelList[index].list[itemValueIndex].isActive =
          !this.labelList[index].list[itemValueIndex].isActive
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
      this.checkedList = []
      // let label1Arr = []
      // let label2Arr = []
      // let value1Arr = []
      // let value2Arr = []
      // console.log('xxxx', this.labelList)
      // this.labelList[0].list.map(item => {
      //   if (item.isActive) {
      //     label1Arr.push(item.label)
      //     value1Arr.push(item.value)
      //   }
      // })
      // this.labelList[1].list.map(item => {
      //   if (item.isActive) {
      //     label2Arr.push(item.label)
      //     value2Arr.push(item.value)
      //   }
      // })
      //
      // let checkObject1 = {
      //   title: this.labelList[0].label,
      //   label: label1Arr.toString(),
      //   value: value1Arr.toString()
      // }
      // let checkObject2 = {
      //   title: this.labelList[1].label,
      //   label: label2Arr.toString(),
      //   value: value2Arr.toString()
      // }
      // if (checkObject1.label !== '') {
      //   this.checkedList.push(checkObject1)
      // }
      // if (checkObject2.label !== '') {
      //   this.checkedList.push(checkObject2)
      // }

      this.labelList.forEach(item => {
        if (item.list) {
          let isActiveList = []
          item.list.forEach(option => {
            if (option.isActive) {
              isActiveList.push({
                label: option.label,
                value: option.value
              })
            }
          })
          if (isActiveList.length) {
            let labelStr = isActiveList.map(lab => lab.label).join(',')
            let valueStr = isActiveList.map(lab => lab.value).join(',')
            this.checkedList.push({
              label: labelStr,
              value: valueStr,
              title: item.label,
              prop: item.prop
            })
          }
        }
      })

      this.isShowPanel = false
      this.isShowCheckedList = true
      this.tempLabelList = JSON.parse(JSON.stringify(this.labelList))
      this.tempCheckedList = JSON.parse(JSON.stringify(this.checkedList))
      this.$emit('startFilter', this.checkedList)
    }
  }
}
</script>

<style lang="less" scoped>
.newFilter {
  display: flex;
  align-items: center;
  overflow: hidden;
  .newFilter_icon {
    margin-right: 8px;
    cursor: pointer;
    flex: none;
    &.isActive,
    &:hover {
      color: var(--active-color);
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
        // background: var(--bg-color-2);
        background: var(--checked-option-192035-to-f8f8f8);
        margin-right: 8px;
        color: var(--base-text-color-to-999999);
        font-size: 14px;
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
            color: #409eff;
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
  box-shadow: var(--box-shadow);
  //border: 1px solid rgba(255, 255, 255, 0.06);
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  .label_list_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 12px 0 0 0;
    font-size: 14px;
    margin-bottom: 16px;
    .filter_item {
      display: flex;
      line-height: 22px;
      &.other-line-height {
        line-height: 28px;
      }
    }
    .label {
      flex: none;
      font-size: 16px;
      white-space: nowrap;
      margin-right: 16px;
      color: var(--base-text-color-to-999999);
    }
    .value {
      color: var(--base-text-color-to-999999);
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > .value_item {
        display: flex;
        align-items: center;
        margin-right: 47px;
        white-space: nowrap;
        cursor: pointer;
        .check_box {
          position: relative;
          width: 14px;
          height: 14px;
          box-sizing: border-box;
          border: 1px solid #5D6C8C;
          border-radius: 2px;
          margin-right: 8px;
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
              top: 1px;
              left: 4px;
            }
          }
        }
        // margin-bottom: 15px;
        // border-radius: 20px;
        &:hover {
          // color: #fff;
          color: var(--active-color);
          // box-shadow: 0px 0px 10px rgba(23, 125, 220) inset;
          // border: 1px solid rgba(23, 125, 220, 0.5);
        }
        &.isActive {
          // box-shadow: 0px 0px 10px rgba(23, 125, 220) inset;
          // border: 1px solid rgba(23, 125, 220, 0.5);
          // color: #fff;
          color: var(--active-color);
        }
      }
    }
    .change_choice_way {
      flex: none;
      width: 56px;
      box-sizing: border-box;
      border: 1px solid var(--border-color-input);
      border-radius: 2px;
      font-size: 14px;
      line-height: 26px;
      color: var(--base-text-color-1);
      cursor: pointer;
      text-align: center;
    }
    .switchButton {
      flex: 1;
      .p-button {
        float: right;
        padding: 0px 10px;
        border: 1px solid #177ddc;
        box-sizing: border-box;
      }
    }
  }
  .filterButtonBox {
    height: 50px;
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    .filterButton {
      padding: 0px 30px;
      border: 1px solid #177ddc;
      box-sizing: border-box;
    }
    .p-button {
      padding: 0px 19px;
      border: 1px solid var(--border-color-input);
      border-radius: 2px;
      line-height: 30px;
      box-sizing: border-box;
    }
    .p-button:hover {
      border: 1px solid var(--active-color);
      background: transparent;
      color: var(--active-color);
    }
  }
}
.labelml21 {
  padding-left: 24px;
}
</style>
