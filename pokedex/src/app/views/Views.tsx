import { useState } from 'react';
import { useSearchParamsState } from '@/hooks';
import { usePokedex } from '@/providers/pokedex.provider';
import { DexEntryDetailsDialog } from '@/components/dex-entry-details-dialog';
import { GridView } from './grid-view';
import { TableView } from './table-view';
import type { PokemonDto } from '@/services';

export const Views = () => {
  const { viewMode } = useSearchParamsState();
  const { caughtPokemon, catchPokemon, releasePokemon, onAddNote } =
    usePokedex();

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
        <TableView onSelectPokemon={onSelectPokemon} />
      )}

      {selectedPokemon && (
        <DexEntryDetailsDialog
          isOpen={isDetailsModalOpen}
          onOpenChange={closeDetailsModal}
          pokemon={selectedPokemon}
          caughtTimestamp={caughtPokemon[selectedPokemon.id]?.timestamp}
          caughtNotes={caughtPokemon[selectedPokemon.id]?.notes}
          onAddCaughtNote={onAddNote}
          toogleCatch={
            !!caughtPokemon[selectedPokemon.id]
              ? () => releasePokemon(selectedPokemon.id)
              : () => catchPokemon(selectedPokemon.id)
          }
        />
      )}
    </>
  );
};
