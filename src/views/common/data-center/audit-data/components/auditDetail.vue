<template>
  <div class='audit_detail_wrap'>
    <div class='item_wrap'>
      <div class='tip_info'>{{ (row.placeName || '--') + (row.placeCode ? `（${row.placeCode}）` : '') }}</div>
      <el-row>
        <el-col :span='7'>
          <div class='tip'>场所类型：</div>
          <div class='info'>{{ row.placeTypeName || '--' }}</div>
        </el-col>
        <el-col :span='10'>
          <div class='tip tip_five'>设备名称：</div>
          <div class='info info_five'>{{ row.deviceName || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip tip_five'>设备MAC：</div>
          <div class='info info_five'>{{ row.collectMac || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <div class='tip'>设备厂商：</div>
          <div class='info'>{{ row.factoryCode || '--' }}</div>
        </el-col>
      </el-row>
    </div>

    <div class='item_wrap'>
      <div class='tip_info'>网络行为信息</div>
      <el-row>
        <el-col :span='7'>
          <div class='tip'>网络行为：</div>
          <div class='info'>{{ row.webType || '网页类型' }}</div>
        </el-col>
        <el-col :span='10'>
          <div class='tip tip_five'>终端MAC：</div>
          <div class='info info_five'>{{ row.mac || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip tip_five'>终端IP：</div>
          <div class='info info_five'>{{ row.dstVA4ip || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip'>内网IP：</div>
          <div class='info'>{{ row.srcLocalIp || '--' }}</div>
        </el-col>
        <el-col :span='10'>
          <div class='tip tip_five'>认证账号：</div>
          <div class='info info_five'>{{ row.authCode || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip tip_five'>网址主体：</div>
          <div class='info info_five'>{{ row.host || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <div class='tip'>网站主题：</div>
          <div class='info'>{{ row.title || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='24'>
          <div class='tip'>浏览链接：</div>
          <div class='info'>{{ row.url || '--' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='less' scoped>
.audit_detail_wrap {
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
    .tip_five {
      width: 86px;
    }
    .info {
      width: calc(100% - 104px);
    }
    .info_five {
      width: calc(100% - 110px);
    }
  }
  .el-col:last-child {
    .info {
      width: calc(100% - 80px);
    }
    .info_five {
      width: calc(100% - 86px);
    }
  }
}
</style>
