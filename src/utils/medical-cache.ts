// Medical-Context Caching Strategies for Healthcare Applications

export interface MedicalCacheConfig {
  priority: 'emergency' | 'urgent' | 'routine' | 'consultation';
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size in MB
  preload: boolean; // Whether to preload this data
  department?: string;
  patientContext?: boolean;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  priority: MedicalCacheConfig['priority'];
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number; // Size in bytes
}

// Medical-specific cache configurations
export const medicalCacheConfigs: Record<string, MedicalCacheConfig> = {
  // Emergency department - highest priority, shortest TTL
  emergencyDoctors: {
    priority: 'emergency',
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 10,
    preload: true,
    department: 'emergency',
  },

  emergencyServices: {
    priority: 'emergency',
    ttl: 10 * 60 * 1000, // 10 minutes
    maxSize: 5,
    preload: true,
    department: 'emergency',
  },

  // Urgent care - high priority
  urgentAppointments: {
    priority: 'urgent',
    ttl: 15 * 60 * 1000, // 15 minutes
    maxSize: 8,
    preload: true,
  },

  urgentDoctors: {
    priority: 'urgent',
    ttl: 30 * 60 * 1000, // 30 minutes
    maxSize: 15,
    preload: true,
  },

  // Routine medical data
  doctorProfiles: {
    priority: 'routine',
    ttl: 60 * 60 * 1000, // 1 hour
    maxSize: 20,
    preload: false,
  },

  departmentInfo: {
    priority: 'routine',
    ttl: 2 * 60 * 60 * 1000, // 2 hours
    maxSize: 10,
    preload: true,
  },

  medicalServices: {
    priority: 'routine',
    ttl: 4 * 60 * 60 * 1000, // 4 hours
    maxSize: 25,
    preload: true,
  },

  // Patient-specific data
  patientHistory: {
    priority: 'consultation',
    ttl: 30 * 60 * 1000, // 30 minutes
    maxSize: 50,
    preload: false,
    patientContext: true,
  },

  patientAppointments: {
    priority: 'urgent',
    ttl: 15 * 60 * 1000, // 15 minutes
    maxSize: 10,
    preload: false,
    patientContext: true,
  },

  // Health news and information
  healthNews: {
    priority: 'routine',
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 15,
    preload: false,
  },

  // Static medical content
  medicalGuidelines: {
    priority: 'routine',
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxSize: 30,
    preload: false,
  },
};

class MedicalCache {
  private cache = new Map<string, CacheEntry>();
  private totalSize = 0; // Total cache size in bytes
  private maxTotalSize = 100 * 1024 * 1024; // 100MB total limit

  // Priority weights for eviction algorithm
  private priorityWeights = {
    emergency: 1000,
    urgent: 100,
    routine: 10,
    consultation: 50,
  };

  // Calculate approximate size of data in bytes
  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  // Check if cache entry is expired
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  // Calculate priority score for eviction
  private calculatePriorityScore(entry: CacheEntry): number {
    const priorityWeight = this.priorityWeights[entry.priority];
    const ageWeight = (Date.now() - entry.lastAccessed) / (60 * 1000); // Age in minutes
    const accessWeight = entry.accessCount;

    // Higher score = higher priority to keep
    return priorityWeight + accessWeight - ageWeight;
  }

