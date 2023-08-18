<template>
  <div>
    <!-- <header>
      <div class="input_box">
        <el-input v-model.trim="form.search_items" placeholder="请输入关键字" clearable >
          <template slot='suffix'>
            <i class='iconfont icon-sousuo'></i>
          </template>
        </el-input>
      </div>
      <div class="flex-between">
        <el-select v-model="form.search_type" placeholder="请选择类型">
          <el-option
            v-for="item in optionList"
            :key="item.ename"
            :label="item.cname"
            :value="item.ename"
          >
          </el-option>
        </el-select>

        <el-button type="primary" class="btn" @click="searchEvent" :loading="searchBtnLoading">{{
          searchBtnLoading ? '搜索中' : '搜索'
        }}</el-button>
      </div>
    </header> -->

    <main>
      <Loading :isLoading.sync="searchBtnLoading">
        <div ref="task_box" class="task_box" v-if="taskList.length" @scroll="handleScroll">
          <div class="task_item" v-for="(item, index) in showList" :key="index">
            <div class="date_box">
              <div class="date">{{ item.create_time.split(' ')[0] }}</div>
            </div>
            <div class="type">
              <div class="divide"></div>
              <span>筛选类型： </span>
              <span>{{ item.module_name }}</span>
            </div>
            <div class="info_box">
              <div v-for="(v, index) in labelList" :key="index" class="info">
                <!-- <div class="label" v-if="v.value !== 'cerNumber'">{{ v.label }}</div>
                <div class="label" v-if="(v.value === 'cerNumber') && item[v.value]">{{ v.label }}</div> -->
                <div class="label" v-if="item[v.value]">{{ v.label }}</div>
                <div class="value" v-if="item[v.value]" :class="v.value === 'status' ? (item[v.value] === '已完成' ? 'green' : 'blue') : '' ">{{ item[v.value] }}</div>
                <div class="icon">
                  <i class="iconfont icon-xiangqing" title="详情" v-if="item[v.value] === '已完成'" @click='toEdit(item)'></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cus-empty" v-else>近期暂无任务，请前往添加任务！</div>
      </Loading>
    </main>
  </div>
</template>

<script>
import { queryTasksNew, queryTasks, queryTypes } from '@/api/taskManagement'
import { getRecordApi } from '@/api/analysisJudgment'
// import dayjs from '@/utils/filters'
// import Collapse from '@/components/BasicComponents/Collapse'
import Loading from '@/components/VisualComponents/Loading'
import { mapState } from 'vuex'
import dayjs from '@/utils/filters'
import { getAppListApi } from '@/api/analysisJudgment'

// import { reactive, toRefs, onMounted, getCurrentInstance } from '@vue/composition-api'
const status = {
  true: {
    color: '#177ddc',
    text: '已完成'
  },
  false: {
    color: '#e6a23c',
    text: '进行中'
  }
}
const urlInfo = {
  'task_collision_type': '/ol/deduce/spaceTimeCollision',
  'task_follow_type': '/ol/deduce/peerAnalysis'
}

