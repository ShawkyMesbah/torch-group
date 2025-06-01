import { renderHook, act } from '@testing-library/react';
import { useApiCache } from '@/hooks/useApiCache';
import { apiCache } from '@/utils/api-cache';

jest.mock('@/utils/api-cache', () => ({
  apiCache: {
    get: jest.fn(),
    invalidate: jest.fn(),
  },
}));

describe('useApiCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and cache data', async () => {
    const mockData = { test: 'data' };
    (apiCache.get as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useApiCache('test-key', () => Promise.resolve(mockData))
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Fetch failed');
    (apiCache.get as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useApiCache('test-key', () => Promise.reject(error))
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toEqual(error);
  });

  it('should respect enabled option', () => {
    renderHook(() =>
      useApiCache('test-key', () => Promise.resolve({}), { enabled: false })
    );

    expect(apiCache.get).not.toHaveBeenCalled();
  });

  it('should invalidate cache', async () => {
    const { result } = renderHook(() =>
      useApiCache('test-key', () => Promise.resolve({}))
    );

    await act(async () => {
      result.current.invalidate();
    });

    expect(apiCache.invalidate).toHaveBeenCalledWith('test-key');
  });
}); 