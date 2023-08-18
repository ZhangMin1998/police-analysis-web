<template>
  <div class="buildNew">
    <div class="title" :style="{ opacity: showDom ? 1 : 0 }">
      <img src="@/assets/img/title-header.png" alt="" />
      <div class="tip">{{ editData.id ? '编辑' : '新建' }}</div>
    </div>
    <div class="main_content" :style="{ opacity: showDom ? 1 : 0 }">
      <div class="step_box">
        <div class="step">
          <el-steps :active="active">
            <el-step> <template> </template></el-step>
            <el-step></el-step>
          </el-steps>
        </div>
      </div>
      <div class="step_content_common step_content_1" v-show="active === 1">
        <div class="input_box">
          <div class="input_item">
            <div class="role_name">角色名称：</div>
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="submitObj.roleName"
              maxlength="30"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <div class="btn_list">
          <div class="right formBtn">
            <div class="blank_button" @click="cancleAdd">取消</div>
            <el-button type="primary" class="submitButton" @click="next">下一步</el-button>
          </div>
        </div>
      </div>
      <div class="step_content_common step_content_2" v-show="active === 2">
        <div class="input_box">
          <div class="copy_limit">
            <div class="copy_limit_click" @click="copyPower">
              <i class="iconfont icon-quanxianfuzhi"></i>
              <span>权限复制</span>
            </div>
          </div>
          <div class="feauter_module">
            <div class="feauter_header">
              <span>功能模块</span>
              <span>权限设置</span>
            </div>
            <div class="feauter_tree">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                :expand-on-click-node="false"
                class="el-tree-addordel set_underline"
                node-key="id"
                ref="feauter_tree"
                default-expand-all
                key="1"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span class="operation">
                    <!-- @change="changeMenuData(node, data)" -->
                    <el-radio-group v-model="data.isPublic">
                      <el-radio
                        :disabled="data.disabled"
                        :label="true"
                        @click.native="radioClick(node, data, $event)"
                        >公开</el-radio
                      >
                      <el-radio :label="false" @click.native="radioClick(node, data, $event)"
                        >禁止</el-radio
                      >
                    </el-radio-group>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>
        <div class="btn_list">
          <div class="right formBtn">
            <div class="blank_button to_step" @click="preStep">上一步</div>
            <el-button type="primary" class="submitButton" @click="finished">完成</el-button>
          </div>
        </div>
      </div>
    </div>
    <pop :pop.sync="popData" @beforeClose="closeDailog" :dataCenterDetail="true">
      <!-- 权限复制 -->
      <div class="bulid_department_new">
        <div class="main_content_build">
          <div class="titps">请选择要复制的角色：</div>
          <div class="transfer_box">
            <div class="left_tree">
              <div class="left_tree_header">全部</div>
              <div class="tree_box">
                <el-input placeholder="输入关键字进行过滤" maxlength="30" v-model="searchText">
                  <i slot="suffix" class="iconfont icon-sousuo"></i>
                </el-input>
                <el-tree
                  class="filter-tree el-tree-addordel"
                  :data="popTreeData"
                  :check-on-click-node="true"
                  show-checkbox
                  node-key="treeId"
                  @node-click="handleNodeClick"
                  @check-change="checkChange"
                  default-expand-all
                  :filter-node-method="filterNode"
                  :props="defaultPopTreeProps"
                  ref="popTree"
                  key="2"
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <!-- <span class="em-tree-text" :title="node.label">{{ node.label }}</span> -->
                    <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
                  </span>
                </el-tree>
              </div>
            </div>
            <div class="center_btn">
              <div class="to_right" @click="toRight">
                <i class="el-icon-arrow-right"></i>
              </div>
              <div class="to_right to_left" @click="toLeft">
                <i class="el-icon-arrow-left"></i>
              </div>
            </div>
            <div class="left_tree right_transfer">
              <div class="left_tree_header right_transfer_header">已选</div>
              <div class="tree_box checkout_box">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    :label="item.treeName"
                    v-for="(item, index) in checkTreeList"
                    style="display: block"
                    :key="index"
                  ></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div class="right formBtn">
          <div class="blank_button" @click="cancleSubmit">取消</div>
          <el-button type="primary" class="submitButton" @click="confirm">确定</el-button>
        </div>
      </div>
    </pop>
  </div>
