<template>
  <div v-if='showNum' v-text='showNum'></div>
</template>

<script>
import { tween } from 'shifty'

const TO_FLOAT = /^\d+(\.\d+)?$/
const TO_INT = /^\[1-9][0-9]*$/
const isNumber = (value) => {
  return typeof value === 'number' || (
    typeof value === 'string' && (TO_FLOAT.test(value) || TO_INT.test(value))
  )
}

export default {
  name: 'WAutoAddNumber',
  props: {
    haveSeparator: {
      type: Boolean,
      default: false
    },
    from: {
      type: [Number, String],
      required: true,
      validator: isNumber
    },
    to: {
      type: [Number, String],
      required: true,
      validator: isNumber
    },
    duration: {
      type: [Number, String],
      default: 1000,
      validator: isNumber
    },
    // shifty中用来计算点的宽松曲线
    easing: {
      type: String,
      default: 'easeOutQuad'
    },
    formatter: {
      type: Function,
      default: parseInt
    },
    // auto：会自动新增，touch: 需要通过触发start()方法使得数字有自增的效果
    model: {
      type: String,
      validator: (value) => {
        return value === 'auto' || value === 'touch'
      },
      default: 'auto'
    },
  },
  computed: {
    __from: function () {
      return this.from
    },
    __to: function () {
      return this.to
    }
  },
  watch: {
    // 有点小问题，后面需要修改
    __to: {
      handler (newVal) {
        this.resetOptions('to', newVal)
        if (this.model === 'auto') {
          this.state = 'end'
          this.start()
        }
      }
    },
    __from: {
      handler (newVal) {
        this.resetOptions('from', newVal)
        if (this.model === 'auto') {
          this.state = 'end'
          this.start()
        }
      }
    },
    showNum: {
      handler (newVal) {
        // 数字添加千位分隔符
        if (this.haveSeparator) {
          this.showNum = newVal.toLocaleString('en-US')
        }
      }
    }

  },
  data () {
    return {
      showNum: null,
      state: 'end',
      tweenOptions: {}
    }
  },
  mounted () {
    this.setTweenOptions()
    if (this.model === 'auto') this.start()
    if (this.model === 'touch') {
      typeof this.__from === 'string'
        ? this.showNum = this.formatter(parseFloat(this.__from))
        : this.showNum = this.formatter(this.__from)
    }
  },

  methods: {
    // 设置传递给tween的值的方法
    setTweenOptions () {
      let from = typeof this.__from === 'string'
        ? { x: parseFloat(this.__from) }
        : { x: this.__from }
      let to = typeof this.__to === 'string'
        ? { x: parseFloat(this.__to) }
        : { x: this.__to }
      let duration = typeof this.duration === 'string'
        ? parseFloat(this.duration)
        : this.duration

      this.tweenOptions = {
        from: from,
        to: to,
        duration: duration,
        easing: this.easing,
        step: this.updateNumber
      }
    },
    // 通过shifty来实现数字在一定时间内，从from值到to值的自增效果
    start (options) {
      if (this.state === 'start') return
      this.state = 'start'

      if (options) this.updateAttribute(this.tweenOptions, options)
      if (this.tweenOptions.duration === 0) this.tweenOptions.duration = 1

      tween(this.tweenOptions).then(this.updateNumber).then(() => {
        this.state = 'end'
      })
    },
    updateNumber (state) {
      this.showNum = this.formatter
        ? state.state
          ? this.formatter(state.state.x)
          : this.formatter(state.x)
        : state.state
          ? state.state.x
          : state.x
    },
    updateAttribute (oldObject, newObject) {
      for (let key in newObject) {
        oldObject[key] = newObject[key]
      }
    },
    resetOptions (attr, num) {
      this.tweenOptions[attr] = typeof num === 'string'
        ? { x: parseFloat(num) }
        : { x: num }
    }
  }
}
</script>

<style lang='less' scoped>

</style>
