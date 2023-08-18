<template>
  <div class='epidemic_regis_detail'>
    <div class='item_wrap'>
      <div class='tip_info'>基本信息</div>
      <el-row>
        <el-col :span='6'>
          <div class='tip item_label'>姓名：</div>
          <div class='info item_label_value'>{{ row.name || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>性别：</div>
          <div class='info item_label_value'>{{ row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>民族：</div>
          <div class='info item_label_value'>{{ row.nation || '--' }}</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='6'>
          <div class='tip item_label'>出生日期：</div>
          <div class='info item_label_value'>{{ row.birthdayStr || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>证件类型：</div>
          <div class='info item_label_value'>{{ row.cerType || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>证件号码：</div>
          <div class='info item_label_value'>{{ row.cerNumber || '--' }}</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='6'>
          <div class='tip item_label'>手机：</div>
          <div class='info item_label_value'>{{ row.phone || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>居住地址：</div>
          <div class='info item_label_value'>{{ row.liveCommunity || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>户籍地址：</div>
          <div class='info item_label_value'>{{ row.address || '--' }}</div>
        </el-col>
      </el-row>
    </div>

    <div class='item_wrap'>
      <div class='tip_info'>防疫登记信息</div>
      <el-row>
        <el-col :span='8'>
          <div class='tip item_label'>状态：</div>
          <div class='info item_label_value'>{{ row.passStatus === 'in' ? '进入' : row.passStatus === 'out' ? '离开' : '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip item_label'>体温：</div>
          <div class='info item_label_value'>{{ row.temperature ? row.temperature + '℃' : '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>车牌：</div>
          <div class='info item_label_value'>{{ row.carLicense || '--' }}</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='8'>
          <div class='tip item_label'>登记场所：</div>
          <div class='info item_label_value'>{{ row.placeName || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip item_label'>场所类型：</div>
          <div class='info item_label_value'>{{ row.placeType || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>场所地址：</div>
          <div class='info item_label_value'>{{ row.placeAddress || '--' }}</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='8'>
          <div class='tip item_label'>登记时间：</div>
          <div class='info item_label_value'>{{ row.collectTimeStr || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip item_label'>邮编：</div>
          <div class='info item_label_value'>{{ row.districtCode || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>备注：</div>
          <div class='info item_label_value'>{{ row.remark || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='8'>
          <div class='tip item_label'>经度：</div>
          <div class='info item_label_value'>{{ row.longitude || '--' }}</div>
        </el-col>
        <el-col :span='16'>
          <div class='tip item_label'>纬度：</div>
          <div class='info item_label_value'>{{ row.latitude || '--' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EpidemicRegisDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='less' scoped>
.epidemic_regis_detail {
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
  .el-col {
    display: flex;
    .tip {
      color: var(--base-text-color-to-999999);
      width: 80px;
      white-space: nowrap;
    }
    .info {
      width: calc(100% - 104px);
    }
  }
  .el-col:last-child {
    .info {
      width: calc(100% - 80px);
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
</style>
