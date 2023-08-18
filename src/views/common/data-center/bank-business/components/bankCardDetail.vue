<template>
  <div class='bank_card_detail'>
    <div class='item_wrap'>
      <div class='tip_info'>基本信息</div>
      <el-row>
        <el-col :span='7'>
          <div class='tip item_label'>姓名：</div>
          <div class='info item_label_value'>{{ row.name || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>性别：</div>
          <div class='info item_label_value'>{{ row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>民族：</div>
          <div class='info item_label_value'>{{ row.nation || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip item_label'>出生日期：</div>
          <div class='info item_label_value'>{{ row.birthdayStr || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>证件类型：</div>
          <div class='info item_label_value'>{{ row.cerType || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>证件号码：</div>
          <div class='info item_label_value'>{{ row.cerNumber || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip item_label'>手机：</div>
          <div class='info item_label_value'>{{ row.phone || '--' }}</div>
        </el-col>
        <el-col :span='17'>
          <div class='tip item_label'>户籍地址：</div>
          <div class='info item_label_value'>{{ row.address || '--' }}</div>
        </el-col>
      </el-row>
    </div>
    <div class='item_wrap'>
      <div class='tip_info'>银行业务信息</div>
      <el-row>
        <el-col :span='7'>
          <div class='tip tip_six'>银行类型：</div>
          <div class='info info_six'>{{ row.placeType || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip tip_six'>办理网点：</div>
          <div class='info info_six'>{{ row.placeName || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>网点地址：</div>
          <div class='info item_label_value'>{{ row.placeAddress || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip tip_six'>签名：</div>
          <div class='info info_six'>
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
          <div class='tip tip_six'>签署日期：</div>
          <div class='info info_six'>{{row.signDate || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>办理时间：</div>
          <div class='info item_label_value'>{{ row.collectTimeStr || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip tip_six'>断卡行动联系人：</div>
          <div class='info info_six'>{{ row.monitorName || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip tip_six'>断卡联系人电话：</div>
          <div class='info info_six'>{{ row.monitorPhone || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>备注：</div>
          <div class='info item_label_value'>{{ row.remark || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='7'>
          <div class='tip tip_six'>纬度：</div>
          <div class='info info_six'>{{ row.latitude || '--' }}</div>
        </el-col>
        <el-col :span='17'>
          <div class='tip tip_six'>经度：</div>
          <div class='info info_six'>{{ row.longitude || '--' }}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import formatDate from '@/utils/filters'
export default {
  name: 'BankCardDetail',
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
.bank_card_detail {
  //padding-right: 12px;
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
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    display: flex;
    position: relative;
    line-height: 22px;
    .tip {
      color: var(--base-text-color-to-999999);
      width: 80px;
      white-space: nowrap;
    }
    .tip_six {
      width: 128px;
    }
    .info {
      width: calc(100% - 104px);
      .sign_info {
        position: absolute;
        top: -6px;
        left: 128px;
        width: 102px;
        height: 32px;
        //img {
        //  display: block;
        //  width: 100%;
        //  height: 100%;
        //}
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
      margin-left: 18px;
      width: calc(100% - 170px);
    }
    &:last-child {
      .info_six {
        margin-left: 18px;
        width: calc(100% - 146px);
      }
    }
  }
  .sign_info {
    margin-left: 18px;
  }
}
</style>
