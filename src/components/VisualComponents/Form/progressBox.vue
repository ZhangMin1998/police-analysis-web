<template>
  <div>
    <div class="pop">
      <el-dialog
        :append-to-body="true"
        :visible="show"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :show-close="false"
        width="550px"
        top="33vh"
      >
        <span slot="title" class="dialog-title">
          <div class="rule-content">
            <list-title :title="title" />
          </div>
        </span>
        <div :style="{ height: height }">
          <LoadingProgressPanel
            @cancelLoading="closeProgress"
            :hasCancel="sonHasCancel"
          >
            <template v-if="addJob" v-slot:addJobBtn>
              <span
                class="p-button"
                style="padding:9px 20px;"
                @click="handleAddJob"
                >加入任务</span
              >
            </template>
          </LoadingProgressPanel>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import LoadingProgressPanel from '@/components/VisualComponents/Form/loadingModel'
export default {
  components: {
    LoadingProgressPanel
  },
  props: {
    addJob: {
      type: Boolean,
      default: false
    },
    sonHasCancel: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '数据搜索中...'
    },
    height: {
      type: String,
      default: '120px'
    }
  },

  watch: {
    show (newValue) {
      if (newValue) {
        this.bus.$emit('restetPercentage')
      }
    }
  },

  methods: {
    /**
     * 关闭进度条 弹窗
     */
    closeProgress () {
      this.$emit('beforeClose')
    },

    // 加入任务
    handleAddJob () {
      this.$emit('handleAddJob')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog {
  // background: #232A43;
  background: var(--bg-color-4);
  margin-left: 36% !important;
  padding: 0 !important;
}
</style>
