import Vue from 'vue'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import {
  Loading,
  // MessageBox,
  Notification,
  Message,
  Input,
  Select,
  Option,
  Icon,
  Container,
  Header,
  Button,
  Main,
  Image,
  Popover,
  Radio,
  RadioGroup,
  Pagination,
  Form,
  Upload,
  Table,
  TableColumn,
  FormItem,
  Dialog,
  Tooltip,
  Badge,
  DatePicker,
  Collapse,
  CollapseItem,
  Footer,
  Aside,
  Tabs,
  TabPane,
  Timeline,
  TimelineItem,
  Checkbox,
  CheckboxGroup,
  Row,
  Col,
  Autocomplete,
  Avatar,
  Drawer,
  Descriptions,
  DescriptionsItem,
  Divider,
  InputNumber,
  Link,
  Progress,
  Switch,
  Step,
  Steps,
  TimePicker,
  Transfer,
  Tree,
  Tag,
  Cascader
} from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Loading.directive)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Icon)
Vue.use(Container)
Vue.use(Header)
Vue.use(Button)
Vue.use(Main)
Vue.use(Image)
Vue.use(Popover)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Tooltip)
Vue.use(Badge)
Vue.use(DatePicker)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Footer)
Vue.use(Aside)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Row)
Vue.use(Col)
Vue.use(Autocomplete)
Vue.use(Avatar)
Vue.use(Drawer)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Divider)
Vue.use(InputNumber)
Vue.use(Link)
Vue.use(Progress)
Vue.use(Switch)
Vue.use(Step)
Vue.use(Steps)
Vue.use(TimePicker)
Vue.use(Transfer)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Cascader)

Vue.component(CollapseTransition.name, CollapseTransition)
// Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification
// Vue.prototype.$loading = Loading.service
Vue.prototype.$message = Message
