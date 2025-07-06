import { Card, CardContent, Button, Checkbox, Badge } from '@/components/ui';
import { Pokeball } from '@/components/pokeball';
import { type PokemonType, TYPE_COLORS } from '@/shared';

export interface DexEntryCardProps {
  /**
   * Pokemon name
   */
  name: string;

  /**
   * Pokemon Pokedex ID
   */
  dexId: string;

  /**
   * Pokemon spirit
   */
  sprite: string;

  /**
   * Pokemon main types
   */
  types: PokemonType[];

  /**
   * Wether the pokemon was caught
   * @default false
   */
  isCaught?: boolean;

  /**
   * Callback triggered on catch
   */
  onCatch?: () => void;

  /**
   * If the card checkbox is checked
   */
  isChecked: boolean;

  /**
   * On check callback
   */
  onCheck: (isChecked: boolean) => void;

  /**
   * Callback fired on click
   */
  onPokemonClick: () => void;
}

export const DexEntryCard = ({
  name,
  dexId,
  sprite,
  types,
  isCaught,
  onCatch,
  isChecked,
  onCheck,
  onPokemonClick,
}: DexEntryCardProps) => {
  return (
    <Card className="relative cursor-pointer hover:shadow-lg transition-shadow">
      <div className="absolute top-2 left-2 z-10">
        <Checkbox checked={isChecked} onCheckedChange={onCheck} />
      </div>
      <div className="absolute top-2 right-2 z-10">
        <Button variant="ghost" size="sm" onClick={onCatch} className="">
          <Pokeball isCaught={isCaught} />
        </Button>
      </div>
      <CardContent className="p-8 text-center" onClick={onPokemonClick}>
        <img src={sprite} alt={name} className="w-20 h-20 mx-auto mb-2" />
        <h3 className="font-semibold capitalize">{name}</h3>
        <p className="text-sm text-muted-foreground">
          #{dexId.toString().padStart(3, '0')}
        </p>
        <div className="flex gap-1 justify-center mt-2">
          {types.map((type) => (
            <Badge
              key={type}
              className={`${TYPE_COLORS[type]} text-white text-xs`}
            >
              {type}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
