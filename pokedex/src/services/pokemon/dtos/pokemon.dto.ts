import type { PokemonDetailsDto } from './pokemon-details.dto';

export interface PokemonDto extends PokemonDetailsDto {
  description: string;
}
