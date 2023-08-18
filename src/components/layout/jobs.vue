<template>
  <div>
    <header>
      <div class="mb-16">
        <el-input v-model.trim="form.search_items" placeholder="请输入关键字"> </el-input>
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
    </header>

    <main>
      <Loading :isLoading.sync="searchBtnLoading">
        <div class="cus-main" v-if="collapse.list && collapse.list.length">
          <collapse :collapse.sync="collapse" :dHeight="320"></collapse>
        </div>

        <div class="cus-empty" v-else>近期暂无任务，请前往添加任务！</div>
      </Loading>
    </main>
  </div>
</template>

<script>
import { queryTasks, queryTypes } from '@/api/taskManagement'
import dayjs from '@/utils/filters'
import Collapse from '@/components/BasicComponents/Collapse'
import Loading from '@/components/VisualComponents/Loading'

import { reactive, toRefs, onMounted, getCurrentInstance } from '@vue/composition-api'

export default {
  name: 'jobs',
  components: {
    Collapse,
    Loading
  },
  setup () {
    const { proxy } = getCurrentInstance()

    const routerName = {
      probe: 'probeData',
      wifi: 'hotspot',
      audit: 'auditData',
      fence: 'ElectronicFence',
      task_follow_type: 'peerAnalysis',
      task_collision_type: 'spaceTimeCollision'
    }

    const handleClick = item => {
      localStorage.setItem('clickTask',JSON.stringify(item))
      let routeUrl = proxy.$router.resolve({
        name: routerName[item.search_type],
        query: { id: item.id, keyList: JSON.stringify(item.search_items) }
      })
      window.open(routeUrl.href, '_blank')
    }

    const state = reactive({
      searchBtnLoading: true,
      form: {
        search_type: '',
        search_items: ''
      },
      optionList: [],
      collapse: {
        activeNames: [],
        list: [],
        btnRender: [
          {
            label: '详情',
            type: 'success',
            icon: 'icon-check',
            btnEvent: handleClick,
            alt: '查看结果'
          }
        ]
      }
    })

    const searchEvent = () => {
      getCollapseList()
    }

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

    const getCollapseList = () => {
      state.searchBtnLoading = true
      queryTasks(state.form)
        .then(res => {
          state.collapse.list = formatCollapseList(res.data_page)
        })
        .finally(() => {
          state.searchBtnLoading = false
        })
    }

    const formatCollapseList = dataPage => {
      // console.log(dataPage);
      if (!dataPage || dataPage.length === 0) return
      return dataPage.map(element => {
        return {
          id: element.time,
          label: element.time,
          children: element.list.map(ele => {
            const curItem = state.optionList.find(_c => _c.ename === ele.search_type)
            ele.title = curItem ? '筛选类型：' + curItem.cname : '--'
            ele.isCollision = ele.search_type && ele.search_type + '' === 'task_collision_type'
            ele.createTime = dayjs.filterSS(ele.create_time)

            ele.propList = []

            ele.keyList = ele.search_items.filter(
              _e => {
                if (ele.isCollision) {
                  return _e.ename != 'start_time' && _e.ename != 'end_time' && _e.ename + '' !== 'case_id_list'
                }
                return _e.ename != 'start_time' && _e.ename != 'end_time'
              }
            )

            ele.keyList = ele.keyList.map(_e => {
              ele.propList.push(_e.ename)

              const prop = _e.ename
              return {
                [prop]: _e.cname + '：' + (_e.value || '--')
              }
            })

            ele.search_items.forEach(_e => {
              if (_e.ename === 'start_time') {
                ele.start_time = _e.value
              }
              if (_e.ename === 'end_time') {
                ele.end_time = _e.value
              }
            })

            ele.searchTime =
              ele.start_time && ele.end_time
                ? `${dayjs.filterSS(parseInt(ele.start_time))}~${dayjs.filterSS(
                  parseInt(ele.end_time)
                )}`
                : '--'

            ele.formatterStatus = status[ele.status]
            ele.showBtn = true
            return ele
          }),
          infoList: [
            {
              label: '状态：',
              prop: 'status',
              type: 'status'
            },
            { label: '查询时间：', prop: 'searchTime', type: 'searchTime' },
            { label: '查询条件：', prop: 'searchKey', type: 'keyList' },
            { label: '创建时间：', prop: 'createTime' },
            { label: '操作员：', prop: 'username' }
          ]
        }
      })
    }

    onMounted(() => {
      Promise.all([queryTypes(), queryTasks(state.form)])
        .then(res => {
          const optionArr = [...res[0]]
          optionArr.unshift({ cname: '全部', ename: '' })
          state.optionList = optionArr

          state.collapse.list = formatCollapseList(res[1].data_page)
          // console.log(state.collapse);
          state.collapse.activeNames = state.collapse.list.find(_c => _c.id).id
        })
        .finally(() => {
          state.searchBtnLoading = false
        })
    })

    return {
      ...toRefs(state),
      searchEvent
    }
  }
}
</script>

<style lang="less" scoped>
.cus-main {
  margin-top: 24px;
  height: calc(100vh - 204px);
  overflow-y: auto;
}

.cus-empty {
  padding-top: 25vh;
  text-align: center;
  color: var(--base-text-color-to-999999);
}

.el-loading-parent--relative {
  height: 90vh !important;
}
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mb-16 {
  margin-bottom: 16px;
}
</style>
