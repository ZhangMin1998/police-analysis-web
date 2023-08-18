<template tag="not_change_rem">
  <!-- 权限复制 -->
  <div class="bulid_department_new">
    <div class="main_content_build">
      <div class="transfer_out" v-if="popTyle === '转部门'">
        <div class="transfer_out_department not_change_rem">转出部门：</div>
        <div class="out_department_name">
          {{ departmentData.orgName }}
        </div>
      </div>
      <div class="titps" v-else>
        <el-form
          size="mini"
          :model="submitObj"
          label-position="left"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户账号：" prop="username">
            <el-input v-model="submitObj.username"></el-input>
          </el-form-item>
          <el-form-item label-width="52px" label="姓名：" prop="realName">
            <el-input v-model="submitObj.realName"></el-input>
          </el-form-item>
          <el-form-item label="警员编号：" prop="jobNumber">
            <el-input v-model="submitObj.jobNumber"></el-input>
          </el-form-item>
          <el-form-item label-width="52px" label="手机：" prop="mobile">
            <el-input v-model="submitObj.mobile"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="transfer_main">
        <div class="left_transfer_title not_change_rem">
          {{ popTyle === '转部门' ? '转入部门：' : '角色名称：' }}
        </div>
        <div class="transfer_box">
          <div class="left_tree">
            <div class="left_tree_header">全部</div>
            <div class="tree_box">
              <el-input placeholder="输入关键字进行过滤" maxlength="30" v-model="searchText">
                <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i>
                 -->
                <i slot="suffix" class='iconfont icon-sousuo'></i>
              </el-input>
              <el-tree
                class="filter-tree el-tree-addordel"
                :data="popTreeData"
                show-checkbox
                highlight-current
                :check-on-click-node="true"
                node-key="treeId"
                default-expand-all
                :filter-node-method="filterNode"
                :props="defaultPopTreeProps"
                ref="popTree"
              >
                <span class="custom-tree-node" slot-scope="{ node }">
                  <!-- <span class="em-tree-text" :title="node.label">{{ node.label }}</span> -->
                  <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
                </span>
              </el-tree>
            </div>
          </div>
          <div class="center_btn" :class="{ add: popTyle === '新建' || popTyle === '编辑' }">
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
                  :label="`${item.treeName}(${item.parentName})`"
                  v-for="(item, index) in checkTreeList"
                  style="display: block"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right formBtn">
      <div class="blank_button" @click="cancleSubmit">取消</div>
      <el-button type="primary" class="submitButton" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
var checkUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('用户账号不能为空'));
  }
  setTimeout(() => {
    let url = value.match(
      /^[0-9a-zA-Z]*$/g
    );
    if (url) {
      if (value.length > 38) {
        callback(new Error('长度限制38位以内'));
      } else {
        callback();
      }
    } else {
      callback(new Error('请输入字母或者数字'));
    }
  });
};
var checkPhone = (rule, value, callback) => {
  const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
  if (!value) {
    return callback(new Error('手机号码不能为空'))
  }
  setTimeout(() => {
    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'))
    } else {
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
  }, 100)
};
var checkJobNumber = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('警员编号不能为空'))
  }
  setTimeout(() => {
    if (!Number.isInteger(+value)) {
      callback(new Error('请输入数字值'))
    } else {
      if (value.length === 6 || value.length === 7) {
        callback()
      } else {
        callback(new Error('请输入6-7位纯数字的警员编号'))
      }
    }
  }, 100)
}
import { authUserCreate, authUserUpdate, userChangeOrgBatch } from '@/api/sysSetting'
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
export default {
  components: {
    EllipsisPop
  },
  props: {
    editData: {
      type: Object
    },
    popTyle: {
      type: String
    },
    departmentData: {
      type: Object
    },
    popTreeData: {
      type: Array
    },
    checkedList: {
      type: Array
    },
  },
  data () {
    return {
      searchText: '',
      checkList: [],
      // ruleForm: {
      //   username: '',
      //   realName:'',
      //   jobNumber:'',
      //   mobile:''
      // },
      submitObj: {
        "id": 0,
        "jobNumber": "",
        "mobile": "",
        "positionName": "",
        "realName": "",
        "roleIds": [
          0
        ],
        "status": "",
        username: ""
      },
      rules: {
        username: [
          { required: true, validator: checkUsername, trigger: 'blur' },
        ],
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 0, max: 20, message: '请输入长度在 12 到 20 个字符', trigger: 'blur' }
        ],
        jobNumber: [
          { required: true, validator: checkJobNumber, trigger: 'blur' },
        ],
        mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
      },
      // popTreeData: [],
      checkTreeList: [],
      defaultPopTreeProps: {
        children: 'children',
        label: 'treeName'
      },
      // editCheckId: ''
    }
  },
  watch: {
    searchText (val) {
      this.$refs.popTree.filter(val);
    }
  },
  mounted () {
    if (this.editData.userId) {
      this.submitObj.username = this.editData.username
      this.submitObj.realName = this.editData.realName
      this.submitObj.jobNumber = this.editData.jobNumber
      this.submitObj.mobile = this.editData.mobile
      this.submitObj.status = this.editData.status
      this.submitObj.id = this.editData.userId
      setTimeout(() => {
        this.$refs.popTree.setCheckedKeys(this.editData.treeId, true)
        this.toRight()
      }, 1000)
    } else {
      this.submitObj.status = 'enable'
      this.submitObj = {
        "id": 0,
        "jobNumber": "",
        "mobile": "",
        "positionName": "",
        "realName": "",
        "roleIds": [
          0
        ],
        "status": "",
        username: ""
      }
      delete this.submitObj.id
    }
  },
  methods: {
    // handleNodeClick (item) { //自己定义的editCheckId，防止单选出现混乱
    //   this.editCheckId = item.treeId;
    //   this.$refs.popTree.setCheckedKeys([item.treeId])
    // },
    // checkChange (item, node) {
    //   if (node == true) {
    //     this.editCheckId = item.treeId;
    //     this.$refs.popTree.setCheckedKeys([item.treeId])
    //   } else {
    //     if (this.editCheckId == item.treeId) {
    //       this.$refs.popTree.setCheckedKeys([item.treeId])
    //     }
    //   }
    // },
    getLabelWidth () {
      return '80px'
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.treeName.indexOf(value) !== -1;
    },
    toRight () {
      let tempList = this.$refs.popTree.getCheckedNodes(true, true)
      if (!tempList.length) {
        if (!this.editData.userId) {
          this.$message.info('请先选择角色')
        }
      } else {
        // console.log(tempList);
        this.checkTreeList = tempList
        // console.log(tempList);
        this.checkList = tempList.reduce((arr, cur) => {
          arr.push(cur.treeName + '(' + cur.parentName + ')')
          return arr
        }, [])
        // this.checkList = ['超级管理员(荣成市公安局)']
        // console.log(this.checkList);
      }
    },
    toLeft () {
      if (!this.checkList.length) {
        this.$message.info('请先选择需要移除的角色')
      } else {
        // this.checkList = []
        console.log('选中的，', this.checkList);
        console.log('全部的', this.checkTreeList);
        this.checkTreeList = this.checkTreeList.filter((item) => {
          // let key = this.checkList.every((_c) => {
          //   return item.treeName + '(' + item.parentName + ')' !== _c
          // })
          // if (!key) {
          //   return item
          // }
          return !this.checkList.includes(item.treeName + '(' + item.parentName + ')')
        })
        this.checkList = this.checkTreeList.reduce((arr, cur) => {
          arr.push(cur.treeName + '(' + cur.parentName + ')')
          return arr
        }, [])
        const checkIds = this.checkTreeList.reduce((ids, cur) => {
          ids.push(cur.treeId)
          return ids
        }, [])
        this.$refs.popTree.setCheckedKeys(checkIds)
      }

    },
    cancleSubmit () {
      this.$emit('cancleSubmit')
    },
    confirm () {
      if (this.popTyle === '转部门') {
        if (this.checkTreeList.length === 0) {
          this.$message.info('请选择至少一个部门角色进行转部门')
        } else {
          const tempSubmitObj = {}
          tempSubmitObj.newRoleId = this.checkTreeList.reduce((arr, cur) => {
            arr.push(cur.treeId.split('-')[1])
            return arr
          }, [])
          tempSubmitObj.userRoles = this.checkedList
          userChangeOrgBatch(tempSubmitObj).then(() => {
            this.$message.success('转部门成功')
            this.$emit('confirm')
          })
        }
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 获取选择的角色
          if (this.checkTreeList.length) {
            this.submitObj.roleIds = this.checkTreeList.reduce((arr, cur) => {
              arr.push(cur.treeId.split('-')[1])
              return arr
            }, [])
          } else {
            this.submitObj.roleIds = []
          }
          // 编辑或者新增
          if (this.editData.userId) {
            authUserUpdate(this.submitObj).then((res) => {
              this.$message.success('修改成功')
              this.$emit('confirm', res, 'edit')
            })
          } else {
            authUserCreate(this.submitObj).then((res) => {
              res.passWord = res.mobile.substring(res.mobile.length - 8)
              this.$emit('confirm', res, 'add')
            })
          }
        } else {
          this.$message.info('请填写完整')
          return false;
        }
      })
      // this.$emit('confirm')
    },
  }
}
</script>

