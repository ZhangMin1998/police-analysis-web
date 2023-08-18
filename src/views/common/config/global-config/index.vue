<template>
  <div>
    <template v-if="isAdmin">
      <div class="config-wrapper">
        <list-title title="全局配置" style="margin-bottom: 10px;"></list-title>
        <!-- 不可变 -->

        <!-- 可变 -->
        <el-form :model="formParams" label-width="150px">
          <!-- <el-form-item label="保密加密：">
            <el-switch
              v-model="formParams.isEncrypt"
              active-text="加密"
              inactive-text="不加密">
            </el-switch>
          </el-form-item> -->
          <el-form-item label="是否在线：">
            <el-switch v-model="formParams.isOl" active-text="在线" inactive-text="离线">
            </el-switch>
          </el-form-item>
          <el-form-item label="导航栏标题：">
            <el-input v-model="formParams.title" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="地图中心坐标：">
            <el-row>
              <el-col :span="5">
                <el-input v-model="formParams.longitude" placeholder="经度"></el-input>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-input v-model="formParams.latitude" placeholder="纬度"></el-input>
              </el-col>
              <el-col :span="1">
                <el-popover style="margin-left:20px;" popper-class="config-popper" placement="right" title="经纬度参考"
                  width="200" trigger="hover" :content="infoContent">
                  <!-- <el-button slot="reference">focus 激活</el-button> -->
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="搜索范围城市：">
            <el-select v-model="formParams.searchCity">
              <el-option v-for="(item, index) in cityList" :label="item.label" :value="item.label" :key="index">
              </el-option>
            </el-select>
            <!-- <el-popover
              popper-class="config-popper"
              placement="right"
              title="温馨提醒"
              width="200"
              trigger="hover"
              content="此选项仅在在线模式生效">
              <i style="margin-left:20px;" class="el-icon-question" slot="reference"></i>
            </el-popover> -->
          </el-form-item>
          <!-- <el-form-item label="下拉菜单：">
            <el-checkbox-group v-model="formParams.optList">
              <el-checkbox
                v-for="(item, idx) in extrTypeList"
                :key="idx"
                :label="item.typeCode">
                {{ item.typeName }}
                </el-checkbox>
            </el-checkbox-group>
          </el-form-item> -->
          <el-form-item label="地图默认缩放级别：">
            <el-input-number :min="formParams.mapMiniZoom" :max="formParams.mapMaxZoom" v-model="formParams.mapZoom"
              label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="地图最小缩放级别：">
            <el-input-number :min="8" :max="formParams.mapMaxZoom" v-model="formParams.mapMiniZoom"
              label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="地图最大缩放级别：">
            <el-input-number :min="formParams.mapMiniZoom" :max="20" v-model="formParams.mapMaxZoom"
              label="描述文字"></el-input-number>
          </el-form-item>
          <!-- <el-form-item label="坐标系：">
            <el-radio-group v-model="formParams.cooSystem">
              <el-radio
                v-for="(item, idx) in posTransform"
                :key="idx"
                :disabled="true"
                :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="阶段类型：">
            <el-select v-model="formParams.statStage">
              <el-option v-for="(item, index) in dataTypeList" :label="item.dec" :value="item.stage" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据管理是否可编辑：">
            <el-select v-model="formParams.dataManageIsEdit">
              <el-option v-for="(item, index) in IsEditList" :label="item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签库是否可编辑：">
            <el-select v-model="formParams.dataManageTagIsEdit">
              <el-option v-for="(item, index) in IsEditList" :label="item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否进行模糊搜索：">
            <el-select v-model="formParams.fuzzySearch">
              <el-option v-for="(item, index) in SearchList" :label="item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="python接口：">
            <el-input v-model="formParams.pyUrl" style="width: 400px;"></el-input>
          </el-form-item>            -->
          <el-form-item label="登陆页版本：">
            <el-select v-model="formParams.loginVersion">
              <el-option v-for="(item, index) in versionList" :label="item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登陆页标题：">
            <el-input v-model="formParams.loginTitle" maxlength="11" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="登陆页城市：">
            <el-input v-model="formParams.loginCity" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item label="地图版本：">
            <el-select v-model="formParams.loginMap">
              <el-option v-for="(item, index) in mapList" :label="item.label" :value="item.value" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地图底图URL：">
            <el-input v-model="formParams.rongChengMapUrl" style="width: 300px;"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="form-btn p-button-blue" style="margin-right:16px;" @click="onSubmit">确 定</div>
            <div class="form-btn p-button" @click="onReset">重 置</div>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template v-else>
      <NotPermission />
    </template>
  </div>
