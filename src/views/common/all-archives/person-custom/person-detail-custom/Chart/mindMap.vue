<template>
  <div class="data_synchronization_detail">
    <div class="main_container">
      <mindmap id="mindmap"  v-model="mindData" height='680' :strokeWidth="2" :xSpacing="50" :ySpacing="10" :gps="false" :download="false" :fitView="false" :keyboard="false" :draggable="true" :showNodeAdd="false" :contextMenu="false" :zoomable="true" :showUndo="false"></mindmap>
    </div>
  </div>
</template>

<script>
// import html2canvas from 'html2canvas'
import mindmap from '@hellowuxin/mindmap'

export default {
  components: {
    mindmap
  },
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      mindData: [],
      tableData: [],
    }
  },
  created () {
    this.mindData = this.chartData
    // getDetail(this.$route.query.id).then(res => {
    //   if (res.code === 1 && res.msg === 'success') {
    //     this.taskName = res.data.taskName
    //     this.sourceType = res.data.sourceType
    //     this.destinationType = res.data.destinationType
    //     this.sourcePath = res.data.sourcePath
    //     this.tableData = res.data.tableMapping
    //   }
    // }).catch(err => {
    //   console.log(err)
    // }).finally(() => {

    // })
  },
  methods:{

  }
}
</script>

<style lang="less" scoped>
// .data_synchronization_detail {
//   .main_container {
//     padding: 16px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
// }
/deep/ div#mindmap svg {
    -webkit-box-flex: 1;
    -ms-flex: auto;
    flex: auto;
    outline: none;
    background-color: var(--bg-color-2);
}
</style>
