<script lang="ts" setup>
import { type ArtistSearchResult, searchArtists } from '@/api/artists'

const query = ref('')
const selectedArtist = defineModel<ArtistSearchResult>()
const searchResults = ref<ArtistSearchResult[]>([])

const search = async (q: string) => {
  if (!q) {
    searchResults.value = []
    return
  }

  try {
    searchResults.value = await searchArtists(q)
  } catch (e) {
    console.error(e)
  }
}

watchDebounced(query, (q) => search(q), { debounce: 250 })
</script>

<template>
  <Combobox v-model="selectedArtist">
    <ComboboxInput
      @change="query = $event.target.value"
      :displayValue="(artist: ArtistSearchResult) => artist.name"
    />
    <ComboboxOptions>
      <ComboboxOption v-for="artist in searchResults" :key="artist.id" :value="artist">
        <ArtistSearchItem :artist="artist" />
      </ComboboxOption>
    </ComboboxOptions>
  </Combobox>
</template>
