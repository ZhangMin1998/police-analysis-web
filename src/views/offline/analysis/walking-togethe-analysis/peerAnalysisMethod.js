import Drawer from '@/components/BasicComponents/Drawer/newIndex'
import Steps from '@/views/common/warn/components/Steps'
import AnalysisForm from '@/views/offline/analysis/components/AnalysisForm'
import RoundTimeline from '@/views/offline/analysis/components/RoundTimeline'
import AnalysisResult from '@/views/offline/analysis/walking-togethe-analysis/analysisResultTable'
import ProgressBox from '@/components/VisualComponents/Form/progressBox'
import { addJob } from '@/api/taskManagement'
import TabsMapWithList from '@/components/VisualComponents/TabsMapWithList'
import ListPages from './components/ListPages'
import { mapMutations } from 'vuex'


const iconMiniData = [
  { type: 'wifi', text: '轨迹点', url: 'icon-route-by.png' },
  { type: 'wifi', text: '最早出现时间', url: 'icon-route-start.png' },
  { type: 'wifi', text: '最后出现时间', url: 'icon-route-end.png' }
]
// const columns = [
//   { label: '时间', prop: 'captureTime', minWidth: '13.06%' },
//   { label: '地址', prop: 'captureTime', minWidth: '13.06%' },
//   { label: '经纬度', prop: 'name', minWidth: '9.1%' },
// ]
export default {
  components: {
    Steps,
    Drawer,
    AnalysisForm,
    RoundTimeline,
    AnalysisResult,
    ProgressBox,
    TabsMapWithList,
    // TableGrid
    ListPages
  },
  data () {
    return {
      iconMiniData: Object.freeze(iconMiniData),
      drawer: {
        isShow: true
      },
      isSubmiting: false, // 分析按钮状态
      stepList: [
        {
          title: '分析条件',
          isChecked: true,
          isCanExpend: true
        },
        {
          title: '分析结果',
          isChecked: false,
          isCanExpend: false
        }
      ],
      fd: null,
      dashTracksList: [],
      tracksList: [],
      tableParams: {
        page_size: 200
      },
      activeName: 'map',
      // columns:columns,
      tableData: [],
      imgWidth: ''
    }
  },
  created () {
    if (this.$route.query.id) { // 如果是从任务管理进入同行分析
      this.handleExpend(1)
      // this.stepList[0].isCanExpend = false
    }
  },
  mounted (){
    this.imgWidth = document.getElementsByClassName('drawerBoxOpen')[0].offsetWidth + 'px'
  },

  methods: {
    ...mapMutations('DataCenter', {
      setJobPanelShow: 'setJobPanelShow'
    }),
    getTableData (tableData) {
      this.tableData = tableData
    },
    // 切换地图页或者列表页
    clickTab (val) {
      this.activeName = val
      // if (this.tableParams?.attrs?.length) {
      //   if (val === 'list') {
      //     this.isSubmiting = true
      //     this.tableParams.page_size = 5000
      //   } else {
      //     this.isSubmiting = true
      //     this.tableParams.page_size = 11
      //   }
      // }

    },
    toggleMainTrackList (list) {
      this.tracksList = list
    },
    toggleDashTrackList (list) {
      this.dashTracksList = list
    },
    // 展开消息面板
    DrawerHandleClick () {
      this.drawer.isShow = !this.drawer.isShow
    },

    // 展开步骤
    handleExpend (index) {
      // console.log(index,'成功后触发了这里');
      this.stepList.forEach((element) => {
        element.isChecked = false
      })
      this.stepList[index].isChecked = true
      this.stepList[index].isCanExpend = true
      // console.log('是因为第一次有了结果之后执行了这里，导致了handleExpend吧isSubmiting改为了false,导致了后面进去之后isSubmiting为false,this.isCancel为true，所以在遇到很长时间的任务的时候，会只轮询一次');
      // this.isSubmiting = false
    },

    // 获取data
    submitForm () {
      this.$nextTick(() => {
        // console.log(11111111111,'提交');
        // 校验成功调用handleReq方法 发送请求
        this.$refs.AnalysisForm.formatParams()
      })
    },

    // 加入任务
    handleAddJob () {
      const params = {
        user_id: localStorage.getItem('personId'),
        search_type: 'task_follow_type',
        search_items: { ... this.tableParams }
      }

      addJob(params).then(() => {
        this.setJobPanelShow(true)
      }).finally(() => {
        // console.log('handleAddJob');
        this.tableData = []
        this.isSubmiting = false
      })
    },

    // 发送请求 分析
    handleReq (fd = this.fd, attrList = []) {
      console.log('fd', fd)
      this.$nextTick(() => {
        // console.log('是因为执行了这里handleReq');
        console.log(attrList)
        this.isSubmiting = true
        const start_time = this.$refs.AnalysisForm.params.startTime
        const end_time = this.$refs.AnalysisForm.params.endTime
        const list = attrList.map(ele => {
          return {
            attr_type: ele.type || ele.cerType,
            attr: ele.data || ele.cerNumber
          }
        })

        // 参数传递给表格
        this.tableParams = {
          start_time, end_time, page_num: 1, page_size: 200, attrs: [...list]
        }
        // console.log('tableParams', this.tableParams)
      })

    },
  }
}
