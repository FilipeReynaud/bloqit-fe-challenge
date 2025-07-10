export interface ExportPokemonDto {
  id: number;
  name: string;
  height: string;
  weight: string;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  caught: 'Yes' | 'No';
  caught_at: string | undefined;
  note: string | undefined;
}
