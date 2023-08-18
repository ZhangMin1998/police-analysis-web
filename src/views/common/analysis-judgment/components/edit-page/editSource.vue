<template>
<div class='edit_source_wrap'>
  <div class='up_way_wrap'>
    <div
      :class='{
        "active": operaWay === "system",
        "way_item": true
      }'
      @click='operaWay = "system"'
    >系统数据</div>
    <div
      :class='{
        "active": operaWay === "csv",
        "way_item": true
      }'
      @click='operaWay = "csv"'
    >本地csv文件上传</div>
    <div
      :class='{
        "active": operaWay === "container",
        "way_item": true
      }'
      @click='operaWay = "container"'
    >容器数据</div>
  </div>
  <div v-show='operaWay === "system"' class='source_wrap'>
    <div class='source common'>
<!--      <el-input
        v-model.trim="sourceName"
        @keyup.enter.native="searchClick"
        placeholder="请输入"
      >
        <template slot="suffix">
          <i class="iconfont icon-sousuo" v-debounce.prevent.stop="searchClick"></i>
        </template>
      </el-input>-->
      <div class='list'>
        <div
          v-for='item in sourceList'
          :key='item.srcNameEn'
          :class='{
            "source_item": true,
            "is_choice": choiceData.srcNameEn && item.srcNameEn === choiceData.srcNameEn
          }'
          @click='choiceSource(item)'
        >{{ item.srcNameCn }}</div>
      </div>
    </div>
    <div class='choice common'>
      <div class='tip'>已选</div>
      <div v-show='choiceData.srcNameEn' class='choice_tag'>
        <div class='value'>{{ choiceData.srcNameCn || '' }}</div>
        <i class='iconfont icon-xiangqingguanbi' @click='delChoice'></i>
      </div>
    </div>
  </div>
  <div v-show='operaWay === "csv"' class='upload_wrap'>
    <el-upload
      v-if='!uploadFileInfo.url'
      class='upload_window'
      :action="'#'"
      :http-request="uploadRequest"
      accept='.csv'
      :multiple="false"
      :auto-upload="true"
      :on-error="unError"
      :show-file-list="false"
      :before-upload="beforeUpload">
      <div class='upload_tip'>
        <div class='upload_text'>
          <div>请选择文件</div>
        </div>
        <div class='text_tip'>支持上传csv文件，且不超过10MB</div>
      </div>
    </el-upload>
    <div v-else class='upload_result'>
      <div class='file_info'>
        <div class='file_type'>
          <img :src='require(`@/assets/img/${$themeColor("--upload-file-bg")}.png`)' alt=''>
        </div>
        <EllipsisPop class='file_name' :content='uploadFileInfo.name'>
          <div>{{ uploadFileInfo.name }}</div>
        </EllipsisPop>
      </div>
      <div class='upload_data_name'>
        <div class='label'>表名：</div>
        <el-input v-model.trim="uploadFileInfo.tableName" placeholder="请输入表名" maxlength='7'></el-input>
      </div>
    </div>
  </div>
  <div
    v-show='operaWay === "container"'
    class='module_source_wrap'
  >
    <div
      class='choice_wrap'
      v-p-loading="moduleLoading"
      element-loading-text="数据加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="--bg-color-4"
    >
      <div class='common module_list'>
        <el-tree
          class="filter-tree el-tree-addordel"
          :data="moduleTreeData"
          show-checkbox
          highlight-current
          :check-on-click-node="true"
          node-key="id"
          default-expand-all
          :props="treeProps"
          ref="tree"
          @check='handleCheck'
        >
        <span class="custom-tree-node" slot-scope="{ node }">
          <EllipsisPop class="em-tree-text" :content="node.label"></EllipsisPop>
        </span>
        </el-tree>

      </div>
      <div class='choice common'>
        <div class='tip'>已选</div>
        <div v-show='moduleData.id' class='choice_tag'>
          <div class='value'>{{ moduleData.containerName || '' }}</div>
          <i class='iconfont icon-xiangqingguanbi' @click='cancelModule'></i>
        </div>
      </div>
    </div>
  </div>
  <div class='floor'>
    <div class='blank_button' @click='closeDialog'>取消</div>
    <el-button type="primary" @click='submit'>确定</el-button>
  </div>
