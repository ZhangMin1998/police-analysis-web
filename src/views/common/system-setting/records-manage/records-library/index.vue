<template>
<div
  class='records_library_wrap'
  v-pLoading="loading"
  element-loading-text="数据加载中"
  element-loading-spinner="el-icon-loading"
  :element-loading-background="'--bg-color-3'"
>
  <div class='library_tree'>
    <div class='tree_wrap' id='treeWrap' @scroll='treeScroll(true)'>
      <LibraryTree
        :treeData.sync='treeData'
        @nodeClick='nodeClick'
        @updateEntity='updateEntity'
        :activeNode='activeNode'
        :isScroll='isScroll'
      ></LibraryTree>
    </div>
  </div>
  <div class='library_content'>
    <TagTable
      ref='tagTable'
      :showComponent='showComponent'
      @getEntityData='getEntityData'
      :activeEntityId='activeEntityId'
      :activeTrailId='activeTrailId'
      :loading.sync='loading'
    ></TagTable>
  </div>
  <pop
    :pop.sync="pop"
    @beforeClose="closeDialog"
    @beforeOpen="showDialog"
    :dataCenterDetail="true"
  >
    <EntityAddRn @closeDialog='closeDialog' :operaEntityData='operaEntityData'></EntityAddRn>
  </pop>
</div>
</template>

<script>
import LibraryTree from './libraryTree.vue'
import EntityAddRn from './entityAddRn.vue'
import TagTable from './tagTable.vue'
import Pop from '@/components/VisualComponents/PopDialog'
export default {
  name: 'RecordsLibrary',
  provide () {
    return {
      operaEntity: this.operaEntity,
      treeScroll: this.treeScroll
    }
  },
  components: {
    LibraryTree,
    Pop,
    EntityAddRn,
    TagTable
  },
  data () {
    return {
      treeData: [
        {
          label: '数据图谱',
          level: 1,
          showChild: true,
          children: [
            {
              label: '实体',
              showChild: true,
              editor: ['add'],
              showOpera: false,
              level: 2,
              children: [],
            },
            {
              label: '关系',
              level: 2,
              sign: 'relation',
              haveDetail: true
            }
          ]
        },
        {
          label: '数据轨迹',
          level: 1,
          showChild: true,
          children: [
            {
              label: '人/物',
              level: 2,
              sign: 'trail',
              id: 'attr',
              haveDetail: true
            },
            {
              label: '时间',
              level: 2,
              sign: 'trail',
              id: 'time',
              haveDetail: true
            },
            {
              label: '地点',
              level: 2,
              sign: 'trail',
              id: 'place',
              haveDetail: true
            }
          ]
        },
        {
          label: '数据标准',
          level: 1,
          sign: 'standard',
          haveDetail: true
        }
      ], // 左侧树的数据
      activeNode: '', // 初始化选中后面需根据接口修改，暂时写死
      showComponent: '', // 初始化选中后面需根据接口修改，暂时为空
      pop: { show: false, title: '新建', width: '542px' },
      activeEntityId: '', // 当前选中的实体的id
      activeTrailId: '', // 当前选中的数据轨迹的id
      operaEntityData: {}, // 操作实体时，实体的数据
      loading: true,
      isScroll: false
    }
  },
  methods: {
    treeScroll (bool) {
      this.isScroll = bool
    },
    // 左侧树组件，可选中项的选中事件
    nodeClick (item) {
      this.activeNode = item.label
      if (item.sign) {
        this.showComponent = item.sign
      }
      if (this.showComponent === 'entity') {
        this.activeEntityId = item.id || ''
      }
      if (this.showComponent === 'trail') {
        this.activeTrailId = item.id || ''
      }
    },
    closeDialog (isSuccess = false) {
      this.pop.show = false
      this.operaEntityData = {}
      if (isSuccess) {
        this.$refs.tagTable.getEntityList()
      }
    },
    showDialog () {
      this.pop.show = true
    },
    // 点击实体的操作浮窗
    operaEntity (type, item) {
      if (type === 'rename') {
        this.pop.title = '重命名'
        this.operaEntityData = { ...item, way: 'rename' }
      } else {
        this.pop.title = '新建'
        this.operaEntityData = { ...item, way: 'add' }
      }
      this.showDialog()
    },
    // 获取实体数据
    getEntityData (list) {
      this.treeData[0].children[0].children = list
      if (!this.activeNode && !this.showComponent) {
        if (list.length) {
          this.activeNode = list[0].label
          this.showComponent = 'entity'
          this.activeEntityId = list[0].id + ''
        } else {
          this.activeNode = '关系'
          this.showComponent = 'relation'
        }
      }
    },
    // 操作实体之后更新实体的数据
    updateEntity () {
      this.$nextTick(() => {
        this.$refs.tagTable.getEntityList(false, true)
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.records_library_wrap {
  display: flex;
  height: 100%;
  padding: 0 24px 32px;
  background: var(--bg-color-3);
  .library_tree {
    position: relative;
    width: 239px;
    height: 100%;
    padding: 16px 0;
    flex: none;
    background: var(--bg-color-6);
    margin-right: 16px;
    .tree_wrap {
      height: 100%;
      overflow-y: auto;
    }
  }
  .library_content {
    flex: 1;
    height: 100%;
  }
}
/deep/.data_center_detail {
  .el-dialog__wrapper {
    .el-dialog {
      .el-dialog__header {
        margin: 0 16px;
        padding-bottom: 17px;
      }
      .el-dialog__body {
        padding: 30px 32px 32px !important;
      }
    }
  }
}
//.standard_dialog {
//  /deep/.data_center_detail {
//    .el-dialog__wrapper {
//      .el-dialog {
//        .el-dialog__body {
//          padding-top: 24px !important;
//        }
//      }
//    }
//  }
//}
</style>
