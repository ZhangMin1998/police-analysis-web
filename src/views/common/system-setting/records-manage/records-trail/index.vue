<template>
<div class='records_trail_wrap'>
  <TrailList v-if='showComponent === "list"' :listCurrentPage.sync='listCurrentPage' @toOpera='changeStatus'></TrailList>
  <TrailEditor :row='row' @toList='changeStatus' v-else-if='showComponent === "editor"'></TrailEditor>
  <TrailDetail v-else-if='showComponent === "detail"' :row='row' @toList='changeStatus'></TrailDetail>
</div>
</template>

<script>
import TrailList from './trailList.vue'
import TrailEditor from './trailEditor.vue'
import TrailDetail from './trailDetail.vue'
export default {
  name: 'RecordsTrail',
  components: {
    TrailList,
    TrailEditor,
    TrailDetail
  },
  data () {
    return {
      showComponent: 'list',
      row: {},
      listCurrentPage: 0
    }
  },
  methods: {
    changeStatus (cName, row = {}) {
      this.row = row
      this.showComponent = cName
      this.$emit('changeShowTab', cName === 'list' ? true : false)
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.records_trail_wrap {
  height: 100%;
}
</style>
