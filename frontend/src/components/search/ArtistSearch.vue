<script lang="ts" setup>
const query = ref('')

const searchResults = []
</script>

<template>
  <form action="/artists/search" role="search">
    <Combobox v-model="query" name="query">
      <ComboboxInput />
      <ComboboxOptions> </ComboboxOptions>
    </Combobox>
  </form>
</template>
