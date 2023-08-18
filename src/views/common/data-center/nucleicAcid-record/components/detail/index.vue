<template>
  <div class='nucleic_acid_detail'>
    <div class='item_wrap'>
      <div class='tip_info'>基本信息</div>
      <el-row>
        <el-col :span='6'>
          <div class='tip item_label'>姓名：</div>
          <div class='info item_label_value'>{{ row.name || '--' }}</div>
        </el-col>
        <el-col :span='18'>
          <div class='tip item_label'>性别：</div>
          <div class='info item_label_value'>{{ row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '--' }}</div>
        </el-col>
        <!--        <el-col :span='9'>-->
        <!--          <div class='tip'>民族：</div>-->
        <!--          <div class='info'>{{ row.nation || '&#45;&#45;' }}</div>-->
        <!--        </el-col>-->
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
          <div class='info item_label_value'>{{ row.liveAddress || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>户籍地址：</div>
          <div class='info item_label_value'>{{ row.address || '--' }}</div>
        </el-col>
      </el-row>
    </div>

    <div class='item_wrap'>
      <div class='tip_info'>行程信息</div>
      <el-row>
        <el-col :span='24'>
          <div class='tip tip_five'>来自风险区：</div>
          <div class='info info_five' :class='row.isFromEpidemic === true ? "risk_red" : row.isFromEpidemic === false ? "risk_green" : ""'>
            {{ row.isFromEpidemic === true ? '是' : row.isFromEpidemic === false ? '否' : '--' }}
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='9'>
          <div class='tip tip_five'>始发地：</div>
          <div class='info info_five'>{{ row.srcAddress || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>目的地：</div>
          <div class='info item_label_value'>{{ row.dstAddress || '--' }}</div>
        </el-col>
        <el-col :span='6'>
          <div class='tip item_label'>抵达时间：</div>
          <div class='info item_label_value'>{{ row.arrivalTimeStr || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='9'>
          <div class='tip tip_five'>人员分类：</div>
          <div class='info info_five'>{{ row.personType || '--' }}</div>
        </el-col>
        <el-col :span='9'>
          <div class='tip item_label'>工作城市：</div>
          <div class='info item_label_value'>{{ row.unitAreaName || '--' }}</div>
        </el-col>
        <el-col :span='6'>
          <div class='tip item_label'>工作单位：</div>
          <div class='info item_label_value'>{{ row.unitName || '--' }}</div>
        </el-col>
      </el-row>
    </div>

    <div class='item_wrap'>
      <div class='tip_info'>核酸信息</div>
      <el-row>
        <el-col :span='9'>
          <div class='tip tip_five'>本地管控区：</div>
          <div class='info info_five' :class='row.isControl === true ? "risk_red" : row.isControl === false ? "risk_green" : ""'>
            {{ row.isControl === true ? '是' : row.isControl === false ? '否' : '--' }}
          </div>
        </el-col>
        <el-col :span='15'>
          <div class='tip item_label'>检测结果：</div>
          <div class='info item_label_value' :class='row.result === "positive" ? "risk_red" : row.result === "negative" ? "risk_green" : row.result === "testing" ? "risk_blue" : ""'>
            {{
              row.result === "positive"
                ? '阳性' : row.result === "negative"
                  ? '阴性' : row.result === "testing"
                    ? '检测中' : '--'
            }}
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span='9'>
          <div class='tip tip_five'>采样时间：</div>
          <div class='info info_five'>{{ row.collectTimeStr || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>采样场所：</div>
          <div class='info item_label_value'>{{ row.placeName || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip tip_six'>采样窗口：</div>
          <div class='info info_six'>{{ row.sampleWindow || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='9'>
          <div class='tip tip_five'>检测时间：</div>
          <div class='info info_five'>{{ row.testTimeStr || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>检测场所：</div>
          <div class='info item_label_value'>{{ row.testPlaceName || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip tip_six'>首次登记时间：</div>
          <div class='info info_six'>{{ row.registerTimeStr || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='9'>
          <div class='tip tip_five'>数据来源：</div>
          <div class='info info_five'>{{ row.dataSource || '--' }}</div>
        </el-col>
        <el-col :span='8'>
          <div class='tip item_label'>标本类型：</div>
          <div class='info item_label_value'>{{ row.sampleType || '--' }}</div>
        </el-col>
        <el-col :span='7'>
          <div class='tip tip_six'>试剂编码：</div>
          <div class='info info_six'>{{ row.reagentCode || '--' }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='9'>
          <div class='tip tip_five'>状态：</div>
          <div class='info info_five'>{{ row.status || '--' }}</div>
        </el-col>
        <el-col :span='15'>
          <div class='tip item_label'>备注：</div>
          <div class='info item_label_value'>{{ row.remark || '--' }}</div>
        </el-col>
      </el-row>
    </div>



  </div>
</template>

<script>
export default {
  name: 'NucleicAcidDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='less' scoped>
.nucleic_acid_detail {
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
    .tip_five {
      width: 96px;
    }
    .tip_six {
      width: 112px;
    }
    .info {
      width: calc(100% - 104px);
      &.risk_red {
        color: @font-color-4;
      }
      &.risk_green {
        color: #0CBF7E;
      }
      &.risk_blue {
        color: #27A0FC;
      }
    }
    .info_six {
      width: calc(100% - 136px);
    }
    .info_five {
      width: calc(100% - 120px);
    }
  }
  .el-col:last-child {
    .info {
      width: calc(100% - 80px);
    }
    .info_six {
      width: calc(100% - 112px)
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
