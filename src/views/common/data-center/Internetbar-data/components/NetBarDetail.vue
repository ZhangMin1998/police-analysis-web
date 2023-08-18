<template>
  <div class='net_bar_detail'>
    <div class='item_wrap'>
      <div class='tip_info'>{{ row.netBarName || '--' }}</div>
      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>内网终端IP：</div>
          <div class='info info_five'>{{ row.insideIp || '--' }}</div>
        </el-col>
        <el-col :span='16'>
          <div class='tip item_label'>公网IP：</div>
          <div class='info item_label_value'>{{ row.outsideIp || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>姓名：</div>
          <div class='info info_five'>{{ row.realName || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>证件类型：</div>
          <div class='info item_label_value'>{{ row.idCardType || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>证件号码：</div>
          <div class='info item_label_value'>{{ row.idCardNumber || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>上机时间：</div>
          <div class='info info_five'>{{ row.onTimestampStr || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>经度：</div>
          <div class='info item_label_value'>{{ row.longitude || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>纬度：</div>
          <div class='info item_label_value'>{{ row.latitude || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <div class='tip tip_five'>网吧地址：</div>
          <div class='info info_five'>{{ row.address || '--' }}</div>
        </el-col>
      </el-row>
    </div>
    <div class='item_wrap' v-if='bottomList.length'>
      <div class='tip_info'>软件名称及账号</div>
      <el-row v-for='(item, index) in bottomList' :key='index'>
        <el-col :span='8' v-for='(val, ind) in item' :key='ind'>
          <div :class='val.tipClassName'>{{ val.key }}</div>
          <div :class='val.infoClassName'>{{ val.value || '--' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import { netBarById } from '@/api/dataCenter'

export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      bottomList: [],
    }
  },
  created () {
    if (this.row.appInfoStr && this.row.account) {
      let name = this.row.appInfoStr.split(';')
      let value = this.row.account.split(';')
      name.forEach((item, index) => {
        let val = Math.floor(index / 3)
        if (this.bottomList[val]) {
          this.bottomList[val].push({
            key: item + '：',
            value: value[index],
            tipClassName: 'tip item_label',
            infoClassName: 'info item_label_value'
          })
        } else {
          this.bottomList.push([{
            key: item + '：',
            value: value[index],
            tipClassName: 'tip tip_five',
            infoClassName: 'info info_five'
          }])
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.net_bar_detail {
  padding-right: 12px;
  font-size: 16px;
  color: var(--base-text-color-1);
  .item_wrap{
    margin-bottom: 29px;
    &:last-child {
      margin-bottom: 0;
    }
    .tip_info {
      margin-bottom: 13px;
      font-weight: bold;
    }
  }
}
/deep/.el-row {
  margin-bottom: 13px;
  line-height: 22px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    display: flex;
    .tip {
      color: var(--base-text-color-to-999999);
      width: 80px;
      white-space: nowrap;
    }
    .tip_five {
      width: 94px;
    }
    .info {
      width: calc(100% - 104px);
    }
    .info_five {
      width: calc(100% - 118px);
    }
  }
  .el-col:last-child {
    .info {
      width: calc(100% - 80px);
    }
    .info_five {
      width: calc(100% - 104px);
    }
  }
}
@media only screen and (max-width: 1440px) {
  /deep/.el-col {
    .item_label {
      width: 58px !important;
    }
    .item_label_value {
      width: calc(100% - 70px) !important;
    }
    &:last-child {
      .item_label_value {
        width: calc(100% - 58px) !important;
      }
    }
  }
}
@media only screen and (max-width: 1360px) {
  /deep/.el-col {

    .info_five {
      margin-left: 8px;
      width: calc(100% - 126px);
    }
    &:last-child {
      .info_five {
        width: calc(100% - 112px) !important;
      }
    }
  }
}
</style>
