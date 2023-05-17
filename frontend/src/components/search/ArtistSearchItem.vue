<script setup lang="ts">
import { type ArtistSearchResult } from '@/api/artists'

defineProps<{
  artist: ArtistSearchResult
}>()
</script>

<template>
  <div>{{ artist.name }}</div>
</template>
