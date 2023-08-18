<template>
  <div class="BasicInformation">
    <CusInput label="名称"
      ><template>
        <el-input
          v-model.trim="params.warningName"
          placeholder="请输入区域名称"
        ></el-input></template
    ></CusInput>
    <CusInput label="级别"
      ><template>
        <el-select v-model="params.fenceLevel" placeholder="请选择级别" @change="changeLevel">
          <el-option
            v-for="(item, index) in levelList"
            :key="index + '_' + item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select></template
    ></CusInput>
    <CusInput label="类型"
      ><template>
        <el-select v-model="params.fenceType" placeholder="请选择区域类型">
          <el-option
            v-for="(item, index) in areaType"
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
  </div>
</template>

<script>
import CusInput from '@/components/BasicComponents/CusInput'

import { queryReceiverPersonList,configurableSrcDataAll } from '@/api/warn'

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
    CusInput
  },
  data () {
    return {
      params: {
        warningName: '',
        fenceType: '',
        fenceLevel: '',
        receiverIds: [0],
        dataTypeList: ['all']
      },
      personnelList: [],
      levelList: levelList,
      dataTypeList: [],
    }
  },

  computed: {
    areaType () {
      return [...this.$store.state.Dict.extrAreaTypeList]
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
    this.params.fenceLevel = this.levelList[0].value
    queryReceiverPersonList().then(res => {
      this.personnelList = [...res]
    })
    configurableSrcDataAll().then(res => {
      this.dataTypeList = [...res]
    })
  },
  methods: {
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
  // height: calc(100vh - 460px);
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  overflow: auto;
}
.BasicInformation::-webkit-scrollbar {
  width: 0;
}
</style>
