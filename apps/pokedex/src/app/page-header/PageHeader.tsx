import { Progress } from '@/components/ui';
import { Status } from '@/components/status';
import { usePokemonData } from '@/providers/pokemon.provider';
import { usePokedex } from '@/providers/pokedex.provider';
import { useIsOnline } from '@/hooks/useIsOnline';

export const PageHeader = () => {
  const { totalNrOfPokemon } = usePokemonData();
  const { caughtPokemon } = usePokedex();
  const isOnline = useIsOnline();

  const caughtCount = Object.keys(caughtPokemon).length;
  const progressPercentage =
    totalNrOfPokemon > 0 ? (caughtCount / totalNrOfPokemon) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">Pokédex</h1>
        <Status isOnline={isOnline} />
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Progress: {caughtCount}/{totalNrOfPokemon} Pokémon caught
          </span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={progressPercentage} />
      </div>
    </div>
  );
};
