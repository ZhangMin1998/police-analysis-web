export async function callMethodLimitPage (fn, params, pageIndex, arr) {
  let pageSizeMax = 5
  // if (params.pageSize && params.pageSize > 100) {
  //   pageSizeMax = params.pageSize
  // }
  let formData = new FormData()
  formData.append('startTime', params.startTime)
  formData.append('endTime', params.endTime)
  formData.append('faceImageUrl', params.faceImageUrl)
  formData.append('pageSize', pageSizeMax)
  formData.append('pageNum', pageIndex)

  const res = await fn(formData)
  console.log(res)
  const dataClone = res || []
  if (arr.length + pageSizeMax < res.length) {
    return callMethodLimitPage(fn, params, pageIndex + 1, [...arr, ...dataClone])
  }
  return new Promise((resolve) => {
    resolve({
      data: [...arr, ...dataClone].length ? [...arr, ...dataClone] : null,
      errorCode: 0,
      errorDesc: 'success',
      totalCount: [...arr, ...dataClone].length,
    })
  })
}
