import { usePokemonData } from '@/providers/pokemon.provider';
import { LoadingScreen } from '@/components/loading-screen';
import { PageHeader } from './page-header';
import { DexControls } from './dex-controls';
import { Views } from './views';

export function App() {
  const { isLoadingPokedex } = usePokemonData();

  if (isLoadingPokedex) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <PageHeader />
      <DexControls />
      <Views />
    </div>
  );
}

export default App;
