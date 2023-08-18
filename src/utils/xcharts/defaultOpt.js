/*
 * @Description: 各图表默认的 options 配置文件
 * @Author: pdeng
 * @Date: 2019-10-16 19:54:06
 * @LastEditTime: 2019-10-17 10:13:48
 * @LastEditors: Please set LastEditors
 */
import ChineseUnit from '@/utils/ChineseUnit'
import { deepMerge } from './utils'
import { DEFAULT_THEME, OBJECT_COLORS } from './constants'
export default {
  line: () => {
    return Object.assign({}, DEFAULT_THEME(), {
      xAxis: {
        type: 'category',
        // 坐标轴两边留白策略
        boundaryGap: true,
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        // x轴的字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: OBJECT_COLORS.textStyle,
            fontSize: 12
          },
          rotate: 0
        },
        // x轴刻度
        axisLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            width: 2
          }
        },
        // 网格
        splitLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        // y轴
        axisLabel: {
          show: true,
          textStyle: {
            color: OBJECT_COLORS.textStyle,
            fontSize: 14
          }
        },
        // y轴刻度
        axisLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            width: 2 // 这里是坐标轴的宽度
          }
        },
        // y轴网格
        splitLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            type: 'solid'
          }
        }
      },
      series: [
        {
          // data: [820, 932, 901, 934, 1290, 1330, 1320],
          smooth: true,
          type: 'line'
        }
      ]
    })
  },
  bar: () => {
    return Object.assign({}, DEFAULT_THEME(), {
      xAxis: {
        type: 'category',
        // 坐标轴两边留白策略
        boundaryGap: true,
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        // x轴的字体样式
        axisLabel: {
          show: true,
          textStyle: {
            color: OBJECT_COLORS.textStyle,
            fontSize: 12
          },
          rotate: 0
        },
        // x轴刻度
        axisLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            width: 2
          }
        },
        // 网格
        splitLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'value',
        // y轴
        axisLabel: {
          show: true,
          textStyle: {
            color: OBJECT_COLORS.textStyle,
            fontSize: 14
          }
        },
        // y轴刻度
        axisLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            width: 2 // 这里是坐标轴的宽度
          }
        },
        // y轴网格
        splitLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            type: 'solid'
          }
        }
      },
      series: [
        {
          // data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'bar',
        }
      ],
    })
  },
  pie: () => {
    return deepMerge(DEFAULT_THEME(), {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: [0, '80%'],
          label: {
            normal: {
              show: false,
              position: 'center'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        }
      ]
    })
  },
  radar: () => {
    return deepMerge(DEFAULT_THEME(), {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        x: 'left'
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: OBJECT_COLORS.textStyle,
            // backgroundColor: '',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: []
      },
      series: [
        {
          areaStyle: {
            normal: {}
          },
          type: 'radar'
        }
      ]
    })
  },
  scatter: () => {
    return deepMerge(DEFAULT_THEME(), {
      legend: {
        icon: 'circle',
        itemWidth: 15,
        itemHeight: 15
      },
      xAxis: {
        axisLabel: {
          show: true,
          textStyle: {
            color: OBJECT_COLORS.textStyle,
            fontSize: 12
          },
          rotate: 0
        },
        // x轴刻度
        axisLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            width: 2
          }
        },
        // 网格
        splitLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            type: 'dashed'
          }
        }
      },
      yAxis: {
        axisLabel: {
          show: true,
          textStyle: {
            color: OBJECT_COLORS.textStyle,
            fontSize: 12
          },
          rotate: 0
        },
        // x轴刻度
        axisLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            width: 2
          }
        },
        // 网格
        splitLine: {
          show: true,
          lineStyle: {
            color: OBJECT_COLORS.lineStyle,
            type: 'dashed'
          }
        },
        scaleY: true
      },
      series: [
        {
          symbolSize: 20,
          type: 'scatter'
        }
      ]
    })
  },
  map: () => {
    return deepMerge(DEFAULT_THEME(), {
      tooltip: {
        trigger: 'item',
        formatter: function (v) {
          if (!v.name) {
            v.value = 0
          }
          return `
            <div>${v.name}</div>
            <div>设备数量：${v.value}（个）</div>
        `
        },
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 0,
        padding: [5, 12, 5, 12],
        textStyle: {
          color: '#fff',
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3)'
      },
      color: '#fff',
      textStyle: {
        fontSize: 14,
        fontStyle: 'normal'
      },
      visualMap: {
        orient: 'horizontal',
        type: 'continuous',
        itemWidth: 9,
        itemHeight: 55,
        text: ['多', '少'],
        showLabel: true,
        inRange: {
          color: ['rgba(19, 100, 153,.4)', 'rgba(19, 100, 153,.6)', 'rgba(19, 100, 153,1)']
        },
        textStyle: {
          color: '#fff',
          fontSize: 14
        }
      },

      series: [
        {
          type: 'map',
          map: 'china',
          center: [106, 36],
          zoom: 1,
          scaleLimit: {
            min: 1,
            max: 5
          },
          label: {
            normal: {
              formatter: function (params) { //标签内容
                const value = params.value ? ChineseUnit.addChineseUnit(params.value) : 0
                return `${params.name}\n${value}`
              },
              position: 'right',
              show: true,
              textStyle: {
                fontSize: 15,
                color: '#fff'
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          },
          roam: true,
          animation: true,
          itemStyle: {
            normal: {
              areaColor: "#101f32",
              borderWidth: 1.1,
              textStyle: {
                color: "#fff"
              },
              borderColor: "#43d0d6" //地图边框颜色
            },
            emphasis: {
              color: "#fff",
              areaColor: "rgba(0, 112, 249)"
            }
          },
        }
      ]
    })
  }
}
