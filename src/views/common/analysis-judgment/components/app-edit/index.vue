<template>
  <div
    v-p-loading="loading"
    element-loading-text="数据加载中"
    element-loading-spinner="el-icon-loading"
    :element-loading-background="loadBg"
    class='app_edit_wrap'
  >
    <template v-if='!showEditPage'>
      <div class='ground_bar'>
        <div class='page_wrap'>
          <div class='tab' v-for='(item, index) in tabList' :key='item.id' :class='{ "active": activeGroup === item.id }'>
            <div class='tab_label' v-if='!item.isRename' @click='changeGroup(item)'>{{ item.pageName }}</div>
            <el-input v-else v-model.trim="item.editLabel" placeholder="请输入" @blur='submitRename(item, item.id, index)' maxlength='10'></el-input>
            <div id='operaIcon' class='opera_icon' :class='{ "disabled": !item.id }' @click.stop='operaGround(item, index)'>
              <i class='iconfont icon-xiala' v-if='!item.showOpera'></i>
              <i class='iconfont icon-tongyong-Icontubiao-Line-left' v-else></i>
            </div>
            <div v-show='item.showOpera' class='opera_btn' id='operaBtn'>
              <div class='btn' :class='{ "can_opera": item.id }' @click='groundRename(item)'>重命名</div>
              <div v-if='!item.homePageFlag' class='btn' :class='{ "can_opera": item.id }' @click='toHomePage(item, index)'>置于首页</div>
              <div v-if='!item.homePageFlag' class='btn' :class='{ "can_opera": item.id }' @click='delGround(item, index)'>删除</div>
            </div>
          </div>
          <i class='iconfont icon-a-zu6003' @click='addGroup' title='新建页面及配置'></i>
        </div>
        <div v-show='!showPageTitle' class='app_header_hidden'>
          <i class='iconfont icon-yulan-dakai_preview-open' title='显示' @click='showPageTitle = !showPageTitle'></i>
        </div>
      </div>
      <div
        class='edit_content_wrap'
        v-p-loading="changePageLoad"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="--bg-color-3"
      >
        <div v-show='showPageTitle' class='app_name_header'>
          <el-input v-if='pageTitleInfo.isFocus' id='pageTitle' v-model.trim='pageTitleInfo.editLabel' @blur='pageTitleBlur'></el-input>
          <EllipsisPop v-else class='app_name' :content='pageTitleInfo.pageName' @click='pageTitleClick'></EllipsisPop>
<!--          <div v-else class='app_name' @click='pageTitleClick'>{{ pageTitleInfo.pageName }}</div>-->
          <i class='iconfont icon-yincang' title='隐藏' @click='showPageTitle = !showPageTitle'></i>
        </div>
        <template v-if='currentPageInfo && currentPageInfo["modulesData"]'>
          <div class='module_wrap'>
            <PGridLayout
              :layout='pageContentInfo[activeGroup]["modulesData"]'
              :colNum='4'
              :rowHeight='156'
              :dragAllowFrom='".module_header"'
              @resizedEvent='resizedEvent'
              @movedEvent='movedEvent'
            >
              <AppModuleContent
                slot='itemContent'
                slot-scope='{ info, index }'
                :id='info.htmlId'
                :ref='info.htmlId'
                :moduleInfo='info'
                :currentPage='+activeGroup'
                @linkSkip='linkSkip'
                @upDateLinkInfo='upDateLinkInfo(index)'
              >
                <div slot='moduleName' class='module_title'>
                  <div v-if='info.showEdit' class='edit_state'>
                    <el-input v-model.trim='info.editName'></el-input>
                    <div class='btn cancel_btn' @click='cancelEditModule(info)'>取消</div>
                    <div class='btn' @click='updateModuleName(info)'>确定</div>
                  </div>
                  <div v-else class='title_state'>
                    <div class='module_name'>{{ info.moduleName || '--' }}</div>
                    <i class='iconfont icon-bianji' title='编辑' @click='editModuleName(info)'></i>
                  </div>
                </div>
                <template slot='opera'>
                  <i
                    v-if='info.operatorFlag'
                    class='iconfont icon-bianji'
                    title='编辑'
                    @click='editModule(info)'
                  ></i>
                  <i
                    class='iconfont icon-delete'
                    title='删除'
                    @click='delModule(info, index)'
                  ></i>
                </template>
                <div
                  slot='noContent'
                  class='module_no_content'
                  @click='editModule(info)'
                >
                  <i class='iconfont icon-tianjia1'></i>
                  <div class='tip'>添加</div>
                </div>
              </AppModuleContent>
            </PGridLayout>
          </div>
          <div class='add_module' @click='addModule'>
            <i class='iconfont icon-tianjia1'></i>
          </div>
        </template>
      </div>
    </template>
    <EditPage
      v-else
      :editModuleInfo='currentEditModule'
      :pageInfo='{
      currentPageInfo: {
        pageName: pageTitleInfo.pageName,
        pageId: this.activeGroup
      },
      pageList: tabList
    }'
      @changeShowPage='changeShowPage'
      @toEdit='showEditHome'
    ></EditPage>
  </div>
