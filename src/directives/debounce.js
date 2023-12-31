
export default (vue) => {
  /**
   * 绑定方法
   * @param {Object} el - The element the directive is bound to.
   * @param {Object} binding - An vue directive object
   */
   vue.directive('debounce', { //防抖函数指令
      inserted: function (el, binding) {
        let timer
        el.addEventListener("click", (e) => {
          if (timer) {
            clearTimeout(timer)
          }
          if (e.target.parentNode.nodeName === 'BUTTON') {
            e.target.parentNode.blur()
          } else if (e.target.nodeName === 'BUTTON') {
            e.target.blur()
          }
          timer = setTimeout(() => {
            //关键点:vue 的自定义指令传递的参数binding 如果是一个函数,则通过      binding.value()来执行,通过上述示例,还可以传递比如事件, 绑定对象之类的
            binding.value()
          }, 500)
        })
      }
   })
}
