/* eslint-disable */
import Vue from 'vue'
import Loading from './index.vue'
import { addClass, removeClass, getStyle } from '@/utils/dom.js'
import { PopupManager } from 'element-ui/src/utils/popup'
import afterLeave from '@/utils/after-leave'
const Mask = Vue.extend(Loading)

const toggleLoading = (el, binding) => {
  if (binding.value) {
    Vue.nextTick(() => {
      if (binding.modifiers.fullscreen) {
        el.originalPosition = getStyle(document.body, 'position')
        el.originalOverflow = getStyle(document.body, 'overflow')
        el.maskStyle.zIndex = PopupManager.nextZIndex()

        addClass(el.mask, 'is-fullscreen')
        insertDom(document.body, el, binding)
      } else {
        removeClass(el.mask, 'is-fullscreen')

        if (binding.modifiers.body) {
          el.originalPosition = getStyle(document.body, 'position')

          ['top', 'left'].forEach(property => {
            const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft'
            el.maskStyle[property] = el.getBoundingClientRect()[property] +
              document.body[scroll] +
              document.documentElement[scroll] -
              parseInt(getStyle(document.body, `margin-${ property }`), 10) +
              'px'
          })
          ['height', 'width'].forEach(property => {
            el.maskStyle[property] = el.getBoundingClientRect()[property] + 'px'
          })

          insertDom(document.body, el, binding)
        } else {
          el.originalPosition = getStyle(el, 'position')
          insertDom(el, el, binding)
        }
      }
    })
  } else {
    afterLeave(el.instance, _ => {
      if (!el.instance.hiding) return
      el.domVisible = false
      const target = binding.modifiers.fullscreen || binding.modifiers.body
        ? document.body
        : el
      removeClass(target, 'el-loading-parent--relative')
      removeClass(target, 'el-loading-parent--hidden')
      el.instance.hiding = false
    }, 300, true)
    el.instance.visible = false
    el.instance.hiding = true
  }
}
const insertDom = (parent, el, binding) => {
  if (!el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden') {
    Object.keys(el.maskStyle).forEach(property => {
      el.mask.style[property] = el.maskStyle[property]
    })

    if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
      addClass(parent, 'el-loading-parent--relative')
    }
    if (binding.modifiers.fullscreen && binding.modifiers.lock) {
      addClass(parent, 'el-loading-parent--hidden')
    }
    el.domVisible = true

    parent.appendChild(el.mask)
    Vue.nextTick(() => {
      if (el.instance.hiding) {
        el.instance.$emit('after-leave')
      } else {
        el.instance.visible = true
      }
    })
    el.domInserted = true
  } else if (el.domVisible && el.instance.hiding === true) {
    el.instance.visible = true
    el.instance.hiding = false
  }
}

const src_addStyle = (options, parent, instance) => {
  let maskStyle = {}
  if (options.fullscreen) {
    instance.originalPosition = getStyle(document.body, 'position')
    instance.originalOverflow = getStyle(document.body, 'overflow')
    maskStyle.zIndex = PopupManager.nextZIndex()
  } else if (options.body) {
    instance.originalPosition = getStyle(document.body, 'position')
    ['top', 'left'].forEach(function (property) {
      let scroll = property === 'top' ? 'scrollTop' : 'scrollLeft'
      maskStyle[property] = options.target.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] + 'px'
    })
    ['height', 'width'].forEach(function (property) {
      maskStyle[property] = options.target.getBoundingClientRect()[property] + 'px'
    })
  } else {
    instance.originalPosition = getStyle(parent, 'position')
  }
  Object.keys(maskStyle).forEach(function (property) {
    instance.$el.style[property] = maskStyle[property]
  })
}

const defaults = {
  text: null,
  fullscreen: true,
  body: false,
  lock: false,
  customClass: ''
}
let LoadingConstructor = Vue.extend(Loading)
let fullscreenLoading = void 0

LoadingConstructor.prototype.originalPosition = ''
LoadingConstructor.prototype.originalOverflow = ''

LoadingConstructor.prototype.close = function () {
  let _this = this

  if (this.fullscreen) {
    fullscreenLoading = undefined
  }
  afterLeave(this, function (_) {
    let target = _this.fullscreen || _this.body ? document.body : _this.target
    removeClass(target, 'el-loading-parent--relative')
    removeClass(target, 'el-loading-parent--hidden')
    if (_this.$el && _this.$el.parentNode) {
      _this.$el.parentNode.removeChild(_this.$el)
    }
    _this.$destroy()
  }, 300)
  this.visible = false
}

export default {
  'pLoading': {
    bind: function (el, binding, vnode) {
      const textExr = el.getAttribute('element-loading-text')
      const spinnerExr = el.getAttribute('element-loading-spinner')
      const backgroundExr = el.getAttribute('element-loading-background')
      const customClassExr = el.getAttribute('element-loading-custom-class')
      const vm = vnode.context
      const mask = new Mask({
        el: document.createElement('div'),
        data: {
          text: vm && vm[textExr] || textExr,
          spinner: vm && vm[spinnerExr] || spinnerExr,
          background: vm && vm[backgroundExr] || backgroundExr,
          customClass: vm && vm[customClassExr] || customClassExr,
          fullscreen: !!binding.modifiers.fullscreen
        }
      })
      el.instance = mask
      el.mask = mask.$el
      el.maskStyle = {}

      binding.value && toggleLoading(el, binding)
    },

    update: function (el, binding) {
      el.instance.setText(el.getAttribute('element-loading-text'))
      el.instance.setBackground(el.getAttribute('element-loading-background'))
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding)
      }
    },

    unbind: function (el, binding) {
      if (el.domInserted) {
        el.mask &&
        el.mask.parentNode &&
        el.mask.parentNode.removeChild(el.mask)
        toggleLoading(el, { value: false, modifiers: binding.modifiers })
      }
      el.instance && el.instance.$destroy()
    }
  },
  pLoadingFun: function () {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
    options = Object.assign({}, defaults, options)
    if (typeof options.target === 'string') {
      options.target = document.querySelector(options.target)
    }
    options.target = options.target || document.body
    if (options.target !== document.body) {
      options.fullscreen = false
    } else {
      options.body = true
    }
    if (options.fullscreen && fullscreenLoading) {
      return fullscreenLoading
    }
    let parent = options.body ? document.body : options.target
    let instance = new LoadingConstructor({
      el: document.createElement('div'),
      data: options
    })

    src_addStyle(options, parent, instance)
    if (instance.originalPosition !== 'absolute' && instance.originalPosition !== 'fixed') {
      addClass(parent, 'el-loading-parent--relative')
    }
    if (options.fullscreen && options.lock) {
      addClass(parent, 'el-loading-parent--hidden')
    }
    parent.appendChild(instance.$el)
    Vue.nextTick(function () {
      instance.visible = true
    })
    if (options.fullscreen) {
      fullscreenLoading = instance
    }
    return instance
  }
}
