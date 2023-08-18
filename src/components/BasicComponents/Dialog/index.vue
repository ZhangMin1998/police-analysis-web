<template>
  <div id="PopTem">
    <div v-if="pop.show" :class="customClass ? customClass : styleClass">
      <el-dialog
        :visible="pop.show"
        :close-on-click-modal="false"
        @close="beforeClose"
        :modal-append-to-body="false"
        :width="pop.width"
        :top="pop.top"
        :style="{ height: pop.height || '' }"
        :custom-class="pop.class || ''"
      >
        <!-- <span slot="title" class="dialog-title">
          <div class="rule-content">
            <list-title :title="pop.title" :class='{"export_dialog": exportDialog}'/>
          </div>
        </span> -->
        <div slot="title" class="title-box">
          <div class='set'>
            <img :src='require("@/assets/img/set-bg.png")' alt=''>
            <div>{{pop.title}}</div>
          </div>
          <!-- <i class="el-icon-close" @click="close" title="关闭"></i> -->
        </div>
        <slot></slot>

        <div class="btns-r" v-if="pop.btn && pop.btn.length > 0">
          <slot name='btn'>
            <div
              :class="[
              i.type == 'nor' ? 'p-button' : 'p-button-blue',
              { loading: i.loading }
            ]"
              v-for="i in pop.btn"
              :key="i.text"
              @click="i.event(i.loading)"
            >
              {{ i.loading ? '提交中...' : i.text }}
            </div>
          </slot>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    pop: {
      type: Object,
      default: function () {
        return { show: false, title: '原始数据', width: '980px', top: '18vh' }
      }
    },
    customClass: {
      type: String
    },
    exportDialog: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight'
    }),
    styleClass () {
      return this.screenHeight > 936 ? 'addFeature' : 'pop'
    }
  },
  methods: {
    beforeClose () {
      this.$emit('beforeClose')
    },
    beforeOpen () {
      this.$emit('beforeOpen')
    }
  }
}
</script>

<style lang="less" scoped>
// .PopTem{
  // position: relative;
// }
.title-box{
  // position: absolute;
  // width: 96%;
  // top: 20px;
  // left: 21px;
  padding: 0 0 12px 0;
  margin: 0 0 24px 0;
  border-bottom: 1px solid var(--active-color);
  .set {
    position: relative;
    height: 24px;
    width: 100px;
    line-height: 24px;
    font-size: 18px;
    color: var(--base-text-color-1);
    font-weight: bold;
    div {
      width: max-content;
      position: absolute;
      bottom: 0;
      margin-left: 10px;
    }
    img {
      width: 65px;
      height: 8px;
      margin-top: 16px;
    }
  }
}
.btns-r {
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
  & > div {
    margin-right: 16px;
  }
  & > div:last-child {
    margin-right: 0px;
  }
}

.loading {
  cursor: not-allowed;
  background-color: rgba(255, 255, 255, 0.3);
}
.export_dialog {
  background: url('~@/assets/img/device-list-title-bg-2.png') no-repeat !important;
}
</style>
