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
                    palette: 'palette5'
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

            // console.log('Labels:', labelsList);
            // console.log('Series:', seriesList);

            this.series = seriesList;
            this.chartOptions.labels = labelsList;

            this.chartOptions = {
                ...this.chartOptions,
                labels: labelsList
            };
            // Update chart options dan series dengan data yang benar
            // this.chartOptions = {
            //     ...this.chartOptions,
            //     labels: {
            //         ...this.chartOptions,
            //         labels: labelsList
            //     }
            // };
        },
        getDailyApiFunction() {
            const endpoint = `${process.env.VUE_APP_BASE_ENDPOINT_DEV}/api/v1`;

            ApiService.setHeader();
            ApiService.get(`${endpoint}/weekly/pelanggaran`)
                .then((response) => {
                    const yesterdayDetails = response.data.data.this_week.details;
                    this.prepareChartData(yesterdayDetails);
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
