import { renderHook, act } from '@testing-library/react';
import { useSearchParamsState } from '../useSearchParamsState.hook';

// Mock useSearchParams from react-router-dom
const setSearchParams = jest.fn();
let params: Record<string, string> = {};
const mockUseSearchParams = [
  {
    get: (key: string) => params[key] ?? null,
    toString: () => new URLSearchParams(params).toString(),
  },
  setSearchParams,
];

jest.mock('react-router-dom', () => ({
  useSearchParams: () => mockUseSearchParams,
}));

describe('useSearchParamsState', () => {
  beforeEach(() => {
    params = {};
    setSearchParams.mockClear();
  });

  it('returns default values when no params are set', () => {
    // Act
    const { result } = renderHook(() => useSearchParamsState());

    // Assert
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedTypes).toEqual([]);
    expect(result.current.sortBy).toBe('id');
    expect(result.current.sortOrder).toBe('asc');
    expect(result.current.viewMode).toBe('grid');
    expect(result.current.showOnlyCaught).toBe(false);
  });

  it('parses values from params', () => {
    // Arrange
    params = {
      search: 'bulba',
      types: 'grass,poison',
      sortBy: 'name',
      sortOrder: 'desc',
      viewMode: 'table',
      caughtOnly: 'true',
    };

    // Act
    const { result } = renderHook(() => useSearchParamsState());

    // Assert
    expect(result.current.searchTerm).toBe('bulba');
    expect(result.current.selectedTypes).toEqual(['grass', 'poison']);
    expect(result.current.sortBy).toBe('name');
    expect(result.current.sortOrder).toBe('desc');
    expect(result.current.viewMode).toBe('table');
    expect(result.current.showOnlyCaught).toBe(true);
  });

  it('updateParam sets and deletes params', () => {
    // Arrange
    const { result } = renderHook(() => useSearchParamsState());

    // Act
    act(() => {
      result.current.updateParam('search', 'pikachu');
    });

    // Assert
    const setCall = setSearchParams.mock.calls[0][0];
    expect(setCall.get('search')).toBe('pikachu');

    // Act
    act(() => {
      result.current.updateParam('search', '');
    });

    // Assert
    const deleteCall = setSearchParams.mock.calls[1][0];
    expect(deleteCall.get('search')).toBeNull();
  });

  it('updateTypes sets and deletes types param', () => {
    // Arrange
    const { result } = renderHook(() => useSearchParamsState());

    // Act
    act(() => {
      result.current.updateTypes(['fire', 'water']);
    });

    // Assert
    const setTypesCall = setSearchParams.mock.calls[0][0];
    expect(setTypesCall.get('types')).toBe('fire,water');

    // Act
    act(() => {
      result.current.updateTypes([]);
    });

    // Assert
    const deleteTypesCall = setSearchParams.mock.calls[1][0];
    expect(deleteTypesCall.get('types')).toBeNull();
  });
});
