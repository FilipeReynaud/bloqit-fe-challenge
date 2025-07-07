import { PokemonDto } from '@/services';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SortBy = keyof Pick<
  PokemonDto,
  'id' | 'name' | 'height' | 'weight'
>;
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'table';

const DEFAULT_SORT_BY: SortBy = 'id';
const DEFAULT_SORT_ORDER: SortOrder = 'asc';
const DEFAULT_VIEW_MODE: ViewMode = 'grid';

export interface UseSearchParamsState {
  searchTerm: string;
  selectedTypes: string[];
  sortBy: SortBy;
  sortOrder: SortOrder;
  viewMode: ViewMode;
  showOnlyCaught: boolean;
  updateParam: (key: string, value: string) => void;
  updateTypes: (types: string[]) => void;
}

export const useSearchParamsState = (): UseSearchParamsState => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('search') || '';
  const selectedTypes = useMemo(() => {
    const types = searchParams.get('types');
    return types ? types.split(',').filter(Boolean) : [];
  }, [searchParams]);
  const sortBy = (searchParams.get('sortBy') as SortBy) || DEFAULT_SORT_BY;
  const sortOrder =
    (searchParams.get('sortOrder') as SortOrder) || DEFAULT_SORT_ORDER;
  const viewMode =
    (searchParams.get('viewMode') as ViewMode) || DEFAULT_VIEW_MODE;
  const showOnlyCaught = searchParams.get('caughtOnly') === 'true';

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams, { replace: true });
  };

  const updateTypes = (types: string[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (types.length > 0) {
      newParams.set('types', types.join(','));
    } else {
      newParams.delete('types');
    }

    setSearchParams(newParams, { replace: true });
  };

  return {
    searchTerm,
    selectedTypes,
    sortBy,
    sortOrder,
    viewMode,
    showOnlyCaught,
    updateParam,
    updateTypes,
  };
};
