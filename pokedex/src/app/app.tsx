import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DexEntryCard } from '@/components/dex-entry-card';
import { DexEntryDetailsDialog } from '@/components/dex-entry-details-dialog';
import { LoadingScreen } from '@/components/loading-screen';
import { PageHeader } from '@/components/page-header';
import { DexControls } from '@/components/dex-controls';
import { fetchPokemon, type PokemonDto } from '@/services/pokemon';

export function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDto | null>(
    null
  );

  const isDetailsModalOpen = !!selectedPokemon;
  const { data, isLoading } = useQuery<PokemonDto[]>({
    queryKey: ['pokemon-details'],
    queryFn: async (): Promise<PokemonDto[]> => {
      return await fetchPokemon();
    },
  });

  if (isLoading) {
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
      <PageHeader totalCount={data?.length ?? 0} caughtCount={100} />
      <DexControls />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data?.map((pokemon) => (
          <DexEntryCard
            key={pokemon.name}
            name={pokemon.name}
            dexId={pokemon.id.toString()}
            types={pokemon.types.map((type) => type.type.name)}
            sprite={pokemon.sprites.other['official-artwork'].front_default}
            isChecked={false}
            isCaught={true}
            onPokemonClick={() => onSelectPokemon(pokemon)}
            onCheck={() => null}
          />
        ))}
      </div>

      {selectedPokemon && (
        <DexEntryDetailsDialog
          isOpen={isDetailsModalOpen}
          onOpenChange={closeDetailsModal}
          name={selectedPokemon.name}
          dexId={selectedPokemon.id.toString()}
          types={selectedPokemon.types.map((type) => type.type.name)}
          sprite={selectedPokemon.sprites.front_default}
          description={selectedPokemon.description}
          height={selectedPokemon.height}
          weight={selectedPokemon.weight}
          stats={selectedPokemon.stats}
          gallerySprites={[]}
          isCaught={true}
          toggleCaught={() => null}
          onShare={() => null}
        />
      )}
    </div>
  );
}

export default App;
