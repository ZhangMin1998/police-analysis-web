<template>
  <div id="sms">
    <div class="myItem">
      <div class="label">短信模板：</div>
      <div class="content">
        {{ messageTemplate }}
      </div>
    </div>
    <div class="myItem">
      <div class="label">短信模板：</div>
      <div class="content">
        <el-transfer
          v-model="value"
          :data="personList"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入人员姓名"
          :titles="['所有人员', '已选择']"
        ></el-transfer>
      </div>
    </div>
    <div class="right formBtn">
      <div class="submitButton cancle" @click="close">取消</div>
      <el-button type="primary" class="submitButton" @click="submit" :loading="loadingbut">{{
        loadingbut ? '提交中...' : '确定'
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { queryClue_phone } from '@/api/warn'

// const smsType = {
// 1:'聚集预警',
// 2:'特征预警',
// 3:'手机预警'，
// 4:'一机多号',
// 5:'一机多卡',
// }

export default {
  props: {
    smsType: {
      type: [Number, String]
    }
  },
  data () {
    return {
      loadingbut: false,
      messageTemplate: '',
      personList: [],
      value: [],
      filterMethod (query, item) {
        return item.search.indexOf(query) > -1
      }
    }
  },

  mounted () {
    this.queryTemData()
  },
  methods: {
    /** 查询模板 数据  */
    queryTemData () {
      queryClue_phone(this.smsType).then(res => {
        this.messageTemplate = res.messageTemplate
        this.personList = this.generateData(res.userList)
      })
    },

    /** 处理人员list  */
    generateData (list) {
      return list.map(i => {
        return {
          label: i.realName + ' ' + (i.phone || ''),
          key: i.id,
          search: i.realName,
          id: i.id
        }
      })
    },

    /** 设置确定状态  */
    setLoadingbut (boolean) {
      this.loadingbut = boolean
    },

    /** 确定  */
    submit () {
      this.$emit('submit', this.value)
    },

    /** 取消  */
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
#sms {
  margin: 0 auto;
  .myItem {
    display: flex;
    margin-bottom: 24px;
    .label {
      color: var(--base-text-color-to-999999);
      margin-right: 14px;
    }
    .content {
      color: var(--base-text-color-1);
      line-height: 22px;
      flex: 1 1 auto;
    }
  }
}
.right {
  &.formBtn {
    display: flex;
    justify-content: flex-end;
  }
  .submitButton {
    padding: 8px 20px;
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: inline-block;
    color: @font-color-3;
    &.cancle {
      margin-right: 8px;
      border-radius: 4px;
      cursor: pointer;
    }
    &:hover {
      background-color: #177ddc;
    }
  }
}
</style>
