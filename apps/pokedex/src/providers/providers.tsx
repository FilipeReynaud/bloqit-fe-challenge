import { TooltipProvider } from '@/components/ui';
import { PokedexProvider } from './pokedex.provider';
import { PokemonProvider } from './pokemon.provider';
import { QueryProvider } from './query.provider';
import { OnlineManagerProvider } from './online-manager.provider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <OnlineManagerProvider>
      <QueryProvider>
        <PokedexProvider>
          <PokemonProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </PokemonProvider>
        </PokedexProvider>
      </QueryProvider>
    </OnlineManagerProvider>
  );
};
