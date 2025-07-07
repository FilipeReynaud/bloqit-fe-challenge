import { POKEMON_TYPES } from '@/shared';
import { Checkbox } from '@radix-ui/react-checkbox';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@radix-ui/react-dialog';
import {
  Search,
  Grid,
  List,
  Table,
  Star,
  Filter,
  Download,
  Trash2,
} from 'lucide-react';
import {
  Button,
  DialogHeader,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { useState } from 'react';

export const DexControls = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'cards'>('grid');

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
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
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
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
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table className="w-4 h-4" />
          </Button>
        </div>

        <Button
          //   variant={showOnlyCaught ? 'default' : 'outline'}
          size="sm"
          //   onClick={() => setShowOnlyCaught(!showOnlyCaught)}
        >
          <Star className="w-4 h-4 mr-1" />
          Caught Only
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Types
            </Button>
          </DialogTrigger>
          <DialogContent>
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
                        setSelectedTypes([...selectedTypes, type]);
                      } else {
                        setSelectedTypes(
                          selectedTypes.filter((t) => t !== type)
                        );
                      }
                    }}
                  />
                  <label htmlFor={type} className="capitalize text-sm">
                    {type}
                  </label>
                </div>
              ))}
            </div>
            <Button onClick={() => setSelectedTypes([])}>Clear All</Button>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="sm"
          // onClick={exportToCSV}
        >
          <Download className="w-4 h-4 mr-1" />
          Export CSV
        </Button>

        {/* {selectedPokemon.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deletePokemon(selectedPokemon)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete ({selectedPokemon.length})
          </Button>
        )} */}
      </div>
    </div>
  );
};
