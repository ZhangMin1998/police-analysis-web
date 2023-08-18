export default {
  data () {
    return {
      totalDataLoading: true,
      chartLineLoading: true,
      chartStackLineLoad: false
    }
  },
  computed: {
    loading () {
      return this.totalDataLoading || this.chartLineLoading || this.chartStackLineLoad
    },
  },
  methods: {
    changeTotalDataLoad (bool) {
      this.totalDataLoading = bool
    },
    changeChartLineLoad (bool) {
      this.chartLineLoading = bool
    },
    changeStackLineLoad (bool) {
      this.chartStackLineLoad = bool
    }
  }
}
