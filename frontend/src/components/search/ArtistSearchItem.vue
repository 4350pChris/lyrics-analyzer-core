<script setup lang="ts">
import { type ArtistSearchResult } from '@/api/artists'

type Props = {
  artist: ArtistSearchResult
  active: boolean
  selected: boolean
}

defineProps<Props>()
</script>

<template>
  <li
    relative
    cursor="default"
    select="none"
    p="y-2 pr-4 l-10"
    :class="{
      'bg-teal-600 text-white': active,
      'text-gray-900': !active
    }"
  >
    <span block truncate :class="{ 'font-medium': selected, 'font-normal': !selected }">
      {{ artist.name }}
    </span>
    <span
      v-if="selected"
      absolute
      inset="y-0"
      left="0"
      flex
      items="center"
      p="l-3"
      :class="{ 'text-white': active, 'text-teal-600': !active }"
    >
      <div i-heroicons-check h="5" w="5" aria-hidden="true" />
    </span>
  </li>
</template>
