<template>
  <div class="importantMap">
    <div class="police-site">
      <div class="police-btn" @click="selectSite">
        <div style="padding-top: 3px; margin-right: 15px;">
          <img src="@/assets/img/icon-circle-plus.png" alt="" />
        </div>
        <div>
          <span>选择位置</span>
        </div>
      </div>
    </div>
    <div v-if="dialogVisible">
      <el-dialog
        custom-class="p-dialog"
        append-to-body
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="86%"
        top="13vh"
        :close-on-click-modal="true"
      >
        <component :is="curMap" ref="siteAmap" @hideAmap="hideAmap" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import siteAmap from '@/views/online/devicemap/deviceList/siteAmap'
import offlineSite from '@/views/offline/devicemap/siteMap.vue'
const { _isOl } = require('@/config/user.js')
export default {
  components: {
    siteAmap,
    offlineSite
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      dialogVisible: false,
      curMap: null,  // 当前地图显示
    }
  },

  methods: {
    setMap () {
      if (_isOl()) {
        this.curMap = siteAmap
      } else {
        this.curMap = offlineSite
      }
    },
    selectSite () {
      this.dialogVisible = true
    },
    hideAmap () {
      this.dialogVisible = false
    },
    handleClose () {
      this.$nextTick(() => {
        this.$refs.siteAmap && this.$refs.siteAmap.delSite()
        this.dialogVisible = false
      })
    },
  },
  mounted () {
    this.setMap()
  }
}
</script>

<style scoped>
.police-site {
  display: flex;
  align-items: center;
}

.police-btn {
  display: flex;
  align-items: center;
  margin-right: 40px;
  cursor: pointer;
  color: #177ddc;
  width: 120px;
  justify-content: flex-start;
}
</style>