</template>

<script>
import PGridLayout from '@/components/VisualComponents/GridLayout'
import AppModuleContent from '../app-content'
import EditPage from '../edit-page'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import {
  getAppPagesApi,
  addAppPageApi,
  delAppPageApi,
  toHomePageApi,
  renameAppPageApi,
  getAppPageModulesApi,
  addModuleApi,
  delModuleApi,
  updateModuleApi,
  updateModuleCoordinateApi
} from '@/api/analysisJudgment'

export default {
  name: 'AppEdit',
  components: {
    PGridLayout,
    AppModuleContent,
    EditPage,
    EllipsisPop
  },
  data () {
    return {
      tabList: [
        /*{
          id: 1,
          label: '页面1',
          editLabel: '',
          isRename: false,
          showOpera: false
        }*/
      ], // 页面列表
      activeGroup: null, // 当前激活的页面
      oldOperaEdit: '',
      moduleList: [
        // { i: '0', x: 0, y: 0, w: 4, h: 3, moduleName: '模块1' },
      ],
      showEditPage: false, // 是否展示编辑页面
      currentAppId: null, // 当前应用的id
      defaultName: '', // 新建页面时默认名字
      currentAppPagesNameList: [], // 当前应用页面名称数组
      pageContentInfo: {}, // 存储页面对应内容信息
      pageTitleInfo: {
        editLabel: '',
        pageName: '',
        isFocus: false
      }, // 页面标题信息
      currentEditModule: {}, // 当前编辑模块的信息
      loadBg: '--bg-color-3',
      loading: false, // 初始化时的loading
      changePageLoad: false,
      showPageTitle: true
    }
  },
  computed: {
    currentPageInfo () {
      return this.pageContentInfo[this.activeGroup]
    }
  },
  created () {
    this.loading = true
    document.title = this.$route.query.appName || ''
    this.currentAppId = +this.$route.query.appId
    this.defaultName = this.$route.query.appName || ''
  },
  mounted () {
    this.getPagesData()
  },
  methods: {
    getPagesData () {
      getAppPagesApi({
        appId: this.currentAppId,
        pageId: ''
      }).then(res => {
        let result = res || []
        result.forEach(item => {
          const value = {
            ...item,
            editLabel: '',
            isRename: false,
            showOpera: false,
            showTitle: true
          }
          if (item.homePageFlag) {
            this.tabList.unshift(value)
          } else {
            this.tabList.push(value)
          }
          this.currentAppPagesNameList.push(item.pageName)
          this.$set(this.pageContentInfo, item.id, {})
          this.pageContentInfo[item.id]['pageName'] = item.pageName
        })
        let activePage = this.tabList[0]
        let isTask = false
        if (this.$route.query.type === 'task' && this.$route.query.taskPage) {
          let taskPage = this.tabList.find(item => item.id === +this.$route.query.taskPage)
          if (taskPage) {
            activePage = taskPage
            isTask = true
          }
        }
        this.changeGroup(activePage, true, isTask)
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取页面模块接口
    getModuleData (pageId, isLink, linkParam) {
      return new Promise((resolve, reject) => {
        getAppPageModulesApi({
          appId: this.currentAppId,
          pageId
        }).then(res => {
          let result = res || []
          this.$set(this.pageContentInfo[pageId], 'modulesData', [])
          this.$set(this.pageContentInfo[pageId], 'moduleNameList', [])
          result.forEach(item => {
            const coordinateInfo = item.containerCoordinate.split(',')
            this.pageContentInfo[pageId]['modulesData'].push({
              ...item,
              i: item.id + '',
              moduleName: item.containerName,
              x: +coordinateInfo[0],
              y: +coordinateInfo[1],
              w: +coordinateInfo[2],
              h: +coordinateInfo[3],
              oldContainerCoordinate: coordinateInfo,
              editName: '',
              showEdit: false,
              tableName: item.tableName,
              htmlId: `module${item.id}`,
              isLink: isLink ? item.id === isLink : false,
              linkParams: item.id === isLink ? linkParam : []
            })
            this.pageContentInfo[pageId]['moduleNameList'].push(item.containerName)
          })
          resolve()
        }).catch(() => {
          reject()
        }).finally(() => {
          this.changePageLoad = false
          this.loading = false
        })
      })
    },
    // 切换页面栏
    changeGroup (item, isMount, isTask) {
      this.pageTitleInfo.pageName = item.pageName
      this.pageTitleInfo.editLabel = item.pageName
      let ind = this.tabList.findIndex(page => page.id === this.activeGroup)
      ind !== -1 && (this.tabList[ind].showTitle = this.showPageTitle)
      this.activeGroup = item.id
      this.showPageTitle = item.showTitle
      if (!isMount) this.changePageLoad = true
      this.getModuleData(item.id).then(() => {
        if (!isMount) return
        if (!isTask || !this.$route.query.taskModule) return
        const taskModule = this.pageContentInfo[this.activeGroup]["modulesData"].find(item => item.id === +this.$route.query.taskModule)
        taskModule && this.editModule(taskModule)
      })
      // if (!this.pageContentInfo[item.id]['modulesData']) {
      //   if (!isMount) this.changePageLoad = true
      //   this.getModuleData(item.id).then(() => {
      //     if (!isTask || !this.$route.query.taskModule) return
      //     const taskModule = this.pageContentInfo[this.activeGroup]["modulesData"].find(item => item.id === +this.$route.query.taskModule)
      //     taskModule && this.editModule(taskModule)
      //   })
      // }
    },
    // 点击页面下拉栏
    operaGround (item, index) {
      if (!item.id) return
      if (item.showOpera) {
        item.showOpera = false
        this.oldOperaEdit = ''
        return
      }
      if (this.oldOperaEdit) {
        this.tabList[+this.oldOperaEdit].showOpera = false
        this.tabList[+this.oldOperaEdit].isRename = false
      }
      this.oldOperaEdit = index + ''
      item.showOpera = true
    },
    // 页面重命名
    groundRename (item) {
      item.editLabel = item.pageName
      item.isRename = true
      item.showOpera = false
      this.oldOperaEdit = ''
    },
    // 删除页面时
    delGround (item, ind) {
      let params = new FormData()
      params.append('appId', this.currentAppId)
      params.append('pageId', item.id)
      delAppPageApi(params).then(() => {
        this.oldOperaEdit = ''
        this.$message.success('页面删除成功！')
        if (item.id === this.activeGroup) {
          ind === this.tabList.length - 1 ? this.changeGroup(this.tabList[0]) : this.changeGroup(this.tabList[ind + 1])
        }
        this.tabList.splice(ind, 1)
        this.currentAppPagesNameList = this.currentAppPagesNameList.filter(name => name !== item.pageName)
        delete this.pageContentInfo[item.id]
      })
    },
    // 页面点击的时候
    pageTitleClick () {
      this.pageTitleInfo.isFocus = true
      this.$nextTick(() => {
        document.getElementById('pageTitle').focus()
      })
    },
    // 页面标题失去焦点
    pageTitleBlur () {
      if (!this.pageTitleInfo.editLabel) {
        this.$message.error('页面名称不可为空！')
        this.pageTitleInfo.isFocus = false
        this.pageTitleInfo.editLabel = this.pageTitleInfo.pageName
        return
      }
      const index = this.tabList.findIndex(item => item.pageName === this.pageTitleInfo.pageName)
      this.submitRename(this.pageTitleInfo, this.activeGroup, index)
      this.pageTitleInfo.isFocus = false
    },
    // 点击添加页面的时候
    addGroup () {
      let pageName = null
      const getPageName = (defaultNum) => {
        let name = this.defaultName + defaultNum
        if (this.currentAppPagesNameList.includes(name)) {
          getPageName(defaultNum + 1)
        } else {
          pageName = name
        }
      }
      getPageName(this.tabList.length + 1)
      addAppPageApi({
        appId: this.currentAppId,
        pageName
      }).then(res => {
        if (res === -1) return
        this.$message.success('新建页面成功！')
        this.currentAppPagesNameList.push(pageName)
        this.addGroupSuccess(res)
      })
    },
    // 新增页面成功往已有页面数据后添加
    addGroupSuccess (pageId) {
      getAppPagesApi({
        appId: this.currentAppId,
        pageId: pageId
      }).then(res => {
        let result = res || []
        if (!result[0]) return
        let newItem = result[0]
        this.tabList.push({
          ...newItem,
          editLabel: '',
          isRename: false,
          showOpera: false,
          showTitle: true
        })
        this.$set(this.pageContentInfo, newItem.id, {})
        this.pageContentInfo[newItem.id]['pageName'] = newItem.pageName
      })
    },
    // 页面重命名
    submitRename (item, pageId, ind) {
      if (!item.editLabel) {
        this.$message.error('页面名称不可为空！')
        item.isRename = false
        return
      }
      if (item.editLabel !== item.pageName) { // 分组重命名
        renameAppPageApi({
          appId: this.currentAppId,
          id: pageId,
          pageName: item.editLabel
        }).then(() => {
          this.$message.success('页面重命名成功！')
          const nameInd = this.currentAppPagesNameList.findIndex(name => name === item.pageName)
          this.currentAppPagesNameList[nameInd] = item.editLabel
          this.pageTitleInfo.pageName = item.editLabel
          this.pageTitleInfo.editLabel = item.editLabel
          this.updateGroupSuccess(pageId, ind)
        })
      }
      item.isRename = false
    },
    // 页面重命名后，更新页面数组
    updateGroupSuccess (id, ind) {
      getAppPagesApi({
        appId: this.currentAppId,
        pageId: ''
      }).then(res => {
        let result = res || []
        let updateIndex = result.findIndex(item => item.id === id)
        if (updateIndex > -1) {
          this.tabList[ind].pageName = result[updateIndex].pageName
          this.pageContentInfo[result[updateIndex].id].pageName = result[updateIndex].pageName
        }
      })
    },
    // 置于首页
    toHomePage (page, ind) {
      let params = new FormData()
      params.append('appId', this.currentAppId)
      params.append('pageId', page.id)
      toHomePageApi(params).then(() => {
        this.$message.success(`${page.pageName}置于首页成功！`)
        let value = {
          ...page
        }
        value.showOpera = false
        value.homePageFlag = true
        value.showTitle = true
        this.tabList.splice(ind, 1)
        this.tabList.forEach(item => {
          item.homePageFlag = false
        })
        this.tabList.unshift(value)
      })
    },
    // 添加模块
    addModule () {
      let maxRow = {
        y: 0,
        h: 0
      }
      let pageName = null
      const getPageName = (defaultNum) => {
        let name = '模块' + defaultNum
        if (this.currentPageInfo.moduleNameList.includes(name)) {
          getPageName(defaultNum + 1)
        } else {
          pageName = name
        }
      }
      getPageName(this.currentPageInfo.modulesData.length + 1)
      if (this.currentPageInfo.modulesData.length) {
        this.currentPageInfo.modulesData.forEach(item => {
          if (item.y > maxRow.y) {
            maxRow.y = item.y
            maxRow.h = item.h
          } else if (item.y === maxRow.y && item.h > maxRow.h) {
            maxRow.h = item.h
          }
        })
      }
      addModuleApi({
        appId: this.currentAppId,
        pageId: this.activeGroup,
        containerName: pageName,
        containerCoordinate: `0,${maxRow.y + maxRow.h},4,4` // 表示xywh
      }).then(() => {
        this.$message.success('添加模块成功！')
        this.pageContentInfo[this.activeGroup]['moduleNameList'].push(pageName)
        this.handleModule(null, pageName)
      })
    },
    // 添加模块成功
    handleModule (updateModuleId, newModuleName) {
      getAppPageModulesApi({
        appId: this.currentAppId,
        pageId: this.activeGroup
      }).then(res => {
        let result = res || []
        let newItem = updateModuleId ? result.find(item => item.id === updateModuleId) : result.find(item => item.containerName === newModuleName)
        if (!newItem) return
        const coordinateInfo = newItem.containerCoordinate.split(',')
        const value = {
          ...newItem,
          i: newItem.id + '',
          moduleName: newItem.containerName,
          x: +coordinateInfo[0],
          y: +coordinateInfo[1],
          w: +coordinateInfo[2],
          h: +coordinateInfo[3],
          oldContainerCoordinate: coordinateInfo,
          editName: '',
          showEdit: false,
          tableName: this.tableName,
          htmlId: `module${newItem.id}`,
          isLink: false,
          linkParams: []
        }
        if (updateModuleId) {
          let moduleInd = this.pageContentInfo[this.activeGroup]['modulesData'].findIndex(item => item.id === updateModuleId)
          moduleInd !== -1 && (this.pageContentInfo[this.activeGroup]['modulesData'][moduleInd].operatorFlag = newItem.operatorFlag)
        } else {
          this.pageContentInfo[this.activeGroup]['modulesData'].push(value)
        }
      })
    },
    // 删除模块
    delModule (module, index) {
      this.$policeComfirm(`模块${module.moduleName}删除后不可恢复，是否继续操作？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = new FormData()
        params.append('appId', this.currentAppId)
        params.append('pageId', this.activeGroup)
        params.append('containerId', +module.i)
        delModuleApi(params).then(() => {
          this.$message.success('模块删除成功！')
          this.pageContentInfo[this.activeGroup]['moduleNameList'] =
            this.pageContentInfo[this.activeGroup]['moduleNameList'].filter(name => name !== module.moduleName)
          this.pageContentInfo[this.activeGroup]['modulesData'].splice(index, 1)
          this.$nextTick(() => {
            this.updateModuleCoordinate()
          })
        })
      })
    },
    // 模块缩放之后
    resizedEvent () {
      this.updateModuleCoordinate().then(res => {
        res.forEach(item => {
          let info = this.pageContentInfo[this.activeGroup]['modulesData'][item]
          this.$nextTick(() => {
            this.$refs[info.htmlId].moduleResize()
          })
        })
      })
      // updateModuleApi({
      //   appId: this.currentAppId,
      //   pageId: this.activeGroup,
      //   id: +info.i,
      //   containerName: info.moduleName,
      //   containerCoordinate: `${info.x},${info.y},${w},${h}`
      // }).then(() => {
      //   info.oldContainerCoordinate = [info.x, info.y, info.w, info.h]
      //   this.$nextTick(() => {
      //     this.$refs[info.htmlId].moduleResize()
      //   })
      // }).catch(() => {
      //   this.$nextTick(() => {
      //     info.w = +info.oldContainerCoordinate[2]
      //     info.h = +info.oldContainerCoordinate[3]
      //   })
      // })
    },
    // 模块移动之后
    movedEvent () {
      this.updateModuleCoordinate()
      // updateModuleApi({
      //   appId: this.currentAppId,
      //   pageId: this.activeGroup,
      //   id: +info.i,
      //   containerName: info.moduleName,
      //   containerCoordinate: `${x},${y},${info.w},${info.h}`
      // }).then(() => {
      //   info.oldContainerCoordinate = [info.x, info.y, info.w, info.h]
      // }).catch(() => {
      //   this.$nextTick(() => {
      //     info.x = +info.oldContainerCoordinate[0]
      //     info.y = +info.oldContainerCoordinate[1]
      //   })
      // })
    },
    updateModuleCoordinate () {
      return new Promise((resolve, reject) => {
        let updateInfo = {}
        this.pageContentInfo[this.activeGroup]['modulesData'].forEach((module, index) => {
          const changeCoordinate = `${module.x},${module.y},${module.w},${module.h}`
          if (changeCoordinate !== module.oldContainerCoordinate.join(',')) {
            updateInfo[index + ''] = {
              id: module.id,
              containerCoordinate: changeCoordinate
            }
          }
        })
        const params = Object.values(updateInfo)
        if (!params.length) {
          reject('noLength')
        } else {
          updateModuleCoordinateApi(params).then(() => {
            for (let key in updateInfo) {
              this.pageContentInfo[this.activeGroup]['modulesData'][key].oldContainerCoordinate = updateInfo[key].containerCoordinate.split(',')
            }
            resolve(Object.keys(updateInfo))
          }).catch(() => {
            Object.keys(updateInfo).forEach(update => {
              let info = this.pageContentInfo[this.activeGroup]['modulesData'][update]
              info.x = +info.oldContainerCoordinate[0]
              info.y = +info.oldContainerCoordinate[1]
              info.w = +info.oldContainerCoordinate[2]
              info.h = +info.oldContainerCoordinate[3]
            })
            reject(Object.keys(updateInfo))
          })
        }
      })
    },
    // 模块名称编辑按钮点击
    editModuleName (info) {
      info.editName = info.moduleName
      info.showEdit = true
    },
    // 取消编辑模块名称
    cancelEditModule (info) {
      info.editName = ''
      info.showEdit = false
    },
    // 模块名称修改提交
    updateModuleName (info) {
      if (info.editName === info.moduleName) {
        info.editName = ''
        info.showEdit = false
        return
      }
      updateModuleApi({
        appId: this.currentAppId,
        pageId: this.activeGroup,
        id: +info.i,
        containerName: info.editName,
        containerCoordinate: `${info.x},${info.y},${info.w},${info.h}`
      }).then(() => {
        info.moduleName = info.editName
      }).finally(() => {
        info.editName = ''
        info.showEdit = false
      })
    },
    // 切换显示编辑模块页面还是编辑数据页面
    changeShowPage (bool) {
      this.showEditPage = bool
    },
    showEditHome () {
      this.changeShowPage(false)
      this.getModuleData(this.activeGroup)
      // this.handleModule(+this.currentEditModule.i)
      this.currentEditModule = {}
    },
    // 编辑模块内容
    editModule (info) {
      this.currentEditModule = info
      this.changeShowPage(true)
    },
    // 链接跳转
    linkSkip (linkInfo, needLocal = true) {
      if (linkInfo.errorFlag) {
        this.$message.error(linkInfo.errorMsg)
        return
      }
      let positionFun = () => {
        let ind = this.pageContentInfo[this.activeGroup]['modulesData'].findIndex(item => item.id === linkInfo.linkContainerId)
        if (ind > -1) {
          const result = this.pageContentInfo[this.activeGroup]['modulesData'][ind]
          result.linkParams = linkInfo.matchInfo
          result.isLink = true
          needLocal && this.$nextTick(() => {
            document.getElementById(result.htmlId).scrollIntoView()
          })
        }
      }
      if (linkInfo.linkPageId === this.activeGroup) {
        positionFun()
        return
      }
      let matchPageInd = this.tabList.findIndex(item => item.id === linkInfo.linkPageId)
      if (matchPageInd === -1) return
      let matchPage = this.tabList[matchPageInd]
      this.pageTitleInfo.pageName = matchPage.pageName
      this.pageTitleInfo.editLabel = matchPage.pageName
      this.activeGroup = matchPage.id
      this.changePageLoad = true
      this.getModuleData(this.activeGroup, linkInfo.linkContainerId, linkInfo.matchInfo).then(() => {
        needLocal && this.$nextTick(() => {
          document.getElementById(`module${linkInfo.linkContainerId}`).scrollIntoView()
        })
      })
      /*if (!this.pageContentInfo[this.activeGroup]['modulesData']) {
        this.changePageLoad = true
        this.getModuleData(this.activeGroup, linkInfo.linkContainerId, linkInfo.matchInfo).then(() => {
          this.$nextTick(() => {
            document.getElementById(`module${linkInfo.linkContainerId}`).scrollIntoView()
          })
        })
      } else {
        positionFun()
      }*/
    },
    // 链接成功之后清空模块链接信息
    upDateLinkInfo (ind) {
      let value = this.pageContentInfo[this.activeGroup]['modulesData'][ind]
      value.linkParams = []
      value.isLink = false
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.app_edit_wrap {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .ground_bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 24px 32px 8px 24px;
    .page_wrap {
      display: flex;
      flex-wrap: wrap;
      flex: 1;
    }
    .app_header_hidden {
      flex: none;
      i {
        font-size: 14px;
        color: var(--return-back-i-color);
        cursor: pointer;
      }
    }
    .tab {
      position: relative;
      border-bottom: 1px solid rgba(81, 92, 124, .5);
      &.active {
        border-bottom-color: var(--active-color);
        .tab_label {
          color: var(--active-color);
        }
      }
      .tab_label {
        padding: 8px 36px 8px 12px;
        font-size: 16px;
        line-height: 21px;
        color: var(--base-text-color-to-666666);
        cursor: pointer;
      }
      /deep/.el-input {
        margin-right: 4px;
        .el-input__inner {
          border: 0;
          height: 37px;
          line-height: 37px;
          padding: 0 12px;
        }
      }
      .opera_icon {
        position: absolute;
        right: 12px;
        top: 10px;
        cursor: pointer;
        &.disabled {
          cursor: not-allowed;
        }
        i {
          font-size: 16px;
          line-height: 16px;
          color: var(--base-text-color-to-666666)
        }
      }
      .opera_btn {
        background: var(--datapicker-shijian-xiala-bg-color);
        border: 1px solid var(--border-color-1);
        position: absolute;
        right: 0;
        top: 42px;
        z-index: 10;
        .btn {
          min-width: 84px;
          padding: 9px 0;
          font-size: 14px;
          line-height: 14px;
          text-align: center;
          color: var(--record-library-tree-opera);
          cursor: not-allowed;
          &.can_opera {
            color: var(--base-text-color-2);
            cursor: pointer;
            &:hover {
              background: var(--datapicker-in-range-bg-color);
              color: var(--base-text-color-1);
            }
          }
        }
      }
    }
    .icon-a-zu6003 {
      font-size: 16px;
      font-weight: bold;
      line-height: 38px;
      color: var(--base-text-color-to-666666);
      cursor: pointer;
      margin-left: 16px;
      &.disabled {
        cursor: not-allowed;
      }
    }
  }
  .edit_content_wrap {
    min-height: calc(100% - 70px);
  }
  .app_name_header {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 78px;
    background-image: var(--analysis-result-header);
    background-size: 100% 100%;
    font-size: 18px;
    color: var(--base-text-color-5);
    font-weight: bold;
    i {
      position: absolute;
      top: 24px;
      right: 72px;
      font-size: 16px;
      color: var(--return-back-i-color);
      cursor: pointer;
    }
    .app_name {
      width: 400px !important;
      text-align: center;
      margin-top: 20px;
    }
    /deep/.el-input {
      width: 342px;
      .el-input__inner {
        border-width: 0;
        border-bottom-width: 1px;
      }
    }
  }
  .module_wrap {
    width: 100%;
    padding: 0 16px;
    .module_title {
      .edit_state {
        display: flex;
        align-items: center;
        /deep/.el-input {
          margin-right: 24px;
          .el-input__inner {
            font-size: 14px;
            height: 28px;
            line-height: 20px;
            padding: 2px 10px 6px;
            border-width: 0;
            border-bottom-width: 1px;
          }
        }
        .btn {
          font-weight: 400;
          white-space: nowrap;
          font-size: 13px;
          color: var(--active-color);
          cursor: pointer;
        }
        .cancel_btn {
          color: var(--base-text-color-3);
          margin-right: 16px;
        }
      }
      .title_state {
        display: flex;
        align-items: center;
        .module_name {
          margin-right: 8px;
        }
        i {
          cursor: pointer;
          font-weight: 400;
        }
      }
    }
  }
  .add_module {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 64px);
    height: 64px;
    background: var(--bg-color-3);
    cursor: pointer;
    margin: 8px 32px 32px;
    i {
      font-size: 20px;
      line-height: 20px;
      color: var(--active-color);
    }
  }
  .module_no_content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    cursor: pointer;
    color: var(--active-color);
    font-size: 18px;
    i {
      font-size: 20px;
      line-height: 20px;
      margin-right: 8px;
    }
  }
}
</style>
