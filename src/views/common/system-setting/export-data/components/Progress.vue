<template>
  <div>
    <div class="pop">
      <el-dialog
        :append-to-body="false"
        :visible="show"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :show-close="false"
        width="550px"
        top="250px"
      >
        <span slot="title" class="dialog-title">
          <div class="rule-content">
            <list-title :title="title" />
          </div>
        </span>
        <div style="height:120px;">
          <LoadingProgressPanel @cancelLoading="closeProgress" :hasCancel="sonHasCancel" />
        </div>
      </el-dialog>
    </div>
    <!-- <div class="upload-list">
      <div class="upload-item">
        <div class="upload-item-text">
          <div><i class="el-icon-document"> </i>food.jpeg</div>
        </div>
        <el-progress
          :percentage="percentage"
          :stroke-width="3"
          :color="customColor"
          status="success"
        ></el-progress>
      </div>
    </div> -->
  </div>
</template>

<script>
import LoadingProgressPanel from '@/components/VisualComponents/Form/loadingModel'
export default {
  components: {
    LoadingProgressPanel,
  },

  props: {
    sonHasCancel: {
      type: Boolean,
      default: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '数据上传中...',
    },
  },

  data () {
    return {
      customColor: '#409eff',
      percentage: 100,
    }
  },

  watch: {
    show (newValue) {
      if (newValue) {
        this.bus.$emit('restetPercentage')
      }
    },
  },

  methods: {
    /**
     * 关闭进度条 弹窗
     */
    closeProgress () {
      this.$emit('beforeClose')
    },

    increase () {
      this.percentage += 1
      if (this.percentage > 100) {
        this.percentage = 100
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/.el-dialog {
  padding: 0 !important;
}
.pop /deep/.v-modal {
  left: 160px !important;
  top: 102px !important;
}

.el-dialog__wrapper {
  left: 160px !important;
  top: 102px !important;
}
.upload-list {
  .upload-item {
    padding: 8px 0;
    &:hover {
      color: #66b1ff !important;
      background-color: rgba(255, 255, 255, 0.08);
    }
    &:hover div {
      color: #66b1ff !important;
    }
    .upload-item-text {
      font-size: 14px;
      color: var(--base-text-color-to-999999);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 10px;
    }
    .el-icon-document {
      margin-right: 8px;
    }
  }
}
</style>
