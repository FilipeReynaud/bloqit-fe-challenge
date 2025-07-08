import { useSearchParamsState } from '@/hooks';
import { usePokedex } from '@/providers/pokedex.provider';
import { PokemonDto } from '@/services';
import { useState } from 'react';
import { GridView } from './grid-view';
import { TableView } from './table-view';
import { DexEntryDetailsDialog } from '@/components/dex-entry-details-dialog';

export const Views = () => {
  const { viewMode } = useSearchParamsState();
  const { caughtPokemon, catchPokemon, releasePokemon } = usePokedex();

  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDto | null>(
    null
  );
  const isDetailsModalOpen = !!selectedPokemon;

  const closeDetailsModal = () => {
    setSelectedPokemon(null);
  };

  const onSelectPokemon = (pokemon: PokemonDto) => {
    setSelectedPokemon(pokemon);
  };

  return (
    <>
      {viewMode === 'grid' ? (
        <GridView onSelectPokemon={onSelectPokemon} />
      ) : (
        <TableView />
      )}

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
    </>
  );
};
