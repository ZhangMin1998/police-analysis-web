<template>
  <div class='records_atlas_wrap'>
    <AtlasList v-if='showComponent === "list"' :listCurrentPage.sync='listCurrentPage' @toOpera='changeStatus'></AtlasList>
    <AtlasEditor :row='row' @toList='changeStatus' v-else-if='showComponent === "editor"'></AtlasEditor>
    <AtlasDetail :row='row' @toList='changeStatus' v-else-if='showComponent === "detail"'></AtlasDetail>
  </div>
</template>

<script>
import AtlasList from './atlasList.vue'
import AtlasEditor from './atlasEditor.vue'
import AtlasDetail from './atlasDetail.vue'
export default {
  name: 'RecordsAtlas',
  components: {
    AtlasList,
    AtlasEditor,
    AtlasDetail
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
.records_atlas_wrap {
  height: 100%;
}
</style>
