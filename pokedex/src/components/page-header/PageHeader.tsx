import { Progress } from '@/components/ui';
import { Status } from '@/components/status';

export const PageHeader = () => {
  const caughtCount = 10;
  const totalCount = 700;

  const progressPercentage =
    totalCount > 0 ? (caughtCount / totalCount) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">Pokédex</h1>
        <Status />
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Progress: {caughtCount}/{totalCount} Pokémon caught
          </span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
};
