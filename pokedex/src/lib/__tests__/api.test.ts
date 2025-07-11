import { api } from '../api';

let mockGet: jest.Mock;

jest.mock('axios', () => {
  return {
    default: {
      create: jest.fn(() => ({
        get: (...args: any[]) => mockGet(...args),
      })),
    },
    create: jest.fn(() => ({
      get: (...args: any[]) => mockGet(...args),
    })),
  };
});

describe('API', () => {
  beforeEach(() => {
    mockGet = jest.fn();
  });

  it('should return data from a successful GET request', async () => {
    // Arrange
    const mockData = { foo: 'bar' };
    mockGet.mockResolvedValue({ data: mockData });

    // Act
    const result = await api.get('/test-url');

    // Assert
    expect(result).toEqual(mockData);
    expect(mockGet).toHaveBeenCalledWith('/test-url', undefined);
  });

  it('should pass config to axios.get', async () => {
    // Arrange
    mockGet.mockResolvedValue({ data: 123 });
    const config = { headers: { Authorization: 'Bearer token' } };

    // Act
    await api.get('/test-url', config);

    // Assert
    expect(mockGet).toHaveBeenCalledWith('/test-url', config);
  });

  it('should throw if axios.get fails', async () => {
    // Arrange
    const error = new Error('Network error');
    mockGet.mockRejectedValue(error);

    // Act & Assert
    await expect(api.get('/fail')).rejects.toThrow('Network error');
  });
});