export default {
  name: 'jobs',
  components: {
    // Collapse,
    Loading
  },
  computed: {
    ...mapState('User', {
      userInfo: 'userInfo',
    }),
    ...mapState('Common', {
      permissionsArray: 'permissionsArray'
    }),
    isAppCenterLimit () {
      return this.permissionsArray.includes('analysis')
    }
  },
  data () {
    return {
      searchBtnLoading: false,
      taskList: [],
      routerName: Object.freeze({
        probe: 'probeData',
        wifi: 'hotspot',
        audit: 'auditData',
        fence: 'ElectronicFence',
        task_follow_type: 'peerAnalysis',
        task_collision_type: 'spaceTimeCollision'
      }),
      labelList: [
        {
          label: '状态：',
          value: 'status'
        },{
          label: '查询条件：',
          value: 'task_condition'
        },{
          label: '证件号码：',
          value: 'cer_number'
        },{
          label: '证件号码：',
          value: 'cerNumber'
        },{
          label: '手机号：',
          value: 'phone'
        },{
          label: '车牌号：',
          value: 'car_license'
        },{
          label: '创建时间：',
          value: 'create_time'
        },{
          label: '结束时间：',
          value: 'end_time'
        },{
          label: '操作员：',
          value: 'operator'
        }
      ],
      types: [],
      showList: [],
      page: 1
    }
  },

  created () {
    this.getTaskList()
  },
  mounted () {
  },
  methods: {
    async getTaskList () {
      if (!this.userInfo.userRoleList.length) return
      else {
        let haveAuthority =  this.userInfo.userRoleList.some(function (obj) {
          return obj.roleId === 1
        })
        const types = await queryTypes()
        this.types = types

        const oldList = await queryTasks({
          search_type: '',
          search_items: ''
        })
        const oldWarnList = this.formatCollapseList(oldList.data_page)

        const newWarnList = await queryTasksNew({
          operator: this.userInfo.username,
          is_admin: haveAuthority
        })

        this.taskList = oldWarnList.concat(newWarnList)
        this.taskList.forEach(item => {
          item.isShow = true
        })
        this.showList = this.taskList.slice(
          (this.page - 1) * 20,
          this.page * 20
        )
      }
    },
    handleScroll () {
      const task_box = this.$refs.task_box
      const scrollHeight = task_box.scrollHeight
      const scrollTop = task_box.scrollTop
      const clientHeight = task_box.clientHeight
      const pageSize = 20
      // console.log(scrollHeight, scrollTop, clientHeight)

      if (scrollHeight - scrollTop <= clientHeight) {
        this.showList = this.showList.concat(this.taskList.slice((this.page) * pageSize, (this.page + 1) * pageSize))
        this.page++
      }
    },
    itemClick (item) {
      item.isShow = !item.isShow
    },
    toEdit (info) {
      if (!this.isAppCenterLimit) {
        this.$message.warning('暂无应用中心查看权限！')
        return
      }
      if (info.module_name === 'app') {
        this.toApp(info)
      } else if (info.search_type === 'task_collision_type' || info.search_type === 'task_follow_type') {
        this.toAppOldAnalysis(info)
      }
    },
    // 跳转老的分析研判功能
    toAppOldAnalysis (info) {
      getAppListApi({
        type: ''
      }).then(res => {
        let result = res || []
        const taskApp = result.findIndex(app => app.appCategory === 'import' && app.importType === 'URL' && app.importUrl.includes(info.urlInfo))
        if (taskApp === -1) return
        localStorage.setItem('clickTask', JSON.stringify(info.jumpInfo))
        let routeUrl = this.$router.resolve({
          name: this.routerName[info.search_type],
          query: { id: info.jumpInfo.id, keyList: JSON.stringify(info.jumpInfo.search_items) }
        })
        window.open(routeUrl.href, '_blank')
      })
    },
    toApp (info) {
      getRecordApi({
        containerId: info['container_id']
      }).then(res => {
        let result = res || []
        if (!result.length) return
        const isExist = result.findIndex(item => item.id === info.record_id)
        if (isExist === -1) {
          this.$message.error('该操作已不存在！')
          return
        }
        if (isExist === result.length - 1) { // 去应用页面
          let win = window.open('', info['app_id'] + 'result')
          const url = window.location.origin + '/ol/analysisResult?appId=' + info['app_id'] +
            '&homePageId=' + (info['page_id'] || '') +
            '&appName=' + info['app_name'] +
            '&type=task' +
            '&focusModule=' + info['container_id']
          if (win.location.href === 'about:blank') {
            window.open(url, info['app_id'] + 'result')
          } else {
            win.location.href = url
            win.focus()
          }
        } else { // 去建模页面
          let win = window.open('', info['app_id'] + 'edit')
          const url = window.location.origin + '/ol/analysisEdit?appId=' + info['app_id'] +
            '&appName=' + info['app_name'] +
            '&type=task' +
            '&taskPage=' + info['page_id'] +
            '&taskModule=' + info['container_id']
          if (win.location.href === 'about:blank') {
            window.open(url, info['app_id'] + 'edit')
          } else {
            win.location.href = url
            win.focus()
          }
        }
      }).catch(() => {
        this.$message.error('请点击重试！')
      })
    },
    formatCollapseList (dataPage) {
      if (!dataPage || dataPage.length === 0) return
      // let allArr = []
      let arr = []
      dataPage.forEach(item => {
        item.list.forEach(e => {
          /*
          * 以下代码为老代码复制，为了跳转到老的时空碰撞，同行分析
          * */
          e.isCollision = e.search_type && e.search_type + '' === 'task_collision_type'
          e.createTime = dayjs.filterSS(e.create_time)
          e.propList = []
          e.keyList = e.search_items.filter(
            _e => {
              if (e.isCollision) {
                return _e.ename !== 'start_time' && _e.ename !== 'end_time' && _e.ename + '' !== 'case_id_list'
              }
              return _e.ename !== 'start_time' && _e.ename !== 'end_time'
            }
          )
          e.keyList = e.keyList.map(_e => {
            e.propList.push(_e.ename)

            const prop = _e.ename
            return {
              [prop]: _e.cname + '：' + (_e.value || '--')
            }
          })
          e.search_items.forEach(_e => {
            if (_e.ename === 'start_time') {
              e.start_time = _e.value
            }
            if (_e.ename === 'end_time') {
              e.end_time = _e.value
            }
          })
          e.searchTime =
            e.start_time && e.end_time
              ? `${dayjs.filterSS(parseInt(e.start_time))}~${dayjs.filterSS(
                parseInt(e.end_time)
              )}`
              : '--'
          e.formatterStatus = status[e.status]
          e.showBtn = true
          arr.push({
            app_id: e.id * 1000,
            app_name: '',
            container_id: e.id * 1000,
            create_time: dayjs.filterSS(e.create_time),
            module_name: this.types.find(_c => _c.ename === e.search_type).cname,
            operator: e.username,
            status: e.status ? '已完成' : '未完成',
            search_type: e.search_type,
            urlInfo: urlInfo[e.search_type],
            ...this.formatDataToString(e.search_items),
            // task_condition: this.formatDataToString(e.search_items)[0],
            // cerNumber:  this.formatDataToString(e.search_items)[1],
            jumpInfo: {
              ...e,
            }
          })
        })
      })
      return arr
    },
    formatDataToString (data) {
      let obj = {}
      data.forEach(item => {
        if (item.ename === 'end_time' || item.ename === 'start_time') {
          obj[item.ename] = dayjs.filterSS(item.value)
        } else {
          obj[item.ename] = item.value
        }
      })
      console.log(obj)
      return obj
      // const startTime = data.find(obj => obj.ename === 'start_time')
      // const endTime = data.find(obj => obj.ename === 'end_time')
      // const cerNumber = data.find(obj => obj.ename === 'cer_number')

      // const startEndStr = `${startTime ? dayjs.filterSS(startTime.value) : ''} ~ ${endTime ? dayjs.filterSS(endTime.value) : ''}`
      // const cerNumberStr = `${cerNumber ? cerNumber.value : ''}`

      // return [startEndStr, cerNumberStr]
    }
  }
}
</script>

