<template>
  <div class="PickArea" :style="$attrs.cusStyle">
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
        <div>如果不添加系统默认所有场所</div>
      </li>
      <li v-show="deviceTypeList.length && placeList.length">
        <CusButton
          :btnList="[
            {
              text: '清除区域',
              type: 'button',
              event: this.handleClear
            }
          ]"
        ></CusButton>
      </li>
    </ul>
    <div class="PickArea_result" v-show="deviceTypeList.length && placeList.length">
      <ul>
        <li>
          <div class="PickArea_result_label">场所名称（{{ placeList.length }}）</div>
          <ul class="PickArea_result_value">
            <li v-for="item in placeList" :key="item">{{ item }}</li>
          </ul>
        </li>
        <li>
          <div class="PickArea_result_label">设备采集类型（{{ deviceTypeList.length }}）</div>
          <ul class="PickArea_result_value">
            <li v-for="item in deviceTypeList" :key="item">{{ item }}</li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="footer"><CusButton :btnList="btnList"></CusButton></div>
  </div>
</template>

<script>
import CusButton from '@/components/BasicComponents/CusButton'

export default {
  name: 'PickArea',
  components: { CusButton },
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    btnList: {
      type: Array,
      default: () => []
    },
    deviceTypeList: {
      type: Array,
      default: () => []
    },
    placeList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  methods: {
    changeDrawer () {
      this.$emit('changeDrawer')
    },
    handleClear () {
      this.$emit('handleClear')
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1000px) and (max-width: 1365px) {
  .PickArea {
    height: calc(100vh - 510px);
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .PickArea {
    height: calc(100vh - 460px);
  }
}
@media screen and (min-width: 1920px) {
  .PickArea {
    height: calc(100vh - 460px);
  }
}
.PickArea {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  font-size: 16px;
  color: var(--base-text-color-to-999999);
  overflow-y: auto;
  .PickArea_icon {
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

.footer {
  position: absolute;
  right: 16px;
  bottom: 24px;
}
</style>
