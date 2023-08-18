<template>
  <div class="validator-wrapper">
    <span slot="title" class="dialog-title">
      <div class="rule-content">
        <list-title title="数据校验" />
      </div>
    </span>

    <div class="search-wrapper">
      <el-form :inline="true" :model="switchParams" ref="switchRef" :rules="switchRules">
        <el-form-item label="类型：">
          <el-select v-model="switchParams.data_type" placeholder="请选择">
            <el-option
              v-for="(item, index) in optionsList.list"
              :key="index"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数目：" prop="record_num">
          <el-input v-model="switchParams.record_num"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="" @click="switchHandle">验 证</el-button >
          <el-button type="primary" class="" @click="switchReset">重 置</el-button >
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData.list" style="width: 100%;" max-height="400">
      <!-- file fields -->
      <el-table-column label="日志" align="center" fixed="left">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.file.content }}</p>
            <div slot="reference" class="name-wrapper">
              <i class="el-icon-tickets"></i>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- random fields -->
      <el-table-column
        v-for="(column, index) in tableData.headers"
        :key="index"
        :label="column"
        width="120">
        <template slot-scope="scope">
          <template v-if="scope.row[column].error">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row[column].tooltip }}</p>
              <div slot="reference" class="name-wrapper">
                <div class="error-content">
                  {{ scope.row[column].content || '错误信息' }}
                </div>
              </div>
            </el-popover>
          </template>
          <template v-else>
            <div class="normal-content"> {{ scope.row[column].content || '成功' }} </div>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reactive, ref, watch } from "@vue/composition-api";
import { validationStart, validationRecords } from "@/api/sysSetting";

// const FAKE_DATA = [
//   {
//     COMPANY_ID: "755652234",
//     DEVICENUM: "755652234D4EE0759E5BE",
//     DEVICE_MAC: "D4-EE-07-59-E5-BE",
//     IMEI: "111111111111111",
//     IMSI: "111111111111111",
//     MAC: "11-11-11-11-11-11",
//     PHONE: "11111111111",
//     POWER: "-88",
//     SERVICECODE: "37100221073222",
//     START_TIME: 1609836060,
//     STATION: "中国移动",
//     XPOINT: "113.96128",
//     YPOINT: "22.567758",
//     error: {
//       COORDINATE_SYSTEM: "必要字段未在数据中出现",
//       END_TIME: "必要字段未在数据中出现",
//       IMSI: "格式异常，不为15位",
//       LATITUDE: "必要字段未在数据中出现",
//       LONGITUDE: "必要字段未在数据中出现",
//       PHONE: "格式异常，非正常手机",
//       SESSION_ID: "必要字段未在数据中出现",
//       XPOINT: "非法字段",
//       YPOINT: "非法字段",
//       related_check: "SERVICECODE第9、10位不为COMPANY_ID后两位",
//     },
//     file:
//       "/var/suntang/data/warn/DWZM/20210106/00/202011361400012888_430300_755652234_022.log",
//   },
// ];

export default {
  setup () {
    const optionsList = reactive({
      list: [{ label: '电子围栏', value: 'fence_type' }]
    })
    const tableData = reactive({ list: [], headers: [] })
    const maxCount = 5
    let curCount = 0

    watch(
      () => tableData.list,
      (newVal) => {
        const headerSet = new Set()
        newVal?.forEach(column => Object.keys(column).map(item => (item !== 'file') && headerSet.add(item)))
        tableData.headers = [...headerSet]
        console.log('tabledata', tableData.headers);
      })
    const switchParams = reactive({
      record_num: 10,
      data_type: "fence_type",
    });

    const requestParams = { record_num: 1 }
    const switchHandle = async () => {
      switchRef.value.validate(async valid => {
        if (valid) {
          const resInfo = await validationStart(switchParams)
          if (!resInfo.includes('start')) {
            return
          }

          tableData.list = []
          curCount = 0
          timer && clearTimeout(timer);

          requestParams.record_num = Math.ceil(switchParams.record_num / 4)
          cycleRequest()
        }
      })
    };

    const switchReset = () => {
      switchParams.record_num = 10
      switchParams.data_type = 'fence_type'
    }

    let timer = null;
    const cycleRequest = async () => {
      if (tableData.list.length >= switchParams.record_num || curCount >= maxCount) {
        timer && clearTimeout(timer);
        curCount = 0
        return
      }

      const result = await validationRecords(requestParams)

      if (Array.isArray(result)) {
        // console.log('结果', result.map(column => formatDataHeader(column)))
        tableData.list = [...tableData.list, ...result.map(column => formatDataHeader(column))]
      } else {
        curCount += 1
      }

      // tableData.list = [formatDataHeader(FAKE_DATA[0])]
      timer = setTimeout(cycleRequest, 2000)
    };

    // 格式化内容
    const formatDataHeader = (data) => {
      const res = {};
      const errorObject = data["error"];
      for(const key in errorObject) {
        res[key] = { content: '', error: true, tooltip: errorObject[key] }
      }
      for (const key in data) {
        if (key === "error") continue;  // if key equal 'error', jump
        const isError = Reflect.has(res, key)
        if (isError) {
          res[key]['content'] = data[key]
        } else {
          res[key] = { content: data[key], error: false }
        }
      }
      return res;
    };

    const switchRef = ref('')
    const checkNums = (rule, value, callback) => {
      if(!value) return callback(new Error('不能为空'))
      value = Number(value)
      setTimeout(() => {
        if (!Number.isInteger(value)) callback(new Error('请输入整数'))
        else {
          (value > 200 || value < 1)? callback(new Error('确保范围1-200')) : callback()
        }
      })
    }
    const switchRules = reactive({
      record_num: [ { validator: checkNums, trigger: 'blur' }]
    })
    return {
      switchHandle,
      tableData,
      optionsList,
      switchParams,
      switchReset,
      switchRef,
      switchRules
    };
  },
};
</script>

<style lang="less" scoped>
.validator-wrapper {
  padding: 16px;
  box-sizing: border-box;
  .search-wrapper {
    margin: 16px 0 28px 0;
  }
}

.error-content {
  background: rgb(168, 79, 79);
  border-radius: 4px;
  text-align: center;
}
</style>