<style lang="less" scoped>
.cus-empty {
  padding-top: 25vh;
  text-align: center;
  color: var(--base-text-color-to-999999);
}

.el-loading-parent--relative {
  height: 90vh !important;
}
/deep/.el-input__inner{
  height: 32px;
}
.input_box {
  margin: 16px 0;
  /deep/.el-input__suffix {
    right: 12px;
    .icon-sousuo {
      font-size: 16px;
      // color: #657494;
      line-height: 32px;
      cursor: pointer;
    }
    .el-icon-circle-close {
      line-height: 32px;
      width: 16px;
      font-size: 16px !important;
      position: absolute;
      right: 18px;
      top: -5px;
      color: #657494 !important;
    }
    .el-icon-circle-close:hover {
      color: @active-color !important;
    }
  }
}
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.task_box{
  overflow: auto;
  width: 416px;
  height: calc(100vh - 112px);
  // margin: 16px 0;
  .task_item{
    position: relative;
    width: 100%;
    // width: 416px;
    // height: 225px;
    // height: 100%;
    background-color: var(--car-right-chuangkou-hearder-bg);
    box-sizing: border-box;
    padding: 19px 16px 16px 16px;
    margin-bottom: 16px;
    // margin-right: 0 !important;
    &:last-child{
      margin-bottom: 0;
    }
    .date_box{
      display: flex;
      justify-content: space-between;
      .date{
        color: var(--base-text-color-1);
        font-weight: bold;
      }
      .icon_button{
        // padding: 0 0 0 10px;
      }
    }
    .type{
      margin: 19px 0 8px 0;
      display: flex;
      color: var(--base-text-color-1);
      .divide{
        width: 4px;
        height: 16px;
        background-color: var(--base-text-color-1);
        margin-right: 8px;
      }
    }
    .info_box{
      margin: 0 0 ;
      font-size: 14px;
      .info{
        display: flex;
        line-height: 26px;
        // margin-bottom: 12px;
        color: var(--base-text-color-to-666666);
        .label{
          width: 70px;
        }
        @media screen and (min-width: 1024px) and (max-width:1650px){
          .label{
            width: 120px;
          }
        }
        .value{
          width: 300px;
          color: var(--base-text-color-1);
        }
        .green{
          color:#0CBF7E;
        }
        .blue{
          color: #5E86FF;
        }
      }
    }
    .icon{
      position: absolute;
      right: 16px;
      bottom: 16px;
      i {
        cursor: pointer;
      }
    }
  }
}
</style>
