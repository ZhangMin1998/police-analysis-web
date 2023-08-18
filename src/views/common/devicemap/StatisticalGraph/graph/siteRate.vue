<template>
  <div class="card-box">
    <CardTitle class="title-box" :title="title" />
    <CustomDatePicker :value="timeValue" @changeValue="changeValue" />
    <PieChart :id="boxId" :colors="['#00fdd8', '#20b7fe']" :countRate="countRate" />
  </div>
</template>

<script>
import CardTitle from '../title'
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import CustomDatePicker from '@/components/BasicComponents/CustomDatePicker/'
import { getDeviceOnlineStatistics, getPlaceOnlineStatistics } from '@/api/equipMap'
import PieChart from './pieChart'
import { generateSevenDay } from '@/utils/'

export default defineComponent({
  components: {
    CardTitle,
    CustomDatePicker,
    PieChart
  },
  props: {
    title: {
      type: String,
      default: '场所设备数统计'
    },
    value: {
      type: Array
    },
    boxId: {
      type: String,
      default: 'guage-1'
    },
    type: {
      type: String,
      required: true
    }
  },
  setup (props) {
    let timeValue = ref(generateSevenDay())

    const FetchUrl = props.type == 'device' ? getDeviceOnlineStatistics : getPlaceOnlineStatistics
    const params = {
      startTime: '',
      endTime: ''
    }

    const countRate = reactive({
      onRate: '',
      total: '0',
      onlineTotal: '0',
      offlineTotal: '0'
    })

    const fetchData = async value => {
      if (!value || value.length != 2) return

      params.startTime = value[0]
      params.endTime = value[1]

      const res = await FetchUrl(params)
      for (const key in res) {
        countRate[key] = res[key]
      }
    }

    const changeValue = async value => {
      fetchData(value)
    }

    onMounted(() => {
      fetchData(timeValue.value)
    })

    return {
      changeValue,
      timeValue,
      countRate
    }
  }
})
</script>

<style lang="less" scoped>
.card-box {
  padding: 16px 16px 0;
  font-size: 16px;
}
</style>
