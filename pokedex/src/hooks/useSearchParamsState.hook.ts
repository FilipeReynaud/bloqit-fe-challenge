import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'table';

export interface UseSearchParamsState {
  searchTerm: string;
  selectedTypes: string[];
  sortBy: string;
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
  const sortBy = searchParams.get('sortBy') || 'id';
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || 'asc';
  const viewMode = (searchParams.get('viewMode') as ViewMode) || 'grid';
  const showOnlyCaught = searchParams.get('caughtOnly') === 'true';

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
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
