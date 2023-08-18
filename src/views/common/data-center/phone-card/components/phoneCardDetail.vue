<template>
  <div class='phone_call_detail'>
    <div class='item_wrap'>
      <div class='tip_info'>办理信息</div>
      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>办理人姓名：</div>
          <div class='info info_five'>{{ row.name || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>状态：</div>
          <div class='info item_label_value'>{{ row.status || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>运营商：</div>
          <div class='info item_label_value'>{{ row.operator || '--' }}</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>办理人手机：</div>
          <div class='info info_five'>{{ row.phone || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>SIM：</div>
          <div class='info item_label_value'>{{ row.sim || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>IMSI：</div>
          <div class='info item_label_value'>{{ row.imsi || '--' }}</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>用户类型：</div>
          <div class='info info_five'>{{ row.clientType || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>办理业务：</div>
          <div class='info item_label_value'>{{ row.businessType || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>办理时间：</div>
          <div class='info item_label_value'>{{ row.collectTimeStr || '--' }}</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>办理地点：</div>
          <div class='info info_five'>{{ row.businessPlace || '--' }}</div>
        </el-col>
        <el-col :span='16'>
          <div class='tip item_label'>漫游类型：</div>
          <div class='info item_label_value'>{{ row.roamingType || '--' }}</div>
        </el-col>
      </el-row>
    </div>

<!--    状态为正常时，无以下内容-->
    <div class='item_wrap' v-if='row.operator !== "移动"'>
      <div class='tip_info'>持有人信息</div>
      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>持有人姓名：</div>
          <div class='info info_five'>{{ row.holderName || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip tip_six'>持有人证件类型：</div>
          <div class='info info_six'>{{ row.cerType || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip tip_six'>持有人证件号码：</div>
          <div class='info info_six'>{{ row.cerNumber || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <div class='tip tip_five'>居住地址：</div>
          <div class='info info_five'>{{ row.liveAddress || '--' }}</div>
        </el-col>
      </el-row>
    </div>

    <div class='item_wrap' v-if='row.operator !== "移动"'>
      <div class='tip_info'>代理人信息</div>
      <el-row>
        <el-col :span='8'>
          <div class='tip tip_five'>代理人姓名：</div>
          <div class='info info_five'>{{ row.agentName || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip tip_six'>代理人证件类型：</div>
          <div class='info info_six'>{{ row.agentCerType || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip tip_six'>代理人证件号码：</div>
          <div class='info info_six'>{{ row.agentCerNumber || '--' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhoneCardDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='less' scoped>
.phone_call_detail {
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
      width: 96px;
    }
    .tip_six {
      width: 128px;
    }
    .info {
      width: calc(100% - 104px);
    }
    .info_five {
      width: calc(100% - 120px);
    }
    .info_six {
      width: calc(100% - 152px);
    }
  }
  .el-col:last-child {
    .info {
      width: calc(100% - 80px);
    }
    .info_six {
      width: calc(100% - 128px);
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
      margin-left: 12px;
      width: calc(100% - 132px);
    }
    .info_six {
      margin-left: 18px;
      width: calc(100% - 150px);
    }
  }
}
</style>
