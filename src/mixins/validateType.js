export default {
  data () {
    const actions = {
      mac: this.validateMac,
      id_num: this.validateIDCard,
      ip_addr: this.validateIP,
      wechat: this.validateWeixin,
      email: this.validateEmail,
      mobile: this.validateMobilePhone,
      car_num: this.validateCarNumber
      // imei,
      // imsi
    }
    return { actions: actions }
  },
  methods: {
    // 校验值
    validateValue (type, value, canEmpty) {
      if (!this.actions[type]) return true
      return this.actions[type](value, canEmpty)
    },
    // 电脑MAC地址
    validateMac (value, canEmpty) {
      if (canEmpty) return true
      if (!value) {
        this.$messageTip.error('请输入MAC地址')
        return false
      }
      value = value.split(' ').join('')
      value = value.split('-').join('')

      if (value.length !== 12) {
        this.$messageTip.error('请输入12位MAC地址')
        return false
      }

      let temp = /([a-fA-F\d]{2}){5}[a-fA-F\d]{2}/
      if (!temp.test(value)) {
        this.$messageTip.error('请输入12位MAC地址')
        return false
      }

      return true
    },
    // 身份证
    validateIDCard (value, canEmpty) {
      if (canEmpty) return true
      if (!value) {
        this.$messageTip.error('请输入身份证')
        return false
      }
      if (
        value &&
        (!/\d{17}[\d|x]|\d{15}/.test(value) || (value.length !== 15 && value.length !== 18))
      ) {
        this.$messageTip.error('身份证号码不规范')
        return false
      }
      return true
    },
    //  IP地址
    validateIP (value, canEmpty) {
      if (canEmpty) return true
      if (!value) {
        this.$messageTip.error('请输入IP地址')
        return false
      }
      if (value && '...' === value) {
        this.$messageTip.error('请输入IP地址')
        return false
      }
      if (
        value &&
        !/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/.test(
          value
        )
      ) {
        this.$messageTip.error('IP地址不规范')
        return false
      }
      return true
    },
    // 微信号
    validateWeixin (value, canEmpty) {
      if (canEmpty) return true
      if (value === '') {
        this.$messageTip.error('微信号不能为空')
        return false
      } else {
        var reg = /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/
        if (!reg.test(value)) {
          this.$messageTip.error('请输入正确的微信号码')
          return false
        }
        return true
      }
    },
    // 邮箱：
    validateEmail: (value, canEmpty) => {
      if (canEmpty) return true
      if (value === '') {
        this.$messageTip.error('请正确填写邮箱')
        return false
      }

      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(value)) {
        this.$messageTip.error('请输入有效的邮箱')
        return false
      }

      return true
    },
    //  手机号：
    validateMobilePhone (value, canEmpty) {
      if (canEmpty) return true
      if (value === '') {
        this.$messageTip.error('手机号不可为空')
        return false
      }

      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        this.$messageTip.error('请输入有效的手机号码')
        return false
      }

      return true
    },
    // 车牌号
    validateCarNumber (value, canEmpty) {
      if (canEmpty) return true
      if (value === '') {
        this.$messageTip.error('车牌号不可为空')
        return false
      }
      var xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/

      var creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/

      if (value.length == 7) {
        if (!creg.test(value)) {
          this.$messageTip.error('请输入有效的车牌号')
          return false
        }
      } else if (value.length == 8) {
        if (!xreg.test(value)) {
          this.$messageTip.error('请输入有效的车牌号')
          return false
        }
      }

      return true
    },
    //判断两个对象是否相等
    isEqual (objA, objB) {
      //相等
      if (objA === objB) return objA !== 0 || 1 / objA === 1 / objB
      //空判断
      if (objA == null || objB == null) return objA === objB
      //类型判断
      if (Object.prototype.toString.call(objA) !== Object.prototype.toString.call(objB))
        return false

      switch (Object.prototype.toString.call(objA)) {
        case '[object RegExp]':
        case '[object String]':
          //字符串转换比较
          return '' + objA === '' + objB
        case '[object Number]':
          //数字转换比较,判断是否为NaN
          if (+objA !== +objA) {
            return +objB !== +objB
          }

          return +objA === 0 ? 1 / +objA === 1 / objB : +objA === +objB
        case '[object Date]':
        case '[object Boolean]':
          return +objA === +objB
        case '[object Array]':
          //判断数组
          for (let i = 0; i < objA.length; i++) {
            if (!this.isEqual(objA[i], objB[i])) return false
          }
          return true
        case '[object Object]': {
          //判断对象
          let keys = Object.keys(objA)
          for (let i = 0; i < keys.length; i++) {
            if (!this.isEqual(objA[keys[i]], objB[keys[i]])) return false
          }

          keys = Object.keys(objB)
          for (let i = 0; i < keys.length; i++) {
            if (!this.isEqual(objA[keys[i]], objB[keys[i]])) return false
          }

          return true
        }
        default:
          return false
      }
    }
  }
}
