import Vue from 'vue'
import MessageBox from './index.vue'

let currentInfo, instance
const tipBox = Vue.extend(MessageBox)

const callback = action => {
  if (currentInfo.resolve) {
    if (action === 'confirm') {
      currentInfo.resolve(action)
    } else if (currentInfo.reject && (action === 'cancel' || action === 'close')) {
      currentInfo.reject(action)
    }
  }
}

const showMessageBox = (data) => {
  instance = new tipBox({
    data
  }).$mount()
  instance.callback = callback
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
  })
}

MessageBox.install = (message, option) => {
  currentInfo = {}
  option.message = message
  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      currentInfo = {
        options: option,
        resolve: resolve,
        reject: reject
      }
      showMessageBox(option)
    })
  } else {
    currentInfo = {
      options: option,
    }
    showMessageBox(option)
    return instance
  }
}

export default MessageBox
