<template>
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
    name: 'BarChart',
    components: {
        apexchart: VueApexCharts,
    },
    props: {
        studentData: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            series: [],
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'bar',
                    animations: {
                        speed: 200
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 5,
                        distributed: true,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                title: {
                    text: 'Tahun ' + new Date().getFullYear(),
                    align: 'center',
                },
                // dataLabels: {
                //     enabled: true,
                //     formatter: function (val) {
                //         return val;
                //     },
                //     offsetY: -30,
                //     style: {
                //         fontSize: '16px',
                //         colors: ["#304758"]
                //     }
                // },
                theme: {
                    palette: 'palette1' // upto palette10
                },
                xaxis: {
                    categories: [], // Akan diisi dengan nama siswa
                    labels: {
                        show: false,
                        style: {
                            colors: '#BED1E6',
                            fontSize: '16px'
                        }
                    },
                    position: 'bottom',
                    crosshairs: {
                        fill: {
                            type: 'gradient',
                            gradient: {
                                colorFrom: '#038FA6',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            }
                        }
                    },
                    tooltip: {
                        enabled: false,
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: true
                    },
                    axisTicks: {
                        show: true,
                    },
                    labels: {
                        show: true,
                        formatter: function (val) {
                            return val;
                        }
                    }
                },
            },
        };
    },
    watch: {
        studentData: {
            immediate: true,
            handler(newData) {
                this.prepareChartData(newData);
            }
        }
    },
    methods: {
        updateTheme(e) {
            this.chartOptions = {
                theme: {
                    palette: e.target.value
                }
            };
        },
        prepareChartData(newData) {
            const categoriesList = newData.map(student => student.nama);
            const dataList = newData.map(student => student.pelanggaran_count);

            // Update chart options dan series dengan data yang benar
            this.chartOptions = {
                ...this.chartOptions,
                xaxis: {
                    ...this.chartOptions.xaxis,
                    categories: categoriesList
                }
            };
            this.series = [{
                name: 'Jumlah Pelanggaran',
                data: dataList
            }];
        }
    }
};
</script>

<style scoped>
/* Tambahkan style yang dibutuhkan di sini */
</style>
