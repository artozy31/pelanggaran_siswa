<template>
  <div class="page-margin">

    <v-card class="hb-input-form-style">
      <p class="text-h5 text-center font-weight-black text-blue-hb">Pelanggaran</p>

      <div>
        <v-row>
          <center-column>
            <v-sheet class="pa-4 text-black dashboard-card-daily">
              <h4 class="dashboard-card-title-text">{{ yesterdayDate }}</h4>
              <v-progress-circular v-if="loadingFlagging" indeterminate color="primary"></v-progress-circular>

              <template v-else>
                <div v-if="dataDailyYesterday !== 0">
                  <DoughnutChartDaily></DoughnutChartDaily>
                  <!-- <p class="text-h3 pt-2 font-weight-black">{{ dataDailyYesterday }}</p> -->
                </div>
                <div v-else>
                  <p class="text-h3 font-weight-black pt-2">-</p>
                  <p class="text-h5">Tidak ada data</p>
                </div>
              </template>
            </v-sheet>
          </center-column>

          <center-column>
            <v-sheet class="pa-4 text-black dashboard-card-daily">
              <h4 class="dashboard-card-title-text">{{ (new Date()).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long', day: 'numeric'
              }) }}</h4>
              <v-progress-circular v-if="loadingFlagging" indeterminate color="primary"></v-progress-circular>

              <template v-else>
                <div v-if="dataDailyToday !== 0">
                  <!-- <p class="text-h3 pt-2 font-weight-black">{{ dataDailyToday }} <v-icon
                      :color="dataDailyToday > dataDailyYesterday ? 'error' : (dataDailyToday < dataDailyYesterday ? 'success' : '')">{{
                        getDailyIcon }}</v-icon></p> -->
                  <DoughnutChartDailyToday></DoughnutChartDailyToday>
                </div>
                <div v-else>
                  <p class="text-h3 font-weight-black pt-2">-</p>
                  <p class="text-h5">Tidak ada data</p>
                </div>
              </template>
            </v-sheet>
          </center-column>
        </v-row>
      </div>

      <hr>

      <div>
        <v-row>
          <center-column>
            <v-sheet class="pa-4 text-black dashboard-card-weekly">
              <h4 class="dashboard-card-title-text">Minggu Lalu</h4>
              <h4 class="dashboard-card-title-text">{{ lastWeekRange }}</h4>
              <v-progress-circular v-if="loadingFlagging" indeterminate color="primary"></v-progress-circular>

              <template v-else>
                <div v-if="dataLastWeek !== 0">
                  <!-- <p class="text-h3 pt-2 font-weight-black">{{ dataLastWeek }}</p> -->
                  <DoughnutChartThisWeek></DoughnutChartThisWeek>
                </div>
                <div v-else>
                  <p class="text-h3 font-weight-black pt-2">-</p>
                  <p class="text-h5">Tidak ada data</p>
                </div>
              </template>
            </v-sheet>
          </center-column>

          <center-column>
            <v-sheet class="pa-4 text-black dashboard-card-weekly">
              <h4 class="dashboard-card-title-text">Minggu Ini</h4>
              <h4 class="dashboard-card-title-text">{{ thisWeekRange }}</h4>
              <v-progress-circular v-if="loadingFlagging" indeterminate color="primary"></v-progress-circular>

              <template v-else>
                <div v-if="dataWeekly !== 0">
                  <!-- <p class="text-h3 pt-2 font-weight-black">{{ dataWeekly }} <v-icon
                      :color="dataWeekly > dataLastWeek ? 'error' : (dataWeekly < dataLastWeek ? 'success' : '')">{{
                        getWeeklyIcon }}</v-icon></p> -->
                  <DoughnutChartLastWeek></DoughnutChartLastWeek>
                </div>
                <div v-else>
                  <p class="text-h3 font-weight-black pt-2">-</p>
                  <p class="text-h5">Tidak ada data</p>
                </div>
              </template>
            </v-sheet>
          </center-column>
        </v-row>
      </div>

      <hr>

      <div>
        <v-row>
          <center-column>
            <v-sheet class="pa-4 text-black dashboard-card-monthly">
              <h4 class="dashboard-card-title-text">Bulan {{ lastMonth }}</h4>
              <v-progress-circular v-if="loadingFlagging" indeterminate color="primary"></v-progress-circular>

              <template v-else>
                <div v-if="dataLastMonth !== 0">
                  <!-- <p class="text-h3 pt-2 font-weight-black">{{ dataLastMonth }}</p> -->
                  <DoughnutChartLastMonth></DoughnutChartLastMonth>
                </div>
                <div v-else>
                  <p class="text-h3 font-weight-black pt-2">-</p>
                  <p class="text-h5">Tidak ada data</p>
                </div>
              </template>
            </v-sheet>
          </center-column>

          <center-column>
            <v-sheet class="pa-4 text-black dashboard-card-monthly">
              <h4 class="dashboard-card-title-text">Bulan {{ new Intl.DateTimeFormat('id-ID', {
                month: 'long'
              }).format(new
                Date()) }}</h4>
              <v-progress-circular v-if="loadingFlagging" indeterminate color="primary"></v-progress-circular>

              <template v-else>
                <div v-if="dataMonthly !== 0">
                  <!-- <p class="text-h3 pt-2 font-weight-black">{{ dataMonthly }} <v-icon
                      :color="dataMonthly > dataLastMonth ? 'error' : (dataMonthly < dataLastMonth ? 'success' : '')">{{
                        getMonthlyIcon }}</v-icon></p> -->
                  <DoughnutChartThisMonth></DoughnutChartThisMonth>
                </div>
                <div v-else>
                  <p class="text-h3 font-weight-black pt-2">-</p>
                  <p class="text-h5">Tidak ada data</p>
                </div>
              </template>
            </v-sheet>
          </center-column>
        </v-row>
      </div>
    </v-card>

    <v-divider></v-divider>

    <v-card class="hb-input-form-style">
      <p class="text-h5 text-center font-weight-black text-blue-hb">Siswa Pelanggar Terbanyak</p>

      <BarChartStudentMonthly :studentData="dataStudentViolationsPerMonth"></BarChartStudentMonthly>

      <BarChartStudentAnually :studentData="dataStudentViolationsPerYear"></BarChartStudentAnually>

      <!-- <v-row>
        <center-column>
        </center-column>

        <center-column>
          <v-sheet class="pa-4 text-black dashboard-card-weekly">
          </v-sheet>
        </center-column>
      </v-row> -->
    </v-card>

    <v-divider></v-divider>

    <v-card class="hb-input-form-style">
      <p class="text-h5 text-center font-weight-black text-blue-hb">Pelanggaran Terbanyak</p>

      <BarChartViolationsMonthly :violationData="dataViolationsPerMonth"></BarChartViolationsMonthly>

      <BarChartViolationsAnually :violationData="dataViolationsPerYear"></BarChartViolationsAnually>

      <!-- <v-row>
        <center-column>
          <v-sheet class="pa-4 text-black dashboard-card-daily">
            <h4 class="dashboard-card-title-text">Bulan Ini</h4>

            <v-progress-circular v-if="loadingFlagging" indeterminate color="primary"></v-progress-circular>

            <template v-else>
              <div v-if="dataViolationsPerMonth !== null">
                <p class="text-h3 font-weight-black pt-2">{{ dataViolationsPerMonth.total }}</p>
                <p class="text-h5">{{ dataViolationsPerMonth.penjelasan }}</p>
              </div>
              <div v-else>
                <p class="text-h3 font-weight-black pt-2">-</p>
                <p class="text-h5">Tidak ada data</p>
              </div>
            </template>
          </v-sheet>
        </center-column>

        <center-column>
          <v-sheet class="pa-4 text-black dashboard-card-weekly">
            <h4 class="dashboard-card-title-text">Tahun Ini</h4>

            <v-progress-circular v-if="loadingFlagging" indeterminate color="primary"
              justify-center></v-progress-circular>

            <template v-else>
              <div v-if="dataViolationsPerYear !== null">
                <p class="text-h3 font-weight-black pt-2">{{ dataViolationsPerYear.total }}</p>
                <p class="text-h5">{{ dataViolationsPerYear.penjelasan }}</p>
              </div>
              <div v-else>
                <p class="text-h3 font-weight-black pt-2">-</p>
                <p class="text-h5">Tidak ada data</p>
              </div>
            </template>
          </v-sheet>
        </center-column>
      </v-row> -->
    </v-card>

    <v-divider></v-divider>

    <BarChartMonth :series="seriesMonthly"></BarChartMonth>

    <BarChartYear :series="seriesYearly"></BarChartYear>

    <v-divider></v-divider>
  </div>