<style lang="less" scoped>
.bulid_department_new {
  // height: 200px;
  box-sizing: border-box;
  padding-right: 21px;
  // display: flex;
  // align-items: center;
  .main_content_build {
    // height: calc(100vh - 400px);
    box-sizing: border-box;
    // padding: 0 20px;
    .transfer_out {
      display: flex;
      padding-left: 4px;
      margin-bottom: 16px;
      .transfer_out_department.not_change_rem {
        color: var(--base-text-color-to-999999);
        width: 72px;
        white-space: nowrap;
        margin-right: 7px;
      }
      .out_department_name {
        color: var(--base-text-color-1);
      }
    }
    .titps {
      color: var(--base-text-color-to-999999);
      //margin-bottom: 16px;
      ::v-deep .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          display: flex;
          margin-bottom: 16px !important;
          .el-form-item__label {
            flex: none;
            padding-right: 5px !important;
            box-sizing: content-box;
          }
          .el-form-item__content {
            flex: 1;
            margin-left: 0 !important;
            .el-input__inner {
              height: 32px !important;
              line-height: 32px !important;
              border-radius: 2px !important;
            }
          }
        }
        .el-form-item:nth-child(2n - 1) {
          width: 51%;
        }
        .el-form-item:nth-child(2n) {
          margin-left: 16px;
          width: calc(49% - 16px);
        }
      }
    }
    .transfer_main {
      height: 100%;
      display: flex;
      .left_transfer_title.not_change_rem {
        color: var(--base-text-color-to-999999);
        width: 78px;
        padding-left: 4px;
        margin-right: 7px;
      }
      .transfer_box {
        height: calc(100vh - 400px);
        display: flex;
        color: var(--base-text-color-1);
        overflow: hidden;
        width: 712px;
        .left_tree {
          flex: 1;
          height: 100%;
          overflow: hidden;
          background-color: var(--bg-color-6);
          // box-shadow: 0px -1px 12px 1px var(--box-shadow-color);
          .left_tree_header {
            height: 39px;
            line-height: 40px;
            padding-left: 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }
          .tree_box {
            height: calc(100vh - 442px);
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
              // .el-input__inner:focus {
              //   border-bottom: 1px solid #5288d8 !important;
              // }
            }
            ::v-deep .el-tree-node__expand-icon {
              padding: 8px 8px 6px 24px;
              color: #4e5769;
            }
          }
        }
        .center_btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 10px;
          &.add {
            margin: 0 24px;
          }
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
          // width: 285px;
          .checkout_box {
            padding: 24px;
          }
          ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
            color: var(--base-text-color-1) !important;
          }
        }
      }
      @media only screen and (min-width: 900px) and (max-width: 1400px) {
        .transfer_box {
          height: calc(100vh - 600px);
        }
      }
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    margin-top: 26px;
    box-sizing: border-box;
    .blank_button {
      margin-right: 16px;
      //padding-top: 7px;
      //padding-bottom: 7px;
    }
    //.submitButton {
    //  padding: 8px 20px;
    //  background-color: transparent;
    //  border: 1px solid rgba(255, 255, 255, 0.2);
    //  display: inline-block;
    //  color: #ffffff;
    //  &.out {
    //    background-color: #177ddc;
    //    &:hover {
    //      background-color: rgb(80, 147, 223);
    //    }
    //  }
    //  &.cancle {
    //    margin-right: 8px;
    //    border-radius: 4px;
    //    cursor: pointer;
    //  }
    //  &:hover {
    //    background-color: #177ddc;
    //  }
    //}
  }
}
</style>
