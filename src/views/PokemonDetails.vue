<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { usePokedexStore } from '@/stores/pokedex';
import { storeToRefs } from 'pinia';
import PokemonDetails from '@/components/PokemonDetails.vue';
import { useRoute } from 'vue-router';
import type { VariablesParameter } from '@vue/apollo-composable/dist/useQuery';
import type { OperationVariables } from '@apollo/client';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { createToast } from 'mosha-vue-toastify';

const route = useRoute();
const pokedexStore = usePokedexStore();
const { getPokemon } = pokedexStore;
const { pokemon } = storeToRefs(pokedexStore);

const isLoading = ref<boolean>(false);

const pokemonId: VariablesParameter<OperationVariables> = computed(() => route.params.id);

onMounted(async () => {
  try {
    if (pokemonId.value) {
      isLoading.value = true;
      await getPokemon(pokemonId.value);
      isLoading.value = false;
    }
  } catch (e: any) {
    createToast('Erro ao buscar dados', { type: 'danger', position: 'bottom-right' });
  }
  isLoading.value = false;
});

watch(pokemonId, async () => {
  try {
    if (route.params.id) {
      isLoading.value = true;
      await getPokemon(pokemonId.value);
      isLoading.value = false;
    }
  } catch (e: any) {
    createToast('Erro ao buscar dados', { type: 'danger', position: 'bottom-right' });
  }
  isLoading.value = false;
});
</script>

<template>
  <div v-if="isLoading" class="pt-20 flex flex-1 justify-center">
    <PulseLoader :loading="isLoading" class="" color="#fcd34d" />
  </div>

  <div v-else class="flex items-center">
    <pokemon-details :pokemon="pokemon" />
  </div>
</template>
