<template>
  <div class="initial">
    <el-steps :active="active" simple finish-status="success">
      <el-step title="初始化数据库"> </el-step>
      <el-step title="创建菜单表数据"> </el-step>
      <el-step title="创建各表数据"> </el-step>
    </el-steps>
    <div v-show="active === 0">
      <div class="select-btns"></div>
      <div class="like-table-class">
        <span v-if="inintialAll">初始化结果：初始化数据库成功</span>
        <span v-else>提示：请先初始化数据库➜</span>
        <div>
          <el-button
            type="primary"
            :disabled="inintialAll"
            :loading="btnLoading"
            @click="initializeDatabase"
            >初始化数据库</el-button
          >
        </div>
      </div>
    </div>
    <div v-show="active === 1">
      <div class="select-btns">
        <el-button
          type="primary"
          :disabled="menuBtnDisabled"
          :loading="btnLoading"
          @click="createFormData"
          >创建菜单表数据</el-button
        >
      </div>
      <div class="like-table-class">
        <Config ref="config" :asComponent="true" @handleSucess="handleSucess"></Config>
      </div>
    </div>
    <div v-show="active === 2">
      <div class="select-btns"></div>
      <div class="like-table-class">
        <span v-if="showData[this.active]">创建结果：{{ showData[this.active] }}</span>
        <span v-else>提示：请创建各表数据➜</span>
        <div>
          <el-button
            type="primary"
            :disabled="!!showData[this.active]"
            :loading="btnLoading"
            @click="createFormData"
            >创建各表数据</el-button
          >
        </div>
      </div>
    </div>
    <!-- <div v-show="active === 3">
      <div class="select-btns">
        <el-button
          type="primary"
          :disabled="!!showData[this.active]"
          :loading="btnLoading"
          @click="createFormData"
          >创建用户表数据</el-button
        >
      </div>
      <div class="like-table-class">
        <span v-if="showData[this.active]">创建结果：{{ showData[this.active] }}</span>
        <span v-else>提示：请创建用户表数据</span>
      </div>
    </div> -->
    <!-- <div v-show="active === 4">
      <div class="select-btns">
        <el-button
          type="primary"
          :disabled="!!showData[this.active]"
          :loading="btnLoading"
          @click="createFormData"
          >创建角色与用户表数据</el-button
        >
      </div>
      <div class="like-table-class">
        <span v-if="showData[this.active]">创建结果：{{ showData[this.active] }}</span>
        <span v-else>提示：请创建角色与用户表数据</span>
      </div>
    </div> -->
    <div v-show="active === 3">
      <div class="like-table-class mt-btn-top">已完成所有操作</div>
    </div>
    <div class="step-btn">
      <el-button type="primary" style="margin-top: 12px" v-if="active !== 0" @click="pre"
        >上一步</el-button
      >
      <el-button type="primary" style="margin-top: 12px" v-if="active < 3" @click="next">{{
        active === 2 && showData[this.active] ? '完成' : '下一步'
      }}</el-button>
      <el-button type="primary" style="margin-top: 12px" v-if="active === 3" @click="toLogin"
        >去登录</el-button
      >
    </div>
  </div>
</template>

<script>
import { getInitializeTable, insertInitializeTable, initializeTableData } from '@/api/initial'
import Config from './components/Config'
export default {
  name: 'initial',
  components: {
    Config,
    // TemplateTable
  },
  data () {
    return {
      active: 0, // 激活的显示步奏
      tableData: [], // 第一步中的table表列表数据
      inintialAll: false, // 控制第一步的按钮是否禁止
      multipleSelection: [],
      showData: {}, // 第345步的显示数据
      btnLoading: false, // 控制除第一步按钮的loading效果
      menuBtnDisabled: false, // 控制第二步中按钮是否禁止
    }
  },
  created () {
    // this.getTableData()
  },
  methods: {
    checkSelect (row) {
      return row.status === 'exist' ? false : true
    },
    initializeDatabase () {
      insertInitializeTable().then((res) => {
        this.inintialAll = true
        if (res === true) {
          this.$message.success('初始化数据库成功')
        }
      })
    },
    toLogin () {
      this.$router.push({ path: '/ol/login' })
    },
    // 获取所有表列表数据
    getTableData () {
      getInitializeTable().then((res) => {
        console.log(res);
        this.tableData = res
        this.inintialAll = res.every((item) => {
          return item.status === "exist"
        })
      })
    },
    handleSucess () {
      this.btnLoading = false
      this.menuBtnDisabled = true
    },
    // 创建表数据，根据active发送不同的请求
    createFormData () {

      if (this.active === 1) {
        if (this.$refs.config.checkedChildrenNameList.length === 0) {
          this.$message.info('请先勾选相应的菜单再进行创建')
          return
        }
        this.btnLoading = true
        this.$refs.config.handeleSubmit()
      } else if (this.active === 2) {
        this.btnLoading = true
        initializeTableData().then((res) => {
          this.$set(this.showData, this.active, res)
          this.$message.success(res)
          this.btnLoading = false
        })
      }
    },
    // 下一步
    next () {
      if (this.active === 0) {
        if (!this.inintialAll) {
          this.$message.info('请先初始化数据库再继续下一步')
          return
        }
      } else if (this.active === 1) {
        // 第二步，要有勾选的一级菜单和勾选的二级菜单才能进行到下一步
        if (!this.menuBtnDisabled) {
          this.$message.info('请先创建菜单再继续下一步')
          return
        }
      }
      else if (this.active === 2) {
        if (!this.showData[this.active]) {
          this.$message.info('请先完成创建该表数据再继续下一步')
          return
        }
      } else if (this.active === 3) {
        return
      }
      this.active++
    },
    // 上一步
    pre () {
      if (this.active > 0) this.active--
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
  }
}
</script>

<style lang="less" scoped>
.initial {
  padding-top: 20px;
  .select-btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 24px 0;
  }
  .step-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
  }
  .like-table-class {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 580px;
    font-size: 18px;
    background-color: var(--bg-color-3);
  }
  .mt-btn-top {
    margin-top: 74px;
  }
  ::v-deep .el-table__body-wrapper {
    background-color: #2c384e;
  }
  // 当前步骤数圆圈样式设置
  ::v-deep .el-steps--simple {
    background: var(--bg-color-3);
  }
  ::v-deep .el-step {
    .el-step__title.is-process {
      color: #d4b021;
    }
    .el-step__head.is-process {
      color: #d4b021;
      border-color: #d4b021;
    }
    .el-step__line {
      background-color: var(--base-text-color-to-999999);
    }
    .el-step__head.is-success {
      color: #177ddc;
      border-color: #177ddc;
    }
    .el-step__title.is-success {
      color: #177ddc;
    }
  }
}
</style>
