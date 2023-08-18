<template>
  <div class="importantMap">
    <div class="police-site">
      <div class="police-btn" @click="addPoliceSite">
        <div style="padding-top: 3px;">
          <img src="@/assets/img/icon-circle-plus.png" alt="" />
        </div>
        <div>
          <span>添加场所</span>
        </div>
      </div>
      <div>
        <span class="police-attention">
          <i class="el-icon-warning-outline"></i>
          如果不添加系统默认所有场景
        </span>
      </div>
    </div>

    <el-dialog
      custom-class="p-dialog"
      append-to-body
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="86%"
      top="8vh"
      :close-on-click-modal="false"
    >
      <site-amap v-if="dialogVisible" />
      <span slot="footer" class="dialog-footer">
        <p-button class="" @click="handleClose">取 消</p-button>
        <p-button class="" @click="confirmSelected">确 定</p-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import siteAmap from '_off/warn/MapWarn/site'
import PButton from '@/components/BasicComponents/Button/index'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    PButton,
    siteAmap,
  },
  data () {
    return {
      dialogVisible: false,
      defaultSelectedMarkersArr: [], // 默认
    }
  },
  computed: {
    ...mapState('Map', {
      roomListData: 'roomListData',
    }),
    ...mapGetters('Map', {
      activedRoomData: 'activedRoomData',
    }),
  },
  methods: {
    ...mapMutations('Map', {
      changeRoomList: 'changeRoomList',
    }),
    addPoliceSite () {
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
      // 取消之前选中的
      this.$nextTick(() => {
        this.changeRoomList(this.defaultSelectedMarkersArr)
      })
    },
    confirmSelected () {
      // 如果对象不为空，说明有选择场所
      const selectedSite = this.activedRoomData
      // 更新初始状态
      this.defaultSelectedMarkersArr = this.activedRoomData.map((_c, i) => i)
      if (Object.keys(selectedSite).length > 0) {
        this.$emit('addSite', selectedSite)
      }
      this.dialogVisible = false
      this.$nextTick(() => {
        this.changeRoomList(this.defaultSelectedMarkersArr)
      })
    },
    /**
     * 加载默认选中的 （编辑状态下有用）
     */
    loadDefaultSeleced () {
      this.defaultSelectedMarkersArr = this.activedRoomData.map((_c) => _c)
    },
    // markerClick({ isActive, curId }) {},
  },
  mounted () {
    this.loadDefaultSeleced()
  },
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
  width: 80px;
  justify-content: space-between;
}

.police-attention {
  color: var(--base-text-color-to-999999);
  font-size: 14px;
  user-select: none;
}

/deep/.el-dialog {
  height: calc(100vh - 200px);
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
</style>
