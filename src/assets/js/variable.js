
const baseSize = {
  "--font-size-large-x": "22px",
  "--font-size-large": "18px",
  "--font-size-medium": "14px",
  "--font-size-medium-x": "16px",
  "--font-size-small-s": "10px",
  "--font-size-small": "12px",
  "--supersearch-active-color": "#3D6EFF",
  "--box-shadow": "0px -1px 12px 1px rgba(1, 47, 142, 0.08)",
  "--warn-trigger-box-shadow": "0 0 6px 1px rgba(0, 0, 0, 0.25)",
  "--warn-trace-source-box-shadow": "0 0 6px 1px rgba(0, 0, 0, 0.06)"
};

export const lightTheme = {
  // 文字颜色
  "--title-text-color": "#012F8E", // 系统标题
  "--primary-menu-text-color": "#999999", // 一级菜单
  "--base-text-color-1": "#333333",  // 333为白色风格主要的文字颜色 表格文字
  "--base-text-color-1-to-666666": "#666666",
  "--base-text-color-1-to-ffffff": "#FFFFFF",
  "--base-text-color-2": "#666666",
  "--base-text-color-3": "#666666",
  "--base-text-color-4": "#333333",
  "--base-text-color-5": "#333333",
  "--base-text-color-6": "#999999",
  "--base-text-color-7": "#FFFFFF",
  "--base-text-color-9": "rgba(102, 102, 102, 0.32)",
  "--base-text-color-to-333333": "#666666",  // 黑色主要文字颜色(body的颜色) 转成 白色主要文字颜色
  "--base-text-color-to-666666": "#666666",
  "--base-text-color-to-999999": "#666666",// 表格表头
  "--white-color-to-333333": "#333333",
  "--333333-to-white-color": "#ffffff",
  "--C0D0E7-to-blue-color": "#012F8E",
  //  激活时的颜色 var(--active-color)
  "--active-color": "#012F8E",
  "--devicemap-active-color": "#012F8E", // 设备地图右上角模式激活颜色
  "--base-text-color-8": "#FFFFFF", // 设备地图右上角模式文字颜色
  "--border-image": "linear-gradient(to right, #ffffff, transparent) 1", // 设备地图右上角模式边框

  // loading颜色
  "--loading-color": "#fff",
  "--loading-color-1": "rgba(255, 255, 255, 0.5)",
  "--loading-color-2": "rgba(255, 255, 255, 0.5)",
  "--loading-color-3": "rgba(241, 242, 245, 0.5)",
  // 组件颜色(组件类)
  "--border-color-input": "#EBEDF6", // input的边框颜色
  "--border-color-input-hover": "#DADCE5",
  "--border-color-input-error": "rgba(255, 16, 110, .4)",
  "--table-row-border-bottom-color" :'#DEDEDE',
  "--input-placehold-color": "#C8CFDF", // input输入框的placeholder的颜色
  "--table-head-bg-color": "rgba(246, 248, 253)", // table头部的背景颜色
  // "--table-row-simple-bg-color": "rgba(246, 248, 253)", // table条纹浅色的背景颜色
  "--pagination-bg-to-F6F8FD": "#f6f8fd",
  "--pagination-active-bg-to-012F8E": "#012F8E",
  "--pagination-active-color-to-ffffff": "#ffffff",
  "--daochu-bg-color": "#e9ebec", // 弹出层dialog的统一背景颜色 导出的背景颜色
  "--xuanzeqi-bg-color": "#fff", // 选择器的背景颜色
  "--checkbox-normal-color": "#c0d0e7", // checkbox正常状态颜色
  "--table-pageHeader-bg-color": "#fff", // 表格上面部分 搜索栏的表头颜色
  "--date-picker-bg-color": "#ffffff", // 日期选择器的背景颜色
  "--search-input-hover-bg": "#999999", // 类似百度的搜索框hover时的背景颜色
  "--datapicker-disabled-bg": "transparent", // 时间选择器禁止的颜色
  "--datapicker-input-border-color": "#EBEDF5", // 时间选择器input边框的颜色
  "--datapicker-in-range-bg-color": "#ebeef6", // 时间选择器选择到日期的背景颜色
  "--datapicker-shijian-xiala-bg-color": "#ffffff", // 时间选择器选择时间下拉背景颜色
  "--datapicker-border-color": "#E4E4E4", // 时间选择器中间的边框
  "--tab-bg-color": "linear-gradient(to right, rgba(1, 47, 142), transparent)", // 进入统计模式/列表模式的渐变色
  "--expand-table-bg-color":"#fff",
  "--data-search-inactive":"#8799BF",
  "--checkbox-border":"#DADCE5",
  "--map-search-bg": "#FFFFFF",
  "--map-search-placeholder": "rgba(153, 153, 153, 0.6)",
  "--map-search-result-bg": "rgba(255, 255, 255, 0.87)",

  //  背景颜色
  // "--bg-color-1": "#f6f8fd",  // 数据中心第三层（第二黑） 转为白色背景基础色（淡灰）
  "--bg-color-1": "#fff",  // 数据中心第三层（第二黑） 转为白色背景基础色（淡灰）
  // "--bg-color-2": "#fff", // 数据中心第二层（不黑偏白的那个） 转为纯白白色
  "--bg-color-2": "#f1f2f5", // 数据中心第二层（不黑偏白的那个） 转为纯白白色
  "--bg-color-3": "#fff", // 数据中心第三层（第二黑） 转为纯白白色
  "--bg-color-4": "#FFFFFF",
  "--bg-color-5": "#f6f8fd",
  // "--bg-color-5": "#FFFFFF",
  "--bg-color-6": "#F1F2F5",
  "--bg-color-7": "#FFFFFF",
  "--bg-color-8": "#FFFFFF",
  "--bg-color-9": "rgba(255, 255, 255, 0.9)",
  "--checked-option-192035-to-f8f8f8":"#f6f8fd",
  "--heared-bg-color": "#f6f8fd", // 数据中心第一层（最黑的那个） 转为白色背景基础色（淡灰）
  "--tooltip-bg-262D44-to-f6f8fd": "#f6f8fd",
  "--bg-collapse": "#f3f3f3", // 任务管理内容的背景色
  "--bg-deduction-chart": "#f6f8fd", // 关系推演图谱背景色
  // "--bg-deduction-line": "rgba(255, 16, 110, .4)", // 关系推演图谱线条色
  "--bg-leftDrawer-click": "rgba(1,47,142,0.08)", // 左侧dwear弹框选中后的背景色

  // 阴影
  "--box-shadow-color": "rgba(1, 47, 142, 0.08)",

  // 边框
  "--border-color-1": "#DBDEE6",
  "--border-color-2": "#B3BFDB",
  "--border-color-3": "#FFFFFF",
  "--border-color-4": "#DEDEDE",

  // 按钮
  "--button-bg-color": "#012F8E",
  "--button-hover-bg-color": "#0E48BE",
  "--button-disabled-bg-color": "rgba(1, 47, 142, 0.23)",
  "--button-disabled-color": "rgba(255, 255, 255)",
  "--button-plain-border-color": "#C9CDD6",
  "--button-plain-disabled-border-color": "rgba(201, 205, 214, 0.4)",
  "--button-plain-disabled-color": "rgba(102, 102, 102, 0.4)",

  // // 页面类（不通用）
  "--device-map-toal-number-bg": "#FFFFFF",
  "--device-map-toal-text-color": "rgba(102, 102, 102, 0.32)",
  "--device-map-toal-text-active-color": "#333333",
  "--device-map-devicelist-choosed-text-color": "#333333",
  "--device-map-devicelist-choosed-bg-color": "rgba(0, 0, 0, 0.2)",
  "--supersearch-tuijian-bg": "#f3f3f3",
  "--supersearch-search-focus-bg": '#f6f8fd',
  "--car-right-chuangkou-bg":"#fff",
  "--car-right-chuangkou-hearder-bg":"#fff",
  "--car-left-drawer-info-bg":"#fff",
  "--zuoxifenxi-right-top-zhanshifangshi-bg":"#fff",
  "--fangkongyujing-xinjian-bianji-header-bg":"#fff",
  "--el-select-input-bg": "#fff",
  "--quyufangkong-table-bg": "transparent",
  "--map-point-info-dialog-bg": "#fff", // 地图设备点详情弹框
  "--shikongpengzhuang-hours-select-bg": "#f3f3f3",
  "--return-back-i-color": "#666666",
  "--record-track-color": "#999999",
  "--record-atlas-color": "#8CA9FF",
  "--record-library-tree" : "rgba(1, 47, 142, 0.08)",
  "--record-library-tree-opera" : "rgba(102, 102, 102, .32)",
  "--record-library-standard" : "rgba(255, 255, 255, .95)",
  "--control-map-dialog-bg": "rgba(246, 248, 253, 0.9)",
  "--warn-touch-list-bg": "#F3F3F3",
  "--warn-error-image-bg": "#F3F3F3",
  "--app-upload-border": "rgba(1, 47, 142, 0.56)",
  "--app-upload-bg": "rgba(255, 255, 255, 0.64)",
  "--app-Filter-box-shadow": "rgba(1, 47, 142, 0.08)",
  "--app-record-success-color": "#0CBF7E",

  // 分割线
  "--division": "rgba(120, 133, 165, .45)",

  // 背景图路径
  "--sys-header-bg": `url(${require('../img/sys-header-bg-light.png')})`,
  "--system-tab-active-line":`url(${require('../img/sys-header-active-light.png')})`,
  "--car-default-pic":`${require('../img/car-default-light.png')}`,
  "--car-default-pic-name":'car-default-light',
  "--person-default-pic":`${require('../img/icon-morenHeader-light.png')}`,
  "--person-default-pic-name":'icon-morenHeader-light',
  "--icon-nocar-pic":`${require('../img/icon-nocar-light.png')}`,
  "--icon-no-monitor-pic":`${require('../img/no-monitor-light.png')}`,
  "--icon-map-dialog-pic":`url(${require('../img/MapPopup_bg-light.png')})`,
  "--drawer-top-bg": `url(${require('../img/drawer-top-light.png')})`,
  "--atlis-default-img": "atlis-default-light",
  "--analysis-app-box": `url(${require('../img/analysis-app-bg-light.png')})`,
  "--analysis-result-header": `url(${require('../img/appresult-header-bg-light.png')})`,
  "--upload-file-bg": "upload_file_light",
  ...baseSize,
};

