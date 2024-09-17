<template>
  <VueApexCharts type="donut" :options="chartOptions" :series="series" height="350" width="350"></VueApexCharts>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
const props = defineProps({ series: { type: Array, default: [100, 100, 165] }, labels: { type: Array, default: [] } })
let chartOptions = {
  chart: {
    type: 'donut',
    toolbar: {
      show: false
    },
  },
  colors: ['#E52421', '#fe6d6b', '#ffc9c8'],
  plotOptions: {
    pie: {
      customScale: 0.8,
      expandOnClick: false
    }
  },
  dataLabels: {
    enabled: false, // غیرفعال کردن لیبل‌ها
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
    active: {
      filter: {
        type: 'none',
      },
    },
  },
  labels: props.labels,
  legend: { show: false },
}

</script>

<style></style>