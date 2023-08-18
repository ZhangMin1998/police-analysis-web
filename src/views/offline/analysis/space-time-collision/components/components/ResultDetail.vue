<template>
  <div>
    <el-container class="detail-container" style="height: 45vh;">
      <el-aside :width="datas.personList && datas.personList.length && false ? '' : '100%'">
        <el-container style="height: 44vh;">
          <el-header height="24px">{{ datas.attr }}</el-header>
          <el-main>
            <div class="block">
              <div class="radio">
                排序：
                <el-radio-group v-model="reverse">
                  <el-radio :label="true">倒序</el-radio>
                  <el-radio :label="false">正序</el-radio>
                </el-radio-group>
              </div>

              <el-timeline :reverse="reverse">
                <el-timeline-item
                  v-for="(activity, index) in datas.tracks"
                  :key="index"
                  :timestamp="activity.startTime + ' - ' + activity.endTime"
                >
                  {{ activity.place_name || '--' }}
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-main>
        </el-container>
      </el-aside>

      <el-main v-if="datas.personList && datas.personList.length && false">
        <el-container style="height: 44vh;">
          <el-header height="24px"> 档案列表 </el-header>
          <el-main>
            <div class="person">
              <div class="person-item" v-for="(person, index) in datas.personList" :key="index">
                <div class="person-header">
                  <div class="img">
                    <img
                      :src="require('@/assets/img/icon-morenHeader.png')"
                      alt=""
                      width="53"
                      height="80"
                    />
                  </div>
                  <div class="item-info">
                    <div class="value info">
                      <div>{{ person.name }}</div>
                      <div>{{ person.sex == 1 ? '男' : '女' }}</div>
                      <div>重点人</div>
                    </div>
                    <div>
                      <span class="key">身份证号：</span>
                      <span class="value">{{ person.idCardNumber || '--' }}</span>
                    </div>
                    <div>
                      <span class="key">手机号：</span>
                      <span class="value">{{ person.idCardNumber || '--' }}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <span class="key">最后时间：</span>
                    <span class="value">xxx</span>
                  </div>
                  <div>
                    <span class="key">最后地址：</span>
                    <span class="value">xxx</span>
                  </div>
                </div>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Object,
      default: function () {
        return { attr: '' }
      }
    }
  },
  data () {
    return {
      reverse: true
    }
  },
  mounted () {
    console.log(this.datas)
  }
}
</script>

<style lang="less" scoped>
.detail-container {
  > .el-aside {
    margin-right: 16px;
    .el-main {
      background-color: var(--table-head-bg-color);
    }
  }
  > .el-main {
    padding: 0;
    .el-main {
      background-color: var(--table-head-bg-color);
      padding: 20px 0 20px 18px;
    }
  }
}

.el-header {
  color: var(--base-text-color-1);
  font-size: 18px;
  font-weight: 600;
  height: 20px;
  margin-bottom: 16px;
}
/deep/.el-timeline-item__content,
.radio,
.value {
  color: var(--base-text-color-1);
}

.radio {
  height: 40px;
}

/deep/.el-timeline-item__timestamp,
.el-radio,
.key {
  color: var(--base-text-color-to-999999);
}

.person {
  display: flex;
  flex-wrap: wrap;
  .person-item {
    width: 48%;
    padding: 8px;
    box-sizing: border-box;
    line-height: 22px;
    background-color: rgba(255, 255, 255, 0.06);
    margin-right: 10px;
    margin-bottom: 10px;
    .person-header {
      display: flex;
      .img {
        margin-right: 10px;
      }
      .item-info {
        flex: 1 1 auto;

        .info {
          display: flex;
          margin-bottom: 8px;
          > div {
            flex: 1 1 auto;
          }
        }
      }
    }
  }
}
</style>
