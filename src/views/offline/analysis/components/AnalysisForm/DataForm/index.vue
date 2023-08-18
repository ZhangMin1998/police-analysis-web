<template>
  <div class="dataForm" @click="removeIsActive">
    <el-form :model="form" ref="form">
      <!-- 属性 -->
      <div class="dataForm-item">
        <TrendBox
          ref="children"
          :attrs="form.list"
          :groups="groups"
          @add="addEvent"
          @del="delEvent"
        >
          <template v-slot:formBox0="props">
            <div class="key">数据类型</div>
            <div class="val">
              <el-select
                v-model="form.list[props.boxIndex].type"
                placeholder="请选择搜索类型"
                @change="handleChangeType($event, props.boxIndex)"
              >
                <template>
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.labelName"
                    :value="item.labelNameEn"
                    size="small"
                  >
                  </el-option>
                </template>
              </el-select>
            </div>
          </template>

          <!-- 上传人脸 -->
          <template v-slot:formBox1="props">
            <div
              class="key"
              :style="{ marginBottom: form.list[props.boxIndex].type === imageAttr ? '20px' : '' }"
            >
              {{ form.list[props.boxIndex].type === imageAttr ? '上传人脸' : '准确数值' }}
            </div>
            <div
              class="val"
              :style="{ height: form.list[props.boxIndex].type === imageAttr ? '160px' : '' }"
            >
              <div v-if="form.list[props.boxIndex].type === imageAttr">
                <UploadIcon
                  :UploadImage.sync="UploadImage"
                  @handleChange="UploadChange"
                ></UploadIcon>
              </div>

              <el-input
                v-else
                v-model.trim="form.list[props.boxIndex].data"
                size="small"
                :placeholder="form.list[props.boxIndex].placeholder || '请输入您要查询的内容'"
              ></el-input>
            </div>
          </template>
        </TrendBox>
      </div>
    </el-form>
  </div>
</template>

<script>
import TrendBox from '@/components/VisualComponents/Form/trendBox'
import UploadIcon from '@/components/BasicComponents/UploadIcon'
import { uploadFacePic } from '@/api/allArchives'
import { getFeatureOptionsApi } from '@/api/warnControl.js'
// import { mapState } from 'vuex'

const imageAttr = 'attr_face_image_type'
export default {
  components: {
    TrendBox,
    UploadIcon
  },

  props: {
    hasImageAttr: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      imageAttr: Object.freeze(imageAttr),
      form: {
        list: [{ data: '', type: '' }],
        file: null,
        isImage: false
      },
      activeIndex: -1, //当前点击框active css 效果
      groups: [0, 1], //一组有两个input框
      UploadImage: {
        imageUrl: '',
        accept: '.jpg',
        multiple: false,
        width: 104,
        height: 104,
        imgFile: null
      },
      typeList: []
    }
  },

  computed: {
    // ...mapState('Common', {
    //   dataTypeFormList: 'dataTypeFormList', // 数据类型list
    // }),
    // typeList () {
    //   let option = this.$store.state.Dict.extrTypeList || []
    //   return option.filter(item => item.typeCode !== imageAttr)
    // }
  },

  // watch: {
  //   'form.list': {
  //     handler (val) {
  //       if (!this.hasImageAttr) return
  //       const isImage = val.some(_c => _c.type === imageAttr)
  //       this.setTypeList(isImage)
  //     },
  //     deep: true,
  //     immediate: false
  //   }
  // },

  created () {
    this.setDataTypeList()
  },
  mounted () {
    if(this.$route.query.attrValue){
      this.form.list[0].type = this.$route.query.attrType
      this.form.list[0].data = this.$route.query.attrValue
      setTimeout(()=>{
        this.$parent.formatParams()
      },300)
    }
    let clickTask = JSON.parse(localStorage.getItem('clickTask'))
    if (this.$route.query && clickTask && this.$route.query?.id === clickTask?.id.toString()) {
      this.form.list[0].type = clickTask.propList[0]
      this.form.list[0].data = clickTask.search_items[clickTask.search_items.length - 1].value
    }
  },

  methods: {
    setDataTypeList () {
      getFeatureOptionsApi().then(res => {
        let result = res || []
        result.forEach(item => {
          if (!item.isFile) {
            this.typeList.push(item)
          }
        })
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        if(!this.form.list[0].type){
          this.form.list[0].type = this.typeList?.[0].labelNameEn ?? ''
          this.form.list[0].placeholder = '请输入您要查询的' + this.typeList?.[0].labelName ?? '内容'
        }

      })
    },
    // setTypeList (hasImage = false) {
    //   // prop hasImageAttr 为false 则所有不显示人脸图片下拉   hasImage只能选择一张人脸 则选了则不能显示人脸下拉
    //   if (!this.hasImageAttr) {
    //     // 不要图片属性
    //     this.typeList = this.allType.filter(_c => _c.typeCode !== imageAttr)
    //     return false
    //   }

    //   if (hasImage) {
    //     // 不要图片属性
    //     this.typeList = this.allType.filter(_c => _c.typeCode !== imageAttr)
    //   } else {
    //     // 包含图片属性
    //     this.typeList = [...this.allType]
    //   }
    // },
    // 动态显示属性 placeholder
    handleChangeType (value, index) {
      this.form.list[index].placeholder = '请输入您要查询的' + this.typeList.find(_c => _c.labelNameEn === value)?.labelName
      if (value === 'attr_face_image_type') {
        this.form.isImage = true
      } else {
        this.form.isImage = false
      }
    },

    // 点击外部 移除点击效果
    removeIsActive () {
      this.activeIndex = -1
      this.$refs.children.removeClick()
    },

    // 新增 输入
    addEvent () {
      this.form.list.push({
        data: '',
        type: this.typeList?.[0]?.labelNameEn ?? ''
      })
    },

    // 删除 输入
    delEvent (idx) {
      this.form.list.splice(idx, 1)
    },

    UploadChange (file) {
      if (file.raw.type !== 'image/jpeg') {
        this.$messageTip.error('请上传jpg格式的图片!')
      } else {
        let url = URL.createObjectURL(file.raw)
        this.UploadImage.imageUrl = url
        this.form.imgFile = file.raw
        let formData = new FormData()
        formData.append('multipartFile', file.raw)
        uploadFacePic(formData).then((res) => {
          this.form.file = res
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dataForm-item {
  margin-bottom: 16px;
  ::v-deep .el-select .el-input {
    // color: #C0D0E7;
    .el-input__inner {
      color: var(--base-text-color-1-to-666666);
      height: 32px;
      line-height: 32px;
      border-width: 0;
      padding-left: 0
    }
    .el-input__suffix {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
