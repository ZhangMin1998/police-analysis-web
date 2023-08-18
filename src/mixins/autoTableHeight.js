import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('analysisJudgement', {
      screenHeight: 'screenHeight'
    }),
    tableHeight () {
      return this.screenHeight - (this.subHeight || 270)
    },
    rowHeight () {
      return this.tableHeight / (this.rowNum || 11.5)
    }
  }
}
