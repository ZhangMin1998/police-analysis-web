<template>
  <div class="All">
    <Trail v-if="activeChart === 'map'" :personInfo="personInfo"></Trail>
    <TrailTable v-else></TrailTable>
  </div>
</template>

<script>
import Trail from '@/views/common/all-archives/personFileDetail/components/Trail/trail'
import TrailTable from '@/views/common/all-archives/personFileDetail/components/Trail/trailTable'
export default {
  name: 'All',
  components: {
    Trail,
    TrailTable
  },
  props: {
    activeChart: {
      type: String,
      default: ''
    },
    personInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
.All{

}
</style>
