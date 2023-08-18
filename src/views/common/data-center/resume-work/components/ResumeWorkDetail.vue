<template>
<div class='resume_work_detail'>
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
        <div class='info item_label_value'>{{ row.birthday || '--' }}</div>
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
        <div class='info item_label_value'>{{ row.liveAddress  || '--'}}</div>
      </el-col>
      <el-col :span='9'>
        <div class='tip item_label'>户籍地址：</div>
        <div class='info item_label_value'>{{ row.address || '--' }}</div>
      </el-col>
    </el-row>
  </div>

  <div class='item_wrap'>
    <div class='tip_info'>复工复产信息</div>
    <el-row>
      <el-col :span='6'>
        <div class='tip item_label'>出行方式：</div>
        <div class='info item_label_value'>{{ row.tripMode || '--' }}</div>
      </el-col>
      <el-col :span='9'>
        <div class='tip item_label'>前往地点：</div>
        <div class='info item_label_value'>{{ row.resumeworkAddress || '--' }}</div>
      </el-col>
      <el-col :span='9'>
        <div class='tip item_label'>登记时间：</div>
        <div class='info item_label_value'>{{ row.collectTimeStr || '--' }}</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span='24'>
        <div class='tip item_label'>备注：</div>
        <div class='info item_label_value'>{{ row.remark || '--' }}</div>
      </el-col>
    </el-row>
  </div>

</div>
</template>

<script>
export default {
  name: 'ResumeWorkDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='less' scoped>
.resume_work_detail {
  padding-right: 12px;
  font-size: 16px;
  color: var(--base-text-color-1);
  .item_wrap:nth-child(1) {
    margin-bottom: 29px;
  }
  .item_wrap{
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
