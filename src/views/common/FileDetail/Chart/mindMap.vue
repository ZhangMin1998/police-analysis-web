<template>
  <div class="data_synchronization_detail">
    <div class="main_container">
      <!-- <mindmap id="mindmap"  v-model="mindData" height='680' :strokeWidth="2" :xSpacing="50" :ySpacing="10" :gps="false" :download="false" :fitView="false" :keyboard="false" :draggable="true" :showNodeAdd="false" :contextMenu="false" :zoomable="true" :showUndo="false"></mindmap> -->
      <mindmap
        id="mindmap"
        v-model="mindData"
        :height="getSvgHeight()"
        :strokeWidth="2"
        :xSpacing="10"
        :ySpacing="10"
        :gps="false"
        :fitView="false"
        :zoomable="false"
        :download="false"
        :contextMenu="false"
        :showUndo="false"
        :keyboard="false"
        :draggable="false"
        :showNodeAdd="false"
      ></mindmap>
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
      tableData: []
    }
  },
  created () {
    this.mindData = this.chartData
    // console.log(this.mindData);
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
  mounted () {
    let svgDom = document.querySelector('#mindmap svg g')
    let svgHeight = svgDom.getBoundingClientRect().height
    let imgTY = '50%'
    let imgTx = '50%'
    let imgS = '1'
    let boxWidth = document.querySelector('#mindmap svg').getBoundingClientRect().width - 48
    let svgWidth = svgDom.getBoundingClientRect().width
    // 思维导图的缩放
    if (svgWidth > boxWidth) {
      imgS = boxWidth / svgWidth
    }

    let mindMapDom = document.querySelector('#mindmap svg g g').childNodes
    let childList = Array.from(mindMapDom).slice(1, -2)

    // 在X轴的偏移
    let translateX = 0
    let translateXWay = null
    childList.forEach(item => {
      let itemWidth = item.getBoundingClientRect().width
      if (itemWidth > (boxWidth / 2) && translateX < itemWidth) {
        translateX = itemWidth
        translateXWay = item.__data__.dy < 0 ? 'left' : 'right'
      }
    })
    if (translateXWay) {
      if (translateXWay === 'left') {
        imgTx = translateX * imgS + 'px'
      } else if (translateXWay === 'right') {
        imgTx = (boxWidth - translateX + 50) * imgS + 'px'
      }
    }
    // 在Y轴的偏移
    if (svgHeight > 680 && childList.length > 1) {
      let maxHeight = 0
      childList.forEach((item) => {
        if (item.__data__ && item.__data__.dx && item.__data__.dx > 0) {
          let itemHeight = item.getBoundingClientRect().height
          let maxTy = item.__data__.dx
          let maxChild = Array.from(item.childNodes).slice(2, -2)
          let bigMaxTyArr = []
          let bigMaxTyHeight = 0
          maxChild.forEach(info => {
            if (info.__data__ && info.__data__.dx && info.__data__.dx < 0) {
              if (Math.abs(info.__data__.dx) > maxTy) {
                bigMaxTyArr.push(info)
              }
            }
          })
          if (bigMaxTyArr.length) {
            bigMaxTyArr.push(maxChild[bigMaxTyArr.length])
            bigMaxTyArr.forEach((item, index) => {
              if (bigMaxTyArr[index + 1]) {
                bigMaxTyHeight += (item.getBoundingClientRect().height - bigMaxTyArr[index + 1].getBoundingClientRect().height)
              } else {
                bigMaxTyHeight -= (maxTy - item.getBoundingClientRect().height)
              }
            })
            itemHeight -= bigMaxTyHeight
          }
          if (maxHeight < itemHeight) {
            maxHeight = itemHeight
          }
        }
      })
      let translateY = svgHeight - maxHeight + 94
      imgTY = translateY * imgS + 'px'
    }
    svgDom.style.transform = `translate(${imgTx}, ${imgTY}) scale(${imgS})`
  },
  methods: {
    getSvgHeight () {
      let svg = document.querySelector('#mindmap svg g')
      let g = document.querySelector('#mindmap svg')
      if (svg) {
        let height = svg.getBoundingClientRect().height

        g.removeChild(svg)
        // this.$nextTick(() => {
        //   g.appendChild(svg)
        // })

        setTimeout(() => {
          //  svg.transform.baseVal.getItem(0).setTranslate(500,3000);
          g.appendChild(svg)
          console.dir(svg);
          // svg.transform = 'translate(100 100)'
          console.log(svg.style.transform);
          //  svg.transform.baseVal.getItem(0).matrix.f = 2000

          console.log(svg.transform.baseVal.getItem(0));
        }, 500)
        console.log(height);
        return height < 680 ? 680 : height + 200
      }


      // return 600
    }
  }
}
</script>

<style lang="less" scoped>
.data_synchronization_detail {
  .main_container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-color-2);
  }
}

/deep/ div#mindmap svg {
  // flex: left;
  // outline: none;
  background-color: var(--bg-color-2);
  transform-origin: left top !important;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  g#content {
    transform-origin: left top !important;
    //transform: translate(50%, 50%) scale(1);
    // .depth_0.node{
    //   transform :translateY(18%)
    // }
    // foreignObject{
    //   transform: translate(50%, 50%);
    // }
  }
}
</style>
