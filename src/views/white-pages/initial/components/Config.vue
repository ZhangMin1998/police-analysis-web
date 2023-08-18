<template>
  <div class="menuManage_con" :class="{ as_component_class: asComponent }">
    <div class="nav-btn" @click="$router.push({ name: 'MenusTable' })" v-if="!asComponent">
      <!-- <nav-title title="表格菜单"></nav-title> -->
      <BackPrevious></BackPrevious>
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
          @change="parentChecked(item)"
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
import { authMenuSaveAll } from '@/api/initial'
// 本地调试文件
import allRoute from '@/router/constant.js'

export default {
  props: {
    asComponent: {
      type: Boolean,
      default: false
    },
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
      isAddParentRouter: false
    }
  },

  methods: {
    // 手动设置一级菜单显隐
    toggleFirstState (item) {
      const index = this.allRoute.findIndex(_c => _c.itemName === item.itemName)
      this.$set(this.allRoute[index], 'hidden', !item.hidden)
    },

    handeleSubmit () {
      // console.log(this.allRoute)
      // console.log(this.checkedParentNameList)
      // console.log(this.checkedChildrenNameList)
      let checkedRoute = JSON.parse(JSON.stringify(this.allRoute))
      checkedRoute = checkedRoute.filter((item) => {
        item.list = item.list.filter((_c) => {
          return this.checkedChildrenNameList.includes(_c.itemName)
        })
        if (item.list.length) {
          return item
        }
      })
      console.log(checkedRoute)
      authMenuSaveAll(checkedRoute).then((res) => {
        // console.log(res);
        this.$message.success(res)
        this.$emit('handleSucess',res)
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
