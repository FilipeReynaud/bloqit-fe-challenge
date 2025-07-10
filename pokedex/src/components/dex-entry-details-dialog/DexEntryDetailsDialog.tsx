import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@/components/ui';
import { Share2 } from 'lucide-react';
import { RadarChart } from '@/components/radar-chart';
import { Pokeball } from '@/components/pokeball';
import { PokemonTypes } from '../pokemon-types';
import type { PokemonDto } from '@/services';

export interface DexEntryDetailsDialogProps {
  /**
   * Pokemon data
   */
  pokemon: PokemonDto;

  /**
   * Whether the details dialog is open.
   */
  isOpen: boolean;

  /**
   * Callback fired when the open state changes.
   * @param isOpen - The new open state.
   */
  onOpenChange: (isOpen: boolean) => void;

  /**
   * Whether the Pokémon is marked as caught.
   */
  isCaught: boolean;

  /**
   * Callback to toggle the caught state.
   */
  toogleCatch: () => void;

  /**
   * Callback fired when the share action is triggered.
   */
  onShare: () => void;
}

export const DexEntryDetailsDialog = ({
  isOpen,
  onOpenChange,
  pokemon,
  isCaught,
  toogleCatch,
  onShare,
}: DexEntryDetailsDialogProps) => {
  const gallerySprites: string[] = [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="flex gap-4 capitalize text-2xl items-center">
            <Pokeball isCaught={isCaught} />
            {pokemon.name} #{pokemon.id.toString().padStart(3, '0')}{' '}
            <PokemonTypes types={pokemon.types.map((type) => type.type.name)} />
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes" disabled={!isCaught}>
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-2">
            <div className="flex items-center justify-center">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-48 h-48"
              />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                {pokemon.description}
              </p>
            </div>
          </TabsContent>

          <TabsContent
            value="stats"
            className="space-y-6 mt-2 flex justify-center"
          >
            <div className="h-[300px] w-[300px]">
              <RadarChart
                data={pokemon.stats.map((stat) => ({
                  stat: stat.stat.name,
                  value: stat.base_stat,
                }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-2">
            <div>
              <h3 className="font-semibold mb-3">Physical Attributes</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="font-medium">Height:</span>
                  <span>{pokemon.height / 10} m</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="font-medium">Weight:</span>
                  <span>{pokemon.weight / 10} kg</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Sprite Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallerySprites.map((sprite) => (
                  <div
                    key={sprite}
                    className="text-center p-3 bg-muted/30 rounded"
                  >
                    <img
                      src={sprite}
                      alt="Front"
                      className="w-20 h-20 mx-auto"
                    />
                    <p className="text-xs mt-1">Front</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Catch Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Days in collection:</span>
                    <span className="font-medium">
                      {Math.floor(
                        (Date.now() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Catch time:</span>
                    <span className="font-medium">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Personal Notes</h3>
                <Textarea
                  placeholder={`Share your memories with this Pokémon ${name}`}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              onClick={toogleCatch}
              className={`flex-1 ${!isCaught ? 'hover:bg-green-600' : ''}`}
              variant={isCaught ? 'destructive' : 'default'}
            >
              <Pokeball isCaught={isCaught} />
              {isCaught ? 'Release' : 'Catch!'}
            </Button>
            <Button variant="outline" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
