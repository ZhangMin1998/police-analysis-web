<template>
  <div id="chart" class="chart"></div>
</template>
<script>
import { colors} from './mock'
import { lightTheme, darkTheme } from "@/assets/js/variable";
import { mapState } from 'vuex';
// import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
export default {
  name: 'Charts',
  props: {
    chartList: {
      type: Array
    },
    bgColor: { // 图谱背景色
      type: String
    },
    // usefulRelationTypeListMap: {
    //   type: Object
    // },
    // usefulRelationTypeList: {
    //   type: Array
    // },
    // iconObj: {
    //   type: Object
    // },
  },

  data () {
    return {
      myChart: null,
      seriesData: [],
      seriesLinks: [],
      seriesCategories: [],
      cerTypeObj: {
        attr_identity_card_type: '身份证',
        attr_passport_type: '护照',
        attr_hk_permit_type: '港澳通行证'
      },
      option: {}
      // iconObj: {}
    }
  },

  computed: {
    ...mapState('User', {
      theme: 'theme'
    }),
    ...mapState('Common', {
      iconObj: 'iconObj',
      usefulRelationTypeListMap: 'usefulRelationTypeListMap',
      usefulRelationTypeList: 'usefulRelationTypeList'
    }),
    origin () {
      return window.location.origin + '/'
    }
    // ...mapGetters('Dict', {
    //   usefulRelationTypeListMap: 'usefulRelationTypeListMap',
    //   usefulRelationTypeList: 'usefulRelationTypeList'
    // })
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
    },
    theme: {
      handler () {
        // console.log(this.myChart);
        if (this.myChart) {
          // console.log(this.option);
          // console.log('执行了');
          // this.myChart.setOption(this.option)
          this.formatData(this.chartList)
        }
      },
      immediate: true
    }
  },
  created () {
    // console.log(this.theme);
  },

  methods: {
    // 数据格式化
    formatData (list) {
      // 存在类别 赋值
      this.seriesCategories = this.formatCates(list[0])
      const sArr =
        list[1]?.map(_c => {
          return { source: _c.src + '', target: _c.dst + '', dataRelationShipName: _c.data_source, personRelationShipName: _c.relationship, ..._c }
        }) ?? []
      this.seriesLinks = sArr.filter((element, index, self) => {
        return self.findIndex(x => x.vid === element.vid) === index
      })
      // const typeImgsMapOBJ = { ...typeImgsMap }
      const nArr =
        list[0]?.map(_c => {
          if (_c.type !== 'entity_certificate_type') { // 给name赋值  默认在实体上显示
            _c.name = _c.main_prop_val
          }

          _c.category = this.seriesCategories.findIndex(
            ele => ele.name === this.usefulRelationTypeListMap[_c.type]
          )
          _c.symbolSize = 38
          // console.log(_c.type,this.iconObj[_c.type])
          _c.symbol = this.iconObj[_c.type]['icon_path'] ? 'image://' + this.origin + this.iconObj[_c.type]['icon_path'] : require(`@/assets/img/atlis-default.png`)

          // if (typeImgsMapOBJ[_c.type]) {
          //   _c.symbol = 'image://' + require(`@/assets/img/${typeImgsMapOBJ[_c.type]}.png`)
          // }
          // 以下代码保留
          // if (typeImgsMapOBJ[_c.type] && _c.type !== 'entity_certificate_type') {
          //   _c.symbol = 'image://' + require(`@/assets/img/${typeImgsMapOBJ[_c.type]}.png`)
          // } else {
          //   _c.symbolSize = 100
          //   if (_c.avatarUrl) {
          //     _c.symbol = 'image://' + window.location.origin + '/' + _c.avatarUrl
          //   } else {
          //     _c.symbol = 'image://' + require('@/assets/img/icon-morenHeader.png')
          //     // _c.symbol = 'image://' + require(`@/assets/img/${typeImgsMapOBJ[_c.type]}.png`)
          //   }
          // }

          _c.id = _c.vid
          return _c
        }) ?? []
      // 不可有重复name否则会报错
      this.seriesData = nArr.filter((element, index, self) => {
        return self.findIndex(x => x.vid === element.vid) === index
      })
      // this.seriesData = nArr

      this.$nextTick(() => {
        this.initCharts()
      })
    },

    // 处理显示类别为有数据的类别
    formatCates (list) {
      const nameList = list.map(_c => this.usefulRelationTypeListMap[_c.type])
      const uniqueArr = [...new Set(nameList)]
      // console.log(uniqueArr)
      // 将人员放在数组首项
      // const index = uniqueArr.findIndex(_c => _c === '人员')
      // if (index !== -1) {
      //   const personItem = uniqueArr.splice(index, 1)
      //   uniqueArr.unshift(personItem[0])
      // }

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

        // this.myChart.on('click', params => {
        //   console.log(params);
        //   if (params.dataType === 'node') {
        //     this.$emit('handleClickNode', params.data)
        //   } else if (params.dataType === 'edge') {
        //     this.$emit('handleClickEdge', params.data)
        //   }
        // })
        // 双击事件
        this.myChart.on('dblClick', params => {
          // console.log('双击事件',params)
          this.$emit('handleDbClick', params.data)
        })
        // 点击
        this.myChart.on('click', params => {
          // if (!params.target) {
          //   this.$emit('handleClickOut')
          // }
          // console.log('单击事件',params)
          if (params.dataType === 'edge') {
            this.$emit('clickEdge', params)
          }
        })

        this.myChart.on('legendselectchanged', e => {
          const { selected } = e
          let { legend } = _this.myChart.getOption()
          for(let key in selected) {
            legend[0].data.forEach(item => {
              if (selected[key]) {
                if (item.name === key) {
                  item.itemStyle.opacity = 1
                  item.textStyle.opacity = 1
                }
              } else {
                if (item.name === key) {
                  item.itemStyle.opacity = 0.2
                  item.textStyle.opacity = 0.2
                }
              }
            })
          }
          // const index = legend[0].data.findIndex(_c => _c.name === name)
          // const typeImgsMapOBJ = { ...typeImgsMap }
          // const typeCode = this.usefulRelationTypeList.find(ele => ele.typeName === name)?.typeCode ?? ''
          // if (!selected[name]) {
          //   legend[0].data[index].icon =
          //     typeCode && typeImgsMapOBJ[typeCode]
          //       ? 'image://' + require(`@/assets/img/${typeImgsMapOBJ[typeCode]}-g.png`)
          //       : ''
          // } else {
          //   legend[0].data[index].icon =
          //     typeCode && typeImgsMapOBJ[typeCode]
          //       ? 'image://' + require(`@/assets/img/${typeImgsMapOBJ[typeCode]}.png`)
          //       : ''
          // }
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

      // 颜色不能写死，需要写变量对应
      let colorObj = this.theme === 'light' ? lightTheme : darkTheme

      // 指定图表的配置项和数据
      this.option = {
        backgroundColor: this.bgColor,
        // 提示框的配置
        tooltip: {
          // backgroundColor: 'rgba(40, 50, 71,.9)',
          backgroundColor: colorObj['--tooltip-bg-262D44-to-f6f8fd'],
          borderWidth: 0,
          enterable: true,
          position: 'right',
          hideDelay: 10,
          // transitionDuration:'2',
          textStyle: {
            //默认值，
            color: colorObj['--base-text-color-to-666666'], //默认值各异，
            fontSize: 16 //默认值，
          },
          padding: 10,
          formatter: params => {
            // params.data.properties.forEach(item => {
            //   params.data[item.prop_name] = item.prop_val
            // })
            // console.log(params)
            {
              // 关系线的提示
              if (params.dataType === 'edge') {
                // return params.data.dataRelationShipName
                return
              }

              if (params.data.type === 'entity_person_type' || params.data.type === 'entity_certificate_type') {
                // const birthday = params.data.birthday?.split(' ')[0] ?? '--'
                // const nationObj = this.$store.getters['Dict/nationListMap']
                // const imgUrl = params.data.avatarUrl
                //   ? window.location.origin + '/' + params.data.avatarUrl
                //   : require('@/assets/img/icon-morenHeader.png')
                const imgUrl = params.data.avatar_url?.slice(0,6) === 'image/'
                  ? window.location.origin + '/' + params.data.avatar_url
                  : this.theme === 'light' ? require('@/assets/img/icon-morenHeader-light.png') : require('@/assets/img/icon-morenHeader.png')

                return `
                <div style="display:flex;color: ${colorObj['--base-text-color-to-999999']};">
                    <img style="height:90px;width:75px;object-fit: cover;" src="${imgUrl}"" />
                    <div style="margin-left:8px;">
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;">姓名：</div>
                        <div>
                          ${params.data.name || '--'}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;">性别：</div>
                        <div>
                          ${this.getSex(params.data)}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;">民族：</div>
                        <div>
                          ${params.data.nation || '--'}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;">出生日期：</div>
                        <div>
                          ${this.getBirthday(params.data)}
                        </div>
                      </div>
                    </div>
                </div>
                <div style="margin-top:0px;">
                  <div>
                    <div style="display:flex">
                      <div style="width:75px;font-size:14px;">${this.getCerType(params.data)}</div>
                      <div>${params.data.cer_number || '--'}</div>
                    </div>
                  <div>
                  <div>
                    <span style="font-size:14px;">户籍地址：</span>
                    <span>${params.data.registered_address || '--'}</span>
                  </div>
                </div>
                `
              } else if (params.data.type === 'entity_mobile_phone_type') {
                return `
                  <div style="color: ${colorObj['--base-text-color-to-999999']}">
                    <span style="font-size:14px;">IMEI：</span>
                    <span>${params.data.imei || '--'}</span>
                  </div>
                `
              } else if (params.data.type === 'entity_phone_card_type') {
                return `
                  <div style="color: ${colorObj['--base-text-color-to-999999']}">
                    <span style="font-size:14px;">手机号：</span>
                    <span>${params.data.main_prop_val || '--'}</span>
                  </div>
                  <div style="color: ${colorObj['--base-text-color-to-999999']}">
                    <span style="font-size:14px;">IMSI：</span>
                    <span>${params.data.imsi || '--'}</span>
                  </div>
                `
              } else {
                let list = []
                for(let key in params.data) {
                  this.iconObj[params.data.type].fields.forEach(item => {
                    if (key === item.label_name_en && params.data[key]) {
                      if (key.indexOf('_image') !== -1) {
                        list.push({
                          label: item.label_name_cn,
                          value: params.data[key],
                          isImage: true
                        })
                      } else {
                        list.push({
                          label: item.label_name_cn,
                          value: params.data[key],
                          isImage: false
                        })
                      }
                    }
                  })
                }
                return `
                  <ul>
                      ${list.map(item => {
                        if (item.isImage) {
                          return `
                            <li style="color: ${colorObj['--base-text-color-to-999999']}">
                              <span style="font-size:14px;">${item.label + '：'}</span>
                              <img style="height:75px;width:100px;" src="${window.location.origin + '/' + item.value}" />
                            </li>
                          `
                        } else {
                          return `
                            <li style="color: ${colorObj['--base-text-color-to-999999']}">
                              <span style="font-size:14px;">${item.label + '：'}</span>
                              <span>${item.value || '--'}</span>
                            </li>
                          `
                        }
                }).join('')}
                  </ul>
                `
              }
            }
          }
        },
        // 类目color
        color: colors,
        // 类目数组
        legend: [
          {
            // data: [],
            data: this.chartList[0].map(_c => {
              return {
                name: this.iconObj[_c.type]['entity_name_cn'],
                icon: this.iconObj[_c.type]['icon_path'] ? 'image://' + this.origin + this.iconObj[_c.type]['icon_path'] : require(`@/assets/img/atlis-default.png`),
                itemStyle: {
                  opacity: 1
                },
                textStyle: {
                  opacity: 1
                }
              }
            }),
            // data: this.seriesCategories.map(_c => {
            //   console.log(_c)
            //   const typeImgsMapOBJ = { ...typeImgsMap }
            //   const typeCode =
            //     this.usefulRelationTypeList.find(ele => ele.typeName === _c.name)?.typeCode ?? ''
            //   return {
            //     name: _c.name,
            //     icon:
            //       typeCode && typeImgsMapOBJ[typeCode]
            //         ? 'image://' + require(`@/assets/img/${typeImgsMapOBJ[typeCode]}.png`)
            //         : ''
            //   }
            // }),
            x: 'right',
            y: 'bottom',
            itemWidth: 24,
            itemHeight: 24,
            textStyle: {
              // color: 'rgba(174, 189, 212,0.9)',
              color: colorObj['--base-text-color-to-666666'],
              fontSize: 12
            }
          }
        ],
        series: [
          {
            type: 'graph', // 类型:关系图
            top: '10%', // 图表距离容器顶部的距离
            // zoom: 1,
            layout: 'force', //图的布局，类型为力导图
            legendHoverLink: false, //是否启用图例 hover(悬停) 时的联动高亮。
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [2, 8], // 两端大小
            // symbolOffset: [15,0], // 偏移
            // force: {
            //   gravity: 0.2,
            //   edgeLength: [100,300], // 两个节点之间的距离
            //   repulsion: [100,400], //节点之间的斥力因子值
            //   friction: 0, // 节点的移动速度 取值0~1
            // },
            force: {
              edgeLength: 300, // 两个节点之间的距离
              repulsion: 1000, //节点之间的斥力因子值
              friction: 0.2, // 节点的移动速度 取值0~1
            },
            roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            draggable: true, //每个节点的拖拉
            // 关系线样式lineStyle
            lineStyle: {
              show: true,
              width: 1,
              // color: '#8799BF', //决定边的颜色是与起点相同还是与终点相同 可选'target'
              color: colorObj['--base-text-color-to-999999'], //决定边的颜色是与起点相同还是与终点相同 可选'target'
              curveness: 0.1 // 边的曲度，支持从 0 到 1 的值，值越大曲度越大。
            },
            //图形上的文本标签，可用于说明图形的一些数据信息
            label: {
              //标签的字体样式
              // color: '#c0d0e7', //字体颜色
              color: colorObj['--base-text-color-1'], //字体颜色
              fontStyle: 'normal', //文字字体的风格 'normal'标准 'italic'斜体 'oblique' 倾斜
              fontWeight: 'bolder', //'normal'标准'bold'粗的'bolder'更粗的'lighter'更细的或100 | 200 | 300 | 400...
              fontFamily: 'sans-serif', //文字的字体系列
              fontSize: 12, //字体大小
              show: true, //显示
              position: 'top', //相对于节点标签的位置，默认在节点中间
              //回调函数，你期望节点标签上显示什么
              formatter: function (params) {
                // 对手机号特殊处理，标签上优先取手机号，没有则依次取值
                if (params.data.type === 'entity_probe_phone_type') {
                  return params.data.phone || params.data.imei || params.data.imsi
                } else {
                  return params.name
                }
              }
            },
            edgeLabel: {
              position: 'middle', // 标签位置 线的中点
              show: true,
              fontSize: 12,
              color:  colorObj['--base-text-color-to-666666'],
              // formatter: function (x) {
              //   let relationObj = {
              //     edge_father2son: '父子',
              //     edge_conjugal_relationship: '夫妻',
              //     edge_mother2son: '母子',
              //     edge_guardian: '监护'
              //   }
              //   let arr = Object.keys(relationObj)
              //   if (x.data.type) {
              //     if (x.data.type === 'edge_conjugal_relationship') {
              //       return x.data.relationship ? x.data.dataRelationShipName+ '（' + x.data.relationship + '）' : x.data.dataRelationShipName + '（' + relationObj[x.data.type] + '）'
              //     } else if (arr.includes(x.data.type)) {
              //       return x.data.dataRelationShipName + '（'+ relationObj[x.data.type] + '）'
              //     } else {
              //       console.log(x.data.dst.split('-')[0])
              //       // return '666'
              //       return getVertexName(x.data.dst.split('-')[0]) + '(' + x.data.dataRelationShipName + ')' || ''
              //     }
              //   } else {
              //     return x.data.dataRelationShipName || ''
              //   }
              // }
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
            symbolSize: 5, //节点大小
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
        // animationDurationUpdate: 200, //数据更新动画的时长。[ default: 300 ]
        animationEasingUpdate: 'quinticInOut' //// 数据更新动画的缓动效果。[ default: cubicOut ]    "quinticInOut"
      }

      this.option.series[0].edgeLabel.formatter = (x => {
        let relationObj = {
          edge_father2son: '父子',
          edge_conjugal_relationship: '夫妻',
          edge_mother2son: '母子',
          edge_guardian: '监护'
        }
        let arr = Object.keys(relationObj)
        if (x.data.type) {
          if (x.data.type === 'edge_conjugal_relationship') {
            return x.data.relationship ? x.data.relationship + '（' + x.data.dataRelationShipName + '）' : relationObj[x.data.type] + '（' + x.data.dataRelationShipName + '）'
          } else if (arr.includes(x.data.type)) {
            return relationObj[x.data.type] + '（'+ x.data.dataRelationShipName + '）'
          } else {
            return this.getVertexName(x.data.dst.split('-')[0]) + '(' + x.data.dataRelationShipName + ')' || ''
          }
        } else {
          return x.data.dataRelationShipName || ''
        }
      })

      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(this.option,true)
      let model  = this.myChart.getModel().getSeriesByIndex(0).getData()._itemLayouts;
      this.$emit('updateData',model)
      // console.log('model',model);
      // console.log(this.myChart)
      // let a = this.myChart.getOption()
      // console.log(a)
    },

    switchHigh (index, name) {
      this.myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: index,
        name: name
      })
    },
    // 通过身份证获取性别
    getSex (data) {
      // console.log(data)
      // return data.gender
      if (data.gender === '' || data.gender == null) {
        if (data.cer_type === 'attr_identity_card_type') {
          if (parseInt(data.cer_number.substr(16, 1)) % 2 === 1) {
            return "男"
          } else {
            return "女"
          }
        } else {
          return '--'
        }
      } else {
        if (data.gender === 'female' || data.gender === '女') {
          return '女'
        } else if (data.gender === 'male' || data.gender === '男') {
          return '男'
        } else {
          // return '--'
          return data.gender
        }
      }
    },
    // 通过身份证号获取出生日期
    getBirthday (data) {
      if (data.birthday === '' || data.birthday == null) {
        if (data.cer_type === 'attr_identity_card_type') {
          return data.cer_number.substring(6, 10) + "/" + data.cer_number.substring(10, 12) + "/" + data.cer_number.substring(12, 14)
        } else {
          return '--'
        }
      } else {
        return data.birthday
      }
    },
    getCerType (data) {
      if (data.cer_type === 'attr_hk_permit_type') {
        return '港澳通行证：'
      } else if (data.cer_type === 'attr_passport_type') {
        return '护照：'
      } else if (data.cer_type === 'attr_identity_card_type') {
        return '身份证：'
      } else {
        return '未知证件：'
      }
    },
    getVertexName (data) {
      return this.iconObj[data]['entity_name_cn']
    }
  }
}
</script>
<style scoped>
/* .chart {
  height: 100%;
  height: calc(100vh - 100px);
  user-select:text !important;
} */
.cusEchart-label {
  width: 500px;
}
</style>
