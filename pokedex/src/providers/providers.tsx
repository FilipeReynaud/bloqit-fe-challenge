import { PokedexProvider } from './pokedex.provider';
import { PokemonProvider } from './pokemon.provider';
import { QueryProvider } from './query.provider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <PokedexProvider>
        <PokemonProvider>{children}</PokemonProvider>
      </PokedexProvider>
    </QueryProvider>
  );
};
