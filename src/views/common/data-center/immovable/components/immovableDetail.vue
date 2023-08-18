<template>
<div class='immovable'>
  <div class='item_wrap'>
    <el-image
      :src="origin + row.obligeePhoto"
      :preview-src-list="row.obligeePhoto ? [origin + row.obligeePhoto] : []"
      fit="fill"
    >
      <div slot="error" class="image-slot">
        <!-- <img src='@/assets/img/icon-morenHeader.png'> -->
        <img :src='imgUrl'>
      </div>
    </el-image>
    <div class='info_item_wrap'>
      <div class='tip_info'>基本信息</div>
      <el-row>
        <el-col :span='7'>
          <div class='tip item_label'>权利人：</div>
          <div class='info item_label_value'>{{ row.obligee || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip tip_six'>不动产证号：</div>
          <div class='info info_six'>{{ row.assetsCode || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>证件号码：</div>
          <div class='info item_label_value'>{{ row.cerNumber || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip item_label'>用途：</div>
          <div class='info item_label_value'>{{ row.houseUsage || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip tip_six'>面积：</div>
          <div class='info info_six'>{{ row.houseArea ? row.houseArea : '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>坐落：</div>
          <div class='info item_label_value'>{{ row.houseAddress || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip item_label'>受理编号：</div>
          <div class='info item_label_value'>{{ row.acceptCode || '--' }}</div>
        </el-col>
        <el-col :span='17'>
          <div class='tip tip_six'>登记时间：</div>
          <div class='info info_six'>{{ row.collectTimeStr || '--' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>

  <div class='item_wrap wrap_one'>
    <el-image
      :src="origin + row.mortgagePhoto"
      :preview-src-list="row.mortgagePhoto ? [origin + row.mortgagePhoto] : []"
      fit="fill"
    >
      <div slot="error" class="image-slot">
        <!-- <img src='@/assets/img/icon-morenHeader.png'> -->
        <img :src='imgUrl'>
      </div>
    </el-image>
    <div class='info_item_wrap'>
      <div class='tip_info'>抵押信息</div>
      <el-row>
        <el-col :span='7'>
          <div class='tip item_label'>债权人：</div>
          <div class='info item_label_value'>{{ row.mortgage || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip tip_six'>抵押起始日期：</div>
          <div class='info info_six'>{{ row.mortgageStartTimeStr || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip tip_six'>抵押终止日期：</div>
          <div class='info info_six'>{{ row.mortgageEndTimeStr || '--' }}</div>
        </el-col>
      </el-row>

      <div class='tip_info tip_one'>查封信息</div>
      <el-row>
        <el-col :span='24'>
          <div class='tip tip_six'>查封单位：</div>
          <div class='info info_six'>{{ row.seizureUnit || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='8'>
          <div class='tip tip_six'>查封起始日期：</div>
          <div class='info info_six'>{{ row.seizureStartTimeStr || '--' }}</div>
        </el-col>
        <el-col :span='16'>
          <div class='tip tip_six'>查封终止日期：</div>
          <div class='info info_six'>{{ row.seizureEndTimeStr || '--' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>

<!--  <div class='item_wrap wrap_one'>-->
<!--    <div class='info_item_wrap info_wrap_one'>-->
<!--      <div class='tip_info'>查封信息</div>-->
<!--      <el-row>-->
<!--        <el-col :span='24'>-->
<!--          <div class='tip tip_six'>查封单位：</div>-->
<!--          <div class='info info_six'>{{ row.seizureUnit || '&#45;&#45;' }}</div>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row>-->
<!--        <el-col :span='8'>-->
<!--          <div class='tip tip_six'>查封起始日期：</div>-->
<!--          <div class='info info_six'>{{ row.seizureStartTimeStr || '&#45;&#45;' }}</div>-->
<!--        </el-col>-->
<!--        <el-col :span='16'>-->
<!--          <div class='tip tip_six'>查封终止日期：</div>-->
<!--          <div class='info info_last'>{{ row.seizureEndTimeStr || '&#45;&#45;' }}</div>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->
<!--  </div>-->
</div>
</template>

<script>
import { mapState } from 'vuex'
import { lightTheme, darkTheme } from "@/assets/js/variable";
export default {
  name: 'ImmovableDetail',
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
    origin () {
      return window.location.origin + '/'
    },
    imgUrl (){
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme
      return colorObj['--person-default-pic']
    }
  }
}
</script>

<style lang='less' scoped>
.immovable {
  font-size: 16px;
  color: var(--base-text-color-1);
  .item_wrap {
    display: flex;
    img {
      flex: none;
      width: 128px;
      height: 160px;
      margin-right: 16px;
    }
    .info_item_wrap{
      flex: 1;
      .tip_info {
        margin-bottom: 16px;
        font-weight: bold;
      }
      .tip_one {
        margin-top: 40px;
      }
    }
    .info_wrap_one {
      margin-left: 184px;
    }
  }
  .wrap_one {
    margin-top: 32px;
  }
}
/deep/.el-row {
  margin-bottom: 16px;
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
      width: 112px;
    }
    .info {
      width: calc(100% - 104px);
    }
    .info_five {
      width: calc(100% - 120px);
    }
    .info_six {
      width: calc(100% - 136px);
    }
  }
  .el-col:last-child {
    .info {
      width: calc(100% - 80px);
    }
    .info_six {
      width: calc(100% - 112px);
    }
  }
}
/deep/.el-image {
  flex: none;
  width: 128px;
  height: 160px;
  margin-right: 16px;
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
      margin-left: 14px;
      width: calc(100% - 150px);
    }
    &:last-child {
      .info_six {
        margin-left: 14px;
        width: calc(100% - 126px);
      }
    }
  }
}
</style>
