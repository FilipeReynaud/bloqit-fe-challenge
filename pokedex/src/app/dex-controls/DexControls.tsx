import { POKEMON_TYPES, PokemonType } from '@/shared';
import {
  Search,
  Grid,
  Table,
  Star,
  Filter,
  Download,
  Trash2,
} from 'lucide-react';
import {
  Checkbox,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  Button,
  DialogHeader,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { usePokemonData } from '@/providers/pokemon.provider';
import { usePokedex } from '@/providers/pokedex.provider';
import { useSearchParamsState } from '@/hooks';
import { PokemonTypes } from '@/components/pokemon-types';

export const DexControls = () => {
  const {
    searchTerm,
    selectedTypes,
    sortBy,
    sortOrder,
    viewMode,
    showOnlyCaught,
    updateParam,
    updateTypes,
  } = useSearchParamsState();
  const { selectedPokemonIds, releasePokemon } = usePokedex();
  const { exportData } = usePokemonData();

  const btnClassNames = 'bg-blue-500 hover:bg-blue-500';

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => updateParam('search', e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(v) => updateParam('sortBy', v)}
          >
            <SelectTrigger className="w-32" data-testid="sort-by-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">ID</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="height">Height</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="caught">Caught Date</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() =>
              updateParam('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc')
            }
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateParam('viewMode', 'grid')}
            className={viewMode === 'grid' ? btnClassNames : ''}
            data-testid="grid-view-btn"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateParam('viewMode', 'table')}
            className={viewMode === 'table' ? btnClassNames : ''}
            data-testid="table-view-btn"
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>

        <Button
          variant={showOnlyCaught ? 'default' : 'outline'}
          className={showOnlyCaught ? btnClassNames : ''}
          size="sm"
          onClick={() =>
            updateParam('caughtOnly', showOnlyCaught ? '' : 'true')
          }
        >
          <Star className="w-4 h-4 mr-1" />
          Caught Only
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Types
              <PokemonTypes
                types={selectedTypes as PokemonType[]}
                maxNrOfTypes={3}
              />
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="types">
            <DialogHeader>
              <DialogTitle>Filter by Types</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-2">
              {POKEMON_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateTypes([...selectedTypes, type]);
                      } else {
                        updateTypes(selectedTypes.filter((t) => t !== type));
                      }
                    }}
                  />
                  <label htmlFor={type} className="capitalize text-sm">
                    {type}
                  </label>
                </div>
              ))}
            </div>
            <Button onClick={() => updateTypes([])} className={btnClassNames}>
              Clear All
            </Button>
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="sm" onClick={exportData}>
          <Download className="w-4 h-4 mr-1" />
          Export CSV
        </Button>

        {selectedPokemonIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => releasePokemon(selectedPokemonIds)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Release Into The Wild ({selectedPokemonIds.length})
          </Button>
        )}
      </div>
    </div>
  );
};