</div>
</template>

<script>
import EllipsisPop from '@/components/VisualComponents/EllipsisPop'
import {
  setModuleSourceApi,
  uploadFileApi,
  getAppPagesModulesApi
} from '@/api/analysisJudgment'
import { toPinYin } from './config.js'

export default {
  name: 'EditSource',
  components: {
    EllipsisPop
  },
  inject: ['closeDialog', 'editModuleInfo', 'successOpera'],
  props: {
    // 可选的数据源
    sourceList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      moduleLoading: false,
      // sourceName: '', // 搜索数据源绑定的值
      choiceData: {}, // 系统数据源时选中的数据
      moduleData: {}, // 容器数据时选中的数据
      operaWay: 'system', // 当前显示添加数据源的方式
      uploadFileInfo: {
        url: '',
        name: '',
        tableName: ''
      }, // 上传csv文件的路径
      treeProps: {
        children: 'children',
        label: 'label'
      },
      moduleTreeData: []
      /*moduleTreeData: [
        {
          "id": 3,
          "appId": 3,
          "pageName": "应用-小小",
          "label": "应用-小小",
          "homePageFlag": true,
          "disabled": true,
          "children": [
            {
              "id": 767,
              "appId": 3,
              "pageId": 3,
              "containerName": "模块1",
              "label": "模块1",
              "containerCoordinate": "0,0,4,4",
              "operatorFlag": true,
              "maxRecordId": 2623,
              "refreshFlag": false,
              "runningFlag": false,
              "disabled": false,
            },
            {
              "id": 783,
              "appId": 3,
              "pageId": 3,
              "containerName": "模块2",
              "label": "模块2",
              "containerCoordinate": "0,4,4,4",
              "operatorFlag": true,
              "maxRecordId": 2809,
              "refreshFlag": true,
              "runningFlag": false,
              "disabled": false,
            }
          ]
        },
        {
          "id": 142,
          "appId": 3,
          "pageName": "应用-小小2",
          "label": "应用-小小2",
          "homePageFlag": false,
          "disabled": true,
        },
        {
          "id": 465,
          "appId": 3,
          "pageName": "应用-小小3",
          "label": "应用-小小3",
          "homePageFlag": false,
          "disabled": true,
          "children": [
            {
              "id": 978,
              "appId": 3,
              "pageId": 465,
              "containerName": "模块1",
              "label": "模块1",
              "containerCoordinate": "0,0,4,4",
              "operatorFlag": true,
              "maxRecordId": 3165,
              "refreshFlag": false,
              "runningFlag": false,
              "disabled": false,
            }
          ]
        }
      ]*/
    }
  },
  computed: {
    currentAppId () {
      return this.$route.query.appId
    }
  },
  watch: {
    operaWay: {
      handler (newVal) {
        if (newVal === 'container' && !this.moduleTreeData.length) {
          this.moduleLoading = true
          this.getAppPagesModule()
        }
      }
    }
  },
  methods: {
    // 当为容器数据时，容器选择时
    handleCheck (item, check) {
      if (check.checkedKeys.length) {
        const algorithmType = ['decision_tree','random_forest']
        if (item.algorithmFlag && algorithmType.includes(item.algorithmType)) {
          this.$message.warning('不支持关联涉及复杂算法模块')
          if (this.moduleData.id) {
            this.$refs.tree.setCheckedKeys([this.moduleData.id])
          } else {
            this.$refs.tree.setCheckedKeys([])
            this.moduleData = {}
          }
          return
        }
        this.$refs.tree.setCheckedKeys([item.id])
        this.moduleData = item
      } else {
        this.moduleData = {}
      }
    },
    // 容器数据已选数据取消选择时
    cancelModule () {
      this.moduleData = {}
      this.$refs.tree.setCheckedKeys([])
    },
    // 获取容器数据
    getAppPagesModule () {
      getAppPagesModulesApi({
        appId: this.currentAppId
      }).then(res => {
        let result = res || []
        result.forEach(item => {
          item.id = `page_${item.id}`
          item.disabled = true
          item.label = item.pageName
          item.children = Array.isArray(item.children) ? item.children : []
          item.children.forEach(module => {
            module.label = module.containerName
            if (module.errorFlag || !module.operatorFlag || module.id === +this.editModuleInfo.i) {
              module.disabled = true
            }
          })
        })
        this.moduleTreeData = result
      }).finally(() => {
        this.moduleLoading = false
      })
    },

    // 搜索数据源
    // searchClick () {},
    // 选中数据源
    choiceSource (item) {
      this.choiceData = item
    },
    delChoice () {
      this.choiceData = {}
    },
    // 文件上传前
    beforeUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isLt10M
    },
    // 上传文件调用接口
    uploadRequest (file) {
      const type = file.file.type === 'text/csv' ? 'csv' : 'setting'
      let uploadFile = new FormData()
      uploadFile.append('multipartFile', file.file)
      uploadFile.append('type', type)
      uploadFileApi(uploadFile).then(res => {
        this.uploadFileInfo.url = res || ''
        this.uploadFileInfo.name = file.file.name
        this.uploadFileInfo.tableName = file.file.name.split('.')[0].slice(0, 7)
      })
    },
    // 文件上传失败
    unError (fileList) {
      this.$message.error(fileList[0].msg)
    },
    submit () {
      if (this.operaWay === 'csv') {
        if (!this.uploadFileInfo.url) {
          this.$message.error('请上传csv数据源！')
          return
        }
        if (!this.uploadFileInfo.name) {
          this.$message.error('请填写表名！')
          return
        }
      } else if (this.operaWay === 'system') {
        if (!this.choiceData.tableName || !this.choiceData.srcNameEn) {
          this.$message.error('请选择系统数据源！')
          return
        }
      } else if (this.operaWay === 'container') {
        if (!this.moduleData.id || !this.moduleData.containerName) {
          this.$message.error('请选择模块数据源！')
          return
        }
      } else {
        return
      }
      let params = null
      if (this.operaWay === 'csv') {
        params = {
          containerId: +this.editModuleInfo.i,
          csvUrl: this.uploadFileInfo.url,
          database: 'csv',
          tableNameCn: this.uploadFileInfo.tableName,
          tableName: toPinYin(this.uploadFileInfo.tableName)
        }
      } else if (this.operaWay === 'system') {
        params = {
          containerId: +this.editModuleInfo.i,
          database: 'kudu',
          tableName: this.choiceData.tableName,
          srcNameEn: this.choiceData.srcNameEn
        }
      } else if (this.operaWay === 'container') {
        params = {
          containerId: +this.editModuleInfo.i,
          database: 'container',
          tableName: this.moduleData.id,
          tableNameCn: this.moduleData.containerName
        }
      }
      setModuleSourceApi(params).then(() => {
        this.$message.success('添加数据源成功！')
        this.successOpera()
      })
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.edit_source_wrap {
  width: 100%;
  .up_way_wrap {
    display: flex;
    position: relative;
    top: -8px;
    margin-bottom: 8px;
    .way_item {
      font-size: 16px;
      line-height: 21px;
      color: var(--base-text-color-2);
      white-space: nowrap;
      padding: 0 20px 8px;
      border-bottom: 1px solid var(--border-color-2);
      &.active {
        color: var(--active-color);
        border-bottom-color: var(--active-color);
      }
    }
  }
  .module_source_wrap {
    width: 100%;
    .choice_wrap {
      display: flex;
      width: 100%;
    }
    .module_list {
      margin-right: 16px;
      /deep/.el-tree {
        height: calc(100% - 32px);
        margin-top: 16px;
        overflow-y: auto;
        .el-tree__empty-text {
          color: var(--base-text-color-to-666666);
        }
      }
    }
  }
  .source_wrap {
    display: flex;
    width: 100%;
    .source {
      margin-right: 16px;
      /deep/.el-input {
        width: calc(100% - 48px);
        margin: 14px 24px 0;
        .el-input__inner {
          height: 26px;
          line-height: 26px;
          font-size: 14px;
          border: 0;
          border-bottom: 1px solid;
          border-color: var(--border-color-input);
          &::placeholder {
            font-size: 14px;
          }
          &:hover {
            border-color: var(--border-color-input-hover);
          }
        }
        .icon-sousuo {
          font-size: 14px;
          line-height: 26px;
          color: var(--base-text-color-to-666666);
          cursor: pointer;
        }
      }
      .list {
        height: calc(100% - 32px);
        margin-top: 16px;
        overflow-y: auto;
        .source_item {
          width: 100%;
          font-size: 14px;
          line-height: 32px;
          color: var(--base-text-color-1);
          padding: 0 24px;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            background: var(--record-library-tree);
          }
          &.is_choice {
            background: var(--record-library-tree);
          }
        }
      }
    }
  }
  .common {
    flex: 1;
    height: 610px;
    background: var(--bg-color-2);
  }
  .choice {
    .tip {
      padding: 0 24px;
      font-size: 14px;
      line-height: 40px;
      color: var(--base-text-color-1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .choice_tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px 0 24px;
      font-size: 14px;
      line-height: 32px;
      color: var(--base-text-color-1);
      background: var(--record-library-tree);
      margin-bottom: 1px;
      margin-top: 8px;
      i {
        font-size: 16px;
        cursor: pointer;
        color: var(--button-plain-border-color);
        &:hover {
          color: var(--active-color);
        }
      }
    }
  }
  .upload_wrap {
    width: 650px;
    height: 368px;
    background: var(--app-upload-bg);
    border: 1px dashed var(--app-upload-border);
    border-radius: 8px;
  }
  .upload_window {
    width: 100%;
    height: 100%;
    /deep/.el-upload {
      width: 100%;
      height: 100%;
    }
    /deep/.el-upload-dragger {
      height: 368px;
      border-color: rgba(61, 110, 255, 0.56);
      border-radius: 0;
    }
    .upload_tip {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .upload_text {
      display: flex;
      font-size: 18px;
      line-height: 24px;
      color: var(--active-color);
      margin-bottom: 16px;
      div {
        color: var(--active-color);
        margin-right: 6px;
      }
    }
    .text_tip {
      font-size: 14px;
      line-height: 19px;
      color: var(--base-text-color-to-666666);
    }
  }
  .upload_result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .file_info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: calc(100% - 32px);
      .file_type {
        position: relative;
        margin-bottom: 8px;
        img {
          width: 80px;
          height: 80px;
        }
        &::after {
          display: block;
          content: 'CSV';
          position: absolute;
          top: 34px;
          left: 14px;
          width: 36px;
          height: 21px;
          font-size: 14px;
          line-height: 21px;
          white-space: nowrap;
          text-align: center;
          color: var(--base-text-color-2);
          border-radius: 2px;
          background: #FFFFFF;
        }
      }
      .file_name {
        text-align: center;
        font-size: 14px;
        line-height: 19px;
        color: var(--base-text-color-to-666666);
      }
    }
    .upload_data_name {
      display: flex;
      margin-top: 32px;
      .label {
        font-size: 18px;
        line-height: 32px;
        margin-top: 6px;
        color: var(--base-text-color-1);
      }
      /deep/.el-input {
        width: 240px;
        .el-input__inner {
          font-size: 18px;
          border-width: 0;
          border-bottom-width: 1px;
          padding: 0;
        }
      }
    }
  }
  .floor {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    .blank_button {
      margin-right: 16px;
    }
  }
}
/deep/.el-tree {
  padding: 0 18px;
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
/deep/.el-tree .el-tree-node.is-current > .el-tree-node__content,
/deep/.el-tree .el-tree-node__content:hover {
  background: transparent;
}
/deep/.el-tree .el-tree-node__content {
  height: auto;
  min-height: 32px;
}
/deep/.el-tree .el-tree-node__children {
  .el-tree-node__content .el-checkbox.is-disabled {
    display: inline-block;
    .el-checkbox__inner {
      display: inline-block;
      background: transparent;
    }
  }
}
</style>