  // Evict least important entries to make space
  private evictEntries(requiredSpace: number): void {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, entry, score: this.calculatePriorityScore(entry) }))
      .sort((a, b) => a.score - b.score); // Sort by priority (lowest first)

    let freedSpace = 0;
    for (const { key, entry } of entries) {
      if (freedSpace >= requiredSpace) break;

      // Don't evict emergency data unless absolutely necessary
      if (entry.priority === 'emergency' && freedSpace < requiredSpace * 0.8) {
        continue;
      }

      this.cache.delete(key);
      this.totalSize -= entry.size;
      freedSpace += entry.size;
    }
  }

  // Set cache entry with medical context
  set<T>(key: string, data: T, config?: Partial<MedicalCacheConfig>): void {
    const defaultConfig = medicalCacheConfigs[key] || medicalCacheConfigs.routine;
    const finalConfig = { ...defaultConfig, ...config };

    const size = this.calculateSize(data);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      priority: finalConfig.priority,
      ttl: finalConfig.ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
      size,
    };

    // Check if we need to make space
    if (this.totalSize + size > this.maxTotalSize) {
      this.evictEntries(size);
    }

    // Remove existing entry if it exists
    const existingEntry = this.cache.get(key);
    if (existingEntry) {
      this.totalSize -= existingEntry.size;
    }

    this.cache.set(key, entry);
    this.totalSize += size;
  }

  // Get cache entry with medical context
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.totalSize -= entry.size;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    return entry.data;
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.totalSize -= entry.size;
      return false;
    }

    return true;
  }

  // Clear cache entries by priority
  clearByPriority(priority: MedicalCacheConfig['priority']): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.priority === priority) {
        this.cache.delete(key);
        this.totalSize -= entry.size;
      }
    }
  }

  // Clear expired entries
  clearExpired(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.totalSize -= entry.size;
      }
    }
  }

  // Preload critical medical data
  async preloadCriticalData(dataLoader: (key: string) => Promise<any>): Promise<void> {
    const criticalKeys = Object.entries(medicalCacheConfigs)
      .filter(([_, config]) => config.preload && (config.priority === 'emergency' || config.priority === 'urgent'))
      .map(([key]) => key);

    const preloadPromises = criticalKeys.map(async (key) => {
      try {
        const data = await dataLoader(key);
        this.set(key, data);
      } catch (error) {
        console.warn(`Failed to preload ${key}:`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
  }

  // Get cache statistics for monitoring
  getStats(): {
    totalEntries: number;
    totalSize: number;
    sizeByPriority: Record<string, number>;
    hitRate: number;
  } {
    const sizeByPriority: Record<string, number> = {};
    let totalHits = 0;
    let totalAccesses = 0;

    for (const entry of this.cache.values()) {
      sizeByPriority[entry.priority] = (sizeByPriority[entry.priority] || 0) + entry.size;
      totalHits += entry.accessCount;
      totalAccesses += entry.accessCount;
    }

    return {
      totalEntries: this.cache.size,
      totalSize: this.totalSize,
      sizeByPriority,
      hitRate: totalAccesses > 0 ? totalHits / totalAccesses : 0,
    };
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.totalSize = 0;
  }
}

// Singleton instance
export const medicalCache = new MedicalCache();

// Cache warming utilities for medical context
export const cacheWarming = {
  // Warm cache for emergency department
  async warmEmergencyCache(dataLoader: (key: string) => Promise<any>): Promise<void> {
    const emergencyKeys = ['emergencyDoctors', 'emergencyServices'];
    await Promise.all(emergencyKeys.map((key) => dataLoader(key).then((data) => medicalCache.set(key, data))));
  },

  // Warm cache for specific department
  async warmDepartmentCache(department: string, dataLoader: (key: string) => Promise<any>): Promise<void> {
    const departmentKeys = Object.entries(medicalCacheConfigs)
      .filter(([_, config]) => config.department === department)
      .map(([key]) => key);

    await Promise.all(departmentKeys.map((key) => dataLoader(key).then((data) => medicalCache.set(key, data))));
  },

  // Warm cache for patient context
  async warmPatientCache(
    patientId: string,
    dataLoader: (key: string, patientId: string) => Promise<any>
  ): Promise<void> {
    const patientKeys = Object.entries(medicalCacheConfigs)
      .filter(([_, config]) => config.patientContext)
      .map(([key]) => key);

    await Promise.all(
      patientKeys.map((key) => dataLoader(key, patientId).then((data) => medicalCache.set(`${key}_${patientId}`, data)))
    );
  },
};

// Performance monitoring for medical cache
export const cacheMonitoring = {
  // Log cache performance metrics with Vietnamese localization
  logPerformanceMetrics(): void {
    const stats = medicalCache.getStats();
    console.log('Hiệu suất bộ nhớ đệm y tế (Medical Cache Performance):', {
      ...stats,
      sizeInMB: (stats.totalSize / (1024 * 1024)).toFixed(2),
      hitRatePercentage: (stats.hitRate * 100).toFixed(2) + '%',
      message: 'Thống kê bộ nhớ đệm hệ thống y tế',
    });
  },

  // Monitor cache health with Vietnamese messages
  monitorCacheHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    vietnameseStatus: string;
    vietnameseIssues: string[];
  } {
    const stats = medicalCache.getStats();
    const issues: string[] = [];
    const vietnameseIssues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check cache size
    if (stats.totalSize > 80 * 1024 * 1024) {
      // 80MB
      issues.push('Cache size approaching limit');
      vietnameseIssues.push('Dung lượng bộ nhớ đệm sắp đạt giới hạn');
      status = 'warning';
    }

    // Check hit rate
    if (stats.hitRate < 0.7) {
      issues.push('Low cache hit rate');
      vietnameseIssues.push('Tỷ lệ truy cập bộ nhớ đệm thấp');
      status = 'warning';
    }

    // Check emergency cache presence
    const emergencySize = stats.sizeByPriority.emergency || 0;
    if (emergencySize === 0) {
      issues.push('No emergency data cached');
      vietnameseIssues.push('Không có dữ liệu cấp cứu trong bộ nhớ đệm');
      status = 'critical';
    }

    const vietnameseStatus = status === 'healthy' ? 'Khỏe mạnh' : status === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng';

    return {
      status,
      issues,
      vietnameseStatus,
      vietnameseIssues,
    };
  },

  // Initialize medical cache monitoring with Vietnamese localization
  initializeMedicalCacheMonitoring(): void {
    // Set up periodic cache health checks
    setInterval(
      () => {
        const health = this.monitorCacheHealth();
        if (health.status !== 'healthy') {
          console.warn('Cảnh báo hệ thống bộ nhớ đệm y tế:', {
            status: health.vietnameseStatus,
            issues: health.vietnameseIssues,
          });
        }
      },
      5 * 60 * 1000
    ); // Check every 5 minutes

    // Set up periodic cleanup
    setInterval(
      () => {
        medicalCache.clearExpired();
        console.log('Đã dọn dẹp bộ nhớ đệm y tế hết hạn');
      },
      15 * 60 * 1000
    ); // Clean every 15 minutes

    console.log('Đã khởi tạo giám sát bộ nhớ đệm y tế');
  },
};
