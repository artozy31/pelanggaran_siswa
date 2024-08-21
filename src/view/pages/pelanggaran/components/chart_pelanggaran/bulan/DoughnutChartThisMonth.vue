<template>
    <apexchart type="donut" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import ApiService from "@/core/services/api.service";

export default {
    name: 'DonutChart',
    components: {
        apexchart: VueApexCharts,
    },
    data() {
        return {
            series: [], // Array untuk menyimpan total pelanggaran per jenis
            chartOptions: {
                chart: {
                    width: 400,
                    type: 'donut',
                    dropShadow: {
                        enabled: true,
                        color: '#111',
                        top: -1,
                        left: 3,
                        blur: 3,
                        opacity: 0.2
                    }
                },
                stroke: {
                    width: 1,
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                total: {
                                    showAlways: true,
                                    show: true
                                }
                            }
                        }
                    }
                },
                labels: [], // Array untuk menyimpan penjelasan dari jenis pelanggaran
                dataLabels: {
                    enabled: false,
                    formatter: function (val) {
                        return val + "%"
                    },
                    dropShadow: {
                        blur: 3,
                        opacity: 0.8
                    },
                    style: {
                        fontSize: '16px',
                        colors: ["#ffffff"]
                    }
                },
                states: {
                    hover: {
                        filter: 'none'
                    }
                },
                theme: {
                    palette: 'palette6'
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 260
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }],
            },
        };
    },
    methods: {
        prepareChartData(details) {
            const labelsList = details.map(item => item.penjelasan);
            const seriesList = details.map(item => item.total);

            this.series = seriesList;
            this.chartOptions.labels = labelsList;

            this.chartOptions = {
                ...this.chartOptions,
                labels: labelsList
            };
        },
        getDailyApiFunction() {
            const endpoint = `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/monthly/pelanggaran`)
                .then((response) => {
                    const thisWeekData = response.data.data.this_month.details;
                    this.prepareChartData(thisWeekData);
                })
                .catch(function (error) {
                    console.error('Error fetching data:', error);
                });
        },
    },
    mounted() {
        this.getDailyApiFunction();
    }
};
</script>


<style scoped>
/* Tambahkan style yang dibutuhkan di sini */
</style>
