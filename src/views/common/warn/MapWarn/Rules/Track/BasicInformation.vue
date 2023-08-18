<template>
  <div class="BasicInformation">
    <CusInput label="预警名称"
      ><template>
        <el-input
          v-model.trim="params.warningName"
          placeholder="请输入预警名称"
        ></el-input></template
    ></CusInput>
    <CusInput label="预警聚集人数"
      ><template>
        <el-input
          v-model.number="params.gatherNumber"
          placeholder="请输入预警聚集人数（2人及以上）"
        ></el-input></template
    ></CusInput>
    <CusInput label="警报级别"
      ><template>
        <el-select v-model="params.warningLevel" placeholder="请选择警报级别" @change="changeLevel">
          <el-option
            v-for="(item, index) in levelList"
            :key="index + '_' + item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select></template
    ></CusInput>

    <!-- <CusInput label="发送人员"
      ><template>
        <el-select placeholder="请选择发送人员" multiple v-model="params.receiverIds">
          <el-option
            v-for="(item, index) in personnelList"
            :label="item.username"
            :value="item.id"
            :key="index + '_' + item.id"
          ></el-option>
        </el-select> </template
    ></CusInput> -->

    <CusInput label="数据类型"
      ><template>
        <el-select placeholder="请选择数据类型" multiple v-model="params.dataTypeList">
          <el-option
            v-for="(item, index) in dataTypeList"
            :label="item.srcNameCn"
            :value="item.srcNameEn"
            :key="index + '_' + item.srcNameEn"
          ></el-option>
        </el-select> </template
    ></CusInput>

    <CusInput label="起止时间"
      ><template>
        <div style="width: 288px">
          <!-- <TimePicker ref="TimePicker"  @confirmTime="confirmTime"></TimePicker> -->
          <QuickTimeSelect
            :pStartTime.sync="params.startTime"
            :pEndTime.sync="params.endTime"
            :limitFutureThreeMonth="true"
            class="quick_time_select"
            startPlaceholder="请选择开始日期"
            endPlaceholder="请选择结束日期"
          ></QuickTimeSelect>
          <!-- <TimePicker
            ref="TimePicker"
            @sChangeTime="sChangeTime"
            @eChangeTime="eChangeTime"
            @clearTime="clearTime"
            :isCanToday="true"
            :isPass="false"
            :limitThreeMonth="true"
          /> -->
        </div>
      </template>
    </CusInput>
  </div>
</template>

<script>
import CusInput from '@/components/BasicComponents/CusInput'
// import TimePicker from '@/components/VisualComponents/TimePicker'
import QuickTimeSelect from '@/components/VisualComponents/QuickTimeSelect/index'

import { queryReceiverPersonList, configurableSrcDataAll } from '@/api/warn'

const levelList = [
  {
    label: '一般防控',
    value: 'GENERAL_LEVEL',
    color: 'rgba(69, 150, 230,0.3)'
  },
  {
    label: '中等防控',
    value: 'MEDIUM_LEVEL',
    color: 'rgba(216, 183, 51,0.3)'
  },
  {
    label: '重点防控',
    value: 'EMPHASIS_LEVEL',
    color: 'rgba(240, 63, 88,0.3)'
  }
]

Object.freeze(levelList)
export default {
  name: 'BasicInformation',
  components: {
    CusInput,
    // TimePicker,
    QuickTimeSelect
  },
  data () {
    return {
      params: {
        startTime: '',
        endTime: '',
        warningName: '',
        warningLevel: '',
        receiverIds: [0],
        gatherNumber: '',
        dataTypeList: ['all']
      },
      personnelList: [],
      dataTypeList: [],
      levelList: levelList
    }
  },

  watch: {
    'params.receiverIds': function (val, oldval) {
      let newindex = val.indexOf(0),
          oldindex = oldval.indexOf(0) //获取val和oldval里all的索引,如果没有则返回-1
      if (newindex != -1 && oldindex == -1 && val.length > 1)
        //如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
        this.params.receiverIds = [0]
      else if (newindex != -1 && oldindex != -1 && val.length > 1)
        //如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
        this.params.receiverIds.splice(val.indexOf(0), 1)
    },
    'params.dataTypeList': function (val, oldval) {
      console.log(val);
      let newindex = val.indexOf('all'),
          oldindex = oldval.indexOf('all') //获取val和oldval里all的索引,如果没有则返回-1
      if (newindex != -1 && oldindex == -1 && val.length > 1)
        //如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
        this.params.dataTypeList = ['all']
      else if (newindex != -1 && oldindex != -1 && val.length > 1)
        //如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
        this.params.dataTypeList.splice(val.indexOf('all'), 1)
    },
    // 'params.startTime': function (val) {
    //   this.$nextTick(() => {
    //     this.$refs.TimePicker.setTime('startTime', val)
    //   })
    // },
    // 'params.endTime': function (val) {
    //   this.$nextTick(() => {
    //     this.$refs.TimePicker.setTime('endTime', val)
    //   })
    // }
  },

  created () {
    this.params.warningLevel = this.levelList[0].value
    queryReceiverPersonList().then(res => {
      this.personnelList = [...res]
    })
    configurableSrcDataAll().then(res => {
      this.dataTypeList = [...res]
    })
  },
  methods: {
    // isLimitDate(){
    //   console.log(this.$route.query.id);
    //   if(this.$route.query.id){
    //     console.log(111);
    //     return false
    //   }else{
    //     return true
    //   }
    // },
    confirmTime (val) {
      if (val === null) {
        this.params.startTime = ''
        this.params.endTime = ''
      } else {
        this.params.startTime = val[0]
        this.params.endTime = val[1]
      }
    },
    // clearTime () {
    //   this.params.startTime = ''
    //   this.params.endTime = ''
    // },
    // // 开始时间
    // sChangeTime (e) {
    //   this.params.startTime = e
    // },
    // // 结束时间
    // eChangeTime (e) {
    //   this.params.endTime = e
    // },
    changeLevel (item) {
      const findItem = this.levelList.find(_c => _c.value === item)
      this.$emit('changeLevel', findItem?.color)
    }
  }
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .BasicInformation {
    height: calc(100vh - 510px);
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .BasicInformation {
    height: calc(100vh - 460px);
  }
}
@media screen and (min-width: 1920px) {
  .BasicInformation {
    height: calc(100vh - 460px);
  }
}
.BasicInformation {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  overflow: auto;
}
.BasicInformation::-webkit-scrollbar {
  width: 0;
}
::v-deep .quick_time_select {
  width: 100% !important;
  border: none;
  &.active {
    border: none !important;
  }
  .el-input__inner {
    padding: 0;
  }
  .el-range-input {
    // color: red !important;
    width: 41%;
    &::placeholder {
      color: var(--base-text-color-1) !important;
      font-size: 14px;
    }
  }
  .el-range-separator {
    line-height: inherit;
  }
  .dateIcon {
    width: auto;
    .el-icon-date {
      color: var(--base-text-color-1);
    }
  }
}
</style>
