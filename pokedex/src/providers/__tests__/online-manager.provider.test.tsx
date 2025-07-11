import { render, act } from '@testing-library/react';
import { OnlineManagerProvider } from '../online-manager.provider';
import { onlineManager } from '@tanstack/react-query';

// Mock onlineManager
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query');
  return {
    ...actual,
    onlineManager: {
      setEventListener: jest.fn(),
      isOnline: jest.fn().mockReturnValue(true),
      subscribe: jest.fn(),
    },
  };
});

describe('OnlineManagerProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onlineManager.setEventListener on mount', () => {
    // Arrange
    const children = <div>Test</div>;

    // Act
    render(<OnlineManagerProvider>{children}</OnlineManagerProvider>);

    // Assert
    expect(onlineManager.setEventListener).toHaveBeenCalledTimes(1);
    expect(onlineManager.setEventListener).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('registers and cleans up event listeners', () => {
    // Arrange
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    let cleanup: (() => void) | undefined;

    (onlineManager.setEventListener as jest.Mock).mockImplementation((cb) => {
      cleanup = cb(jest.fn());
    });

    // Act
    render(<OnlineManagerProvider>Test</OnlineManagerProvider>);

    // Assert
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function)
    );

    // Act
    act(() => {
      cleanup && cleanup();
    });

    // Assert
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'online',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'offline',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
