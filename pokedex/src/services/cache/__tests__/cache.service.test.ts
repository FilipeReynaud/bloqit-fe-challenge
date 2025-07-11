import { CacheService, CacheKey, IndexedDBWrapper } from '../cache.service';

describe('CacheService', () => {
  let cacheService: CacheService;
  let mockDB: Record<string, any>;

  beforeEach(() => {
    mockDB = {};

    // Mock DB initilization
    jest
      .spyOn(IndexedDBWrapper.prototype as any, 'openDB')
      .mockImplementation(() => {
        return Promise.resolve({} as IDBDatabase);
      });

    // Mock DB CRUD methods
    jest
      .spyOn(IndexedDBWrapper.prototype, 'set')
      .mockImplementation((key, value) => {
        mockDB[key] = value;
        return Promise.resolve();
      });
    jest.spyOn(IndexedDBWrapper.prototype, 'get').mockImplementation((key) => {
      return Promise.resolve(mockDB[key] ?? null);
    });
    jest
      .spyOn(IndexedDBWrapper.prototype, 'remove')
      .mockImplementation((key) => {
        delete mockDB[key];
        return Promise.resolve();
      });
    jest.spyOn(IndexedDBWrapper.prototype, 'clear').mockImplementation(() => {
      mockDB = {};
      return Promise.resolve();
    });

    cacheService = CacheService.getInstance();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sets and gets a value', async () => {
    // Arrange
    const key: CacheKey = 'pokemonData';
    const value = { foo: 'bar' };

    // Act
    await cacheService.set(key, value);
    const result = await cacheService.get<typeof value>(key);

    // Assert
    expect(result).toEqual(value);
  });

  it('removes a value', async () => {
    // Arrange
    const key: CacheKey = 'caughtPokemon';
    const value = [1, 2, 3];
    await cacheService.set(key, value);

    // Act
    await cacheService.remove(key);
    const result = await cacheService.get<typeof value>(key);

    // Assert
    expect(result).toBeNull();
  });

  it('clears all values', async () => {
    // Arrange
    await cacheService.set('pokemonData', { a: 1 });
    await cacheService.set('caughtPokemon', [1, 2]);

    // Act
    await cacheService.clear();
    const result1 = await cacheService.get('pokemonData');
    const result2 = await cacheService.get('caughtPokemon');

    // Assert
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
