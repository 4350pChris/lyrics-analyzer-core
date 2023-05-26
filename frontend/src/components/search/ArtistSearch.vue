<script lang="ts" setup>
import { type ArtistSearchResult, searchArtists, addArtist } from '@/api/artists'
import { toast } from 'vue3-toastify'

const error = ref(false)
const query = ref('')
const selectedArtist = ref<ArtistSearchResult>()
const searchResults = ref<ArtistSearchResult[]>([])

const search = async (q: string) => {
  error.value = false

  if (!q) {
    searchResults.value = []
    return
  }

  try {
    searchResults.value = await searchArtists(q)
  } catch (e) {
    error.value = true
  }
}

watchDebounced(query, (q) => search(q), { debounce: 250 })

whenever(selectedArtist, async ({ id }) => {
  try {
    await addArtist(id)
    toast.success('Artist added!')
  } catch (e) {
    // TODO: add notification or something
    console.error(e)
  }
})
</script>

<template>
  <Combobox v-model="selectedArtist" by="id">
    <div relative m="t-1">
      <ComboboxInput
        p="y-2 x-4"
        w="full"
        text="sm gray-900"
        leading="5"
        ring="focus:0"
        border="none"
        bg="gray-200"
        @change="query = $event.target.value"
        :displayValue="(artist: ArtistSearchResult) => artist.name"
      />
      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          absolute
          inset-x="0"
          m="t-1"
          w="full"
          overflow="auto"
          list="none"
          rounded="md"
          bg="white"
          p="1"
          text="base sm:sm"
          outline="focus:none"
          shadow="lg"
          ring="1 black opacity-5"
          max-h-60
        >
          <div
            v-if="error || (searchResults.length === 0 && query !== '')"
            relative
            cursor="default"
            select="none"
            p="y-2 x-4"
            text="gray-700"
          >
            {{ error ? 'Error while searching.' : 'Nothing found.' }}
          </div>
          <ComboboxOption
            v-for="artist in searchResults"
            :key="artist.id"
            :value="artist"
            as="template"
            v-slot="{ active, selected }"
          >
            <ArtistSearchItem :artist="artist" :active="active" :selected="selected" />
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>
