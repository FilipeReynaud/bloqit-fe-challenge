import { PokemonProvider } from './pokemon.provider';
import { QueryProvider } from './query.provider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <PokemonProvider>{children}</PokemonProvider>
    </QueryProvider>
  );
};
