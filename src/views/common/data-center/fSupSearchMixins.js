export default {
  created () {
    if (this.$route.query.pathName) {
      window.addEventListener('beforeunload', this.beforeUnloadFun)
      this.$nextTick(() => {
        if (this.$route.query.startTime && this.$route.query.endTime) {
          if (this.$refs.DatePick && this.$refs.DatePick.$refs.resetTime) {
            this.$refs.DatePick.getTimeSelect({
              startTime: this.$route.query.startTime,
              endTime: this.$route.query.endTime
            })
            this.$refs.DatePick.$refs.resetTime.startEndTime = [this.$route.query.startTime, this.$route.query.endTime]
          }
          if (this.$refs.myTable && this.$refs.myTable.$refs.DatePick && this.$refs.myTable.$refs.DatePick.$refs.resetTime) {
            this.$refs.myTable.$refs.DatePick.getTimeSelect({
              startTime: this.$route.query.startTime,
              endTime: this.$route.query.endTime
            })
            this.$refs.myTable.$refs.DatePick.$refs.resetTime.startEndTime = [this.$route.query.startTime, this.$route.query.endTime]
          }
        }
      })
    }
  },
  methods: {
    beforeUnloadFun () {
      if (this.$route.query.pathName) {
        sessionStorage.removeItem('pathName')
      }
    },
  },
  beforeRouteEnter (to, from, next) {
    let pathName = sessionStorage.getItem('pathName')
    if (to.query.pathName && !pathName) {
      let query = {
        pathName: to.query.pathName,
        key: sessionStorage.getItem('dataCenterSearchKey'),
        startTime: sessionStorage.getItem('dataCenterSearchStart'),
        endTime: sessionStorage.getItem('dataCenterSearchEnd'),
      }
      sessionStorage.removeItem('dataCenterSearchKey')
      sessionStorage.removeItem('dataCenterSearchStart')
      sessionStorage.removeItem('dataCenterSearchEnd')
      sessionStorage.setItem('pathName', to.query.pathName)
      next({name: to.name, query: query})
    } else {
      next()
    }
  },
  destroyed () {
    window.removeEventListener('beforeunload', this.beforeUnloadFun)
  }
}
