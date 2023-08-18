<template>
  <div class="PickArea">
    <el-radio-group v-model="radio" @change="handleChange">
      <div><el-radio :label="1">实时监控</el-radio></div>
      <div><el-radio :label="2">跟踪最后位置</el-radio></div>
    </el-radio-group>

    <div class="pickArea_main" v-show="radio === 2">
      <Tabs :tabs.sync="tabs" @handleClick="tabsHandleClick"></Tabs>

      <ul class="PickArea_icon">
        <li @click="changeDrawer">
          <div>
            <i :class="['el-icon-edit-outline', { isActive: isActive }]"></i>
          </div>
          <div>绘制工具</div>
        </li>
        <li>
          <div><i class="el-icon-warning-outline"></i></div>
          <div>点击工具即可在地图上绘出范围。</div>
        </li>
        <li>
          <div><i class="el-icon-warning-outline"></i></div>
          <div>若不选择位置将全图跟踪。</div>
        </li>
      </ul>

      <ul class="results" v-show="list.length">
        <li v-for="(item, index) in list" :key="index" :id="item.id">
          <div class="PickArea_result" @click="handleClick(item.id)">
            <div class="PickArea_result_del" @click.stop="handleDel(item.id)">
              <i class="el-icon-delete"></i>
            </div>
            <ul>
              <li>
                <div class="PickArea_result_label">场所名称（{{ item.placeNameList.length }}）</div>
                <ul class="PickArea_result_value">
                  <li v-for="placeItem in item.placeNameList" :key="placeItem">{{ placeItem }}</li>
                </ul>
              </li>
              <li>
                <div class="PickArea_result_label">
                  设备采集类型（{{ item.deviceTypeList.length }}）
                </div>
                <ul class="PickArea_result_value">
                  <li v-for="deviceItem in item.deviceTypeList" :key="deviceItem">
                    {{ deviceItem }}
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div class="footer"><CusButton :btnList="btnList"></CusButton></div>
  </div>
</template>

<script>
import CusButton from '@/components/BasicComponents/CusButton'
import Tabs from '@/components/BasicComponents/CustomTab'

export default {
  name: 'PickArea',
  components: { CusButton, Tabs },
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    btnList: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    innerOrOuter: {
      type: String,
      default: 'inner'
    }
  },
  data () {
    return {
      radio: 1,
      tabs: {
        list: [
          {
            label: '进入区域',
            name: 'inner'
          },
          {
            label: '离开区域',
            name: 'outer'
          }
        ],
        activeName: 'inner'
      }
    }
  },
  watch: {
    innerOrOuter (val) {
      if (!val) return
      this.tabs.activeName = val
    }
  },
  methods: {
    changeDrawer () {
      this.$emit('changeDrawer')
    },
    handleChange (val) {
      this.radio = val
    },
    tabsHandleClick (tab) {
      if (this.list.length > 0) {
        this.$messageTip.error('当前区域为空可切换进行操作！')
        return false
      }
      this.$emit('update:innerOrOuter', tab.name)
    },
    handleDel (id) {
      this.$emit('handleDel', id)
    },
    handleClick (id) {
      this.$emit('handleClick', id)
    },
    scrollIntoView (id) {
      document.getElementById(id)?.scrollIntoView()
    }
  }
}
</script>

<style lang="less" scoped>
.el-radio-group {
  & > div {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
}
.PickArea {
  height: calc(100vh - 460px);
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  font-size: 16px;
  color: var(--base-text-color-to-999999);
  overflow-y: auto;
  .pickArea_main {
    min-height: calc(100vh - 595px);
    .PickArea_icon {
      padding-top: 24px;
      & > li {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        i {
          margin-right: 6px;
          &.el-icon-edit-outline {
            cursor: pointer;
            &.isActive,
            &:hover {
              color: #1890ff;
            }
          }
        }
      }
    }
    .PickArea_result {
      padding: 2px 12px 12px 12px;
      box-sizing: border-box;
      height: 75%;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      font-size: 14px;
      overflow-y: auto;
      position: relative;
      .PickArea_result_del {
        cursor: pointer;
        position: absolute;
        right: 12px;
        top: 10px;
        font-size: 18px;
        &:hover {
          color: #1890ff;
        }
      }
      .PickArea_result_label {
        color: var(--base-text-color-to-999999);
        padding: 10px 0 4px 0;
      }
      .PickArea_result_value {
        color: var(--base-text-color-1);
        line-height: 22px;
        display: flex;
        flex-wrap: wrap;
        max-height: 200px;
        overflow-y: auto;
        & > li {
          margin-right: 24px;
        }
      }
    }
  }
}

.footer {
  padding-top: 32px;
}

.results {
  & > li {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
