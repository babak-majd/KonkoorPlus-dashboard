<template>
  <VueApexCharts :options="chartOptions" :series="series"></VueApexCharts>
</template>

<script setup>
import VueApexCharts from "vue3-apexcharts";
const props = defineProps({
  categories: { type: Array, default: [] },
  series: { type: Array, default: [] }
})

const chartOptions = ref({
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  stroke: {
    curve: 'smooth',
    width: 5,
    colors: ['#E52421', '#D7D7D7'],
  },
  colors: ['#E52421', '#D7D7D7'],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.7,
      opacityTo: 0.0,
      stops: [30, 100, 100, 100],
    },
  },
  xaxis: {
    categories: props.categories,
    labels: {
      style: {
        fontSize: '14px'
      }
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: true,
      style: {
        fontSize: '12px',
        cssClass: 'apexcharts-yaxis-label',
      }
    },
    axisBorder: {
      show: true,
      offsetX: 3,
    },
  },
  grid: {
    show: true,
  },
  dataLabels: {
    enabled: false,
  },
});

onMounted(() => {
  let max = 0
  props.series.forEach((series) => {
    series.data.forEach((item) => {
      if (item > max) max = item
    })
  })
  if (max % 10 != 0) {
    max += (10 - (max % 10))
  }
  chartOptions.value.yaxis.min = 0
  chartOptions.value.yaxis.max = max
})
</script>