</template>

<script>

import { listWithTreeByRoleId, listWithTree, authRoleUpdate, authRoleCreate, listTreeWithRole } from '@/api/sysSetting'
import Pop from '@/components/VisualComponents/PopDialog'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
export default {
  components: {
    Pop,
    EllipsisPop
  },
  props: {
    currentDepartmentData: {
      type: Object
    },
    editData: {
      type: Object || String
    },
    allRoleList: {
      type: Array
    }
  },
  watch: {
    searchText (val) {
      this.$refs.popTree.filter(val);
    }
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      active: 1,
      submitObj: {
        "describe": "",
        "id": 0,
        "moduleIds": [
          0
        ],
        "orgId": 0,
        "roleName": "",
        "status": ""
      },
      popData: { show: false, title: '权限复制', width: '784px', text: '', key: '' },
      searchText: '',
      defaultPopTreeProps: {
        children: 'children',
        label: 'treeName'
      },
      showDom: false,
      checkList: [],
      checkTreeList: [],
      popTreeData: [],
      tempTreeData: [],
      editCheckId: ''
    };
  },
  mounted () {
    this.setDefaultSubmitInfo()
    if (this.editData.id) {
      this.submitObj.roleName = this.editData.roleName
      this.submitObj.id = this.editData.id
      this.submitObj.status = this.editData.status
      // 编辑时查询菜单表
      this.searchRoleMenu()
    } else {

      listWithTree({ loading: true, loadingDom: '.right_template_table' }).then((res) => {
        this.showDom = true
        this.treeData = res
      })
    }
  },
  beforeDestroy () {
    this.$parent.editData = {}
  },
  methods: {
    handleNodeClick (item) { //自己定义的editCheckId，防止单选出现混乱
      this.editCheckId = item.treeId;
      this.$refs.popTree.setCheckedKeys([item.treeId])
    },
    checkChange (item, node) {
      if (node == true) {
        this.editCheckId = item.treeId;
        this.$refs.popTree.setCheckedKeys([item.treeId])
      } else {
        if (this.editCheckId == item.treeId) {
          this.$refs.popTree.setCheckedKeys([item.treeId])
        }
      }
    },
    searchRoleMenu () {
      listWithTreeByRoleId({ roleId: this.editData.id }, { loading: true, loadingDom: '.right_template_table' }).then((res) => {
        this.showDom = true
        this.formatResData(res, true)
        this.treeData = res
      })
    },
    formatResData (data, parentStatus) {
      data.forEach((item) => {
        if (parentStatus) {
          this.$set(item, 'disabled', false)
        } else {
          this.$set(item, 'disabled', true)
        }
        if (item.children.length) {
          this.formatResData(item.children, item.isPublic)
        }
      })
    },
    resetPopData () {
      this.searchText = ''
      this.checkTreeList = []
      this.checkList = []
      this.popData.show = false
    },
    treeCancleSubmit () {
      this.resetPopData()
    },
    toRight () {
      let tempList = this.$refs.popTree.getCheckedNodes(true, true)
      if (!tempList.length) {
        this.$message.info('请先选择角色')
      } else if (tempList.length !== 1) {
        this.$message.info('只能选择一个角色')
      } else {
        this.checkTreeList = tempList
        this.checkList.push(tempList[0].treeName)
      }
    },
    toLeft () {
      if (!this.checkList.length) {
        this.$message.info('请先选择需要移除的角色')
      } else {
        this.checkList = []
        this.checkTreeList = []
        this.$refs.popTree.setCheckedKeys([])
      }

    },
    cancleSubmit () {
      this.resetPopData()
      this.popData.show = false
    },
    confirm () {
      if (!this.checkList.length) {
        this.$message.info('请先选择一个角色进行复制')
      } else {
        let roleId = this.checkTreeList[0].treeId.split('-')[1]
        listWithTreeByRoleId({ roleId }).then((res) => {
          this.tempTreeData = res
          this.$policeComfirm('权限复制后将覆盖正在编辑的信息，您确定要进行权限复制吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.treeData = this.tempTreeData
            this.$message.success('权限复制成功,请点击完成来创建角色')
            this.resetPopData()
          }).catch(() => {
            this.treeCancleSubmit()
          })
        })
      }

    },
    closeDailog () {
      this.searchText = ''
      this.popData.show = false
    },
    setDefaultSubmitInfo () {
      this.submitObj.orgId = this.currentDepartmentData.orgId
      this.submitObj.status = this.currentDepartmentData.status
      delete this.submitObj.id
    },
    radioClick (node, data, el) {
      if (el.target.tagName === 'SPAN') return
      if (el.target._value) {
        data.isPublic = true
      } else {
        data.isPublic = false
      }
      let curStatus = this.$refs.feauter_tree.getNode(data)

      if (curStatus.parent.data.isPublic === false || data.disabled) return
      let pStatus = data.isPublic
      console.log(data.isPublic);
      console.log(pStatus);
      // 直接赋值会vue感知不到，会导致有bug
      this.$set(data, 'disabled', false)
      this.check(data, false, pStatus)
    },
    check (data, status, pStatus) {
      data.isPublic = pStatus
      if (status) {
        this.$set(data, 'disabled', !pStatus)
      }
      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          this.check(item, true, pStatus)
        })
      }
    },
    changeMenuData (node, data) {
      let pStatus = data.isPublic
      // 直接赋值会vue感知不到，会导致有bug
      this.$set(data, 'disabled', false)
      this.autoCheck(data, false, pStatus)
    },

    autoCheck (data, status, pStatus) {
      data.isPublic = pStatus
      if (status) {
        // 直接赋值会vue感知不到，会导致有bug
        this.$set(data, 'disabled', !pStatus)
      }
      if (data.children && data.children.length) {
        data.children.forEach((item) => {
          this.autoCheck(item, true, pStatus)
        })
      }
    },
    cancleAdd () {
      this.$parent.componentStatus = 'list'
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.treeName.indexOf(value) !== -1;
    },
    next () {
      if (!this.submitObj.roleName) {
        this.$message.info('请先填写角色名称')
        return
      }
      let canNext
      if (this.editData.id) {
        let tempAllRoleList = JSON.parse(JSON.stringify(this.allRoleList))
        tempAllRoleList = tempAllRoleList.filter((item) => {
          return item.id !== this.editData.id
        })
        canNext = tempAllRoleList.every((item) => {
          return item.roleName !== this.submitObj.roleName
        })
      } else {
        canNext = this.allRoleList.every((item) => {
          return item.roleName !== this.submitObj.roleName
        })
      }
      if (canNext) {
        this.active++
      } else {
        this.$message.info('角色名称不能重复')
      }
    },
    preStep () {
      this.active--
    },
    finished () {
      this.submitObj.moduleIds = this.getAllEnableMenuIdArr(this.treeData)
      if (!this.editData.id) {
        // 新增
        authRoleCreate(this.submitObj).then(() => {
          this.$message.success('新增成功')
          this.$parent.componentStatus = 'list'
          this.$parent.backToOriginTreeStatus()
        })
      } else {
        // 编辑接口
        authRoleUpdate(this.submitObj).then(() => {
          this.$message.success('修改成功')
          this.$parent.componentStatus = 'list'
          this.$parent.backToOriginTreeStatus()
        })
      }
    },
    copyPower () {
      listTreeWithRole().then((res) => {
        this.forMatData(res)
        this.popTreeData = res
      })
      this.popData.show = true
    },
    forMatData (arr) {
      arr.forEach((item) => {
        if (item.treeType === 'org') {
          item.disabled = true
        }
        if (item.children && item.children.length) {
          this.forMatData(item.children)
        }
      })
    },
    getAllEnableMenuIdArr (arr) {
      let enableArr = []
      arr.forEach((item) => {
        if (item.isPublic) {
          enableArr.push(item.id)
          if (item.children.length) {
            enableArr = enableArr.concat(this.getAllEnableMenuIdArr(item.children))
          }
        }
      })
      return enableArr
    },
  }
}
</script>

