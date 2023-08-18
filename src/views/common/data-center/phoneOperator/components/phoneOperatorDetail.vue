<template>
  <div class='phone_operator_detail'>
    <div class='item_wrap'>
      <div class='tip_info'>基本信息</div>
      <el-row>
        <el-col :span='7'>
          <div class='tip'>姓名：</div>
          <div class='info'>{{ row.name || '--' }}</div>
        </el-col>
        <el-col :span='10'>
          <div class='tip tip_four item_label'>性别：</div>
          <div class='info item_label_value'>{{ row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip tip_four item_label'>民族：</div>
          <div class='info item_label_value'>{{ row.nation || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip'>出生日期：</div>
          <div class='info'>{{ row.birthdayStr || '--' }}</div>
        </el-col>
        <el-col :span='10'>
          <div class='tip tip_four item_label'>证件类型：</div>
          <div class='info item_label_value'>{{ row.cerType || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip tip_four item_label'>证件号码：</div>
          <div class='info item_label_value'>{{ row.cerNumber || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip'>手机：</div>
          <div class='info'>{{ row.phone || '--' }}</div>
        </el-col>
        <el-col :span='17'>
          <div class='tip tip_four item_label'>户籍地址：</div>
          <div class='info item_label_value'>{{ row.address || '--' }}</div>
        </el-col>
      </el-row>
    </div>
    <div class='item_wrap'>
      <div class='tip_info'>运营商业务信息</div>
      <el-row>
        <el-col :span='24'>
          <div class='tip'>运营商：</div>
          <div class='info'>{{ row.operator || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='6'>
          <div class='tip'>营业厅类型：</div>
          <div class='info'>{{ row.placeType || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip'>营业厅名称：</div>
          <div class='info'>{{ row.placeName || '--' }}</div>
        </el-col>
        <el-col :span='10'>
          <div class='tip'>营业厅地址：</div>
          <div class='info'>{{ row.placeAddress || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='6'>
          <div class='tip'>签名：</div>
          <div class='info'>
            <div class='sign_info'>
              <el-image
                :src="origin + row.signConfirm"
                :preview-src-list="row.signConfirm ? [origin + row.signConfirm] : []"
                fit="fill"
              >
                <div slot="error" class="image-slot">
                  --
                </div>
              </el-image>
            </div>
          </div>
        </el-col>
        <el-col :span='8'>
          <div class='tip'>签署日期：</div>
          <div class='info'>{{row.signDate || '--' }}</div>
        </el-col>
        <el-col :span='10'>
          <div class='tip'>办理时间：</div>
          <div class='info'>{{ row.collectTimeStr || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='6'>
          <div class='tip'>经度：</div>
          <div class='info'>{{ row.longitude || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip'>纬度：</div>
          <div class='info'>{{ row.latitude || '--' }}</div>
        </el-col>
        <el-col :span='10'>
          <div class='tip'>备注：</div>
          <div class='info'>{{ row.remark || '--' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import formatDate from '@/utils/filters'
export default {
  name: 'PhoneOperatorDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    origin () {
      return window.location.origin + '/'
    }
  },
  methods:{
    formatDate (time){
      if(time){
        return formatDate.formatDate(time,'YYYY-MM-DD')
      }else{
        return '--'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.phone_operator_detail {
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
    position: relative;
    .tip {
      color: var(--base-text-color-to-999999);
      width: 96px;
      white-space: nowrap;
    }
    .tip_four {
      width: 80px;
    }
    .info {
      width: calc(100% - 120px);
      .sign_info {
        position: absolute;
        top: -6px;
        left: 96px;
        width: 102px;
        height: 32px;
      }
      .error_img {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #42506A;
        img {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .el-col:last-child {
    .info {
      width: calc(100% - 96px);
    }
  }
}
/deep/.el-image {
  width: 100% !important;
  height: 100% !important;
  background-color: transparent !important;
  img {
    width: 100% !important;
    height: 100% !important;
  }
  .image-slot {
    line-height: 32px;
  }
}
@media only screen and (max-width: 1440px) {
  /deep/.el-col {
    .item_label {
      width: 58px !important;
    }
    .item_label_value {
      width: calc(100% - 70px) !important;
      margin-left: 0 !important;
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
    .info {
      margin-left: 12px;
      width: calc(100% - 132px);
      .sign_info {
        margin-left: 12px;
      }
    }
    &:last-child {
      .info {
        margin-left: 12px;
        width: calc(100% - 108px);
      }
    }
  }
}
</style>
