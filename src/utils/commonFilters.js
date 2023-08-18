export function strCode (str) {  //获取字符串的字节数
  if (str) {  //如果存在字符串，则执行
    let len = str.length;
    for (var i = 0; i < len; i++) {  //遍历字符串，枚举每个字符
      if (str.charCodeAt(i) > 255) {  //字符编码大于255，说明是双字节字符(即是中文)
        len -= 1;  //则累加2个
      }
    }
    return len;  //返回字节数
  } else {
    return 0;  //如果参数为空，则返回0个
  }
}

const Filters = {
  ellipsis (value, wordsNum) {
    if (!value) return ''
    value.toString().trim()
    const len = strCode(value.substring(0, wordsNum))
    return value.slice(0, len) + '...'

  }
}
export default Filters;
