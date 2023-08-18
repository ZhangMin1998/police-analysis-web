const pxtorem = require("postcss-pxtorem");
module.exports = {
  plugins: [
    pxtorem({
      rootValue: 192,
      unitPrecision: 5,
      propList: ["*"],
      selectorBlackList: [/^\.nop2r/, /^\.am/,'.item_label','.item_label_value','.not_change_rem','html','warn_draw_bar','.el-tabs__nav-wrap'],
      replace: true,
      mediaQuery: false,
      minPixelValue: 1
    })
  ]
}
