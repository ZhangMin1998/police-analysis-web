<template>
  <div>
    <div class="CusFilter">
      <div :class="['CusFilter_icon', { isActive: isShowPanel }]" @click="triggerPoint">
        <div style="color: #8799bf; font-size: 14px" v-if="categoryName">
          <span style="margin-right: 12px">{{ categoryName }}</span>
          <i v-if="!isShowPanel" class="el-icon-arrow-down"></i>
          <i v-else class="el-icon-arrow-up"></i>
        </div>
        <div v-else>
          <img class="CusFilter_icon_img" src="@/assets/img/icon-filter.png" />
          <span>过滤器</span>
        </div>
      </div>
      <div class="CusFilter_main">
        <ul class="CusFilter_main_checkeds">
          <li v-for="(item, index) in checkedList" :key="index + '_' + item.label">
            <span> {{ item.label }}</span>
            <i class="content-close el-icon-close" v-if="isShowClose" @click="closeItem(item)"></i>
          </li>
        </ul>
      </div>
    </div>
    <transition name="el-zoom-in-top">
      <div
        v-show="isShowPanel"
        class="CusFilter_mode"
        :class="{ labelml21: categoryName }"
        :style="{'top':cusStyle.top}"
      >
        <ul class="label_list">
          <li
            class="label_list_item"
            v-for="(item, index) in labelList"
            :key="index + '_' + item.label"
          >
            <div class="label" v-if="!categoryName">{{ item.label }}：</div>
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
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'CusFilter',
  props: {
    cusStyle: {
      type: Object,
      default: () => {
        return {
          top: '128px'
        }
      }
    },
    isShowClose:{
      type:Boolean,
      default:true
    },
    categoryList: {
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
      isShowPanel: false,
      checkedList: [],
      labelList: []
    }
  },
  computed: {
    // height() {
    //   let top = this.cusStyle.top
    //   const decHeight = parseFloat(top.slice(0, -2)) + 190
    //   return `calc(100vh -  ${decHeight}px)`
    // }
  },
  watch: {
    categoryList: {
      handler (val) {
        this.labelList = [...val]
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
    document.addEventListener('click', this.bodyClick)
  },
  destroyed () {
    document.removeEventListener('click', this.bodyClick)
  },
  methods: {
    bodyClick (e) {
      // 点击页面其他地方，关闭过滤选择器
      if (this.$route.path === "/ol/superSearchDetail") {
        let cusFilterDiv1 = document.querySelector('.CusFilter1')
        let cusFilterDiv2 = document.querySelector('.CusFilter2')
        if (!cusFilterDiv1.contains(e.target) && !cusFilterDiv2.contains(e.target)) {
          this.isShowPanel = false
        }
      } else {
        let cusFilterDiv = document.querySelector('.CusFilter')
        if (cusFilterDiv && !cusFilterDiv.contains(e.target)) {
          this.isShowPanel = false
        }
      }

    },
    triggerPoint () {
      if(!this.isShowClose){return}
      this.isShowPanel = !this.isShowPanel
      this.$emit('triggerEvent')
    },
    setChecked (val) {
      // console.log(val);
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
      if (this.type === 'superSearchDetail' || this.type === 'keyPersonnelBase') {
        setTimeout(() => {
          this.labelList.map(element => {
            element.list.map(_c => {
              if (_c.label === item.label && item.prop === element.prop) {
                _c.isActive = false
              }
            })
          })
          this.checkedList.map(_item => {
            if (_item.label === item.label) {
              _item.isActive = false
            }
          })
          let num = this.checkedList.findIndex(_item => {
            return _item.isActive === false
          })
          // 删除已选中的激活状态为false的
          if (num !== -1) {
            this.checkedList.splice(num, 1)
          }
          this.$emit('closeEvent', item)
        }, 0)
      } else {
        setTimeout(() => {
          this.labelList.forEach(element => {
            element.list.forEach(_c => {
              if (_c.label === item.label && item.prop === element.prop) {
                _c.isActive = false
              }
            })
          })
          this.checkedList = [...this.formatCheckedList()]
          this.$emit('closeEvent', item)
        }, 0)
      }
    },

    // 添加选项
    addItem (index, itemValueIndex, itemValue, prop) {
      // index:大分类下标 itemValueIndex：小分类下标
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
      if (itemValue.label === '全部') {
        if (this.type === 'superSearchDetail') {
          this.checkedList = []
        }
        this.checkedList = this.checkedList.filter((item) => {
          return item.prop !== prop
        })
        this.checkedList.push(
          {
            isActive: true,
            label: itemValue.label,
            prop,
            value: itemValue.value
          }
        )
      }
      else {
        if (this.type === 'superSearchDetail' || this.type === 'keyPersonnelBase') {
          // 选了全部再选其他的时要删除全部这个选项
          let haveTotal = this.checkedList.some(item => {
            return item.label === '全部'
          })
          if (haveTotal && itemValueIndex) {
            this.checkedList.splice(0, 1)
          }

          // 再次点击更改激活状态
          this.checkedList.map(item => {
            if (item.label === itemValue.label) {
              item.isActive = !item.isActive
            }
          })
          let num = this.checkedList.findIndex(item => {
            return item.isActive === false
          })

          // 删除已选中的激活状态为false的
          if (num !== -1) {
            this.checkedList.splice(num, 1)
          }

          // 已选中的去重，防止重复添加
          let checkDuplicate = this.checkedList.some(item => {
            return item.label === itemValue.label
          })
          if (itemValue.isActive && itemValue.label !== '全部' && !checkDuplicate) {
            this.checkedList.push({ ...itemValue, prop: prop })
          }
        } else {
          this.checkedList = [...this.formatCheckedList()]
        }
      }
      this.$emit('addEvent', itemValue)
    },
    formatCheckedList () {
      let list = []
      this.labelList.forEach(element => {
        element.list.forEach(_c => {
          if (this.type === 'allSingle') { //数据中心-防疫数据
            if (_c.isActive && _c.label) {
              list.push({ ..._c, prop: element.prop })
            }
          } else {
            if (_c.isActive && _c.label !== '全部') {
              list.push({ ..._c, prop: element.prop })
            }
          }
        })
      })
      return list
    }
  }
}
</script>

<style lang="less" scoped>
// .filter{
//   position: relative;
// }
.CusFilter {
  display: flex;
  align-items: center;
  .CusFilter_icon {
    margin-right: 8px;
    cursor: pointer;
    &.isActive,
    &:hover {
      color: #409eff;
    }
    .CusFilter_icon_img {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 8px;
    }
  }

  .CusFilter_main {
    margin-left: 32px;
    flex: 1 1 auto;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    .CusFilter_main_checkeds {
      display: flex;
      > li {
        min-width: 108px;
        height: 32px;
        line-height: 32px;
        padding-left: 16px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.12);
        margin-right: 8px;
        color: var(--base-text-color-1);
        font-size: 14px;
        > span {
          display: inline-block;
          min-width: 70px;
        }
        > i {
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
.CusFilter_mode {
  position: absolute;
  // top: 108px;
  left: 0;
  z-index: 99;
  background-color: var(--daochu-bg-color);
  border: 2px solid rgba(255, 255, 255, 0.06);
  width: 100%;
  padding: 30px 16px 15px 16px;
  box-sizing: border-box;
  .label_list {
    .label_list_item {
      display: flex;
      // align-items: center;
      // padding: 12px 0 0 0;
      font-size: 14px;
      .label {
        white-space: nowrap;
        margin-right: 28px;
        color: var(--base-text-color-to-999999);
      }
      .value {
        color: var(--base-text-color-to-999999);
        display: flex;
        flex-wrap: wrap;
        > .value_item {
          margin-right: 47px;
          white-space: nowrap;
          cursor: pointer;
          margin-bottom: 15px;
          // border-radius: 20px;
          &:hover {
            color: #fff;
            // box-shadow: 0px 0px 10px rgba(23, 125, 220) inset;
            // border: 1px solid rgba(23, 125, 220, 0.5);
          }
          &.isActive {
            // box-shadow: 0px 0px 10px rgba(23, 125, 220) inset;
            // border: 1px solid rgba(23, 125, 220, 0.5);
            color: #fff;
          }
        }
      }
    }
  }
}
.labelml21 {
  padding-left: 37px;
}
</style>