export const darkTheme = {
  // 文字颜色
  "--title-text-color": "#CCE1FF",
  "--primary-menu-text-color": "#8495C2",
  "--base-text-color-1": "#C0D0E7",
  "--base-text-color-1-to-666666": "#C0D0E7",
  "--base-text-color-1-to-ffffff": "#C0D0E7",
  "--base-text-color-2": "#657494",
  "--base-text-color-3": "#515C7C",
  "--base-text-color-4": "#8799BF",
  "--base-text-color-5": "#FFFFFF",
  "--base-text-color-6": "#8799BF",
  "--base-text-color-7": "#3D6EFF",
  "--base-text-color-9": "#434B5F",
  "--base-text-color-to-333333": "#8799BF",
  "--base-text-color-to-666666": "#8799BF",
  "--base-text-color-to-999999": "#8799BF",
  "--white-color-to-333333": "#fff",
  "--333333-to-white-color": "#333333",
  "--C0D0E7-to-blue-color": "#C0D0E7",
  //  激活时的颜色 var(--active-color)
  "--active-color": "#3D6EFF",
  "--devicemap-active-color": "#3D6EFF", // 设备地图右上角模式激活颜色
  "--base-text-color-8": "#3D6EFF", // 设备地图右上角模式文字颜色
  "--border-image": "linear-gradient(to right, rgba(61, 110, 225), transparent) 1", // 设备地图右上角模式边框

   // loading颜色
   "--loading-color": "rgba(25, 32, 53, 1)",
   "--loading-color-1": "rgba(33, 40, 62, 0.5)",
   "--loading-color-2": "rgba(35, 42, 67, 0.5)",
   "--loading-color-3": "rgba(25, 32, 53, 0.5)",
  // 组件颜色(组件类)
  "--border-color-input": "rgba(81, 92, 124, 0.4)",
  "--border-color-input-hover": "#3D4C75",
  "--border-color-input-error": "rgba(255, 16, 110, .4)",
  "--table-row-border-bottom-color" :'rgba(255, 255, 255, 0.12)',
  "--input-placehold-color": "rgba(101, 116, 148, .56)",
  "--table-head-bg-color": "rgba(255, 255, 255, 0.04)",
  // "--table-row-simple-bg-color": "rgba(255, 255, 255, 0.12)",
  "--pagination-bg-to-F6F8FD": "rgba(53,62,91,0.32)",
  "--pagination-active-bg-to-012F8E": "#353E5B",
  "--pagination-active-color-to-ffffff": "#C0D0E7",
  "--daochu-bg-color": "rgba(39, 52, 77, 0.95)",
  "--xuanzeqi-bg-color": "rgba(39, 47, 72, 0.95)",
  "--checkbox-normal-color": "rgba(192, 208, 231, 0.2)",
  "--table-pageHeader-bg-color": "rgba(255, 255, 255, 0.02)",
  "--date-picker-bg-color": "#151C31", // 日期选择器的背景颜色
  "--search-input-hover-bg": "#2e3754", // 类似百度的搜索框hover时的背景颜色
  "--datapicker-disabled-bg":"#2E3754",
  "--datapicker-input-border-color": "rgba(255, 255, 255, 0.2)", // 时间选择器input边框的颜色
  "--datapicker-in-range-bg-color": "#2E3754", // 时间选择器选择到日期的背景颜色
  "--datapicker-shijian-xiala-bg-color": "#242B42", // 时间选择器选择时间下拉背景颜色
  "--datapicker-border-color": "#374460", // 时间选择器中间的边框
  "--tab-bg-color": "linear-gradient(to right, #232c59, transparent)", // 进入统计模式/列表模式的渐变色
  "--expand-table-bg-color":"#1f2b3f",
  "--data-search-inactive":"#4d597f",
  "--checkbox-border":"#515C7C",
  "--map-search-bg": "transparent",
  "--map-search-placeholder": "rgba(132, 149, 194, 0.6)",
  "--map-search-result-bg": "rgba(32, 43, 63, 0.87)",

  // 背景颜色
  "--bg-color-1": "#21283E",
  "--bg-color-2": "#192035",
  "--bg-color-3": "#21283E", // 数据中心第三层（第二黑） 转为纯白白色
  "--bg-color-4": "#232A43",
  "--bg-color-5": "#0D1325",
  "--bg-color-6": "#192035",
  "--bg-color-7": "#192035",
  "--bg-color-8": "#272F48",
  "--bg-color-9": "rgba(33, 40, 62, 0.9)",
  "--checked-option-192035-to-f8f8f8":"#192035",
  "--heared-bg-color": "#1B2132",
  "--tooltip-bg-262D44-to-f6f8fd": "#262D44",
  "--bg-collapse": "#313e58", // 任务管理内容的背景色
  "--bg-deduction-chart": "#21283E", // 关系推演图谱背景色
  // "--bg-deduction-line": "rgba(255, 255, 255, .12)", // 关系推演图谱线条色
  "--bg-leftDrawer-click": "#2E3754", // 左侧dwear弹框选中后的背景色


  // 阴影
  "--box-shadow-color": "rgba(0, 0, 0, 0.16)",

  // 边框
  "--border-color-1": "#42506A",
  "--border-color-2": "#515C7C",
  "--border-color-3": "#515C7C",
  "--border-color-4": "#38425D",

  // 按钮
  "--button-bg-color": "#3D6EFF",
  "--button-hover-bg-color": "#5281FD",
  "--button-disabled-bg-color": "#434B5F",
  "--button-disabled-color": "rgba(255, 255, 255, 0.32)",
  "--button-plain-border-color": "#515C7C",
  "--button-plain-disabled-border-color": "rgba(81, 92, 124, 0.32)",
  "--button-plain-disabled-color": "rgba(192, 208, 231, 0.32)",

  // // 页面类（不通用）
  "--device-map-toal-number-bg": "rgba(22, 28, 46, 0.5)",
  "--device-map-toal-text-color": "rgba(204, 225, 255, 0.45)",
  "--device-map-toal-text-active-color": "#CCE1FF",
  "--device-map-devicelist-choosed-text-color": "#fff",
  "--device-map-devicelist-choosed-bg-color": "rgba(255, 255, 255, 0.2)",
  "--supersearch-tuijian-bg": "#2e3754",
  "--supersearch-search-focus-bg": '#232A42',
  "--car-right-chuangkou-bg":"#21283E",
  "--car-right-chuangkou-hearder-bg":"#192035",
  "--car-left-drawer-info-bg":"#192035",
  "--zuoxifenxi-right-top-zhanshifangshi-bg":"#192035",
  // "--fangkongyujing-xinjian-bianji-header-bg":"rgba(39, 52, 77, 0.6)",
  "--fangkongyujing-xinjian-bianji-header-bg":"#21283E",
  "--el-select-input-bg": "transparent",
  "--quyufangkong-table-bg": "rgba(32, 43, 63, 0.6)",
  "--map-point-info-dialog-bg": "rgba(32, 43, 63, 0.95)",
  "--shikongpengzhuang-hours-select-bg": "#25324b",
  "--return-back-i-color": "#8495C2",
  "--record-track-color": "#4D597F",
  "--record-atlas-color": "#5E86FF",
  "--record-library-tree" : "#2E3754",
  "--record-library-tree-opera" : "rgba(101, 116, 148, .32)",
  "--record-library-standard" : "rgba(39, 47, 72, .95)",
  "--control-map-dialog-bg": "rgba(38, 45, 68, 0.9)",
  "--warn-touch-list-bg": "#252C44",
  "--warn-error-image-bg": "#384262",
  "--app-upload-border": "rgba(61, 110, 255, 0.56)",
  "--app-upload-bg": "rgba(33, 40, 62, 0.64)",
  "--app-Filter-box-shadow": "rgba(0, 0, 0, 0.12)",
  "--app-record-success-color": "#0CBF7E",

  // 分割线
  "--division": "rgba(255, 255, 255, .12)",

  // 背景图路径
  "--sys-header-bg": `url(${require('../img/sys-header-bg-dark.png')})`,
  "--system-tab-active-line":`url(${require('../img/sys-header-active-dark.png')})`,
  "--car-default-pic":`${require('../img/car-default-dark.png')}`,
  "--car-default-pic-name":'car-default-dark',
  "--person-default-pic":`${require('../img/icon-morenHeader.png')}`,
  "--person-default-pic-name":'icon-morenHeader',
  "--icon-nocar-pic":`${require('../img/icon-nocar-dark.png')}`,
  "--icon-no-monitor-pic":`${require('../img/no-monitor-dark.png')}`,
  "--icon-map-dialog-pic":`url(${require('../img/MapPopup_bg-dark.png')})`,
  "--drawer-top-bg": `url(${require('../img/drawer-top.png')})`,
  "--atlis-default-img": "atlis-default",
  "--analysis-app-box": `url(${require('../img/analysis-app-bg.png')})`,
  "--analysis-result-header": `url(${require('../img/appresult-header-bg.png')})`,
  "--upload-file-bg": "upload-file",
  ...baseSize,
};