</template>

<script>
import { Date } from "core-js";
import ApiService from "@/core/services/api.service";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import CenterColumn from '@/view/pages/pelanggaran/components/CenterColumn.vue';
import BarChartMonth from '@/view/pages/pelanggaran/components/BarChartMonth.vue';
import BarChartYear from '@/view/pages/pelanggaran/components/BarChartYear.vue';
import BarChartStudentMonthly from "./components/BarChartStudentMonthly.vue";
import BarChartStudentAnually from "./components/BarChartStudentAnually.vue";
import BarChartViolationsMonthly from "./components/BarChartViolationsMonthly.vue";
import BarChartViolationsAnually from "./components/BarChartViolationsAnually.vue";
import DoughnutChartDaily from "./components/chart_pelanggaran/hari/DoughnutChartDaily.vue";
import DoughnutChartDailyToday from "./components/chart_pelanggaran/hari/DoughnutChartDailyToday.vue";
import DoughnutChartThisWeek from "./components/chart_pelanggaran/minggu/DoughnutChartThisWeek.vue";
import DoughnutChartLastWeek from "./components/chart_pelanggaran/minggu/DoughnutChartLastWeek.vue";
import DoughnutChartThisMonth from "./components/chart_pelanggaran/bulan/DoughnutChartThisMonth.vue";
import DoughnutChartLastMonth from "./components/chart_pelanggaran/bulan/DoughnutChartLastMonth.vue";


