<template>
  <!--begin::Stats Widget 11-->
  <div class="card card-custom gutter-b">
    <!--begin::Body-->
    <div class="card-body p-0">
      <div class="d-flex align-items-center justify-content-between card-spacer flex-grow-1">
        <span class="symbol  symbol-50 symbol-light-success mr-2">
          <span class="symbol-label">
            <span class="svg-icon svg-icon-xl svg-icon-success">
              <inline-svg src="media/svg/icons/Layout/Layout-4-blocks.svg" />
            </span>
          </span>
        </span>
        <div class="d-flex flex-column text-right">
          <span class="text-dark-75 font-weight-bolder font-size-h3">{{ dailyData }}</span>
          <span class="text-muted font-weight-bold mt-2">Daily Income</span>
        </div>
      </div>
      <!--begin::Chart-->
      <apexchart class="card-rounded-bottom" :options="chartOptions" :series="series" type="area" width="100%">
      </apexchart>
      <!--end::Chart-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Stats Widget 11-->
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";

export default {
  name: "widget-7",
  data() {
    return {
      chartOptions: {},
      series: [],
      dailyData: 0,
    };
  },
  computed: {
    ...mapGetters(["layoutConfig"]),

    endpoint() {
      return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
    },
  },
  methods: {
    getDailyApiFunction() {
      const { endpoint } = this;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/daily/pelanggaran`)
        .then((response) => {
          // Assuming your API response has a structure like { data: { total: 750 } }
          // const total = response.data.data.total;
          // this.weeklyIncome = total; // Update weekly income

          // Assuming your API response also provides an array of daily data
          // Example: response.data.data.dailyData
          const dailyData = response.data; // Adjust this based on your actual API response
          console.log('==============> dailyData', dailyData);
          // Update series data based on dailyData
          this.series = [{
            name: "Net Profit",
            // data: dailyData.map(item => item.value) // Adjust this based on your actual API response structure
          }];

        })
        .catch(function (error) {
          console.log('==============> error', error);
        });
    }
  },
  mounted() {
    this.getDailyApiFunction();
    // reference; kt_stats_widget_7_chart
    this.chartOptions = {
      chart: {
        type: "area",
        height: 150,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {},
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "solid",
        opacity: 1
      },
      stroke: {
        curve: "smooth",
        show: true,
        width: 3,
        colors: [this.layoutConfig("colors.theme.base.success")]
      },
      xaxis: {
        categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.layoutConfig("colors.gray.gray-500"),
            fontSize: "12px",
            fontFamily: this.layoutConfig("font-family")
          }
        },
        crosshairs: {
          show: false,
          position: "front",
          stroke: {
            color: this.layoutConfig("colors.gray.gray-300"),
            width: 1,
            dashArray: 3
          }
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        min: 0,
        max: 55,
        show: false,
        labels: {
          show: false,
          style: {
            colors: this.layoutConfig("colors.gray.gray-500"),
            fontSize: "12px",
            fontFamily: this.layoutConfig("font-family")
          }
        }
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0
          }
        },
        hover: {
          filter: {
            type: "none",
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: this.layoutConfig("font-family")
        },
        y: {
          formatter: function (val) {
            return "$" + val + " thousands";
          }
        }
      },
      colors: [this.layoutConfig("colors.theme.light.success")],
      markers: {
        colors: [this.layoutConfig("colors.theme.light.success")],
        strokeColor: [this.layoutConfig("colors.theme.base.success")],
        strokeWidth: 3
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
      }
    };
  },
};
</script>
