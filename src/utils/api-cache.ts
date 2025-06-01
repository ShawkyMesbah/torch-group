type CacheEntry = {
  data: any;
  timestamp: number;
};

class APICache {
  private static instance: APICache;
  private cache: Map<string, CacheEntry>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): APICache {
    if (!APICache.instance) {
      APICache.instance = new APICache();
    }
    return APICache.instance;
  }

  public async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < ttl) {
      return cached.data as T;
    }

    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: now });
    return data;
  }

  public set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  public invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  public clear(): void {
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size;
  }

  public getCacheKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  public isExpired(key: string, ttl: number = this.DEFAULT_TTL): boolean {
    const cached = this.cache.get(key);
    if (!cached) return true;
    return Date.now() - cached.timestamp >= ttl;
  }
}

export const apiCache = APICache.getInstance(); 