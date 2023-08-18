import Vue from 'vue'

export const chartOption = {
  // 类目数组
  legend: [
    {
      data: [],
      x: 'right',
      y: 'bottom',
      itemWidth: 24,
      itemHeight: 24,
      selectedMode: false,
      textStyle: {
        color: Vue.prototype.$themeColor('--base-text-color-to-666666'),
        fontSize: 12
      }
    }
  ],
  // 提示框的配置
  tooltip: {
    show: true,
    backgroundColor: Vue.prototype.$themeColor('--tooltip-bg-262D44-to-f6f8fd'),
    borderWidth: 0,
    //  extraCssText:'width:100px;height:300px;',
    enterable: true,
    triggerOn: 'mousemove',
    position: 'right',
    hideDelay: 10,
    // transitionDuration:'2',
    textStyle: {
      //默认值，
      color: Vue.prototype.$themeColor('--base-text-color-to-666666'), //默认值各异，
      fontSize: 16 //默认值，
    },
    padding: 10,
    formatter: params => {
      // 关系线的提示
      if (params.dataType === 'edge') {
        return
      }
      let result = ''
      params.data.labelList.forEach(item => {
        result += `<div>${item.srcFieldManage.fieldNameCn || '--'}</div>`
      })
      return `<div>${result}</div>`
    }
  },
  series: [
    {
      type: 'graph', // 类型:关系图
      top: '10%', // 图表距离容器顶部的距离
      layout: 'force', //图的布局，类型为力导图
      legendHoverLink: false, //是否启用图例 hover(悬停) 时的联动高亮。
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [2, 8],
      force: {
        edgeLength: 300, // 两个节点之间的距离
        repulsion: 1000 //节点之间的斥力因子值
      },
      roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
      draggable: true, //每个节点的拖拉
      // 关系线样式lineStyle
      lineStyle: {
        show: true,
        width: 1,
        color: Vue.prototype.$themeColor('--base-text-color-to-999999'), //决定边的颜色是与起点相同还是与终点相同 可选'target'
        curveness: 0.2 // 边的曲度，支持从 0 到 1 的值，值越大曲度越大。
      },
      //图形上的文本标签，可用于说明图形的一些数据信息
      label: {
        //标签的字体样式
        color: Vue.prototype.$themeColor('--base-text-color-1'), //字体颜色
        fontStyle: 'normal', //文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
        fontWeight: 'bolder', //'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
        fontFamily: 'sans-serif', //文字的字体系列
        fontSize: 12, //字体大小
        show: true, //显示
        position: 'top', //相对于节点标签的位置，默认在节点中间
        //回调函数，你期望节点标签上显示什么
        formatter: function (params) {
          return params.data.entityName || params.name
        }
      },
      edgeLabel: {
        show: true,
        fontSize: 12,
        color: Vue.prototype.$themeColor('--base-text-color-to-666666'),
        formatter: function (params) {
          let result = params.data.relationshipName || ''
          if (params.data.srcFieldNameCn) {
            result += `（${params.data.srcFieldNameCn}）`
          }
          return result
        }
      },
      emphasis: {
        scale: true, //是否开启鼠标悬停节点的显示动画
        lineStyle: {
          width: 2
        },
        shadowColor: '#00FAE1',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 40,
        focus: 'adjacency'
      },
      symbolSize: 20, //节点大小
      categories: [],
      links: [],
      data: [],
      cursor: 'pointer',
      nodeStyle: {
        brushType: 'both',
        borderColor: 'rgba(255,215,0,0.4)',
        borderWidth: 1
      }
    }
  ],
  // 动画更新变化时间
  animationDurationUpdate: 100, //数据更新动画的时长。[ default: 300 ]
  animationEasingUpdate: 'quinticInOut' //// 数据更新动画的缓动效果。[ default: cubicOut ]    "quinticInOut"
}
