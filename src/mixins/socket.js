// 导入依赖
import io from 'socket.io-client'
import dayjs from '@/utils/filters'
const WarnType = {
  // CLUE: '特征预警',
  WARNING_CLUE: '特征预警',
  PHONE: '异常通讯',
  WARNING_GATHER: '聚集预警',
  // GATHER: '聚集预警',
  RECLUSIVE: '深居简出',
  // FREQUENT: '频繁夜出',
  WARNING_FREQUENTLY: '频繁夜出',
  VESPERTINE: '昼伏夜出',
  STAY: '逗留预警',
  // WARN_FENCE: '区域防控',
  WARNING_FENCE: '区域防控',
  // WARNING_SUSPECT: '重点防控',
  WARNING_PERSON: '重点防控',
  WARNING_BOUNDARY: '边界防控',
  WARNING_FACE: '人脸防控',
  // WARNING_PORNOGRAPHIC: '涉黄预警'
}

/*const PhoneType = {
  PHONE_2_CARD: '一机多卡',
  PHONE_2_ACCOUNT: '一卡多号'
}*/


// let pathList = ['/police/ws', '/police/warning/ws']
let pathList = ['/police/warning/ws']
// let pathList = ['/police/ws']

const isDev = process.env.NODE_ENV === 'development'
if (isDev) {
  // pathList = ['/ws', '/warningws']
  pathList = ['/warningws']
}

