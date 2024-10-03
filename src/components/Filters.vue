<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import localStorage from '@/composables/localStorage';
import { usePokedexStore } from '@/stores/pokedex';
const emit = defineEmits(['loading']);
const pokedexStore = usePokedexStore();
const { getFilteredPokemons } = pokedexStore;
const storage = localStorage();
const { addFiltersToStorage } = storage;
const { filters } = localStorage();

const filter = reactive({
  search: '',
  types: [],
});

let timer: any;

const filterPokemons = () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    emit('loading', true);
    await getFilteredPokemons(filter.search, filter.types);
    emit('loading', false);
  }, 1000);
};

watch(
  () => filter.types,
  async (value) => {
    if (value) {
      addFiltersToStorage(filter);
      emit('loading', true);
      await getFilteredPokemons(filter.search, filter.types);
      emit('loading', false);
    }
  }
);

onMounted(() => {
  filter.search = filters.value.search;
  filter.types = filters.value.types;
});
</script>

<template>
  <div class="flex pb-5">
    <div>
      <input
        v-model="filter.search"
        @input="filterPokemons"
        type="search"
        autocomplete="off"
        placeholder="Pesquisar por nome..."
        class="border bg-gray-50 border-gray-300 text-gray-900 font-mono rounded-md p-2 text-sm placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500 outline-0"
      />
    </div>
  </div>
</template>
