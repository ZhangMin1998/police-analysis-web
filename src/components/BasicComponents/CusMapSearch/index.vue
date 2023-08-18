<template>
  <div class="CusAddressSearch">
    <!-- 搜索 普通搜索 -->
    <el-input
      v-model="cusInput.searchKey"
      :placeholder="cusInput.placeholder"
      @keyup.enter.native="handleSearch"
    >
      <template v-slot:suffix>
        <div class="CusAddressSearch_icon">
          <div v-show="cusInput.searchKey.length">
            <i class="el-icon-close" @click="handleClear"></i>
          </div>
          <div @mouseover="isHover = true" @mouseleave="isHover = false">
            <img
              class="CusAddressSearch_icon_img"
              :src="
                require(`@/assets/components/CusAddressSearch_icon_1${
                  isHover ? '_hover' : ''
                }.png`)
              "
              alt="搜索"
              @click.prevent.stop="handleSearch"
            />
          </div>
        </div>
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'CusMapSearch',
  props: {
    cusStyle: {
      type: Object,
      default: () => {
        return {
          width: '400px',
          height: '40px'
        }
      }
    },
    cusInput: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isHover: false
    }
  },
  methods: {
    // nor 搜索
    handleSearch () {
      this.$emit('handleSearch')
    },

    // 清空搜索值
    handleClear () {
      this.$emit('handleClear')
    }
  }
}
</script>

<style lang="less" scoped>
.CusAddressSearch {
  width: 400px;
  height: 100% !important;
  // background-color: rgba(39, 52, 77, 0.87);
  // background-color: var(--bg-color-2);
  background: var(--car-right-chuangkou-hearder-bg);
  .CusAddressSearch_icon {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 60px;
    .el-icon-close {
      font-size: 18px;
      cursor: pointer;
      color: var(--base-text-color-to-999999);
      &:hover {
        color: #228ffe;
      }
    }
    .CusAddressSearch_icon_img {
      cursor: pointer;
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }
  }
}

/deep/.el-input__inner {
  border-radius: 0 !important;
  border: 2px solid rgba(255, 255, 255, 0.0588235294117647) !important;
  &:hover {
    border-color: rgba(34, 143, 254, 0.6) !important;
  }
  &:focus {
    border-color: #228ffe !important;
  }
}
/deep/.el-input--suffix .el-input__inner {
  padding-right: 60px !important;
}
</style>
