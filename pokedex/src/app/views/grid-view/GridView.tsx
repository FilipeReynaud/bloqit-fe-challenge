import { DexEntryCard } from '@/components/dex-entry-card';
import { usePokedex } from '@/providers/pokedex.provider';
import { usePokemonData } from '@/providers/pokemon.provider';
import { PokemonDto } from '@/services';

export interface GridViewProps {
  onSelectPokemon: (pokemon: PokemonDto) => void;
}

export const GridView = ({ onSelectPokemon }: GridViewProps) => {
  const { pokemonData } = usePokemonData();
  const {
    selectedPokemonIds,
    selectPokemon,
    unSelectPokemon,
    caughtPokemon,
    catchPokemon,
    releasePokemon,
  } = usePokedex();

  const isEmpty = pokemonData.length === 0;
  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No Pokémon found. Please adjust your criteria.
        </p>
      </div>
    );
  }

  return (
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
  );
};
