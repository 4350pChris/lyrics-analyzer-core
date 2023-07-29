<script lang="ts" setup>
import { type ArtistListResult } from '@/api/artists'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartData,
  type Point,
  type ChartOptions
} from 'chart.js'
import { Scatter } from 'vue-chartjs'

interface Props {
  artists: ArtistListResult[]
}

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const props = defineProps<Props>()

const chartData = computed<ChartData<'scatter', (number | Point | null)[], unknown>>(() => ({
  labels: props.artists.map(({ name }) => name),
  datasets: [
    {
      hitRadius: 25,
      pointStyle: (ctx) => {
        const img = new Image(52, 52)
        img.src = props.artists[ctx.dataIndex]?.imageUrl ?? ''
        return img
      },
      data: props.artists.map(({ stats }) => ({
        x: stats.uniqueWords,
        y: stats.medianLength
      }))
    }
  ]
}))

const options = ref<ChartOptions<'scatter'>>({
  plugins: {
    legend: {
      display: false
    }
  },
  responsive: true,
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      offset: true,
      title: {
        display: true,
        text: 'Unique words'
      }
    },
    y: {
      type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
      position: 'left',
      offset: true,
      title: {
        display: true,
        text: 'Median song length'
      }
    }
  }
})
</script>

<template>
  <div px="4" w="full">
    <Scatter :data="chartData" :options="options" />
  </div>
</template>
