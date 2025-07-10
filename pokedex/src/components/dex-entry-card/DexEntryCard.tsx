import { Card, CardContent, Button, Checkbox, Badge } from '@/components/ui';
import { Pokeball } from '@/components/pokeball';
import { TYPE_COLORS } from '@/shared';
import type { PokemonDto } from '@/services';
import { PokemonTypes } from '../pokemon-types';

export interface DexEntryCardProps {
  /**
   * Pokemon data
   */
  pokemon: PokemonDto;

  /**
   * Wether the pokemon was caught
   * @default false
   */
  isCaught?: boolean;

  /**
   * Callback triggered to toggle catch state (caught or not)
   */
  toogleCatch?: () => void;

  /**
   * If the card checkbox is checked
   */
  isChecked: boolean;

  /**
   * On check callback
   */
  onCheck: () => void;

  /**
   * Callback fired on click
   */
  onPokemonClick: () => void;
}

export const DexEntryCard = ({
  pokemon,
  isCaught,
  toogleCatch,
  isChecked,
  onCheck,
  onPokemonClick,
}: DexEntryCardProps) => {
  return (
    <Card className="relative cursor-pointer hover:shadow-lg transition-shadow hover:border-red-500">
      <div className="absolute top-2 left-2 z-10">
        {isCaught && <Checkbox checked={isChecked} onCheckedChange={onCheck} />}
      </div>
      <div className="absolute top-2 right-2 z-10">
        <Button variant="ghost" size="sm" onClick={toogleCatch} className="">
          <Pokeball isCaught={isCaught} />
        </Button>
      </div>
      <CardContent className="p-8 text-center" onClick={onPokemonClick}>
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          className="w-20 h-20 mx-auto mb-2"
        />
        <h3 className="font-semibold capitalize">{pokemon.name}</h3>
        <p className="text-sm text-muted-foreground">
          #{pokemon.id.toString().padStart(3, '0')}
        </p>
        <PokemonTypes types={pokemon.types.map((type) => type.type.name)} />
      </CardContent>
    </Card>
  );
};
