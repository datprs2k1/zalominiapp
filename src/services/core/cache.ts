/**
 * Generic cache service with TTL support, automatic cleanup, and configurable storage
 */

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  cleanupInterval?: number; // Cleanup interval in milliseconds
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  oldestEntry?: number;
  newestEntry?: number;
}

export interface ICache<T = any> {
  get(key: string): T | null;
  set(key: string, value: T, ttl?: number): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  size(): number;
  keys(): string[];
  getStats(): CacheStats;
  cleanup(): number; // Returns number of cleaned entries
}

/**
 * In-memory cache implementation with LRU eviction
 */
export class MemoryCache<T = any> implements ICache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly defaultTTL: number;
  private readonly maxSize: number;
  private readonly cleanupInterval: number;
  private cleanupTimer?: NodeJS.Timeout;
  private stats = {
    hits: 0,
    misses: 0,
  };

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 1000;
    this.cleanupInterval = options.cleanupInterval || 60 * 1000; // 1 minute default

    // Start automatic cleanup
    this.startCleanup();
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    const now = Date.now();
    
    // Check if entry has expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;

    return entry.data;
  }

  set(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const entryTTL = ttl || this.defaultTTL;

    // If cache is at max size, remove least recently used entry
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: now,
      ttl: entryTTL,
      accessCount: 1,
      lastAccessed: now,
    };

    this.cache.set(key, entry);
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalRequests = this.stats.hits + this.stats.misses;
    
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : undefined,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : undefined,
    };
  }

  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

/**
 * Storage-based cache implementation (localStorage/sessionStorage)
 */
export class StorageCache<T = any> implements ICache<T> {
  private readonly storage: Storage;
  private readonly prefix: string;
  private readonly defaultTTL: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000;
    this.prefix = 'cache_';
    
    if (options.storage === 'localStorage') {
      this.storage = localStorage;
    } else if (options.storage === 'sessionStorage') {
      this.storage = sessionStorage;
    } else {
      throw new Error('StorageCache requires localStorage or sessionStorage');
    }
  }

  get(key: string): T | null {
    try {
      const item = this.storage.getItem(this.prefix + key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();

      if (now - entry.timestamp > entry.ttl) {
        this.delete(key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  set(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      accessCount: 1,
      lastAccessed: Date.now(),
    };

    try {
      this.storage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to store cache entry:', error);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    try {
      this.storage.removeItem(this.prefix + key);
      return true;
    } catch {
      return false;
    }
  }

  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => this.storage.removeItem(key));
  }

  size(): number {
    let count = 0;
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        count++;
      }
    }
    return count;
  }

  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  getStats(): CacheStats {
    return {
      size: this.size(),
      hits: 0, // Not tracked in storage cache
      misses: 0,
      hitRate: 0,
    };
  }

  cleanup(): number {
    const keys = this.keys();
    let cleanedCount = 0;

    keys.forEach(key => {
      if (!this.has(key)) { // This will remove expired entries
        cleanedCount++;
      }
    });

    return cleanedCount;
  }
}

/**
 * Cache factory function
 */
export function createCache<T = any>(options: CacheOptions = {}): ICache<T> {
  if (options.storage === 'localStorage' || options.storage === 'sessionStorage') {
    return new StorageCache<T>(options);
  }
  return new MemoryCache<T>(options);
}

// Default cache instance
export const defaultCache = createCache();
