<template>
  <div class='hotel_detail'>
    <div class='item_wrap'>
<!--      <img src='@/assets/img/icon-morenHeader.png' alt=''>-->
      <img :src='showImg ? origin + row.headPic : require(`@/assets/img/${$themeColor("--person-default-pic-name")}.png`)' @error='imgError'>
      <div class='base_info'>
        <div class='name'>{{ row.realName || '--' }}</div>
        <div class='info_item_wrap info_wrap_one'>
          <div class='tip_info'>基本信息</div>
          <el-row>
            <el-col :span='8'>
              <div class='tip tip_six'>出生日期：</div>
              <div class='info info_six'>{{ row.birthdayStr || '--' }}</div>
            </el-col>
            <el-col :span='8'>
              <div class='tip item_label'>证件类型：</div>
              <div class='info item_label_value'>{{ row.idCardType || '--' }}</div>
            </el-col>
            <el-col :span='8'>
              <div class='tip item_label'>证件号码：</div>
              <div class='info item_label_value'>{{ row.cerNumber || '--' }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <div class='tip tip_six'>民族：</div>
              <div class='info info_six'>{{ row.nation || '--' }}</div>
            </el-col>
            <el-col :span='16'>
              <div class='tip item_label'>户籍地址：</div>
              <div class='info item_label_value'>{{ row.houseAddr || '--' }}</div>
            </el-col>
          </el-row>
        </div>

        <div class='info_item_wrap'>
          <div class='tip_info'>入住信息</div>
          <el-row>
            <el-col :span='8'>
              <div class='tip tip_six'>旅店名称：</div>
              <div class='info info_six'>{{ row.hotelName || '--' }}</div>
            </el-col>
            <el-col :span='8'>
              <div class='tip item_label'>旅店编号：</div>
              <div class='info item_label_value'>{{ row.hotelSN || '--' }}</div>
            </el-col>
            <el-col :span='8'>
              <div class='tip item_label'>旅店地址：</div>
              <div class='info item_label_value'>{{ row.resiAddr || '--' }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <div class='tip tip_six'>经度：</div>
              <div class='info info_six'>{{ row.longitude || '--' }}</div>
            </el-col>
            <el-col :span='16'>
              <div class='tip item_label'>纬度：</div>
              <div class='info item_label_value'>{{ row.latitude || '--' }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <div class='tip tip_six'>旅客所属区域：</div>
              <div class='info info_six'>{{ row.travellerRegion || '--' }}</div>
            </el-col>
            <el-col :span='8'>
              <div class='tip item_label'>入住房号：</div>
              <div class='info item_label_value'>{{ row.inRoomNumber || '--' }}</div>
            </el-col>
            <el-col :span='8'>
              <div class='tip item_label'>入住时间：</div>
              <div class='info item_label_value'>{{ row.inTimestampStr || '--' }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8'>
              <div class='tip tip_six'>退房时间：</div>
              <div class='info info_six'>{{ row.outTimestampStr || '--' }}</div>
            </el-col>
            <el-col :span='16'>
              <div class='tip item_label'>居住天数：</div>
              <div class='info item_label_value'>{{ row.live || '--' }}</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HotelDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showImg: true
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    }
  },
  methods: {
    imgError () {
      this.showImg = false
    }
  }
}
</script>

<style lang="less" scoped>
.hotel_detail {
  font-size: 16px;
  color: var(--base-text-color-1);
  .item_wrap {
    display: flex;
    img {
      flex: none;
      width: 246px;
      height: 310px;
      margin-right: 24px;
    }
    .base_info {
      flex: 1;
      .name {
        font-size: 18px;
        line-height: 24px;
        font-weight: bold;
        margin-bottom: 32px;
      }
    }
    .info_item_wrap{
      .tip_info {
        margin-bottom: 13px;
        font-weight: bold;
      }
    }
    .info_wrap_one {
      margin-bottom: 32px;
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
    .tip_six {
      width: 112px;
    }
    .info {
      width: calc(100% - 104px);
    }
    .info_six {
      width: calc(100% - 136px);
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
@media only screen and (max-width: 1360px) {
  /deep/.el-col {
    .info_six {
      margin-left: 14px;
      width: calc(100% - 150px);
    }
  }
}
</style>
