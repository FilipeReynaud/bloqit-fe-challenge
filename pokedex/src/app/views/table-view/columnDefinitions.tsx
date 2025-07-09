import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Checkbox,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui';
import { TYPE_COLORS } from '@/shared';
import { usePokedex } from '@/providers/pokedex.provider';
import { Pokeball } from '@/components/pokeball';
import type { PokemonDto, Sprites, Stats, Types } from '@/services';

export const columnDefinitions: ColumnDef<PokemonDto>[] = [
  {
    id: 'select',
    header: () => {
      const {
        caughtPokemon,
        selectedPokemonIds,
        selectPokemon,
        unSelectPokemon,
      } = usePokedex();
      const hasCaughtPokemon = Object.keys(caughtPokemon).length > 0;
      const isAllCaughtSelected =
        hasCaughtPokemon &&
        Object.keys(caughtPokemon).length === selectedPokemonIds.length;
      const isSomeCaughtSelected =
        !isAllCaughtSelected && selectedPokemonIds.length > 0;

      const toggleChecked = () => {
        const caughtIds = Object.keys(caughtPokemon).map((strId) =>
          parseInt(strId)
        );
        if (isAllCaughtSelected) {
          unSelectPokemon(caughtIds);
        } else {
          selectPokemon(caughtIds);
        }
      };

      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="flex">
              <Checkbox
                checked={
                  isAllCaughtSelected ||
                  (isSomeCaughtSelected && 'indeterminate')
                }
                onCheckedChange={toggleChecked}
                aria-label="Select all"
                disabled={!hasCaughtPokemon}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {hasCaughtPokemon
                ? 'Select all caught pokemon'
                : 'Catch some pokemon first!'}
            </p>
          </TooltipContent>
        </Tooltip>
      );
    },
    cell: ({ row }) => {
      const {
        caughtPokemon,
        selectedPokemonIds,
        selectPokemon,
        unSelectPokemon,
      } = usePokedex();
      const pokemonId: number = row.getValue('id');
      const isCaught = !!caughtPokemon[pokemonId];

      if (!isCaught) return null;

      const isChecked = selectedPokemonIds.includes(pokemonId);
      const onCheck = () => {
        isChecked ? unSelectPokemon(pokemonId) : selectPokemon(pokemonId);
      };

      return (
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheck}
          aria-label="Select pokemon"
        />
      );
    },
  },
  {
    accessorKey: 'id',
    header: () => <span className="font-semibold">Dex ID</span>,
    cell: ({ row }) => {
      const id: number = row.getValue('id');
      return `#${id}`;
    },
  },
  {
    accessorKey: 'sprites',
    header: () => <span className="font-semibold">Sprite</span>,
    cell: ({ row }) => {
      const sprites: Sprites = row.getValue('sprites');
      return (
        <img src={sprites.front_default} alt="sprite" className="w-12 h-12" />
      );
    },
  },
  {
    accessorKey: 'name',
    header: () => <span className="font-semibold">Name</span>,
    cell: ({ row }) => {
      const name: string = row.getValue('name');
      return <span className="capitalize">{name}</span>;
    },
  },
  {
    accessorKey: 'types',
    header: () => <span className="font-semibold">Types</span>,
    cell: ({ row }) => {
      const types: Types = row.getValue('types');
      return (
        <div className="flex gap-1 justify-center w-fit">
          {types.map((type) => (
            <Badge
              key={type.type.name}
              className={`${TYPE_COLORS[type.type.name]} text-white text-xs`}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'height',
    header: () => <span className="font-semibold">Height</span>,
    cell: ({ row }) => {
      const height: number = row.getValue('height');
      return `${height / 10} m`;
    },
  },
  {
    accessorKey: 'weight',
    header: () => <span className="font-semibold">Weight</span>,
    cell: ({ row }) => {
      const weight: number = row.getValue('weight');
      return `${weight / 10} kg`;
    },
  },
  {
    id: 'stats',
    header: () => <span className="font-semibold">HP</span>,
    accessorFn: (pokemon: PokemonDto) => pokemon.stats,
    cell: ({ row }) => {
      const stats: Stats = row.getValue('stats');
      return findAndFormatStat(stats, 'hp');
    },
  },
  {
    id: 'attack',
    header: () => <span className="font-semibold">Attack</span>,
    accessorFn: (pokemon: PokemonDto) => pokemon.stats,
    cell: ({ row }) => {
      const stats: Stats = row.getValue('stats');
      return findAndFormatStat(stats, 'attack');
    },
  },
  {
    id: 'defense',
    header: () => <span className="font-semibold">Defense</span>,
    accessorFn: (pokemon: PokemonDto) => pokemon.stats,
    cell: ({ row }) => {
      const stats: Stats = row.getValue('stats');
      return findAndFormatStat(stats, 'defense');
    },
  },
  {
    id: 'caught',
    header: () => <span className="font-semibold">Caught</span>,
    accessorFn: (pokemon: PokemonDto) => pokemon.id,
    cell: ({ row }) => {
      const { caughtPokemon } = usePokedex();

      const id: number = row.getValue('id');
      const caughtDate = caughtPokemon[id];
      const isCaught = !!caughtDate;

      if (!isCaught) {
        return (
          <div className="w-[96px]">
            <Pokeball isCaught={isCaught} />
          </div>
        );
      }

      return (
        <Badge variant="secondary" className="flex gap-1 w-fit px-1">
          <Pokeball isCaught={isCaught} />
          {format(caughtDate, 'dd/MM/yyyy')}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: () => <span className="font-semibold">Actions</span>,
    cell: ({ row, table }) => {
      const { caughtPokemon, releasePokemon, catchPokemon } = usePokedex();

      const id: number = row.getValue('id');
      const isCaught = !!caughtPokemon[id];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isCaught ? (
              <DropdownMenuItem onClick={() => releasePokemon(id)}>
                Release
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => catchPokemon(id)}>
                Catch
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.onClick(row.original);
              }}
            >
              See Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const findAndFormatStat = (stats: Stats, key: string) => {
  const statIndex = stats.findIndex((stat) => stat.stat.name === key);
  if (statIndex < 0) return '--';
  return stats[statIndex].base_stat;
};
