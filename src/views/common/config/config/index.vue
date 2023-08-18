<template>
  <div class="menuManage_con" :class="{ as_component_class: asComponent }">
    <div class="nav-btn" @click="$router.push({ name: 'MenusTable' })" v-if="!asComponent">
      <!-- <nav-title title="表格菜单"></nav-title> -->
      <!-- <BackPrevious text="表格菜单"></BackPrevious> -->
      <Tab :tabNav.sync="tabNav"/>
    </div>
    <el-row>
      <el-col :span="2"><span class="title">一级菜单:</span></el-col>
      <el-col :span="22" style="display: flex">
        <el-checkbox
          style="width: 200px; margin-right: 0; display: flex; align-items: center"
          v-for="(item, idx) in allRoute"
          :key="idx + '_' + item.itemName"
          v-model="checkedParentNameList"
          :label="item.itemName"
          @change="parentChecked(item, idx)"
          >{{ item.itemName || '' }}

          <span :class="item.hidden ? 'write_btn' : ''">
            <el-button @click.prevent.stop="toggleFirstState(item)" type="primary">
              {{ item.hidden ? '隐藏' : '显示' }}
            </el-button>
          </span>
        </el-checkbox>
      </el-col>
    </el-row>
    <el-row class="children">
      <el-col :span="2"><span class="title">二级菜单:</span></el-col>
      <el-col :span="22">
        <div class="childrenBox">
          <el-checkbox-group
            v-model="checkedChildrenNameList"
            v-for="(item, idx) in allRoute"
            :key="idx"
            @change="childrenChecked(item)"
          >
            <div style="width: 200px">
              <el-checkbox
                v-for="_item in item.list"
                :key="_item.itemName"
                style="margin-bottom: 16px; display: flex; align-items: center"
                :label="_item.itemName"
                :title="_item.itemName"
              >
                {{ _item.itemName || '' }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
    <el-button
      v-if="!asComponent"
      class="changeBtn"
      :disabled="isLoading"
      @click="handeleSubmit"
      type="primary"
    >
      保存
    </el-button>
  </div>
</template>

<script>
const tabNav = {
  list: [
    {
      name: '表格菜单',
      icon: 'txt-clcok',
      isActived: false,
      path: 'FaceWarnList',
      key: 'face_warn:rule_list'
    }
  ]
}
import { addMenu, updateMenu, deleteMenu, getMenuTree } from '@/api/config'
import Tab from '@/components/BasicComponents/Tab'
// import allRoute from 'allRouterBundle'
// 本地调试文件
import allRoute from '@/router/constant.js'

export default {
  props: {
    asComponent: {
      type: Boolean,
      default: false
    },
    inintialAll: {
      type: Boolean,
      default: false
    }
  },
  components:{
    Tab
  },
  data () {
    return {
      isLoading: false,
      allRoute: allRoute,
      checkedChildrenNameList: [], //二级菜单_选中
      checkedParentNameList: [], //一级菜单_选中
      localAllChildrenItemList: [], //本地所有子路由 ['item']
      sqlChildrenNameList: [], //一级菜单_数据库 ['itemName']
      sqlAllRouterList: [], //二级菜单_数据库
      sqlAllParentRouterList: [], // 数据库返回的菜单
      isAddParentRouter: false,
      tabNav:tabNav
    }
  },
  created () {
    // 本地子菜单 [{}] 列表
    this.localAllChildrenItemList = allRoute.reduce((total, cur) => {
      return [...total, ...cur.list.map(item => item)]
    }, [])
    // 查询数据库路由
    if (!this.asComponent) {
      this.queryTreeMenu()
    }
  },
  watch: {
    inintialAll (val) {
      if (val) {
        this.queryTreeMenu()
      }
    }
  },

  methods: {
    // 手动设置一级菜单显隐
    toggleFirstState (item) {
      const index = this.allRoute.findIndex(_c => _c.itemName === item.itemName)
      this.$set(this.allRoute[index], 'hidden', !item.hidden)
    },

    /** ---------------  查询树菜单  ------------- */
    queryTreeMenu () {
      getMenuTree().then(res => {
        //  数据库 一级菜单 - 全部 【'itemName'】
        this.sqlAllParentNameList =
          res?.map(_c => {
            return _c.itemName
          }) ?? []
        if (this.asComponent) {
          // 默认加一级菜单
          const addParentList = this.allRoute.filter(
            item => !this.sqlAllParentNameList.includes(item.itemName)
          )
          if (addParentList.length > 0) {
            addParentList.forEach(ele => {
              addMenu(ele)
            })
            setTimeout(() => {
              this.queryTreeMenu()
            }, 500)

            return
          }
        }

        //  动态更新本地子菜单列表得parentId字段
        this.localAllChildrenItemList = this.localAllChildrenItemList.map(_c => {
          _c.parentId = res.find(ele => ele.itemName === _c.parentName)?.id
          return _c
        })

        // 回显一级菜单显隐
        this.allRoute = this.allRoute.map(_c => {
          const cur = res.find(item => item.itemName === _c.itemName)
          if (cur) {
            _c.hidden = cur.hidden
          }
          return _c
        })

        //数据库 一级菜单 - 全部 【{item}】
        this.sqlAllParentRouterList = [...res]
        // console.log(` //数据库 一级菜单 - 全部 【{item}】`,this.sqlAllParentRouterList);// 第一次进来时为[]

        // console.log(`数据库 一级菜单副本 - 全部 【'name'】`, this.sqlAllParentNameList);

        //  数据库 一级菜单 - 显示状态 ->  双向绑定 选中['itemName']
        this.checkedParentNameList = res.map(_c => {
          return _c.itemName
        })
        // console.log(`数据库 一级菜单 - 显示状态 ->  双向绑定 选中['itemName']`, this.checkedParentNameList);

        // 数据库 一级菜单 - 显示状态 固定不变 ->  ['itemName']
        this.sqlParentNameList = [...this.checkedParentNameList]
        // console.log(`数据库 一级菜单 - 显示状态 固定不变 ->  ['itemName']`,this.sqlParentNameList);

        //  数据库 二级菜单 - 存在状态 ->  双向绑定 选中['itemName']
        this.checkedChildrenNameList = res.reduce((total, cur) => {
          return [...total, ...cur.list.map(item => item.itemName)]
        }, [])
        // console.log(`数据库 二级菜单 - 存在状态 ->  双向绑定 选中['itemName']`, this.checkedParentNameList);

        //数据库 二级菜单 - 存在状态 固定不变 ->  ['itemName']
        this.sqlChildrenNameList = [...this.checkedChildrenNameList]
        // console.log(`数据库 二级菜单 - 存在状态 固定不变 ->  ['itemName']`, this.sqlChildrenNameList);

        //数据库 二级菜单 - 全部 【'item'】
        this.sqlAllRouterList = res.reduce((total, cur) => {
          return [...total, ...cur.list]
        }, [])
        // console.log(`数据库 二级菜单 - 全部 【'item'】`,this.sqlAllRouterList);// 第一次进来时为[]
      })
    },

    /** 提交 */
    handeleSubmit () {
      this.isLoading = true
      // 一级菜单 不可删除 显示和隐藏 调用接口
      this.toggleParentState()

      // 增加二级菜单(需要先增加一级菜单才能增加二级菜单)
      this.addRourter()
      // 删除数据库多余二级菜单
      this.delRouter()

      setTimeout(() => {
        if (!this.asComponent) {
          this.$messageTip.success('修改成功')
        } else {
          this.$messageTip.success('创建成功')
        }

        this.isLoading = false
        this.queryTreeMenu()
      }, 800)
    },

    //一级菜单 显示/隐藏更改
    toggleParentState () {
      if (this.sqlAllParentRouterList.length === 0) return
      this.sqlAllParentRouterList.forEach(ele => {
        const curStateItem = this.allRoute.find(
          _c => ele.itemName === _c.itemName && _c.hidden !== ele.hidden
        )
        if (curStateItem) {
          updateMenu({
            hidden: curStateItem.hidden,
            id: ele.id,
            itemName: curStateItem.itemName,
            parentId: 0,
            type: 0
          })
        }
      })
    },

    //添加二级菜单
    addRourter () {
      const addList = this.checkedChildrenNameList.filter(
        v => !this.sqlChildrenNameList.includes(v)
      )
      if (addList.length === 0) return
      this.localAllChildrenItemList.forEach(ele => {
        if (addList.includes(ele.itemName)) {
          addMenu(ele)
        }
      })
    },

    //删除二级菜单
    delRouter () {
      const delList = this.sqlChildrenNameList.filter(v => {
        const item = this.checkedChildrenNameList.find(_c => _c === v)
        return !item
      })
      if (delList.length === 0) return
      this.sqlAllRouterList.forEach(ele => {
        if (delList.includes(ele.itemName)) {
          deleteMenu(ele.id)
        }
      })
    },

    /* 一级菜单全选反选 */
    parentChecked (i) {
      let allIdArr = i.list.map(ele => {
        return ele.itemName
      })
      this.checkedChildrenNameList.sort((a, b) => {
        return a - b
      })

      if (this.checkedParentNameList.includes(i.itemName)) {
        // 取消全选
        this.checkedParentNameList.push(i.itemName)
        this.checkedParentNameList = Array.from(new Set(this.checkedParentNameList))
        // 全选
        allIdArr.forEach(element => {
          this.checkedChildrenNameList.push(element)
        })
        this.checkedChildrenNameList = Array.from(new Set(this.checkedChildrenNameList))
      } else {
        // 取消全选
        let index = this.checkedParentNameList.findIndex(item => item == i.itemName)
        if (index != -1) {
          this.checkedParentNameList.splice(index, 1)
        }
        this.checkedChildrenNameList = this.checkedChildrenNameList.filter(
          item => !allIdArr.some(ele => ele === item)
        )
      }
    },

    // 二级菜单change事件
    childrenChecked (i) {
      this.checkedParentNameList.push(i.itemName)
      this.checkedParentNameList = Array.from(new Set(this.checkedParentNameList))
      let allIdArr = i.list.map(ele => {
        return ele.itemName
      })
      let checkedCount = this.getInclude1(allIdArr, this.checkedChildrenNameList).length

      // this.parentList[idx].isIndeterminate = checkedCount > 0 && checkedCount < allIdArr.length

      if (checkedCount == 0) {
        let index = this.checkedParentNameList.findIndex(item => {
          return item == i.itemName
        })
        if (index != -1) {
          this.checkedParentNameList.splice(index, 1)
        }
      } else if (checkedCount == allIdArr.length) {
        this.checkedParentNameList.push(i.itemName)
        this.checkedParentNameList = Array.from(new Set(this.checkedParentNameList))
      }
    },

    /** arr2 是否包含arr1 */
    getInclude1 (arr1, arr2) {
      let temp = []
      for (const item of arr2) {
        arr1.find(i => i === item) ? temp.push(item) : ''
      }
      return temp
    }
  }
}
</script>

<style scoped>
.menuManage_con {
  box-sizing: border-box;
  padding: 50px;
  height: calc(100vh - 150px);
  overflow: auto;
  box-sizing: border-box;
}
.childrenBox {
  display: flex;
  width: 98%;
  height: 300px;
  box-sizing: border-box;
}
.children {
  margin-top: 30px;
}
.changeBtn {
  position: fixed;
  bottom: 60px;
  right: 60px;
}
.menuManage_con >>> .el-checkbox__label {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* 作爲组件时的样式 */
.as_component_class {
  height: 100%;
  width: 100%;
  padding: 50px;
  overflow-y: scroll;
}
.nav-btn {
  position: absolute;
  right: 32px;
  top: 16px;
}
</style>
