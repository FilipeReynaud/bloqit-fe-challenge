import { usePokemonData } from '@/providers/pokemon.provider';
import { DataTable } from '@/components/data-table';
import { columnDefinitions } from './columnDefinitions';
import type { PokemonDto } from '@/services';

export interface TableViewProps {
  onSelectPokemon: (pokemon: PokemonDto) => void;
}

export const TableView = ({ onSelectPokemon }: TableViewProps) => {
  const { pokemonData } = usePokemonData();

  return (
    <DataTable
      columns={columnDefinitions}
      data={pokemonData}
      meta={{
        onClick: onSelectPokemon,
      }}
    />
  );
};
