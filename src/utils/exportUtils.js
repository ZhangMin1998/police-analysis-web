import axios from 'axios'
import vm from '@/main.js'
// 导出
export default {
  exportMethod: function (data) {
    return new Promise((resolve) => {
      axios({
        method: data.method,
        url: data.url,
        params: data.params || {},
        data: data.data || {},
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      })
        .then(res => {
          if (res.data.type === 'application/json') {
            const READER = new FileReader()
            READER.readAsText(res.data, 'uft-8')
            READER.onload = () => {
              const RESULT = JSON.parse(READER.result)
              if (RESULT.code === 0) vm.$message.warning(RESULT.msg)
            }
          } else {
            const link = document.createElement('a')
            let blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)

            link.download = data.fileName.trim() + '.xlsx' //下载的文件名  注意：加.xls是兼容火狐浏览器
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            resolve()
          }
        })
        .catch(error => {
          console.log(error)
        })
    })
  }
}
