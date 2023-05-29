<script lang="ts" setup>
import { type ArtistListResult } from '@/api/artists'
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { Scatter } from 'vue-chartjs'

interface Props {
  artists: ArtistListResult[]
}

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.artists.map(({ name }) => name),
  datasets: props.artists.map(({ stats, imageUrl }) => {
    return {
      hitRadius: 25,
      pointStyle: () => {
        const img = new Image(52, 52)
        img.src = imageUrl ?? ''
        return img
      },
      data: [
        {
          x: stats.uniqueWords,
          y: stats.medianLength
        }
      ]
    }
  })
}))

const options = ref({
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
  <div w="full">
    <h2>Statistics</h2>
    <Scatter :data="chartData" :options="options" />
  </div>
</template>
