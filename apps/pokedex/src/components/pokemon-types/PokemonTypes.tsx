import { Badge } from '@/components/ui';
import { type PokemonType, TYPE_COLORS } from '@/shared';

export interface PokemonTypesProps {
  types: PokemonType[];

  /**
   * @default length of `types`
   */
  maxNrOfTypes?: number;
}

export const PokemonTypes = ({
  types,
  maxNrOfTypes = types.length,
}: PokemonTypesProps) => {
  const typesToShow = types.slice(0, maxNrOfTypes);
  const remainingTypes = types.slice(maxNrOfTypes);

  return (
    <div className="flex gap-1 justify-center capitalize">
      {typesToShow.map((type) => (
        <Badge
          key={type}
          className={`${TYPE_COLORS[type]} hover:${TYPE_COLORS[type]} text-white text-xs`}
        >
          {type}
        </Badge>
      ))}
      {remainingTypes.length > 0 && (
        <Badge variant="secondary" className="capitalize text-xs">
          +{remainingTypes.length}
        </Badge>
      )}
    </div>
  );
};
