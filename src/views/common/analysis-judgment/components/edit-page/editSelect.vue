<template>
  <el-select
    v-model="value"
    :placeholder="placeholder"
    :clearable='clearable'
    :class='{
      "have_value": value
    }'
    class='sort_item'
    @change='$emit("selectChange")'
    @visible-change='visibleChange'
  >
    <el-option
      v-for='opt in options'
      :key='opt.value'
      :label='opt.label'
      :value='opt.value'
      :disabled='opt.disabled'
      @click.native='handleItem(opt)'
    >
      <div class='sort_option'>
        <i :class='[ "iconfont", opt.icon ]'></i>
        <div class='sort_label'>{{ opt.label }}</div>
      </div>
    </el-option>
    <i slot='prefix' :class='[ "iconfont", modelIcon ]'></i>
  </el-select>
</template>

<script>
export default {
  name: 'EditSelect',
  props: {
    modelValue: {
      type: String,
      default: ''
    }, // 下拉框绑定的值
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modelIcon: '', // 下拉选中项的图标
    }
  },
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch: {
    value: {
      handler (newVal) {
        if (!newVal) this.modelIcon = ''
        let currentItem = this.options.find(item => item.value === newVal)
        currentItem && (this.modelIcon = currentItem.icon)
      },
      immediate: true
    }
  },
  methods: {
    handleItem (opt) {
      this.$emit('handleItem', opt)
    },
    visibleChange (bool) {
      this.$emit('visibleChange', bool)
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.sort_item {
  width: 100%;
  margin-right: 12px;
  /deep/.el-input {
    height: 32px;
    line-height: 32px;
    .el-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      border-color: var(--border-color-input);
      &::placeholder {
        font-size: 14px;
      }
      &:hover {
        border-color: var(--border-color-input-hover);
      }
    }
  }

  /deep/.el-input__inner {
    padding-left: 12px !important;
  }

  // @-moz-document url-prefix(){
  //   ::v-deep .el-input__inner {
  //     padding-left: 16px !important;
  //   }
  // }
  /deep/.el-input__prefix {
    left: 12px;
    line-height: 14px;
    padding-top: 10px;
    i {
      font-size: 14px;
      color: var(--return-back-i-color);
    }
    .icon-a-zu5742 {
      color: #2CB5E8;
    }
    .icon-a-zu5757 {
      color: #27CC91;
    }
    .icon-a-zu5759 {
      color: #F8BC3C;
    }
  }
  /deep/.el-icon-circle-close {
    margin-top: 0;
  }
}
.have_value {
  /deep/.el-input__inner {
    padding-left: 32px !important;
  }
}
.sort_option {
  display: flex;
  align-items: center;
  i {
    font-size: 16px;
    line-height: 16px;
    margin-right: 8px;
  }
}
.icon-a-zu5742 {
  color: #2CB5E8;
}
.icon-a-zu5757 {
  color: #27CC91;
}
.icon-a-zu5759 {
  color: #F8BC3C;
}
</style>
