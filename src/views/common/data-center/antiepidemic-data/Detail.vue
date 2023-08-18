<template>
  <div
    class="box"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="#21283E"
  >
    <div>
      <el-row v-show="!loading" :gutter="20" v-for="(i, index) in topArr" :key="index + 1">
        <el-col :span="8" v-for="item in i" :key="item.val">
          <popover-show
            :words="20"
            :colKey="item.key + '：'"
            :val="rowobj[item.val]"
          ></popover-show>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import PopoverShow from '@/components/VisualComponents/Form/PopoverShow'

const topList = [
  {
    key: '姓名',
    val: 'name'
  },
  {
    key: '性别',
    val: 'sex'
  },
  {
    key: '民族',
    val: 'nationRecon'
  },
  {
    key: '出生日期',
    val: 'birthday'
  },
  {
    key: '证件类型',
    val: 'certificationType'
  },
  {
    key: '证件号码',
    val: 'certificationCode'
  },
  {
    key: '国籍',
    val: 'nativePlace'
  },

  {
    key: '联系电话',
    val: 'phone'
  },
  {
    key: '户籍地址',
    val: 'houseAddr'
  },

  {
    key: '进入时间',
    val: 'inTimeStr'
  },
  {
    key: '出发时间',
    val: 'startTimeStr'
  },
  {
    key: '入库时间',
    val: 'inBaseTimeStr'
  },

  {
    key: '创建时间',
    val: 'createTime'
  },
  {
    key: '申请人',
    val: 'name'
  },
  {
    key:'申请人联系方式',
    val:'phone'
  },
  {
    key: '修改时间',
    val: 'updateTime'
  },
  {
    key: '与其关系',
    val: 'relative'
  },
  {
    key:'出发地',
    val:''
  },
  {
    key:'目的地',
    val:''
  }
]
export default {
  components: {
    PopoverShow
  },
  props: {
    rowobj: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      loading: true,
      row: {},
      topList: topList,
      topArr: []
    }
  },
  created () {
    for (var i = 0; i < this.topList.length; i += 3) {
      this.topArr.push(this.topList.slice(i, i + 3))
    }

    this.loading = false
  }
}
</script>

<style lang="less" scoped>
.box {
  min-height: 350px;
}
.h2 {
  line-height: 32px;
  font-size: 18px;
  font-weight: bold;
  color: var(--base-text-color-1);
  padding-bottom: 15px;
}
.h3 {
  line-height: 32px;
  font-size: 18px;
  font-weight: bold;
  color: var(--base-text-color-1);
  padding: 15px 0;
}
.rowFlex {
  display: flex;
  font-size: 16px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.key {
  min-width: 100px;
  color: var(--base-text-color-to-999999);
}
.val {
  color: var(--base-text-color-1);
}
</style>