export default {
  data () {
    return {
      socket0: null,
      socket1: null,
    }
  },

  beforeDestroy () {
    this.disconnect()
  },

  methods: {
    todo (data) {
      console.log("🚀 ~ file: socket0.js ~ line 76 ~ initWebSocket ~ data", data)
      if (!data) return
      const result = data
      this.bus.$emit('WSMessage', result)
      let warnTypeStr = WarnType[result.warnTypeEnum || result.warningTypeEnum]
      let obj = JSON.parse(result.content)
      const actions = new Map([
        /*['特征预警', () => {/!*do sth*!/    this.notifyInfo(
          warnTypeStr + ' 新消息！',
          `<div>${dayjs.filterSS(
            obj.probeTime || obj.createTime
          )}</div><div>预警场所：${obj.place ? obj.place.placeName : '--'
          }</div>`,() => {
            this.$router.push({ path: '/ol/Rules' ,query: { label: '特征预警' } })
          }
        )
        }],*/
        /*['重点人聚集预警', () => {/!*do sth*!/ let html = ''

          html += `<div v-if="${obj.ship &&
            obj.ship.length > 0}"><div>预警场所：${obj.ship[0].place ||
            '--'}</div>`

          if (obj.ship && obj.ship.length > 0) {
            obj.ship.forEach(item => {
              html += `<div><div>姓名：${item.personName ||
                '--'}  ${dayjs.filterSS(item.probeTime)}</div>`
            })
          }

          html += '</div></div>'
          this.notifyInfo(warnTypeStr + ' 新消息！', html, () => {
            this.$router.push({ path: '/ol/Rules' ,query: { label: '聚集预警' } })
          })
        }],
        ['异常通讯', () => {/*do sth*/
        //   html += `<div>类型：${PhoneType[obj.warnType]}</div><div>MAC：${obj.attrValue
        //     }</div>`
        //   if (obj.attrVos && obj.attrVos.length) {
        //     html += '<div>绑定信息：</div>'
        //     obj.attrVos.forEach(element => {
        //       html += `<div>${element.typeCode?.toUpperCase() ?? '--'
        //         }/${element.data}</div>`
        //     })
        //   }

        //   this.notifyInfo(warnTypeStr + '新消息！', html)
        // }],
        // ['作息预警', () => {/!*do sth*!/this.notifyInfo(
        //   warnTypeStr + ' 新消息！',
        //   `<div>${dayjs.filterSS(obj.probeTime)}</div><div>预警场所：${obj.place?.placeName ?? '--'
        //   }</div>`
        // )
        // }],*/
        ['区域防控', () => {/*do sth*/ this.notifyInfo(
          warnTypeStr + ' 新消息！',
          `<div>人员姓名：${obj.personName}</div><div>预警场所：${obj.placeName || '--'
          }</div>${obj.triggerTime ? `<div>预警时间：${dayjs.filterSS(obj.triggerTime)}</div>` : ''}<div>${obj.messageContent}</div>`,() => {
            this.$router.push({ name: 'AreaWarnRules' ,query: { label: '区域防控',warnType:'区域防控', msgId: obj.messageId } })
          }
        )
        }],
        ['重点防控', () => {/*do sth*/
          this.notifyInfo(
            warnTypeStr + ' 新消息！',
            `<div>人员姓名：${obj.personName}</div><div>预警场所：${obj.placeName || '--'
            }</div>${obj.triggerTime ? `<div>预警时间：${dayjs.filterSS(obj.triggerTime)}</div>` : ''}<div>${obj.messageContent}</div>`,
            () => {
              this.$router.push({ name:'ImportantWarnHistory', query: { label: '重点防控',warnType:'重点防控', msgId: obj.messageId  } })
            }
          )
        },], ['边界防控', () => {/*do sth*/
          this.notifyInfo(
            warnTypeStr + ' 新消息！',
            `<div>人员姓名：${obj.personName}</div><div>预警场所：${obj.placeName || '--'
            }</div>${obj.triggerTime ? `<div>预警时间：${dayjs.filterSS(obj.triggerTime)}</div>` : ''}<div>${obj.messageContent}</div>`,
            () => {
              this.$router.push({ name: 'BorderWarnHistory', query: { label: '边界防控',warnType:'边界防控', msgId: obj.messageId } })
            }
          )
        },],
        ['人脸防控', () => {/*do sth*/
          this.notifyInfo(
            warnTypeStr + ' 新消息！',
            `<div>人员姓名：${obj.personName}</div><div>预警场所：${obj.placeName || '--'
            }</div>${obj.triggerTime ? `<div>预警时间：${dayjs.filterSS(obj.triggerTime)}</div>` : ''}<div>${obj.messageContent}</div>`,
            () => {
              this.$router.push({ name: 'WarnDetail', query: { label: '人脸防控', warnType:'人脸防控', msgId: obj.messageId } })
            }
          )
        },],
        ['聚集预警', () => {/*do sth*/
          this.notifyInfo(
            warnTypeStr + ' 新消息！',
            `<div>人员姓名：${obj.personName}</div><div>预警场所：${obj.placeName || '--'
            }</div>${obj.triggerTime ? `<div>预警时间：${dayjs.filterSS(obj.triggerTime)}</div>` : ''}<div>${obj.messageContent}</div>`,
            () => {
              this.$router.push({ name: 'History', query: { label: '防控预警', warnType:'聚集预警', msgId: obj.messageId } })
            }
          )
        },],
        ['特征预警', () => {/*do sth*/
          this.notifyInfo(
            warnTypeStr + ' 新消息！',
            `<div>预警场所：${obj.placeName || '--'
            }</div>${obj.triggerTime ? `<div>预警时间：${dayjs.filterSS(obj.triggerTime)}</div>` : ''}<div>${obj.messageContent}</div>`,
            () => {
              this.$router.push({ name: 'History', query: { label: '防控预警', warnType:'特征预警', msgId: obj.messageId } })
            }
          )
        },],
        ['default', () => {/*do sth*/
          return
        }],
      ])

      /**
       * 按钮点击事件
       * @param {string} type  预警类型
       */const onWsMessage = (type) => {
        let action = actions.get(type) || actions.get('default')
        action.call(this)
      }

      const typeList = ['深居简出', '频繁夜出', '昼伏夜出', '逗留预警']
      typeList.includes(warnTypeStr) ? onWsMessage('作息预警') : onWsMessage(warnTypeStr)
      this.bus.$emit('newWarning')
    },
    /**
     *  初始化weosocket
     */
    initWebSocket () {
      const loginUserNum = localStorage.getItem('token')
      pathList.forEach((ele, index) => {
        const opts = {
          path: ele,
          query: 'loginUserNum=' + loginUserNum
        }
        this['socket' + index] = io.connect('/', opts)
      })

      /**
       * 连接成功
       */
      this.socket0?.on('connect', function () {
        console.log('====================================')
        console.log('连接ws成功')
        console.log('====================================')
      })
      this.socket1?.on('connect', function () {
        console.log('====================================')
        console.log('预警 连接ws成功')
        console.log('====================================')
      })
      /**
       * 连接失败
       */
      this.socket0?.on('connect_error', err => {
        console.log('连接失败', err)
      })
      this.socket1?.on('connect_error', err => {
        console.log('预警 连接失败', err)
      })

      /**
       * 接收消息
       */
      this.socket0?.on('public', (data) => {
        try {
          this.todo(data)
        } catch (err) {
          console.log('err', err)
        }
      })

      this.socket1?.on('public', (data) => {
        try {
          this.todo(data)
        } catch (err) {
          console.log('err', err)
        }
      })


      this.socket0?.on('push_message', data => {
        console.log('====================================')
        console.log('数据中心 接受ws消息：')
        console.log(data)
        console.log('====================================')
        try {
          this.bus.$emit('wsHandle', data)
        } catch (err) {
          console.log('err', err)
        }
      })
      this.socket1?.on('push_message', data => {
        console.log('====================================')
        console.log('数据中心 接受ws消息：')
        console.log(data)
        console.log('====================================')
        try {
          this.bus.$emit('wsHandle', data)
        } catch (err) {
          console.log('err', err)
        }
      })
      /**
       * 断开消息
       */

      this.socket0?.on('disconnect', function (reason) {
        console.log('====================================')
        console.log('断开 ws')
        console.log('断开 ws 原因：', reason)
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          console.log('尝试手动连接')
          this.socket0?.connect()
        }
        console.log('====================================')
      })
      this.socket1?.on('disconnect', function (reason) {
        console.log('====================================')
        console.log('预警 断开 ws')
        console.log('预警 断开 ws 原因：', reason)
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          console.log('预警 尝试手动连接')
          this.socket1?.connect()
        }
        console.log('====================================')
      })

      this.socket0?.on('reconnect_error', error => {
        console.log('reconnect_error', error)
      })

      this.socket0?.on('reconnecting', error => {
        console.log('reconnecting', error)
      })

      this.socket0?.on('connect_timeout', error => {
        console.log('connect_timeout', error)
      })

      this.socket1?.on('reconnect_error', error => {
        console.log('reconnect_error', error)
      })

      this.socket1?.on('reconnecting', error => {
        console.log('reconnecting', error)
      })

      this.socket1?.on('connect_timeout', error => {
        console.log('connect_timeout', error)
      })
    },
    /**
     * 发送消息
     */
    websocketsend (name, data) {
      this.socket0?.emit(name, data)
      this.socket1?.emit(name, data)
    },

    disconnect () {
      if (this.socket0) {
        this.socket0?.close()
      }
      if (this.socket1) {
        this.socket1?.close()
      }
    },

    notifyInfo (title, tips, fn) {
      this.$notify.info({
        title: title,
        message: tips,
        duration: 30000,
        offset: 100,
        dangerouslyUseHTMLString: true,
        onClick: fn
      })
    }
  }
}
