import { defineStore, storeToRefs } from 'pinia';
import { computed, type ComputedRef, onMounted, ref } from 'vue';
import type { PokedexBaseResult } from '@/types';
import { createToast } from 'mosha-vue-toastify';
import localStorage from '@/composables/localStorage';
import { usePokedexStore } from '@/stores/pokedex';

export const useTeamStore = defineStore('team', () => {
  const team = ref<PokedexBaseResult[]>([]);
  const { pokemonTeam, addToStorage, removeFromStorage, resetStorage } = localStorage();

  const pokedexStore = usePokedexStore();
  const { pokedex } = storeToRefs(pokedexStore);
  const { getPokemonById } = pokedexStore;

  onMounted(() => {
    //@ts-ignore
    for (let pokemon of Object.values(pokemonTeam.value)) {
      team.value.push(pokemon);
    }
  });

  const alreadyInTeam: ComputedRef<boolean> = computed<boolean>((): any => {
    return (pokemonId: number): boolean => !!team.value.find((poke: PokedexBaseResult) => poke.id === pokemonId);
  });

  const teamSize: ComputedRef<number> = computed<number>(() => {
    return team.value.length;
  });

  function addToTeam(pokemon: PokedexBaseResult): void {
    try {
      checkTeamSize();
      const alreadyAdded = !!team.value.find((poke: PokedexBaseResult) => poke.id === pokemon.id);
      if (!alreadyAdded) {
        addToStorage(pokemon);
        team.value.push(pokemon);
      }
    } catch (e: any) {
      createToast(e.message, { type: 'danger', position: 'bottom-right' });
    }
  }

  function removeFromTeam(pokemon: PokedexBaseResult): void {
    const pokemonIndex = team.value.findIndex((poke: PokedexBaseResult) => poke.id === pokemon.id);
    removeFromStorage(pokemon.name);
    team.value.splice(pokemonIndex, 1);
  }

  function generateTeam(): void {
    resetTeam(false);
    resetStorage();
    let pokemonIndex: Number[] = [];
    if (pokedex.value.length > 8) {
      while (pokemonIndex.length < 8) {
        const randomIndex = Math.round(Math.random() * (pokedex.value.length - 1));
        if (!pokemonIndex.includes(randomIndex)) {
          pokemonIndex.push(randomIndex);
          const pokemonId: number = pokedex.value[randomIndex].id;
          addToTeam(getPokemonById(pokemonId));
        }
      }
      createToast('Time Gerado', { type: 'success', position: 'bottom-right' });
    } else {
      createToast('Atualize os filtros para gerar equipe', { type: 'danger', position: 'bottom-right' });
    }
  }

  function resetTeam(showToast: boolean): void {
    team.value = [];
    if (showToast) createToast('Time restaurado', { type: 'success', position: 'bottom-right' });
  }

  function checkTeamSize() {
    if (team.value.length === 8) {
      throw { message: 'Equipe já na capacidade máxima!' };
    }
  }

  return { team, addToTeam, removeFromTeam, resetTeam, alreadyInTeam, generateTeam, teamSize };
});
