<template>
<div class='car_detail_wrap'>
  <div class='base_info'>
    <span>{{ row.carNumber || '--' }}</span>
    <span>{{ row.parkPlaceName || '--' }}</span>
  </div>
  <div class='in_out_info'>
    <div class='common in_info'>
      <el-image
        :src="imagePrefix + row.inPicUrl"
        :preview-src-list="row.inPicUrl ? [imagePrefix + row.inPicUrl] : []"
        fit="fill"
      >
        <div slot="error" class="image-slot">
          <!-- <img src='@/assets/img/carNone.png'> -->
          <img :src='imgUrl'>
        </div>
      </el-image>
      <div class='info'>
        <el-row>
          <el-col :span='12'>
            <div class='tip item_label'>入口名称：</div>
            <div class='data item_label_value'>{{ row.inGateName || '--' }}</div>
          </el-col>
          <el-col :span='12'>
            <div class='tip item_label'>入场时间：</div>
            <div class='data item_label_value'>{{ row.inTimestampstr || '--' }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <div class='tip item_label'>入口经度：</div>
            <div class='data item_label_value'>{{ row.inLongitude || '--' }}</div>
          </el-col>
          <el-col :span='12'>
            <div class='tip item_label'>入口纬度：</div>
            <div class='data item_label_value'>{{ row.inLatitude || '--' }}</div>
          </el-col>
        </el-row>

      </div>
    </div>

    <div class='common out_info'>
      <el-image
        :src="imagePrefix + row.outPicUrl"
        :preview-src-list="row.outPicUrl ? [imagePrefix + row.outPicUrl] : []"
        fit="fill"
      >
        <div slot="error" class="image-slot">
          <!-- <img src='@/assets/img/carNone.png'> -->
          <img :src='imgUrl'>
        </div>
      </el-image>
      <div class='info'>
        <el-row>
          <el-col :span='12'>
            <div class='tip item_label'>出口名称：</div>
            <div class='data item_label_value'>{{ row.outGateName || '--' }}</div>
          </el-col>
          <el-col :span='12'>
            <div class='tip item_label'>出场时间：</div>
            <div class='data item_label_value'>{{ row.outTimestampstr || '--' }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <div class='tip item_label'>出口经度：</div>
            <div class='data item_label_value'>{{ row.outLongitude || '--' }}</div>
          </el-col>
          <el-col :span='12'>
            <div class='tip item_label'>出口纬度：</div>
            <div class='data item_label_value'>{{ row.outLatitude || '--' }}</div>
          </el-col>
        </el-row>

      </div>
    </div>
  </div>
</div>
</template>
<script>

import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    imagePrefix () {
      return window.location.origin + '/'
    },
    imgUrl (){
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--icon-no-monitor-pic']
    },
  },
}
</script>

<style lang='less' scoped>
.car_detail_wrap {
  padding: 0 15px 8px 0;
  color: var(--base-text-color-1);
  font-size: 16px;
  line-height: 22px;
  .base_info {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 24px;
    span:first-child {
      margin-right: 40px;
    }
  }
  .in_out_info {
    display: flex;
    .common {
      flex: 1;
      ::v-deep .el-image {
        width: 100%;
        height: 315px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .info {
        margin-top: 32px;
        ::v-deep .el-row {
          margin-bottom: 16px;
          .el-col {
            display: flex;
            .tip {
              color: var(--base-text-color-to-999999);
              width: 80px;
              white-space: nowrap;
            }
            .data {
              width: calc(100% - 104px);
            }
          }
          .el-col:last-child {
            .data {
              width: calc(100% - 80px);
            }
          }
        }
      }
    }
    .in_info {
      margin-right: 24px;
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
