import { useState } from 'react';
import { usePokedex } from '@/providers/pokemon.provider';
import { DexEntryCard } from '@/components/dex-entry-card';
import { DexEntryDetailsDialog } from '@/components/dex-entry-details-dialog';
import { LoadingScreen } from '@/components/loading-screen';
import { PageHeader } from '@/components/page-header';
import { DexControls } from '@/components/dex-controls';
import type { PokemonDto } from '@/services/pokemon';

export function App() {
  const { pokemonData, isLoadingPokedex } = usePokedex();
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
      <PageHeader totalCount={pokemonData?.length ?? 0} caughtCount={100} />
      <DexControls />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {pokemonData?.map((pokemon) => (
          <DexEntryCard
            key={pokemon.name}
            pokemon={pokemon}
            isChecked={false}
            isCaught={false}
            onPokemonClick={() => onSelectPokemon(pokemon)}
            onCheck={() => null}
          />
        ))}
      </div>

      {selectedPokemon && (
        <DexEntryDetailsDialog
          isOpen={isDetailsModalOpen}
          onOpenChange={closeDetailsModal}
          pokemon={selectedPokemon}
          isCaught={false}
          toggleCaught={() => null}
          onShare={() => null}
        />
      )}
    </div>
  );
}

export default App;
