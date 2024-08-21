<template>
    <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
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
                    type: 'line',
                    dropShadow: {
                        enabled: true,
                        color: '#000',
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                    },
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false
                    }
                },
                colors: ['#77B6EA', '#545454'],
                dataLabels: {
                    enabled: true,
                },
                stroke: {
                    curve: 'smooth'
                },
                grid: {
                    borderColor: '#e7e7e7',
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                markers: {
                    size: 1
                },
                title: {
                    text: 'Total Pelanggaran Tahun ' + new Date().getFullYear(),
                    align: 'center',
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                },
                yaxis: {
                    title: {
                        text: 'Jumlah'
                    },
                    min: 5,
                    max: 40
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: true,
                    offsetY: -25,
                    offsetX: -5
                }
            },
        };
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
