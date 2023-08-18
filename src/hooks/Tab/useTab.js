import { reactive } from '@vue/composition-api'

// 处理tab菜单逻辑
export function useTabEffect (tabList, fn) {
  if (!tabList || tabList.length === 0) return
  const tabs = reactive({
    activeName: ''
  })

  tabs.list = tabList

  tabs.activeName = tabList[0].name

  // 强制设置tab 当前点击状态
  const setActive = name => {
    tabs.activeName = name
  }

  // 原函数
  let handleClickTab = function (event) {
    tabs.activeName = event.name
  }

  // 定义 aop 函数
  const _after = function (fn, afterfn) {
    return function () {
      let res = fn.apply(this, arguments)
      afterfn.apply(this, arguments)
      return res
    }
  }

  // 用装饰函数装饰原函数
  handleClickTab = _after(handleClickTab, fn)

  return { tabs, handleClickTab, setActive }
}
