<template>
  <div class="card-box">
    <CardTitle class="title-box" :title="'场所设备数统计'" />
    <!-- <CustomDatePicker :value="timeValue" @changeValue="changeValue" /> -->
    <CustomDatePicker class="time-box" :value="timeValue" @changeValue="changeValue" />
    <LineChart
      class="line-box"
      :datas="siteCount"
      :colors="['#20b7fe', '#88e7ff']"
      :cates="['场所', '新增']"
    />
    <LineChart
      class="line-box"
      :datas="devCount"
      :colors="['#9355f4', '#d34edd']"
      :cates="['设备', '新增']"
    />
  </div>
</template>

<script>
import LineChart from './lineChart'
import CardTitle from '../title'
import { onMounted, reactive, ref } from '@vue/composition-api'
import CustomDatePicker from '@/components/BasicComponents/CustomDatePicker/'
import { getDeviceAndPlaceStatistics } from '@/api/equipMap'
import { generateSevenDay } from '@/utils/'
export default {
  components: {
    CardTitle,
    LineChart,
    CustomDatePicker
  },
  setup () {
    let timeValue = ref(generateSevenDay())
    let params = {
      startTime: '',
      endTime: ''
    }

    const siteCount = reactive([])
    const devCount = reactive([])

    const fetchData = async value => {
      params.startTime = value[0]
      params.endTime = value[1]
      const res = await getDeviceAndPlaceStatistics(params)
      siteCount.length = 0
      siteCount.push(res.placeCount, res.addPlaceCount)
      devCount.length = 0
      devCount.push(res.deviceCount, res.addDeviceCount)
    }

    const changeValue = async value => {
      if (!value || value.length != 2) return
      timeValue.value = value
      fetchData(value)
    }

    onMounted(() => {
      if (timeValue.value.length !== 2) return
      fetchData(timeValue.value)
    })

    return {
      timeValue,
      changeValue,
      siteCount,
      devCount
    }
  }
}
</script>

<style lang="less" scoped>
.card-box {
  padding: 16px;
  margin-bottom: 16px;
  font-size: 16px;
  .time-box,
  .line-box {
    margin-bottom: 16px;
  }
  .line-box:last-child {
    margin-bottom: 0;
  }
}
</style>
