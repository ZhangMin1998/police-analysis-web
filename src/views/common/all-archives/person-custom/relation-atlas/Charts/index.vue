<template>
  <div id="chart" class="chart"></div>
</template>
<script>
import { colors, typeImgsMap } from './mock'
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
export default {
  name: 'Charts',
  props: { chartList: Array },

  data () {
    return {
      myChart: null,
      seriesData: [],
      seriesLinks: [],
      seriesCategories: []
    }
  },

  computed: {
    ...mapGetters('Dict', {
      usefulRelationTypeListMap: 'usefulRelationTypeListMap',
      usefulRelationTypeList: 'usefulRelationTypeList'
    })
  },

  watch: {
    chartList: {
      handler (val) {
        if (!val.length) return
        this.myChart && this.myChart.dispose()
        this.myChart = null

        this.formatData(val)
      },
      immediate: true, //关键
      deep: true
    }
  },
  // mounted() {
  //   console.log(this.usefulRelationTypeList)
  // },

  methods: {
    // 数据格式化
    formatData (list) {
      // 存在类别 赋值
      this.seriesCategories = this.formatCates(list[0])
      this.seriesLinks =
        list[1]?.map(_c => {
          return { source: _c.startNodeId + '', target: _c.endNodeId + '', ..._c }
        }) ?? []
      const typeImgsMapOBJ = { ...typeImgsMap }
      const nArr =
        list[0]?.map(_c => {
          if (_c.typeCode !== 'entity_person_type') {
            _c.name = _c.index
          }
          _c.category = this.seriesCategories.findIndex(
            ele => ele.name === this.usefulRelationTypeListMap[_c.typeCode]
          )
          _c.symbolSize = 38
          if (typeImgsMapOBJ[_c.typeCode]) {
            _c.symbol = 'image://' + require(`@/assets/img/${typeImgsMapOBJ[_c.typeCode]}.png`)
          }
          // if (typeImgsMapOBJ[_c.typeCode] && _c.typeCode !== 'entity_person_type') {
          //   _c.symbol = 'image://' + require(`@/assets/img/${typeImgsMapOBJ[_c.typeCode]}.png`)
          // } else {
          //   _c.symbolSize = 100
          //   if (_c.avatarUrl) {
          //     _c.symbol = 'image://' + window.location.origin + '/' + _c.avatarUrl
          //   } else {
          //     _c.symbol = 'image://' + require('@/assets/img/icon-morenHeader.png')
          //     // _c.symbol = 'image://' + require(`@/assets/img/${typeImgsMapOBJ[_c.typeCode]}.png`)
          //   }

          // }
          _c.id = _c.id + ''
          return _c
        }) ?? []
      // 不可有重复name否则会报错
      // this.seriesData = nArr.filter((element, index, self) => {
      //   return self.findIndex(x => x.name === element.name) === index
      // })
      this.seriesData = nArr

      this.$nextTick(() => {
        this.initCharts()
      })
    },

    // 处理显示类别为有数据的类别
    formatCates (list) {
      const nameList = list.map(_c => this.usefulRelationTypeListMap[_c.typeCode])
      const uniqueArr = [...new Set(nameList)]

      // 将人员放在数组首项
      const index = uniqueArr.findIndex(_c => _c === '人员')
      if (index !== -1) {
        const personItem = uniqueArr.splice(index, 1)
        uniqueArr.unshift(personItem[0])
      }

      return uniqueArr.map(_c => {
        return { name: _c }
      })
    },

    /**
     * 设置echarts配置项,重绘画布
     */
    initCharts () {
      const _this = this

      if (!this.myChart) {
        this.myChart = echarts.init(document.getElementById('chart'))

        this.myChart.off('legendselectchanged') //解决重复触发
        // this.myChart.off('click') //解决重复触发
        // this.myChart.getZr()?.off('click') //解决重复触发

        this.myChart.on('click', params => {
          // console.log(params);
          if (params.dataType === 'node') {
            this.$emit('handleClickNode', params.data)
          } else if (params.dataType === 'edge') {
            this.$emit('handleClickEdge', params.data)
          }
        })
        // 双击事件
        // this.myChart.on('dblClick', params => {
        //   console.log(66666)
        // })
        // 点击
        this.myChart.getZr().on('click', params => {
          if (!params.target) {
            this.$emit('handleClickOut')
          }
        })

        this.myChart.on('legendselectchanged', e => {
          console.log(e);
          const { name, selected } = e
          let { legend } = _this.myChart.getOption()
          const index = legend[0].data.findIndex(_c => _c.name === name)
          const typeImgsMapOBJ = { ...typeImgsMap }
          const typeCode =
            this.usefulRelationTypeList.find(ele => ele.typeName === name)?.typeCode ?? ''
          if (!selected[name]) {
            legend[0].data[index].icon =
              typeCode && typeImgsMapOBJ[typeCode]
                ? 'image://' + require(`@/assets/img/${typeImgsMapOBJ[typeCode]}-g.png`)
                : ''
          } else {
            legend[0].data[index].icon =
              typeCode && typeImgsMapOBJ[typeCode]
                ? 'image://' + require(`@/assets/img/${typeImgsMapOBJ[typeCode]}.png`)
                : ''
          }
          const option = { ..._this.myChart.getOption(), legend }
          _this.myChart.setOption(option)
        })

        this.myChart.on('mousedown', e => {
          if (e.dataType === "edge") { return }
          let { tooltip } = _this.myChart.getOption()
          tooltip[0].trigger = 'none'
          const option = { ..._this.myChart.getOption(), tooltip }
          _this.myChart.setOption(option)
        })
        this.myChart.on('globalout', () => {
          let { tooltip } = _this.myChart.getOption()
          tooltip[0].trigger = 'item'
          const option = { ..._this.myChart.getOption(), tooltip }
          setTimeout(() => {
            _this.myChart.setOption(option)
          }, 20)
        })
        this.myChart.on('mouseup', () => {
          let { tooltip } = _this.myChart.getOption()
          tooltip[0].trigger = 'item'
          const option = { ..._this.myChart.getOption(), tooltip }
          setTimeout(() => {
            _this.myChart.setOption(option)
          }, 20)
        })
      }

      // 指定图表的配置项和数据
      let option = {
        backgroundColor: '#192035',
        // 提示框的配置
        tooltip: {
          backgroundColor: 'rgba(40, 50, 71,.9)',
          borderWidth: 0,
          //  extraCssText:'width:100px;height:300px;',
          enterable: true,
          triggerOn: 'mousemove',
          position: 'right',
          hideDelay: 10,
          // transitionDuration:'2',
          textStyle: {
            //默认值，
            color: '#c0d0e7', //默认值各异，
            fontSize: 16 //默认值，
          },
          padding: 10,
          formatter: params => {
            {
              // 关系线的提示
              if (params.dataType === 'edge') {
                return
              }

              if (params.data.typeCode === 'entity_person_type') {
                const birthday = params.data.birthday?.split(' ')[0] ?? '--'
                // const nationObj = this.$store.getters['Dict/nationListMap']
                // const imgUrl = params.data.avatarUrl
                //   ? window.location.origin + '/' + params.data.avatarUrl
                //   : require('@/assets/img/icon-morenHeader.png')
                const imgUrl = params.data.avatarUrl
                  ? window.location.origin + '/' + params.data.avatarUrl
                  : require('@/assets/img/icon-morenHeader.png')

                return `
                <div style="display:flex">
                    <img style="height:90px;width:75px;object-fit: cover;" src="${imgUrl}"" />
                    <div style="margin-left:8px;">
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;color: #8799BF;">姓名：</div>
                        <div>
                          ${params.data.name || '--'}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;color: #8799BF;">性别：</div>
                        <div>
                          ${params.data.sex || '--'}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;color: #8799BF;">民族：</div>
                        <div>
                          ${params.data.nation || '--'}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;color: #8799BF;">出生日期：</div>
                        <div>
                          ${birthday || '--'}
                        </div>
                      </div>
                    </div>
                </div>
                <div style="margin-top:0px;">
                  <div>
                    <span style="font-size:14px;color: #8799BF;">证件类型：</span>
                    <span>${params.data.cerTypeName || '--'}</span>
                  </div>
                  <div>
                    <span style="font-size:14px;color: #8799BF;">证件号码：</span>
                    <span>${params.data.cerNumber || '--'}</span>
                  </div>
                  <div>
                    <span style="font-size:14px;color: #8799BF;">居住地址：</span>
                    <span style="display:${params.data.currentAddr ? 'none' : 'inline-block'}">--</span>
                    <span style="display:${params.data.currentAddr && params.data.currentAddr.length ? 'inline-block' : 'none'}">
                    ${params.data.currentAddr.substring(0, 25)} </span>
                  </div>
                  <div style="display:${params.data.currentAddr && params.data.currentAddr.length > 25 ? 'block' : 'none'}">
                    <span style="display:inline-block;width:70px;font-size:14px;color: #8799BF;"></span>
                    <span>${params.data.currentAddr.slice(25, params.data.currentAddr.length)}</span>
                  </div>
                   <div>
                    <span style="font-size:14px;color: #8799BF;">户籍地址：</span>
                    <span style="display:${params.data.registeredAddr ? 'none' : 'inline-block'}">--</span>
                    <span style="display:${params.data.registeredAddr && params.data.registeredAddr.length ? 'inline-block' : 'none'}">
                    ${params.data.registeredAddr.substring(0, 25)} </span>
                  </div>
                  <div style="display:${params.data.registeredAddr && params.data.registeredAddr.length > 25 ? 'block' : 'none'}">
                    <span style="display:inline-block;width:70px;font-size:14px;color: #8799BF;"></span>
                    <span>${params.data.registeredAddr.slice(25, params.data.registeredAddr.length)}</span>
                  </div>
                </div>
                `
              } else if (params.data.typeCode === 'entity_community_car_type') {
                return `
                  <div>
                    <span style="font-size:14px;color: #8799BF;">车牌号：</span>
                    <span>${params.data.carLicense || '--'}</span>
                  </div>
                  <div>
                    <span style="font-size:14px;color: #8799BF;">车辆编码：</span>
                    <span>${params.data.carFrame || '--'}</span>
                  </div>
                `
              } else if (params.data.typeCode === 'entity_probe_phone_type') {
                return `
                <div>
                  <span style="font-size:14px;color: #8799BF;">手机号：</span>
                  <span>${params.data.phone || '--'}</span>
                </div>
                <div>
                  <span style="font-size:14px;color: #8799BF;">IMEI：</span>
                  <span>${params.data.imei || '--'}</span>
                </div>
                <div>
                  <span style="font-size:14px;color: #8799BF;">IMSI：</span>
                  <span>${params.data.imsi || '--'}</span>
                </div>
                `
              } else if (params.data.typeCode === 'entity_assets_house_type') {
                return `
                <div>
                  <span style="font-size:14px;color: #8799BF;">不动产证号：</span>
                  <span>${params.data.assetsCode || '--'}</span>
                </div>
                `
              }
              return `
                <div>
                  <span style="font-size:14px;color: #8799BF;">${this.usefulRelationTypeListMap[params.data.typeCode]}：</span>
                  <span>${params.name || '--'}</span>
                </div>
              `
            }
          }
        },
        // 类目color
        color: colors,
        // 类目数组
        legend: [
          {
            data: this.seriesCategories.map(_c => {
              const typeImgsMapOBJ = { ...typeImgsMap }
              const typeCode =
                this.usefulRelationTypeList.find(ele => ele.typeName === _c.name)?.typeCode ?? ''
              return {
                name: _c.name,
                icon:
                  typeCode && typeImgsMapOBJ[typeCode]
                    ? 'image://' + require(`@/assets/img/${typeImgsMapOBJ[typeCode]}.png`)
                    : ''
              }
            }),
            x: 'right',
            y: 'bottom',
            itemWidth: 24,
            itemHeight: 24,
            textStyle: {
              color: 'rgba(174, 189, 212,0.9)',
              fontSize: 12
            }
          }
        ],
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
              color: '#8799BF', //决定边的颜色是与起点相同还是与终点相同 可选'target'
              curveness: 0.2 // 边的曲度，支持从 0 到 1 的值，值越大曲度越大。
            },
            //图形上的文本标签，可用于说明图形的一些数据信息
            label: {
              //标签的字体样式
              color: '#c0d0e7', //字体颜色
              fontStyle: 'normal', //文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
              fontWeight: 'bolder', //'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
              fontFamily: 'sans-serif', //文字的字体系列
              fontSize: 12, //字体大小
              show: true, //显示
              position: 'top', //相对于节点标签的位置，默认在节点中间
              //回调函数，你期望节点标签上显示什么
              formatter: function (params) {
                // 对手机号特殊处理，标签上优先取手机号，没有则依次取值
                if (params.data.typeCode === 'entity_probe_phone_type') {
                  return params.data.phone || params.data.imei || params.data.imsi
                } else {
                  return params.name
                }
              }
            },
            edgeLabel: {
              show: true,
              fontSize: 12,
              color: '#8799BF',
              formatter: function (x) {
                return x.data.relationShipName || ''
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
            categories: this.seriesCategories,
            links: this.seriesLinks,
            data: this.seriesData,
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

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    },

    switchHigh (index, name) {
      this.myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: index,
        name: name
      })
    }
  }
}
</script>
<style scoped>
.chart {
  height: 100%;
  user-select: text !important;
}
.cusEchart-label {
  width: 500px;
}
</style>