</template>

<script>
import {
  updateGlobalConfig,
  getRecordTotalType
} from '@/api/config'
import { mapState } from 'vuex'
import NotPermission from '@/views/NotPermission'

export default {
  components: {
    NotPermission
  },
  data () {
    return {
      dataTypeList: [],
      versionList: [
        {
          label: '通用版',
          value: 'common'
        },
        {
          label: '定制版',
          value: 'pro'
        }
      ],
      IsEditList:[
        {
          label: '可编辑',
          value: 'true'
        },
        {
          label: '不可编辑',
          value: 'false'
        }
      ],
      SearchList:[
        {
          label: '是',
          value: 'true'
        },
        {
          label: '否',
          value: 'false'
        }
      ],
      mapList: [
        {
          label: 'Open Street Map',
          value: 'OSMmap'
        },
        {
          label: '天地图',
          value: 'tiandimap'
        },
        {
          label: '荣成定制地图（蓝色高精）',
          value: 'bluemap'
        }
      ],
      cityList: [
        { label: '肇庆', pos: ['112.475243', '23.077845'] },
        { label: '安乡', pos: ['112.179664', '29.425375'] },
        { label: '威海', pos: ['122.180849', '37.425844'] },
        { label: '荣成', pos: ['122.25', '37.10'] },
      ],
      posTransform: [
        { label: 'WGS-84(离线)', value: 1, can: true },
        { label: 'GCJ-02(高德)', value: 2, can: true },
        { label: 'BD-09(百度)', value: 3, can: false },
      ],
      formParams: {
        isOl: true,
        // isEncrypt: false, // 是否加密
        // databasePort: 9543,//  仅限于开发环境展示
        searchCity: '肇庆',
        title: '大数据作战中心',
        mapZoom: 15,
        mapMiniZoom: 8,
        mapMaxZoom: 20,
        // pyApi: '',
        longitude: '',
        latitude: '',
        // optList: [],
        // cooSystem: 'WGS-84', // 坐标系
        // pyUrl: '',
        statStage: '',
        dataManageIsEdit:'true',
        loginVersion: 'pro',
        loginTitle: '公安多维数据研判平台',
        loginCity:'荣成',
        loginMap:'OSMmap',
        rongChengMapUrl:'',
      }
    }
  },
  computed: {
    ...mapState('User', {
      centrePos: 'centrePos',
      zoom: 'zoom',
      zooms: 'zooms',
      title: 'title',
      searchCity: 'searchCity',
      // cooSystem: 'cooSystem',
      // optList: 'optList',
      isOl: 'isOl',
      isAdmin: 'isAdmin',
      statStage: 'statStage',
      dataManageIsEdit:'dataManageIsEdit',
      dataManageTagIsEdit:'dataManageTagIsEdit',
      fuzzySearch:'fuzzySearch',
      loginTitle: 'loginTitle',
      loginVersion: 'loginVersion',
      loginSettings: 'loginSettings',
      globalSettings: 'globalSettings',
      loginCity:'loginCity',
      loginMap:'loginMap',
      rongChengMapUrl:'rongChengMapUrl',
      isMaintain: 'isMaintain',
      maintainDesc: 'maintainDesc',
      maintainTime: 'maintainTime'
    }),
    // ...mapState('Dict', {
    //   extrTypeList: 'extrTypeList'
    // }),
    infoContent () {
      return this.cityList.reduce((v, i) => {
        v += `${i.label}：${i.pos}\n`
        return v
      }, '')
    }
  },
  methods: {
    getRecordType () {
      getRecordTotalType().then(res => {
        this.dataTypeList = res || []
      })
    },

    initFormParams () {
      const params = {
        longitude: this.centrePos[0],
        latitude: this.centrePos[1],
        mapZoom: this.zoom,
        mapMiniZoom: this.zooms[0],
        mapMaxZoom: this.zooms[1],
        searchCity: this.searchCity,
        title: this.title,
        // optList: this.optList,
        // cooSystem: this.cooSystem,
        isOl: this.isOl,
        statStage: this.statStage,
        loginTitle: this.loginTitle,
        loginVersion: this.loginVersion,
        loginCity:this.loginCity,
        loginMap:this.loginMap,
        rongChengMapUrl:this.rongChengMapUrl,
        dataManageIsEdit:this.dataManageIsEdit,
        dataManageTagIsEdit:this.dataManageTagIsEdit,
        fuzzySearch:this.fuzzySearch
      }
      // console.log(this.dataManageIsEdit);
      this.formParams = JSON.parse(JSON.stringify(params))
    },
    onSubmit () {
      const submitParams = {
        applicationName: this.formParams.title,
        centerLatitude: this.formParams.latitude,
        centerLongitude: this.formParams.longitude,
        searchCity: this.formParams.searchCity,
        // coordinateSystem: this.formParams.cooSystem,
        // selectOptions: this.formParams.optList,
        defaultZoom: this.formParams.mapZoom,
        maxZoom: this.formParams.mapMaxZoom,
        minZoom: this.formParams.mapMiniZoom,
        online: this.formParams.isOl,
        statStage: this.formParams.statStage,
        dataManageIsEdit: this.formParams.dataManageIsEdit,
        dataManageTagIsEdit: this.formParams.dataManageTagIsEdit,
        fuzzySearch: this.formParams.fuzzySearch
      }
      const loginparams = {
        loginTitle: this.formParams.loginTitle,
        loginVersion: this.formParams.loginVersion,
        loginCity:this.formParams.loginCity,
        loginMap:this.formParams.loginMap,
        rongChengMapUrl:this.formParams.rongChengMapUrl,
        isMaintain:this.isMaintain,
        maintainDesc:this.maintainDesc,
        maintainTime:this.maintainTime
      }
      // 整合接口需要的参数（包括1.更新value，2.删除多余的数据，3.添加前端的新数据）
      const globalSettings = this.formatParams(submitParams,this.globalSettings)
      const loginSettings = this.formatParams(loginparams,this.loginSettings)
      const promise1 = updateGlobalConfig({
        "list": globalSettings,
        "type": "global"
      })
      const promise2 = updateGlobalConfig({
        "list": loginSettings,
        "type": "login"
      })
      Promise.all([promise1, promise2]).then(() => {
        this.$message({
          type: 'warning',
          message: '重新登录，配置即可生效！'
        })
      })
    },
    formatParams (objParams,vuexSettings) {
      const globalParamsList = Object.keys(objParams)
      let submitArray = vuexSettings.filter((item) => {
        if (item.key in objParams) {
          item.value = objParams[item.key]
        }
        return item.key in objParams
      })
      globalParamsList.forEach((item) => {
        let needAdd = submitArray.find((ele) => {
          return ele.key === item
        })
        if (!needAdd) {
          submitArray.push({
            key: item,
            value: objParams[item]
          })
        }
      })
      return submitArray
    },
    onReset () {
      this.initFormParams()
    }
  },
  mounted () {
    if (!this.isAdmin) return;
    this.initFormParams()
    this.getRecordType()
  }
}
</script>

<style lang="less" scoped>
.config-wrapper {
  background: var(--table-head-bg-color);
  margin-bottom: 16px;
  padding: 12px;
  box-sizing: border-box;
  min-height: 56px;

  & /deep/ .el-form-item {
    margin-bottom: 22px !important;
  }

  .form-btn {
    display: inline-block;
    padding: 0 20px;
  }
}
</style>
