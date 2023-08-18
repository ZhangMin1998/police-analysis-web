<template>
  <div id="chart" class="chart"></div>
</template>
<script>
import { colors } from './mock'
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
    moveMuchNode:{
      type: Boolean
    },
    toShowNode:{
      type: Object
    }
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
      option: {},
      // movedZoom: 1,
      // centerPosition: [],
      onlyAddLine: false,
      // oldOption: {},
      clickID: '',
      moveingEdge: {
        vid: '',
        x: 0,
        y: 0
      },
      moveSingle: false
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
      usefulRelationTypeList: 'usefulRelationTypeList',
      dataTypeObj:'dataTypeObj'
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
      handler (val, oldvalue) {
        if (!val.length) return
        let seriesData = val[0].filter((element, index, self) => {
          return self.findIndex(x => x.vid === element.vid) === index
        })
        let linksData = val[1].filter((element, index, self) => {
          return self.findIndex(x => x.vid === element.vid) === index
        })
        if (oldvalue) {
          let copySeriesData = oldvalue[0].filter((element, index, self) => {
            return self.findIndex(x => x.vid === element.vid) === index
          })
          let copyLinksData = oldvalue[1].filter((element, index, self) => {
            return self.findIndex(x => x.vid === element.vid) === index
          })
          if (oldvalue && seriesData.length === copySeriesData.length && linksData.length !== copyLinksData.length) {
            // 这里说明只有线的变化
            this.onlyAddLine = true
            // console.log(this.onlyAddLine)
          } else {
            this.onlyAddLine = false
            // console.log(this.onlyAddLine)
          }
        }

        // this.myChart && this.myChart.dispose()
        // this.myChart = null
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
    },
    moveMuchNode (val){
      this.moveSingle = !val
    },
    // centerPosition: {
    //   handel(val) {
    //     console.log(val)
    //   },
    //   deep: true
    // }
  },
  created () {
    // console.log(this.theme);
  },

  methods: {
    clickListNode (item) {
      // console.log(item)
      let option = this.myChart.getOption()
      // let selected = option.legend[0].selected
      let toShowNode_name_cn = this.iconObj[item.type]['entity_name_cn']

      if (toShowNode_name_cn in option.legend[0].selected) {
        // selected[toShowNode_name_cn] = true
        // option.legend[0].selected = selected
        Object.keys(option.legend[0].selected).forEach(key => {
          option.legend[0].selected[key] = true;
        })
        this.myChart.setOption(option)
        this.$forceUpdate()
        // console.log(option.legend[0].selected)
      } else {
        Object.keys(option.legend[0].selected).forEach(key => {
          option.legend[0].selected[key] = true;
        })
        this.myChart.setOption(option)
        this.$forceUpdate()
      }
    },
    // 数据格式化
    formatData (list) {
      // console.log(this.dataTypeObj);
      // console.log('格式化')
      // 存在类别 赋值
      this.seriesCategories = this.formatCates(list[0])
      const sArr =
        list[1]?.map(_c => {
          return {
            source: _c.src + '',
            target: _c.dst + '',
            dataRelationShipName: this.dataTypeObj[_c.data_source],
            personRelationShipName: _c.relationship,
            ..._c
          }
        }) ?? []
      this.seriesLinks = sArr.filter((element, index, self) => {
        return self.findIndex(x => x.vid === element.vid) === index
      })
      // const typeImgsMapOBJ = { ...typeImgsMap }
      const nArr =
        list[0]?.map(_c => {
          if (_c.type !== 'entity_person') {
            // 给name赋值  默认在实体上显示
            _c.name = _c.main_prop_val
          }

          _c.category = this.seriesCategories.findIndex(
            ele => ele.name === this.usefulRelationTypeListMap[_c.type]
          )
          // if(this.onlyAddLine){
          //   console.log(this.movedZoom)
          //   _c.symbolSize = 38 * this.movedZoom
          // }else{
          //   console.log(this.movedZoom)
          //   _c.symbolSize = 38
          // }
          // console.log(_c.type,this.iconObj[_c.type])
          _c.symbol = this.iconObj[_c.type]['icon_path']
            ? 'image://' + this.origin + this.iconObj[_c.type]['icon_path']
            : require(`@/assets/img/atlis-default.png`)

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
      // this.seriesLinks.map((_c) => {
      //   let linkNodes = this.seriesData.filter((item) => {
      //     return item.vid === _c.src || item.vid === _c.dst
      //   })
      //   let isFixed = linkNodes.every((item) => {
      //     return item.fixed
      //   })
      //   if(isFixed){
      //     _c.ignoreForceLayout = true
      //   }
      // })
      this.seriesData.map((_c) => {
        if (this.onlyAddLine && _c.vid === this.clickID) {
          // console.log('只有线更新')
          // delete _c.fixed
          delete _c.x
          delete _c.y
          // _c.y = _c.y + 40
          // _c.x = _c.x + 40
          // console.log(_c)
        }
      })
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
      // if(notchange){
      //   this.onlyAddLine = false
      // }
      // console.log('initCharts')
      const _this = this
      if (!this.myChart) {
        // console.log(1111)
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
          if(params.dataType === 'node'){
            this.clickID = params.data.vid
            _this.myChart.showLoading({
              text: '数据加载中',
              maskColor: this.theme === 'light' ? lightTheme['--loading-color-1'] : darkTheme['--loading-color-1'],
            })
            this.$emit('handleDbClick', params.data)
          }
        })
        // 点击
        this.myChart.on('click', params => {
          if (params.dataType === 'edge') {
            this.$emit('clickEdge', params)
          }
        })

        this.myChart.on('legendselectchanged', e => {
          // console.log('legendselectchanged', e)
          const { selected } = e
          let { legend } = _this.myChart.getOption()
          for (let key in selected) {
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
          _this.myChart.setOption(option, false)
        })

        this.myChart.on('mousedown', e => {
          // let { series } = _this.myChart.getOption()
          //   console.log(series)
          if (e.dataType === 'edge') {
            return
          }
          // let model = _this.myChart.getModel().getSeriesByIndex(0).getData()._itemLayouts;
          // console.log(model)
          // console.log(e)
          if (!this.moveSingle) {
            this.moveingEdge.vid = e.data.vid
            // this.moveingEdge.x = e.data.x
            this.moveingEdge.x = e.event.offsetX
            // this.moveingEdge.y = e.data.y
            this.moveingEdge.y = e.event.offsetY
            // e.setDraggable(true)
            // let { series } = _this.myChart.getOption()
            // console.log(series)
          }

          let { tooltip } = _this.myChart.getOption()
          tooltip[0].trigger = 'none'
          const option = { ..._this.myChart.getOption(), tooltip }
          _this.myChart.setOption(option, false)
        })
        this.myChart.on('globalout', () => {
          let { tooltip } = _this.myChart.getOption()
          tooltip[0].trigger = 'item'
          const option = { ..._this.myChart.getOption(), tooltip }
          setTimeout(() => {
            _this.myChart.setOption(option, false)
          }, 20)
        })
        this.myChart.on('mouseup', (e) => {
          if (!this.moveSingle) {
            const dx = e.event.offsetX - this.moveingEdge.x
            const dy = e.event.offsetY - this.moveingEdge.y
            let relationArr = this.seriesLinks.reduce((pre, ele) => {
              if (ele.dst === this.moveingEdge.vid) {
                pre.push(ele.src)
              } else if (ele.src === this.moveingEdge.vid) {
                pre.push(ele.dst)
              }
              return pre
            }, [])
            if(dx || dy){
              this.seriesData.forEach((item) => {
                if (relationArr.indexOf(item.vid) !== -1) {
                  item.x = dx * 300 + item.x
                  item.y = dy * 300 + item.y
                  // 只有x,y的更新的时候，图谱进行setOption是没有效果的
                  item.fixed = false
                }
              })
            }

          }else{
            this.initCharts()
          }

          // console.log(this.seriesData)
          // let dx = this.moveingEdge.x - e.data.x
          // let dy = this.moveingEdge.y - e.data.y
          // console.log(dx,dy)
          //  this.moveingEdge.vid
          // console.log(this.moveingEdge)
          // let { series } = _this.myChart.getOption()
          // console.log(series)
          // this.formatData(this.chartList)
          // 将tooltip的显示方式改为item
          let { tooltip } = _this.myChart.getOption()
          tooltip[0].trigger = 'item'
          const option = { ..._this.myChart.getOption(), tooltip }
          if (!this.moveSingle) {
            option.series[0].data[e.dataIndex].x = e.event.offsetX;
            option.series[0].data[e.dataIndex].y = e.event.offsetY;
            option.series[0].data[e.dataIndex].fixed = true;
            option.series[0].data = this.seriesData
            _this.myChart.setOption(this.option, false)
          }
          setTimeout(() => {
            if (!this.moveSingle) {
              this.seriesData.forEach((item) => {
                // 只有x,y的更新的时候，图谱进行setOption是没有效果的
                item.fixed = true
              })
              option.series[0].data = this.seriesData
            }

            _this.myChart.setOption(option, {
              notMerge: false,
              // replaceMerge: ['series'],
              // lazyUpdate: true
            })

            // let opt = _this.myChart.getOption()
            // console.log(opt)
          }, 50)
          // this.formatData(option,false)
          // 鼠标抬起记录位置
          // let model = this.myChart.getModel().getSeriesByIndex(0).getData()._itemLayouts;
          // const index = this.seriesData.findIndex((item)=>{
          //   return item.vid === params.data.vid
          // })
          // console.log(model[index])
          // this.centerPosition =  model[index]
        })
        // this.myChart.on('mousemove', (e) => {
        // })

        // this.myChart.on('resize ', () => {
        //   console.log('resize事件')
        // })

        // this.myChart.on('restore ', () => {
        //   console.log('restore事件')
        // })
        // this.myChart.on('datarangeselected ', () => {
        //   console.log('datarangeselected事件')
        // })
        // this.myChart.on('globalcursortaken ', () => {
        //   console.log('globalcursortaken事件')
        // })

        // this.myChart.on('rendered ', () => {
        //   console.log('rendered事件')
        // })
        // this.myChart.on('finished ', () => {
        //   console.log('finished事件')
        // })

        // this.myChart.on('graphroam', e => {
        //   // 如果是缩放事件
        //   // console.log(e)
        //   if (e.zoom) {
        //     if (this.movedZoom) {
        //       this.movedZoom = this.movedZoom * e.zoom
        //     }
        //     // else {
        //     //   this.movedZoom = 1 * e.zoom
        //     // }
        //   } else {
        //     // console.log('平移事件')
        //     // let { series } = _this.myChart.getOption()
        //     // console.log(series)
        //     // this.centerPosition =  series[0].center
        //     // 如果是平移事件
        //     // console.log(e)
        //   }
        // })
        // this.myChart.on('rendered', (e) => {
        // console.log(e)
        // console.log(222222)
        // })
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

              if (
                params.data.type === 'entity_person' ||
                params.data.type === 'entity_certificate'
              ) {
                // const birthday = params.data.birthday?.split(' ')[0] ?? '--'
                // const nationObj = this.$store.getters['Dict/nationListMap']
                // const imgUrl = params.data.avatarUrl
                //   ? window.location.origin + '/' + params.data.avatarUrl
                //   : require('@/assets/img/icon-morenHeader.png')
                const imgUrl = params.data.avatar_url?.slice(0, 6) === 'image/'
                  ? window.location.origin + '/' + params.data.avatar_url
                  : this.theme === 'light'
                    ? require('@/assets/img/icon-morenHeader-light.png')
                    : require('@/assets/img/icon-morenHeader.png')

                return `
                <div style="display:flex;color: ${colorObj['--base-text-color-to-999999']};">
                    <img style="height:90px;width:75px;object-fit: cover;" src="${imgUrl}"" />
                    <div style="margin-left:8px;">
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;color: ${colorObj['--base-text-color-to-999999']
                };">姓名：</div>
                        <div>
                          ${params.data.name || '--'}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;color: ${colorObj['--base-text-color-to-999999']
                };">性别：</div>
                        <div>
                          ${this.getSex(params.data)}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;color: ${colorObj['--base-text-color-to-999999']
                };">民族：</div>
                        <div>
                          ${params.data.nation || '--'}
                        </div>
                      </div>
                      <div style="display:flex">
                        <div style="font-size:14px;width:75px;color: ${colorObj['--base-text-color-to-999999']
                };">出生日期：</div>
                        <div>
                          ${this.getBirthday(params.data)}
                        </div>
                      </div>
                    </div>
                </div>
                <div style="margin-top:0px;">
                  <div>
                    <div style="display:flex">
                      <div style="width:75px;font-size:14px;color: ${colorObj['--base-text-color-to-999999']
                };">${this.getCerType(params.data)}</div>
                      <div>${params.data.cer_number || '--'}</div>
                    </div>
                  <div>
                  <div>
                    <span style="font-size:14px;color: ${colorObj['--base-text-color-to-999999']
                };">户籍地址：</span>
                    <span>${params.data.registered_address || '--'}</span>
                  </div>
                </div>
                `
              } else if (params.data.type === 'entity_mobile_phone') {
                return `
                  <div style="color: ${colorObj['--base-text-color-to-999999']}">
                    <span style="font-size:14px;">IMEI：</span>
                    <span>${params.data.imei || '--'}</span>
                  </div>
                `
              } else if (params.data.type === 'entity_phone_card') {
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
                for (let key in params.data) {
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
                })
                .join('')}
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
                icon: this.iconObj[_c.type]['icon_path']
                  ? 'image://' + this.origin + this.iconObj[_c.type]['icon_path']
                  : require(`@/assets/img/atlis-default.png`),
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
            layout: 'force', //图的布局，类型为力导图
            legendHoverLink: false, //是否启用图例 hover(悬停) 时的联动高亮。
            edgeSymbol: ['circle', 'arrow'],
            // center: ['50%','50%'],
            // center: this.centerPosition,
            // zoom: this.movedZoom,
            edgeSymbolSize: [2, 8], // 两端大小
            // symbolOffset: [15,0], // 偏移
            force: {
              edgeLength: 300, // 两个节点之间的距离
              repulsion: 1000, //节点之间的斥力因子值
              friction: 0.5, // 节点的移动速度 取值0~1
              layoutAnimation: true
            },
            // force: {
            //   edgeLength: 300, // 两个节点之间的距离
            //   repulsion: 1000, //节点之间的斥力因子值
            //   friction: 0.2, // 节点的移动速度 取值0~1
            // },
            // scaleLimit:{
            //   min:0.4
            // },
            roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            draggable: true, //每个节点的拖拉
            // 关系线样式lineStyle
            lineStyle: {
              show: true,
              width: 1,
              // color: '#8799BF', //决定边的颜色是与起点相同还是与终点相同 可选'target'
              color: colorObj['--base-text-color-to-999999'], //决定边的颜色是与起点相同还是与终点相同 可选'target'
              // curveness: 0.1 // 边的曲度，支持从 0 到 1 的值，值越大曲度越大。
            },
            autoCurveness:true, // 两条边时自动计算曲线率
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
                if (params.data.type === 'entity_probe_phone') {
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
              color: colorObj['--base-text-color-to-666666'],
              formatter: x => {
                if (x.data.relationship) {
                  return x.data.relationship + '（' + x.data.dataRelationShipName + x.data.rank + '次）'
                } else {
                  return (
                    this.getVertexName(x.data.dst.split('-')[0]) +
                    '(' +
                    x.data.dataRelationShipName + x.data.rank +
                    '次)' || ''
                  )
                }
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
            symbolSize: 38, //节点大小
            nodeScaleRatio: 0.6,
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
        // silent:true,
        animation: true,
        // 动画更新变化时间
        animationDurationUpdate: 100, //数据更新动画的时长。[ default: 300 ]
        // animationDurationUpdate: 200, //数据更新动画的时长。[ default: 300 ]
        animationEasingUpdate: 'quinticInOut' //// 数据更新动画的缓动效果。[ default: cubicOut ]    "quinticInOut"
      }
      // this.option.series[0].edgeLabel.formatter = x => {
      //   if (x.data.relationship) {
      //     return x.data.relationship + '（' + x.data.dataRelationShipName + x.data.rank + '次）'
      //   } else {
      //     return (
      //       this.getVertexName(x.data.dst.split('-')[0]) +
      //       '(' +
      //       x.data.dataRelationShipName + x.data.rank +
      //       '次)' || ''
      //     )
      //   }
      // }

      // 使用刚指定的配置项和数据显示图表。
      // console.log(this.movedZoom)
      // console.log(this.centerPosition)
      // if(this.onlyAddLine){
      //   const option = { ...this.oldOption, data:this.seriesData, links: this.seriesLinks }
      //   console.log(option)
      //   this.myChart.setOption(option, true)
      // }else{
      this.myChart.setOption(this.option, false)
      // this.oldOption = this.myChart.getOption()
      // console.log(this.oldOption)
      // }
      // let { series } = this.myChart.getOption()
      // console.log(series[0])
      // let a = this.myChart.getOption()
      // console.log(a)
      setTimeout(() => {
        let model = this.myChart
          .getModel()
          .getSeriesByIndex(0)
          .getData()._itemLayouts
        if (model.length) {
          // console.log(model);
          this.$emit('updateData', model)
        }

        // let { series } = this.myChart.getOption()
        // console.log(series)
      }, 2000)

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
            return '男'
          } else {
            return '女'
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
          return (
            data.cer_number.substring(6, 10) +
            '/' +
            data.cer_number.substring(10, 12) +
            '/' +
            data.cer_number.substring(12, 14)
          )
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
