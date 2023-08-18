<template>
<div class='binary_tree_wrap'>
  <div v-if='!isNoData' :id='treeId' class='tree'></div>
  <NoEmpty v-else></NoEmpty>
</div>
</template>

<script>
import G6 from '@antv/g6'
import NoEmpty from '@/components/BasicComponents/NoEmpty/index.vue'
export default {
  name: 'BinaryTree',
  components: {
    NoEmpty
  },
  props: {
    treeData: {
      type: Object,
      default: () => {
        return {
          nodes: [],
          edges: []
        }
      }
    },
    treeId: {
      type: String,
      default: 'tree'
    }
  },
  data () {
    return {
      tree: null
    }
  },
  computed: {
    isNoData () {
      return !this.treeData || !this.treeData.nodes.length
    }
  },
  mounted () {
    if (this.isNoData) return
    this.init()
  },
  methods: {
    init () {
      let container = document.getElementById(this.treeId)
      let width = container.scrollWidth
      let height = container.scrollHeight || 500
      this.graph = new G6.Graph({
        container: this.treeId,
        linkCenter: true,
        width,
        height,
        fitView: true,
        modes: {
          default: ['drag-canvas', 'zoom-canvas'],
        },
        layout: {
          type: 'dagre',
          direction: 'TB'
        },
        defaultNode: {
          size: 40,
          type: 'circle',
          style: {
            fill:	'#c4eff6',
            stroke: this.$themeColor('--active-color'),
          },
          labelCfg: {
            style: {
              fontSize: 14,
              fill: this.$themeColor('--active-color')
            }
          }
        },
        defaultEdge: {
          type: 'line',
          size: 1,
          color: '#e2e2e2',
          style: {
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              fill: this.$themeColor('--border-color-2'),
              d: -20
            },
            radius: 20
          },
          labelCfg: {
            refY: 10,
            autoRotate: true,
            style: {
              fontSize: 14,
              fill: this.$themeColor('--base-text-color-to-666666')
            }
          }
        },
      })

      this.graph.data(JSON.parse(JSON.stringify(this.treeData)))
      this.graph.render()
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.binary_tree_wrap {
  width: 100%;
  height: 98%;
  .tree {
    width: 100%;
    height: 100%;
  }
}
</style>
