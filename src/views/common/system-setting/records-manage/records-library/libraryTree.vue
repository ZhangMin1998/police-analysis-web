<template>
  <div class='tree_node'>
    <div class='node' v-for='(item, index) in data' :key='index'>
      <div class='node_content' @click.stop='nodeClick(item)' :class='{ "active": item.label === activeNode }'>
        <div class='node_info' :style='{ "padding-left": $pxToRem(item.level * 24) }'>
          <i v-if='item.children && item.children.length' v-show='item.showChild' class='el-icon-caret-bottom'></i>
          <i v-if='item.children && item.children.length' v-show='!item.showChild' class='el-icon-caret-right'></i>
          <div v-else class='tree_division'></div>
          <div class='node_name'>{{ item.label }}</div>
        </div>
        <div v-if='item.editor && item.editor.length && dataManageTagIsEdit==="true"' class='opera' @mouseover='mouseOn(item, $event)' @mouseout='mouseOut(item)'>
          <div>···</div>
          <div v-show='item.showOpera' class='opera_btn' id='operaBtn' :style='{ "top": dialogTop }'>
            <div class='btn' :class='{ "can_opera": item.editor.includes("add") }' @click.stop='operaClick("add", item)'>新建</div>
            <div class='btn' :class='{ "can_opera": item.editor.includes("rename") }' @click.stop='operaClick("rename", item)'>重命名</div>
            <div class='btn' :class='{ "can_opera": item.editor.includes("del") }' @click.stop='operaClick("del", item)'>删除</div>
          </div>
        </div>
      </div>
      <div v-if='item.children && item.children.length' v-show='item.showChild' class='tree_node_children'>
        <LibraryTree :treeData='item.children' :activeNode='activeNode' @nodeClick='nodeClick' @updateEntity='updateEntity' :isScroll='isScroll'></LibraryTree>
      </div>
    </div>
  </div>
</template>

<script>
import { delEntity } from '@/api/sysSetting'
import { mapState } from 'vuex'
export default {
  name: 'LibraryTree',
  inject: ['operaEntity', 'treeScroll'],
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    activeNode: {
      type: String,
      default: ''
    },
    isScroll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogTop: '',
      hoverEntity: '',
      treeScrollHeight: null
    }
  },
  computed: {
    ...mapState('User', {
      dataManageTagIsEdit:'dataManageTagIsEdit',
    }),
    data: {
      get () {
        return this.treeData
      },
      set (value) {
        this.$emit('update:treeData', value)
      }
    }
  },
  watch: {
    treeScrollHeight: {
      handler (newVal) {
        if (newVal) {
          this.treeScroll(true)
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.treeScrollHeight = document.getElementById('treeWrap').scrollHeight
    })
  },
  methods: {
    nodeClick (item) {
      if ('showChild' in item) {
        if (item.children && item.children.length) {
          item.showChild = !item.showChild
          this.$nextTick(() => {
            this.treeScrollHeight = document.getElementById('treeWrap').scrollHeight
          })
        }
      }
      if (item.haveDetail) {
        this.$emit('nodeClick', item)
      }
    },
    mouseOn (item, e) {
      if (item.label !== this.hoverEntity || this.isScroll) {
        this.dialogTop = e.clientY + 'px'
        this.hoverEntity = item.label
        this.treeScroll(false)
      }
      item.showOpera = true
    },
    mouseOut (item) {
      item.showOpera = false
    },
    updateEntity () {
      this.$emit('updateEntity')
    },
    operaClick (type, item) {
      if (!item.editor.includes(type)) return
      if (type === 'del') {
        if (item.children && item.children.length) {
          this.$policeComfirm(`请先删除${item.label}下的全部实体`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          return
        }
        this.$policeComfirm('您确定要删除该实体吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          delEntity({
            id: +item.id
          }).then(() => {
            this.$message.success('删除成功！')
            this.updateEntity()
          })
        })
      } else {
        this.operaEntity(type, item)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.div {
  box-sizing: border-box;
}
.tree_node {
  font-size: 16px;
  line-height: 20px;
  color: var(--base-text-color-1);
  .node_content {
    display: flex;
    justify-content: space-between;
    padding: 10px 16px 10px 0;
    cursor: pointer;
    &:hover {
      background: var(--record-library-tree);
    }
    &.active {
      background: var(--record-library-tree);
    }
    .node_info {
      display: flex;
      align-items: center;
      flex: 1;
      i {
        margin-right: 8px;
        color: var(--base-text-color-to-666666);
      }
      .tree_division {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
    .opera {
      flex: none;
      color: var(--base-text-color-to-666666);
      font-weight: bold;
    }
    .opera_btn {
      background: var(--datapicker-shijian-xiala-bg-color);
      border: 1px solid var(--border-color-1);
      position: fixed;
      z-index: 10;
      .btn {
        min-width: 84px;
        padding: 9px 0;
        font-size: 14px;
        line-height: 14px;
        text-align: center;
        color: var(--record-library-tree-opera);
        cursor: not-allowed;
        &.can_opera {
          color: var(--base-text-color-2);
          cursor: pointer;
          &:hover {
            background: var(--datapicker-in-range-bg-color);
            color: var(--base-text-color-1);
          }
        }
      }
    }
  }
}
</style>
