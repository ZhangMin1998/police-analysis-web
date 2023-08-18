<template>
  <div class="export_con">
    <div class="lable">
      <div class="classify">
        <div
          :class="`classifyItem ${curClassifyIdx == idx ? 'choosed' : ''} `"
          v-for="(item, idx) in exportList"
          :key="idx"
          @click="selectClassify(item, idx)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="upload">
      <el-upload
        class="upload-demo"
        drag
        :headers="{ token: token }"
        :action="uploadUrl"
        :auto-upload="true"
        :data="params"
        :on-success="(response, file, fileList) => onSuccess(response, file, fileList)"
        :on-error="onError"
        :show-file-list="true"
        :before-upload="beforeUpload"
        accept=".xls,.xlsx"
      >
        <i class="el-icon-document"></i>
        <div class="el-upload__text">
          <div class="title">
            将文件拖到此处，或
            <el-link type="primary" class="download">点击上传</el-link>
          </div>
          <div class="tip">
            只能上传.xls/.xlsx 文件且不超过2M
            <el-link type="primary" class="download" @click.prevent.stop="download"
              >模板下载</el-link
            >
          </div>
        </div>
      </el-upload>
      <ProgressBox @beforeClose="closeProgressBox" :show="isExporting" :sonHasCancel="false" />
    </div>
  </div>
</template>

<script>
import ProgressBox from './components/Progress'
import { mapState, mapMutations } from 'vuex'
const exportList = [
  {
    name: '重点人员',
    prop: 'SUSPECTS_PERSON_EXCEL',
  },
  {
    name: '监所拘留所人员',
    prop: 'DETENTION_PERSON_EXCEL',
  },
  {
    name: '禁毒系统吸毒人员',
    prop: 'DRUG_ADDICT_PERSON_EXCEL',
  },
  {
    name: '旅业',
    prop: 'TRAVEL_EXCEL',
  },
  {
    name: '网吧',
    prop: 'NET_BAR_TXT',
  },
  // {
  //   name: '车辆数据',
  //   prop: 'car',
  // },
  {
    name: '悠美肇庆',
    prop: 'YOUMEIZHAOQING_EXCEL',
  },
]
export default {
  components: {
    ProgressBox,
  },

  data () {
    return {
      token: localStorage.getItem('token'),
      uploadUrl: '/police/excel/import/excel',
      exportList: exportList,
      curClassifyIdx: 0,
      params: {
        fileType: 'SUSPECTS_PERSON_EXCEL',
      },
    }
  },

  computed: {
    ...mapState('SystemSetting', {
      isExporting: 'isExporting',
      exportingNum: 'exportingNum',
      curExportState: 'curExportState',
    }),
  },

  created () {
    if (this.isExporting) {
      this.curClassifyIdx = this.curExportState
      setTimeout(() => {
        this.bus.$emit('conPercentage', this.exportingNum)
      }, 10)
    }
  },

  beforeDestroy () {
    if (this.isExporting) {
      this.set_curExportState(this.curClassifyIdx)
    }
  },

  methods: {
    ...mapMutations('SystemSetting', {
      set_isExporting: 'set_isExporting',
      set_exportingNum: 'set_exportingNum',
      set_curExportState: 'set_curExportState',
    }),

    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$messageTip.error('上传文件大小不能超过 2MB!')
        return false
      }

      this.set_isExporting(true)
    },

    /** 关闭 搜索进度框  */
    closeProgressBox () {},

    /** 选择 导入类型  */
    selectClassify (item, index) {
      this.curClassifyIdx = index
      this.params.fileType = item.prop
    },

    resetExportState () {
      this.set_exportingNum(0)
      this.set_isExporting(false)
    },

    /** 导入 成功  */
    onSuccess (response, file, fileList) {
      if (response.code == '1') {
        if (fileList.length > 0) {
          fileList.pop()
        }
        this.resetExportState()
        this.$messageTip.success('上传成功！')
        fileList.push(file)
      } else {
        if (fileList.length) {
          fileList.pop()
        }
        this.resetExportState()
        this.$messageTip.success(response.msg)
      }
    },
    onError (e) {
      this.resetExportState()
      console.log('失败', e)
      this.$messageTip.error(e.msg)
    },
    download () {
      window.location.href = `/${this.params.fileType}.xlsx`
      return false
    },
  },
}
</script>

<style lang="less" scoped>
.export_con {
  display: flex;
  flex-direction: column;
  padding-top: 23vh;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // padding-right: 6.5%;

  .lable {
    width: 60vw;
    // min-width: 600px;
    max-width: 802px;
    overflow: auto;
    min-height: 40px;
  }
}

/* lable分类 */
.classify {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 802px;
  margin-bottom: 24px;
  box-sizing: border-box;
  .classifyItem {
    cursor: pointer;
    padding: 10px 16px;
    color: var(--base-text-color-to-999999);
    font-size: 14px;
    border: 1px solid #42506a;
    background-color: transparent;
    &.choosed {
      color: var(--base-text-color-1);
      background-color: #42506a;
    }
  }
}
.upload {
  width: 60vw;
  max-width: 802px;
  // min-width: 600px;
  height: 192px;
}
</style>
