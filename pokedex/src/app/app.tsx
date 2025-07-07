import { useState } from 'react';
import { usePokemonData } from '@/providers/pokemon.provider';
import { usePokedex } from '@/providers/pokedex.provider';
import { DexEntryCard } from '@/components/dex-entry-card';
import { DexEntryDetailsDialog } from '@/components/dex-entry-details-dialog';
import { LoadingScreen } from '@/components/loading-screen';
import { PageHeader } from '@/components/page-header';
import { DexControls } from '@/components/dex-controls';
import type { PokemonDto } from '@/services/pokemon';

export function App() {
  const { pokemonData, totalNrOfPokemon, isLoadingPokedex } = usePokemonData();
  const {
    selectedPokemonIds,
    selectPokemon,
    unSelectPokemon,
    caughtPokemon,
    catchPokemon,
    releasePokemon,
  } = usePokedex();

  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDto | null>(
    null
  );
  const isDetailsModalOpen = !!selectedPokemon;

  if (isLoadingPokedex) {
    return <LoadingScreen />;
  }

  const closeDetailsModal = () => {
    setSelectedPokemon(null);
  };

  const onSelectPokemon = (pokemon: PokemonDto) => {
    setSelectedPokemon(pokemon);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <PageHeader totalCount={totalNrOfPokemon} caughtCount={100} />
      <DexControls />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {pokemonData.map((pokemon) => {
          const isChecked = selectedPokemonIds.includes(pokemon.id);
          const onCheck = isChecked
            ? () => unSelectPokemon(pokemon.id)
            : () => selectPokemon(pokemon.id);

          const isCaught = !!caughtPokemon[pokemon.id];
          const toogleCatch = isCaught
            ? () => releasePokemon(pokemon.id)
            : () => catchPokemon(pokemon.id);

          return (
            <DexEntryCard
              key={pokemon.name}
              pokemon={pokemon}
              isCaught={isCaught}
              toogleCatch={toogleCatch}
              onPokemonClick={() => onSelectPokemon(pokemon)}
              isChecked={isChecked}
              onCheck={onCheck}
            />
          );
        })}
      </div>

      {selectedPokemon && (
        <DexEntryDetailsDialog
          isOpen={isDetailsModalOpen}
          onOpenChange={closeDetailsModal}
          pokemon={selectedPokemon}
          isCaught={!!caughtPokemon[selectedPokemon.id]}
          toogleCatch={
            !!caughtPokemon[selectedPokemon.id]
              ? () => releasePokemon(selectedPokemon.id)
              : () => catchPokemon(selectedPokemon.id)
          }
          onShare={() => null}
        />
      )}
    </div>
  );
}

export default App;