export default {
  name: "dashboard-pelanggaran",
  data() {
    return {
      loadingFlagging: false,

      //Daily
      dataDailyToday: 0,
      dataDailyYesterday: 0,

      //Weekly
      dataWeekly: 0,
      dataLastWeek: 0,

      //Monthly
      dataMonthly: 0,
      dataLastMonth: 0,

      //Annually
      dataYearly: 0,
      dataLastYear: 0,

      //Data Siswa Pelanggar Terbanyak Bulan - Tahun ini.
      dataStudentViolationsPerMonth: [],
      dataStudentViolationsPerYear: [],

      //Data Siswa Pelanggar Terbanyak Bulan - Tahun ini.
      dataViolationsPerMonth: [],
      dataViolationsPerYear: [],

      seriesMonthly: [{
        name: 'Total Pelanggaran',
        data: []
      }],

      seriesYearly: [{
        name: 'Total Pelanggaran',
        data: []
      }],
    }
  },
  computed: {
    endpoint() {
      return `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;
    },
    yesterdayDate() {
      const today = new Date();
      today.setDate(today.getDate() - 7);
      return today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    lastMonth() {
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);

      return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(lastMonth);
    },
    lastWeekRange() {
      const today = new Date();
      const dayOfWeek = today.getDay();

      // Jika hari ini adalah sebelum Senin (0 adalah Minggu), maka hitung dari Senin minggu lalu
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - dayOfWeek - 7 + (dayOfWeek === 0 ? -6 : 1));

      // Set ke hari Minggu minggu lalu
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

      const options = { year: 'numeric', month: 'long', day: 'numeric' };

      const start = startOfLastWeek.toLocaleDateString('id-ID', options);
      const end = endOfLastWeek.toLocaleDateString('id-ID', options);

      return `${start} - ${end}`;
    },
    thisWeekRange() {
      const today = new Date();
      const dayOfWeek = today.getDay();

      // Jika hari ini adalah sebelum Senin (0 adalah Minggu), maka hitung dari Senin minggu ini
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (dayOfWeek - 1) + (dayOfWeek === 0 ? -7 : 0));

      // Set ke hari Minggu minggu ini
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const options = { year: 'numeric', month: 'long', day: 'numeric' };

      const start = startOfWeek.toLocaleDateString('id-ID', options);
      const end = endOfWeek.toLocaleDateString('id-ID', options);

      return `${start} - ${end}`;
    },
    getDailyIcon() {
      if (this.dataDailyToday > this.dataDailyYesterday) {
        return 'mdi-chevron-up';
      } else {
        return 'mdi-chevron-down'
      };
    },
    getWeeklyIcon() {
      if (this.dataWeekly > this.dataLastWeek) {
        return 'mdi-chevron-up';
      } else {
        return 'mdi-chevron-down';
      };
    },
    getMonthlyIcon() {
      if (this.dataMonthly > this.dataLastMonth) {
        return 'mdi-chevron-up';
      } else {
        return 'mdi-chevron-down';
      };
    }
  },
  components: {
    CenterColumn,
    BarChartStudentMonthly,
    BarChartStudentAnually,
    BarChartViolationsMonthly,
    BarChartViolationsAnually,
    BarChartMonth,
    BarChartYear,
    DoughnutChartDaily,
    DoughnutChartDailyToday,
    DoughnutChartThisWeek,
    DoughnutChartLastWeek,
    DoughnutChartThisMonth,
    DoughnutChartLastMonth,
  },
  mounted() {
    this.getDataForLineChartMonthly();
    this.getDataForLineChartYearly();
    this.getDailyApiFunction();
    this.getWeeklyApiFunction();
    this.getMonthlyApiFunction();
    this.getStudentMonthlyMostViolations();
    this.getStudentYearlyMostViolations();
    this.getMonthlyMostViolations();
    this.getYearlyMostViolations();

    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Dashboard Pelanggaran" }]);
  },
  methods: {
    setActiveTab1(event) {
      this.tabIndex = this.setActiveTab(event);
    },
    setActiveTab2(event) {
      this.tabIndex2 = this.setActiveTab(event);
    },
    /**
     * Set current active on click
     * @param event
     */
    setActiveTab(event) {
      // get all tab links
      const tab = event.target.closest('[role="tablist"]');
      const links = tab.querySelectorAll(".nav-link");
      // remove active tab links
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active");
      }

      // set current active tab
      event.target.classList.add("active");

      // set clicked tab index to bootstrap tab
      return parseInt(event.target.getAttribute("data-tab"));
    },
    getDailyApiFunction() {
      const { endpoint } = this;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/daily/pelanggaran`)
        .then((response) => {
          this.dataDailyToday = response.data.data.today.total;
          this.dataDailyYesterday = response.data.data.lastWeekSameDay.total;
        })
        .catch(function (error) {
          console.error('==============> error', error);
        });
    },
    getWeeklyApiFunction() {
      const { endpoint } = this;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/weekly/pelanggaran`)
        .then((response) => {
          this.dataWeekly = response.data.data.this_week.total;
          this.dataLastWeek = response.data.data.last_week.total;
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getMonthlyApiFunction() {
      const { endpoint } = this;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/monthly/pelanggaran`)
        .then((response) => {
          this.dataMonthly = response.data.data.this_month.total;
          this.dataLastMonth = response.data.data.last_month.total;
        })
        .catch((error) => {
          console.error(error);
        })
    },
    getStudentMonthlyMostViolations() {
      const { endpoint } = this;
      this.loadingFlagging = true;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/pelanggaran-terbanyak-perbulan/siswa`)
        .then((response) => {
          this.dataStudentViolationsPerMonth = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loadingFlagging = false;
        });
    },
    getStudentYearlyMostViolations() {
      const { endpoint } = this;
      this.loadingFlagging = true;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/pelanggaran-terbanyak-pertahun/siswa`)
        .then((response) => {
          this.dataStudentViolationsPerYear = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.loadingFlagging = false;
        });
    },
    getMonthlyMostViolations() {
      const { endpoint } = this;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/pelanggaran-terbanyak-perbulan/pelanggaran`)
        .then((response) => {
          this.dataViolationsPerMonth = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getYearlyMostViolations() {
      const { endpoint } = this;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/pelanggaran-terbanyak-pertahun/pelanggaran`)
        .then((response) => {
          this.dataViolationsPerYear = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getDataForLineChartMonthly() {
      const { endpoint } = this;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/statistik-perbulan/pelanggaran`)
        .then((response) => {
          this.seriesMonthly = [{
            name: 'Total Pelanggaran',
            data: response.data.data
          }];
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getDataForLineChartYearly() {
      const { endpoint } = this;

      ApiService.setHeader();
      ApiService.get(`${endpoint}/statistik-pertahun/pelanggaran`)
        .then((response) => {
          this.seriesYearly = [{
            name: 'Total Pelanggaran',
            data: response.data.data
          }];
        })
        .catch((error) => {
          console.error(error);
        });
    },
  }
};
</script>
