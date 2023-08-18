
export async function callMethodLimitPage (fn, param, pageIndex, arr) {
  let pageSizeMax = 500
  // if (param.pageSize && param.pageSize > 100) {
  //   pageSizeMax = param.pageSize
  // }
  const { totalSize, content } = await fn({ pageNum: pageIndex, pageSize: pageSizeMax })
  console.log(totalSize, content)
  const dataClone = content || [];
  if (arr.length + pageSizeMax < totalSize) {
    return callMethodLimitPage(fn, param, pageIndex + 1, [...arr, ...dataClone])
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
