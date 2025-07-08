import { usePokemonData } from '@/providers/pokemon.provider';
import { LoadingScreen } from '@/components/loading-screen';
import { PageHeader } from '@/components/page-header';
import { DexControls } from '@/components/dex-controls';
import { Views } from './views';

export function App() {
  const { totalNrOfPokemon, isLoadingPokedex } = usePokemonData();

  if (isLoadingPokedex) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <PageHeader totalCount={totalNrOfPokemon} caughtCount={100} />
      <DexControls />
      <Views />
    </div>
  );
}

export default App;
