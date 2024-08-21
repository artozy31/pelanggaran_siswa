<template>
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
    name: 'BarChart',
    data() {
        return {
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'bar',
                },
                plotOptions: {
                    bar: {
                        borderRadius: 5,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                title: {
                    text: 'Total Pelanggaran Bulan ' + new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date()),
                    align: 'center',
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val;
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                },
                xaxis: {
                    categories: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5"],
                    position: 'bottom',
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
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
                        enabled: true,
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter: function (val) {
                            return val;
                        }
                    }
                },
            },
        }
    },
    components: {
        apexchart: VueApexCharts,
    },
    props: {
        series: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped>
/* Tambahkan style yang dibutuhkan di sini */
</style>
