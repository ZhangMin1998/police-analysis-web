<template>
  <div class="userManage_con">
    <div class="table">
      <div class="content-main">
        <form-search>
          <template slot="form">
            <div class="flex">
              <div class="btns">
                <el-button type="primary" class="submitButton out" @click="add('btnShow')">
                  新建按钮级权限</el-button
                >
                <el-button type="primary" class="submitButton out" @click="add('show')">
                  新建一级菜单</el-button
                >
                <el-button type="primary" class="submitButton out" @click="add('twoShow')">
                  新建二级菜单</el-button
                >
              </div>
            </div>
          </template>
        </form-search>

        <!-- ------------  表格嵌套表格 展开  ------------- -->
        <CollapseTable
          ref="tableRef"
          v-if="collapse.show"
          :pageData.sync="collapse.pageData"
          :collapse.sync="collapse"
          :tableData.sync="collapse.tableData"
          @edit="edit"
          @deleteEvent="deleteEvent"
          @expand="expand"
        />
      </div>
    </div>
    <!-- 弹窗 =>  新建 / 编辑  一级菜单  -->
    <pop :pop.sync="level1Pop" @beforeClose="closeLevel1" @beforeOpen="openLevel1">
      <form-tem
        :loadingBtnObj="loadingBtnObj"
        :rules="rules"
        ref="menuFirstTem"
        :formName="'menuFirstform'"
        :formList="formList"
        :form="menuFirstform"
        @close="closeAddPopEvent('menuFirstTem')"
        @submit="submitForm('menuFirstTem', 'menuFirstform')"
      ></form-tem>
    </pop>

    <!-- 弹窗 =>  新建 / 编辑  二级菜单  -->
    <pop :pop.sync="level2Pop" @beforeClose="closeLevel2" @beforeOpen="openLevel2">
      <form-tem
        :loadingBtnObj="loadingBtnObj"
        :rules="twoRules"
        ref="menuTwoTem"
        :formName="'menuTwoForm'"
        :formList="twoFormList"
        :form="menuTwoForm"
        @close="closeAddPopEvent('menuTwoTem')"
        @submit="submitForm('menuTwoTem', 'menuTwoForm')"
      ></form-tem>
    </pop>
    <!-- 弹窗 =>  新建 / 编辑  按钮菜单  -->
    <pop :pop.sync="level3Pop" class="btnPop" @beforeClose="closeLevel3" @beforeOpen="openLevel3">
      <form-tem
        :loadingBtnObj="loadingBtnObj"
        :rules="threeRules"
        ref="menuThreeTem"
        :formName="'menuThreeForm'"
        :formList="threeFormList"
        :treeData="collapse.tableData"
        :form="menuThreeForm"
        @close="closeAddPopEvent('menuThreeTem')"
        @submit="submitForm('menuThreeTem', 'menuThreeForm')"
      ></form-tem>
    </pop>
  </div>
</template>

<script>
import CollapseTable from './components/Table.vue'
import Pop from '@/components/BasicComponents/Dialog'

