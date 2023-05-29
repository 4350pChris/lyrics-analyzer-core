<script lang="ts" setup>
import { listArtists, type ArtistListResult } from '../api/artists'

const artists = ref<ArtistListResult[]>()
onMounted(async () => {
  artists.value = await listArtists()
})
</script>

<template>
  <main flex="~ col" justify="center" items="center" gap="4" font="sans">
    <ArtistSearch max-w-lg w-full />
    <StatsChart v-if="artists" :artists="artists" />
  </main>
</template>