<style lang="less" scoped>
.buildNew {
  .title {
    display: flex;
    align-items: center;
    font-size: 18px;
    line-height: 32px;
    color: var(--base-text-color-1);
    img {
      width: 18px;
      height: 18px;
      margin-right: 8px;
    }
    .tip {
      font-weight: bold;
    }
  }
  .main_content {
    margin-top: 20px;
    .step_box {
      width: 100%;
      height: 64px;
      background-color: var(--bg-color-2);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 2px;
      .step {
        width: 140px;
      }
      ::v-deep .el-step {
        .el-step__head.is-finish {
          color: var(--active-color);
          border-color: var(--active-color);
        }
        .el-step__head.is-process {
          color: var(--base-text-color-to-999999);
          border-color: var(--base-text-color-to-999999);
        }
        .el-step__icon.is-text {
          border-width: 1px;
        }
        .el-step__line {
          background-color: var(--base-text-color-to-999999);
          left: 30px;
          right: 6px;
        }
        .el-step__icon {
          background: transparent !important;
        }
      }
    }
    .step_content_common {
      width: 100%;
      padding: 24px;
      box-sizing: border-box;
      height: calc(100vh - 261px);
      // overflow: auto;
      background-color: var(--bg-color-2);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .input_box {
        flex: 1;
      }
      .btn_list {
        .right {
          display: flex;
          justify-content: flex-end;
          padding: 8px 0 24px 0;
          box-sizing: border-box;
          &.formBtn {
            padding: 24px 0 0 24px;
            box-sizing: border-box;
          }
          .blank_button {
            margin-right: 16px;
            padding-top: 7px;
            padding-bottom: 7px;
          }
          .to_step {
            padding: 7px 12px;
          }
          /deep/.el-button {
            width: 68px;
            padding: 0 !important;
          }
        }
      }
    }
    .step_content_1 {
      .input_box {
        // display: flex;
        // justify-content: center;
        .input_item {
          width: 450px;
          display: flex;
          align-items: center;
          margin: 40px auto 0;
          .role_name {
            width: 100px;
            color: var(--base-text-color-1);
          }
          @media only screen and (min-width: 900px) and (max-width: 1450px) {
            .role_name {
              width: 126px;
            }
          }
          /deep/.el-input {
            .el-input__inner {
              padding: 0 12px;
              border-radius: 2px;
              border-color: #515C7C;
              &::placeholder {
                color: var(--input-placehold-color);
                font-size: 16px;
              }
            }
            .el-input__count-inner {
              color: var(--input-placehold-color);
              font-size: 16px;
              background-color: var(--bg-color-2) !important;
            }
          }
        }
      }
    }
    .step_content_2 {
      .input_box {
        .copy_limit {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          color: var(--active-color);
          line-height: 16px;
          margin-bottom: 16px;
          .copy_limit_click {
            display: flex;
            cursor: pointer;
            align-items: center;
            i {
              font-size: 16px;
              color: var(--active-color);
            }
            span {
              margin-left: 8px;
            }
          }
        }
        .feauter_module {
          .feauter_header {
            height: 48px;
            line-height: 20px;
            width: 100%;
            background-color: var(--table-head-bg-color);
            display: flex;
            color: var(--base-text-color-1);
            padding: 14px 0;
            box-sizing: border-box;
            span {
              display: inline-block;
              padding-left: 32px;
              box-sizing: border-box;
            }
            span:nth-child(1) {
              flex: 1;
              border-right: 1px solid var(--base-text-color-to-999999);
            }
            span:nth-child(2) {
              width: 481px;
            }
          }
          .feauter_tree {
            ::v-deep .el-tree-node__expand-icon {
              padding-left: 32px;
              padding-top: 8px;
            }
            ::v-deep .set_underline > div.el-tree-node {
              border-bottom: 1px solid var(--division);
              padding-top: 6px;
              padding-bottom: 8px;
            }
            height: calc(100vh - 441px);
            // background-color: red;
            overflow: auto;
            .custom-tree-node {
              display: inline-block;
              width: 100%;
              padding-right: 10px;
              position: relative;
            }
            .operation {
              float: right;
              margin-right: 215px;
              .el-radio__input.is-disabled + span.el-radio__label {
                color: red;
              }
              /deep/.el-radio {
                margin-right: 56px;
                font-size: 16px;
                .el-radio__label {
                  font-size: 16px;
                  padding-left: 8px;
                  color: var(--base-text-color-1) !important;
                }
                .el-radio__inner {
                  width: 16px;
                  height: 16px;
                  border-color: var(--base-text-color-to-999999) !important;
                  &::after {
                    background: var(--active-color) !important;
                  }
                }
                .el-radio__input.is-checked .el-radio__inner {
                  border-color: var(--active-color) !important;
                }
              }
            }
          }
        }
      }
    }
  }
}
.bulid_department_new {
  box-sizing: border-box;
  padding: 0 12px 0 20px;
  .main_content_build {
    height: calc(100vh - 400px);
    box-sizing: border-box;
    .titps {
      color: var(--base-text-color-to-999999);
      margin-bottom: 16px;
    }
    .transfer_box {
      height: calc(100% - 32px);
      display: flex;
      color: var(--base-text-color-1);
      box-sizing: border-box;
      padding-right: 10px;
      .left_tree {
        flex: 1;
        height: 100%;
        overflow: hidden;
        background-color: var(--bg-color-6);
        // box-shadow: var(--box-shadow);
        .left_tree_header {
          height: 39px;
          line-height: 40px;
          padding-left: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .tree_box {
          height: calc(100% - 40px);
          overflow: auto;
          padding: 24px 0;
          box-sizing: border-box;
          .icon-sousuo {
            position: relative;
            top: 4px;
            font-size: 16px;
            color: var(--base-text-color-to-999999);
            cursor: pointer;
          }
          .custom-tree-node {
            display: flex;
            flex: 1;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            padding-right: 24px;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .em-tree-text {
              display: inline-block; //block一样
              overflow: hidden;
              white-space: nowrap;
              width: 100%;
              text-overflow: ellipsis;
            }
          }
          ::v-deep .el-input {
            margin: 0 24px 16px;
            width: calc(100% - 48px);
            .el-input__inner {
              border: 0 !important;
              border-bottom: 1px solid var(--base-text-color-to-999999) !important;
              border-radius: 0;
              line-height: 27px !important;
              height: 27px !important;
              padding-left: 0;
              padding-right: 30px;
              &::placeholder {
                color: var(--input-placehold-color);
                font-size: 14px;
              }
            }
            .el-input__suffix {
              right: 0;
              top: -4px !important;
            }
          }
          ::v-deep .el-tree-node__expand-icon {
            padding: 8px 8px 6px 24px;
            color: #4e5769;
          }
        }
      }
      .center_btn {
        width: 44px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #177ddc;
        .to_right {
          font-size: 14px;
          height: 24px;
          width: 24px;
          text-align: center;
          border: 1px solid var(--active-color);
          border-radius: 2px;
          cursor: pointer;
          box-sizing: border-box;
          i {
            line-height: 23px;
            font-weight: 600;
            color: var(--active-color);
          }
        }
        .to_left {
          margin-top: 26px;
        }
      }
      .right_transfer {
        .checkout_box {
          padding: 24px;
        }
        ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
          color: var(--base-text-color-1) !important;
        }
      }
    }
  }
  @media only screen and (min-width: 900px) and (max-width: 1400px) {
    .main_content_build {
      height: calc(100vh - 600px);
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    margin-top: 32px;
    &.formBtn {
      // padding: 24px 0 24px 24px;
      box-sizing: border-box;
    }
    .blank_button {
      margin-right: 16px;
      padding-top: 7px;
      padding-bottom: 7px;
    }
    // .submitButton {
    //   padding: 8px 20px;
    //   background-color: transparent;
    //   border: 1px solid rgba(255, 255, 255, 0.2);
    //   display: inline-block;
    //   color: @font-color-3;
    //   &.out {
    //     background-color: #177ddc;
    //     &:hover {
    //       background-color: rgb(80, 147, 223);
    //     }
    //   }
    //   &.cancle {
    //     margin-right: 8px;
    //     border-radius: 4px;
    //     cursor: pointer;
    //   }
    //   &:hover {
    //     background-color: #177ddc;
    //   }
    // }
  }
}
</style>
