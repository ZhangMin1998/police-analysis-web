<template>
  <div>
    <pop :pop.sync="pop" @beforeClose="hideCheckDetail" @beforeOpen="showCheckDetail" :exportDialog='true'>
      <el-checkbox-group v-model="checkList">
        <div class='item' v-for="item in allCols" :key="item.label">
          <div class='tip_info'>{{ item.label + '：' }}</div>
          <div class="checkboxList">
            <el-checkbox
              :label="colitem.label"
              v-for="colitem in item.list"
              :key="colitem.prop"
            ></el-checkbox>
          </div>
        </div>
        <div class='division'></div>
      </el-checkbox-group>
      <div class='total'>
        <div class='tip_info'>总数：</div>
        <div class='num'>{{ `共计${totalData}条数据` }}</div>
      </div>
      <template slot='btn'>
        <div class='blank_button' @click='hideCheckDetail'>取消</div>
        <el-button type="primary" class="btn" @click='submit'>确定</el-button>
      </template>
    </pop>
  </div>
</template>

<script>
import Pop from '@/components/BasicComponents/Dialog'
import exportUtils from '@/utils/exportUtils.js'

export default {
  name: 'CusExport',
  components: {
    Pop
  },
  props: {
    exportShow: {
      type: Boolean,
      default: false
    },
    allCols: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    },
    fileName: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: 'post'
    },
    // 总数
    totalData: {
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
      pop: {
        show: false,
        title: '导出',
        width: '1024px',
        top: '200px',
        btn: [
          { text: '取消', event: this.hideCheckDetail, type: 'nor' },
          { text: '确定', event: this.submit, type: 'nor' }
        ]
      },
      checkList: [],
      allCheck: [],
      exportParams: {}
    }
  },
  watch: {
    exportShow (newValue) {
      newValue ? this.showCheckDetail() : this.hideCheckDetail()
    },
    params: {
      handler: function (val) {
        this.exportParams = { ...val }
        this.exportParams.pageNum = 1
        this.exportParams.pageSize = 1000
      },
      immediate: true, //关键
      deep: true
    }
  },

  created () {
    this.allCheck = this.defaultCheckList()
    this.checkList = this.allCheck.map(_c => _c.label)
  },
  methods: {
    defaultCheckList () {
      let list = []
      this.allCols.forEach(ele => {
        ele.list.forEach(_c => {
          list.push(_c)
        })
      })
      return list
    },
    showCheckDetail () {
      this.pop.show = true
    },

    hideCheckDetail () {
      this.pop.show = false
      this.$emit('update:exportShow', false)

      this.checkList = this.allCheck.map(_c => _c.label)
    },

    submit () {
      const list = this.allCheck.filter(_c => this.checkList.includes(_c.label))
      const propList = list.map(_c => _c.prop)
      const newParams = { ...this.exportParams, exportColumns: propList }
      this.exportReq(this.url, newParams)
    },

    exportReq (url, params) {
      const reqObj = {
        method: this.method,
        url: url,
        fileName: this.fileName
      }
      reqObj[this.method === 'post' ? 'data' : 'params'] = params
      //调用封装方法
      exportUtils.exportMethod(reqObj).finally(() => {
        this.hideCheckDetail()
      })
    }
  }
}
</script>

<style lang="less" scoped >
.total {
  display: flex;
  line-height: 22px;
  margin: 30px 0 24px;
  .num {
    font-size: 16px;
    color: var(--base-text-color-1);
  }
}
.item {
  display: flex;
  line-height: 22px;
}
.tip_info {
  font-size: 16px;
  color: var(--base-text-color-to-999999);
  flex: none;
}
/deep/.el-checkbox {
  margin-bottom: 24px;
  margin-right: 40px;
}
/deep/.el-dialog {
  background: var(--daochu-bg-color) !important;
  border: 2px solid rgba(255, 255, 255, .06);
  .el-dialog__header {
    padding: 16px !important;
    .el-dialog__headerbtn {
      top: 16px;
      right: 16px;
    }
  }
  .el-dialog__body {
    padding: 0 43px 26px 37px !important;
  }
}
/deep/.el-checkbox__inner {
  width: 16px;
  height: 16px;
}
/deep/.el-checkbox__input.is-checked {
  .el-checkbox__inner {
    background: var(--active-color) !important;
    border: 0 !important;
    &::after {
      border-color: @font-color-3 !important;
      top: 3px;
      left: 6px;
      height: 6px;
    }
  }
}
/deep/.el-checkbox__input.is-checked+.el-checkbox__label {
  color: var(--base-text-color-1) !important;
}
/deep/.el-checkbox__label {
  font-size: 16px;
  padding-left: 8px;
}
.division {
  position: absolute;
  bottom: -4px;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.12)
}
/deep/.el-checkbox-group {
  position: relative;
  .item {
    max-height: 360px;
    overflow-y: auto;
  }
}
.blank_button {
  margin-right: 16px;
}
</style>
