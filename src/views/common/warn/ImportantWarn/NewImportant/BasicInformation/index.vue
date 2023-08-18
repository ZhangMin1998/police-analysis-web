<template>
  <div class="BasicInformation">
    <CusInput label="规则名称"
      ><template>
        <el-input
          v-model.trim="params.warningName"
          placeholder="请输入规则名称"
        ></el-input></template
    ></CusInput>

    <!-- <CusInput label="预警间隔"
      ><template>
        <el-select v-model="params.messageFrequency" placeholder="请选择预警间隔">
          <el-option
            v-for="(item, index) in [
              { label: '5分钟', value: '5' },
              { label: '15分钟', value: '15' },
              { label: '30分钟', value: '30' },
              { label: '1小时', value: '60' },
              { label: '12小时', value: '720' },
              { label: '24小时', value: '1440' }
            ]"
            :key="index + '_' + item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select></template
    ></CusInput> -->

    <CusInput label="失联时间"
      ><template>
        <el-select v-model="params.disconnection" placeholder="请选择失联时间">
          <el-option
            v-for="(item, index) in [
              { label: '24小时', value: '24' },
              { label: '48小时', value: '48' },
              { label: '72小时', value: '72' }
            ]"
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

    <CusInput label="追踪方式"
      ><template>
        <el-select placeholder="请选择追踪方式" v-model="params.monitorMode">
          <el-option
            v-for="(item, index) in [
              { label: '实时监控', value: 'realTime' },
              { label: '跟踪最后位置', value: 'lastTrack' }
            ]"
            :label="item.label"
            :value="item.value"
            :key="index + '_' + item.value"
          ></el-option>
        </el-select> </template
    ></CusInput>
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
  </div>
</template>

<script>
import CusInput from '@/components/BasicComponents/CusInput'

import { queryReceiverPersonList,configurableSrcDataAll } from '@/api/warn'

export default {
  name: 'BasicInformation',
  components: {
    CusInput
  },
  data () {
    return {
      params: {
        warningName: '',
        receiverIds: [0],
        disconnection: '24',
        // messageFrequency: '5',
        monitorMode: 'realTime',
        dataTypeList: ['all']
      },
      dataTypeList:[],
      personnelList: []
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
      let newindex = val.indexOf('all'),
          oldindex = oldval.indexOf('all') //获取val和oldval里all的索引,如果没有则返回-1
      if (newindex != -1 && oldindex == -1 && val.length > 1)
        //如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
        this.params.dataTypeList = ['all']
      else if (newindex != -1 && oldindex != -1 && val.length > 1)
        //如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
        this.params.dataTypeList.splice(val.indexOf('all'), 1)
    },
  },

  created () {
    queryReceiverPersonList().then(res => {
      this.personnelList = [...res]
    })
    configurableSrcDataAll().then(res => {
      this.dataTypeList = [...res]
    })
  },
}
</script>

<style lang="less" scoped>
@media screen and (min-width: 1024px) and (max-width: 1365px) {
  .BasicInformation {
    height: calc(100vh - 450px);
  }
}
@media screen and (min-width: 1366px) and (max-width: 1919px) {
  .BasicInformation {
    height: calc(100vh - 400px);
  }
}
@media screen and (min-width: 1920px) {
  .BasicInformation {
    height: calc(100vh - 375px);
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
</style>