import FormSearch from '@/components/VisualComponents/Table/formSearch'
import FormTem from '@/views/common/config/config/components/Form'
import { getMenuTree, authMenuCreate, authMenuUpdate, authMenuDelete } from '@/api/config'
export default {
  components: {
    FormSearch,
    FormTem,
    CollapseTable,
    Pop,
  },

  data () {
    const formList = [
      {
        label: '菜单名称',
        prop: 'itemName',
        type: 'input',
        placeholder: '例：设备地图'
      },
      {
        label: '菜单路径',
        prop: 'urlPath',
        type: 'input',
        placeholder: '例：deviceMap'
      },
      {
        label: 'sortNum',
        prop: 'sortNum',
        type: 'input',
        placeholder: '菜单顺序'
      },
      {
        label: '菜单是否隐藏',
        prop: 'hidden',
        type: 'switch',
        activeText: '隐藏'
      },
      {
        label: '功能名称',
        prop: 'moduleName',
        type: 'input',
        placeholder: '例：设备地图'
      },
      {
        label: '功能编码',
        prop: 'moduleCode',
        type: 'input',
        placeholder: '请对应路由表的规则来传值，如：A101'
      }
    ]

    let twoFormList = [
      {
        label: '菜单名称',
        prop: 'itemName',
        type: 'input',
        placeholder: '例：重点人预警'
      },
      { label: 'sortNum', prop: 'sortNum', type: 'input' },
      {
        label: '菜单路由名称',
        prop: 'pathName',
        type: 'input',
        placeholder: '例：Track'
      },
      { label: '上级菜单', prop: 'parentName', type: 'select', option: [] },
      {
        label: 'belong',
        prop: 'belong',
        type: 'input',
        placeholder: '例：重点人预警/新建、编辑菜单使用'
      },
      {
        label: '菜单路径',
        prop: 'urlPath',
        type: 'input',
        placeholder: '例：Track 带参数 例：deviceMap/:id '
      },
      {
        label: '是否为公共组件',
        prop: 'common',
        type: 'switch',
        activeText: '是'
      },
      {
        label: '置灰图标',
        prop: 'icon',
        type: 'input',
        placeholder: '例：icon-2-person.png'
      },
      {
        label: '是否在左边隐藏',
        prop: 'hiddenL',
        type: 'switch',
        activeText: '隐藏'
      },
      {
        label: '激活图标',
        prop: 'iconH',
        type: 'input',
        placeholder: '例：icon-2-person-active.png'
      },
      {
        label: '菜单是否隐藏',
        prop: 'hidden',
        type: 'switch',
        activeText: '隐藏'
      },
      {
        label: 'component',
        prop: 'component',
        type: 'input',
        placeholder: '例：common/all-archives/person-custom'
      },
      {
        label: 'perms',
        prop: 'perms',
        type: 'input',
        placeholder:
          '例：warn:track:add,warn:track:delete,warn:track:update,warn:track:info,warn:track:list,warn:feat:add,warn:feat:delete,warn:feat:update,warn:feat:info,warn:feat:list'
      },
      {
        label: '功能名称',
        prop: 'moduleName',
        type: 'input',
        placeholder: '例：设备地图'
      },
      {
        label: '功能编码',
        prop: 'moduleCode',
        type: 'input',
        placeholder: '请对应路由表的规则来传值，如：A101'
      },
      {
        label: '页面布局',
        prop: 'layout',
        type: 'input',
        placeholder: '请输入'
      },
    ]
    let threeFormList = [
      {
        label: '名称',
        prop: 'itemName',
        type: 'input',
        placeholder: '例：增加'
      },
      {
        label: '上级菜单',
        prop: 'parentName',
        type: 'tree_input',
        placeholder: '一级菜单'
      },
      {
        label: '授权标识',
        prop: 'perms',
        type: 'input',
        placeholder: '例：deviceMap'
      },
      {
        label: '功能名称',
        prop: 'moduleName',
        type: 'input',
        placeholder: '例：设备地图'
      },
      {
        label: '功能编码',
        prop: 'moduleCode',
        type: 'input',
        placeholder: '请对应路由表的规则来传值，如：G109'
      }
    ]
    return {
      level1Pop: {
        show: false,
        title: this.id ? '修改一级菜单' : '新建一级菜单',
        width: '550px',
        top: '180px'
      },
      level2Pop: {
        show: false,
        title: this.id ? '修改二级菜单' : '新建二级菜单',
        width: '56vw',
        top: '150px'
      },
      level3Pop: {
        show: false,
        title: this.id ? '修改按钮菜单' : '新建按钮菜单',
        width: '550px',
        top: '180px'
      },
      collapse: {
        show: true,
        deHeight: 300,
        tableData: [],
        columns: [
          { width: '150', type: 'btn' },
          { width: '100', type: 'expand' },
          { label: '菜单名称', prop: 'itemName', width: '150', type: 'nor' },
          { label: '菜单路径', prop: 'urlPath', width: '220', type: 'nor' },
          {
            label: '菜单显示状态',
            prop: 'hidden',
            width: '140',
            type: 'nor',
            renderFun: function (row) {
              return row.hidden || row.hidden == 'hidden' ? '隐藏' : '显示'
            }
          },
          { label: 'ID', prop: 'id', width: '120', type: 'nor' },
          { label: 'sortNum', prop: 'sortNum', width: '120', type: 'nor' },
          { label: '附加属性', prop: 'meta', minWidth: '200', type: 'nor' }
        ],
        btnRender: [
          {
            label: '编辑',
            type: 'success',
            icon: 'icon-doc-pen',
            btnEvent: this.edit,
            alt: '编辑'
          }
        ],

        child: {
          columns: [
            { width: '150', type: 'btn' },
            {
              label: '菜单名称',
              prop: 'itemName',
              minWidth: '120',
              type: 'nor'
            },
            {
              label: '菜单路由名称',
              prop: 'pathName',
              minWidth: '150',
              type: 'nor'
            },
            {
              label: '菜单显示状态',
              prop: 'hidden',
              width: '140',
              type: 'nor',
              renderFun: function (row) {
                return row.hidden || row.hidden == 'hidden' ? '隐藏' : '显示'
              }
            },
            { label: '菜单路径', prop: 'urlPath', width: '170', type: 'nor' },
            { label: 'ID', prop: 'id', width: '80', type: 'nor' },
            { label: 'sortNum', prop: 'sortNum', width: '100', type: 'nor' },
            { label: '附加属性', prop: 'meta', minWidth: '200', type: 'nor' }
          ],
          btnRender: [
            {
              label: '编辑',
              type: 'success',
              icon: 'icon-doc-pen',
              btnEvent: this.edit,
              alt: '编辑'
            },
            {
              label: '删除',
              type: 'rodeLine',
              icon: 'icon-drop',
              btnEvent: this.deleteEvent,
              alt: '删除'
            }
          ]
        }
      },
      twoFormList: twoFormList,
      threeFormList: threeFormList,
      menuTwoForm: {
        itemName: '',
        pathName: '',
        urlPath: '',
        hidden: false,
        component: '',
        icon: '',
        iconH: '',
        hiddenL: false,
        common: true,
        sortNum: '',
        belong: '',
        layout: '',
        perms: '',
        moduleName: '',
        moduleCode: ''
      },
      menuThreeForm: {
        itemName: '',
        parentName: '',
        parentId: '',
        perms: '',
        moduleName: '',
        type: 2,
        moduleParentId: ''
      },
      twoRules: {
        itemName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        urlPath: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        pathName: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
        component: [{ required: true, message: '请输入component', trigger: 'blur' }],
        sortNum: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }],
        moduleName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
        moduleCode: [{ required: true, message: '请输入功能编码', trigger: 'blur' }],
      },
      threeRules: {
        itemName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        parentName: [{ required: true, message: '请输入上级菜单名称', trigger: 'blur' }],
        moduleName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
        moduleCode: [{ required: true, message: '请输入功能编码', trigger: 'blur' }],
      },
      formList: formList,
      menuFirstform: {
        itemName: '',
        urlPath: '',
        mark: '',
        moduleName: '',
        moduleCode: ''
      },
      rules: {
        itemName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        urlPath: [{ required: true, message: '请输入上级菜单名称', trigger: 'blur' }],
        moduleName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
        moduleCode: [{ required: true, message: '请输入功能编码', trigger: 'blur' }],
      },

      loadingBtnObj: { loading: false, text: '确定', loadingText: '提交中' },

      id: '' //id  1. 无值 标识新建  2.有值 标识 编辑
    }
  },

  created () {
    this.queryTreeMenu()
  },

  methods: {
    /** ---------------  查询树菜单  ------------- */
    queryTreeMenu () {
      this.collapse.show = false
      getMenuTree()
        .then(res => {
          //  上级菜单 下拉
          let idx = this.twoFormList.findIndex(i => i.label == '上级菜单')
          this.twoFormList[idx].option = res.filter(i => i.parentId == 0)
          this.twoFormList[idx].option = this.twoFormList[idx].option.map(i => {
            return { label: i.id, value: i.itemName, moduleId: i.moduleId }
          })

          // this.collapse.tableData = res.map(i => {
          //   i.isOpen = false

          //   i.children =
          //     i.list &&
          //     i.list.sort((a, b) => {
          //       return a.itemName.localeCompare(b.itemName, 'zh')
          //     })
          //   return i
          // })
          //  res.forEach((item)=>{
          //   item.children = item.list
          // })
          this.collapse.tableData = res
        })
        .finally(() => {
          this.collapse.show = true
        })
    },
    /** ---------------  新建/编辑 按钮  ------------- */
    openLevel3 () {
      this.level3Pop.title = this.id ? '修改按钮菜单' : '新建按钮菜单'
      this.level3Pop.show = true
    },
    closeLevel3 () {
      this.level3Pop.show = false
    },
    /** ---------------  一级菜单  ------------- */
    /** 关闭 一级菜单弹窗 */
    closeLevel1 () {
      this.level1Pop.show = false
    },
    openLevel1 () {
      this.level1Pop.title = this.id ? '修改一级菜单' : '新建一级菜单'
      this.level1Pop.show = true
    },

    expand (row) {
      let index = this.indexById(row.id)
      this.$set(this.collapse.tableData[index], 'isOpen', !this.collapse.tableData[index].isOpen)
    },

    indexById (id) {
      return this.collapse.tableData.findIndex(i => i.id == id)
    },

    /** ---------------  二级菜单  ------------- */
    closeLevel2 () {
      this.level2Pop.show = false
    },
    openLevel2 () {
      this.level2Pop.title = this.id ? '修改二级菜单' : '新建二级菜单'
      this.level2Pop.show = true
    },

    deleteEvent (index, row) {
      // console.log(row);
      this.$policeComfirm(`确定要删除(${row.itemName}:${row.pathName})吗?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          authMenuDelete({
            menuId: row.id,
            moduleId: row.moduleId ? row.moduleId : ''
          }).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              customClass: 'messageBox'
            })
            // this.queryTreeMenu()
          })
        })
        .catch(() => { })
    },

    /** 表格 -> 编辑  */
    edit (index, row) {
      this.id = row.id
      if (row.parentId == 0) {
        this.openLevel1()
        this.menuFirstform = JSON.parse(JSON.stringify(row))
      } else if (row.urlPath) {
        this.openLevel2()
        let form = JSON.parse(JSON.stringify(row))
        if (form.meta) {
          let meta = JSON.parse(form.meta)
          form.hiddenL = meta.hidden == 'false' || !meta.hidden ? false : true
          form.common = meta.common == 'false' || meta.common == false ? false : true
          form.icon = meta.icon || ''
          form.iconH = meta['icon-h'] || ''
          form.belong = meta['belong'] || ''
          form.layout = meta['layout'] || ''
        }

        this.menuTwoForm = JSON.parse(JSON.stringify(form))
      } else {
        this.openLevel3()
        this.menuThreeForm = JSON.parse(JSON.stringify(row))
      }
    },

    /** 表格 -> 新增  */
    add (isShowName) {
      this.id = ''
      if (isShowName == 'show') {
        this.openLevel1()
      } else if (isShowName == 'twoShow') {
        this.openLevel2()
      } else if (isShowName == 'btnShow') {
        this.openLevel3()
      }
      this.resetFrom(isShowName)
    },

    /** 新增/编辑 -> 重置表单  */
    resetFrom (isShow) {
      if (isShow == 'show') {
        this.menuFirstform = {
          itemName: '',
          urlPath: '',
          hidden: false,
          sortNum: ''
        }
        this.$nextTick(function () {
          this.$refs['menuFirstTem'].$refs['menuFirstform'].clearValidate()
        })
      } else if (isShow == 'twoShow') {
        this.menuTwoForm = {
          itemName: '',
          pathName: '',
          urlPath: '',
          hidden: false,
          component: '',
          icon: '',
          iconH: '',
          hiddenL: false,
          common: true,
          sortNum: '',
          layout: ''
        }
        this.$nextTick(function () {
          this.$refs['menuTwoTem'].$refs['menuTwoForm'].clearValidate()
        })
      } else if (isShow == 'btnShow') {
        this.menuThreeForm = {
          itemName: '',
          parentName: '',
          parentId: '',
          perms: '',
          type: 2
        }
        this.$nextTick(function () {
          this.$refs['menuThreeTem'].$refs['menuThreeForm'].clearValidate()
        })
      }
    },

    /** 关闭 新建/编辑 弹窗  */
    closeAddPopEvent (temRefName) {
      if (temRefName == 'menuFirstTem') {
        this.closeLevel1()
      } else if (temRefName == 'menuTwoTem') {
        this.closeLevel2()
      } else if (temRefName == 'menuThreeTem') {
        this.closeLevel3()
      }
    },

    /** 提交 新增/编辑 表单  */
    submitForm (temRefName, formName) {
      this.$refs[temRefName].$refs[formName].validate(valid => {
        if (valid) {
          let params
          if (temRefName == 'menuFirstTem') {
            params = {
              ...this.menuFirstform,
              component: 'Layout',
              parentId: 0,
              type: 0
            }
          } else if (temRefName == 'menuTwoTem') {
            params = {
              ...this.menuTwoForm,
              type: 1,
              meta: JSON.stringify({
                common: this.menuTwoForm.common,
                hidden: this.menuTwoForm.hiddenL,
                icon: this.menuTwoForm.icon,
                'icon-h': this.menuTwoForm.iconH,
                belong: this.menuTwoForm.belong,
                layout: this.menuTwoForm.layout
              })
            }
            delete params.hiddenL
            delete params.common
            delete params.icon
            delete params.iconH
            delete params.layout
          } else if (temRefName == 'menuThreeTem') {
            params = {
              ...this.menuThreeForm
            }
            // let postUrl = this.id ? authMenuUpdate : authMenuCreate
            // postUrl(this.menuThreeForm).then((res) => {
            //   console.log(res);
            //   this.queryTreeMenu()
            //   this.closeAddPopEvent(temRefName)
            // })
            // return
          }

          // let postUrl = this.id ? updateMenu : addMenu
          let postUrl = this.id ? authMenuUpdate : authMenuCreate
          postUrl(params).then(() => {
            this.$messageTip.success(this.id ? '修改成功!' : '新建成功!')
            this.queryTreeMenu()
            this.closeAddPopEvent(temRefName)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-main {
  box-sizing: border-box;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.userManage_con {
  margin: 5px;
  box-sizing: border-box;
  .use {
    width: 324px;
    margin-right: 16px;
    background-color: #27344d;
    box-sizing: border-box;
  }
  .table {
    flex: 1 1 auto;
  }
}

.btns {
  display: flex;
}
.btnPop {
  ::v-deep .addFeature {
    .el-dialog__body {
      overflow-y: visible !important;
    }
  }
}
</style>
