import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';

// ===== SAFE LOADING STATE TYPES =====

interface SafeLoadingState {
  isLoading: boolean;
  loadingType: 'route' | 'content' | 'skeleton' | 'progressive' | 'idle';
  progress: number;
  message?: string;
  stage?: string;
  error?: string;
  isStable: boolean;
  renderKey: string; // Unique key to force re-renders when needed
}

interface SafeLoadingConfig {
  minLoadingTime?: number;
  maxLoadingTime?: number;
  enableSkeletonFallback?: boolean;
  medicalContext?: 'appointment' | 'doctor' | 'service' | 'department' | 'general';
  priority?: 'low' | 'normal' | 'high' | 'emergency';
  debounceMs?: number;
}

interface SafeLoadingHookReturn {
  loadingState: SafeLoadingState;
  setLoading: (loading: boolean, config?: Partial<SafeLoadingState>) => void;
  setProgress: (progress: number) => void;
  setStage: (stage: string) => void;
  setError: (error: string | null) => void;
  clearLoading: () => void;
  shouldShowSkeleton: boolean;
  isStableLoading: boolean;
  forceRefresh: () => void;
}

// ===== UTILITY FUNCTIONS =====

function generateRenderKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getMedicalLoadingMessage(context: SafeLoadingConfig['medicalContext']): string {
  switch (context) {
    case 'appointment': return 'Đang tải thông tin lịch hẹn...';
    case 'doctor': return 'Đang tải thông tin bác sĩ...';
    case 'service': return 'Đang tải dịch vụ y tế...';
    case 'department': return 'Đang tải thông tin khoa...';
    default: return 'Đang tải...';
  }
}

// ===== SAFE LOADING STATE HOOK =====

/**
 * Safe loading state hook with race condition prevention and error handling
 */
export function useSafeLoadingState(config: SafeLoadingConfig = {}): SafeLoadingHookReturn {
  const {
    minLoadingTime = 300,
    maxLoadingTime = 10000,
    enableSkeletonFallback = true,
    medicalContext = 'general',
    priority = 'normal',
    debounceMs = 50,
  } = config;

  // Core state with safety features
  const [loadingState, setLoadingState] = useState<SafeLoadingState>({
    isLoading: false,
    loadingType: 'idle',
    progress: 0,
    message: undefined,
    stage: undefined,
    error: undefined,
    isStable: true,
    renderKey: generateRenderKey(),
  });

  // Refs for cleanup and timing
  const loadingTimer = useRef<NodeJS.Timeout>();
  const minTimeTimer = useRef<NodeJS.Timeout>();
  const stabilityTimer = useRef<NodeJS.Timeout>();
  const debounceTimer = useRef<NodeJS.Timeout>();
  const loadingStartTime = useRef<number>(0);
  const isMountedRef = useRef(true);
  const stateChangeCount = useRef(0);
  const lastStateChange = useRef(Date.now());

  // Safe state updater with debouncing and stability tracking
  const safeUpdateState = useCallback((updater: (prev: SafeLoadingState) => SafeLoadingState) => {
    if (!isMountedRef.current) return;

    const now = Date.now();
    const timeSinceLastChange = now - lastStateChange.current;

    // Debounce rapid changes
    if (timeSinceLastChange < debounceMs) {
      stateChangeCount.current++;
      if (stateChangeCount.current > 10) {
        console.warn('🏥 Rapid loading state changes detected, throttling...');
        return;
      }
    } else {
      stateChangeCount.current = 0;
    }

    lastStateChange.current = now;

    // Clear existing timers
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (stabilityTimer.current) {
      clearTimeout(stabilityTimer.current);
    }

    // Update state with debouncing
    debounceTimer.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      setLoadingState(prev => {
        const newState = updater(prev);
        return {
          ...newState,
          isStable: false,
          renderKey: generateRenderKey(),
        };
      });

      // Mark as stable after a delay
      stabilityTimer.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setLoadingState(prev => ({ ...prev, isStable: true }));
      }, 100);
    }, Math.min(debounceMs, 20));
  }, [debounceMs]);

  // Safe timer cleanup
  const cleanupTimers = useCallback(() => {
    if (loadingTimer.current) {
      clearTimeout(loadingTimer.current);
      loadingTimer.current = undefined;
    }
    if (minTimeTimer.current) {
      clearTimeout(minTimeTimer.current);
      minTimeTimer.current = undefined;
    }
    if (stabilityTimer.current) {
      clearTimeout(stabilityTimer.current);
      stabilityTimer.current = undefined;
    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = undefined;
    }
  }, []);

  // Set loading state with comprehensive error handling
  const setLoading = useCallback((loading: boolean, stateConfig: Partial<SafeLoadingState> = {}) => {
    try {
      if (loading) {
        loadingStartTime.current = performance?.now?.() || Date.now();
        cleanupTimers();

        // Set maximum loading timeout
        loadingTimer.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          safeUpdateState(prev => ({
            ...prev,
            error: 'Thời gian tải quá lâu. Vui lòng thử lại.',
            isLoading: false,
            loadingType: 'idle',
            progress: 0,
            isStable: true,
          }));
        }, maxLoadingTime);

        // Update loading state
        safeUpdateState(prev => ({
          ...prev,
          isLoading: true,
          loadingType: stateConfig.loadingType || 'content',
          progress: stateConfig.progress ?? 0,
          message: stateConfig.message || getMedicalLoadingMessage(medicalContext),
          stage: stateConfig.stage,
          error: undefined,
        }));
      } else {
        const endTime = performance?.now?.() || Date.now();
        const duration = endTime - loadingStartTime.current;

        // Ensure minimum loading time for better UX
        const remainingMinTime = Math.max(0, minLoadingTime - duration);

        if (remainingMinTime > 0) {
          minTimeTimer.current = setTimeout(() => {
            if (!isMountedRef.current) return;
            safeUpdateState(prev => ({
              ...prev,
              isLoading: false,
              loadingType: 'idle',
              progress: 100,
              isStable: true,
            }));
          }, remainingMinTime);
        } else {
          safeUpdateState(prev => ({
            ...prev,
            isLoading: false,
            loadingType: 'idle',
            progress: 100,
            isStable: true,
          }));
        }

        // Clear loading timer
        if (loadingTimer.current) {
          clearTimeout(loadingTimer.current);
          loadingTimer.current = undefined;
        }
      }
    } catch (error) {
      console.error('🏥 Error in setLoading:', error);
      // Fallback to safe state
      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        loadingType: 'idle',
        error: 'Lỗi hệ thống. Vui lòng thử lại.',
        progress: 0,
        isStable: true,
        renderKey: generateRenderKey(),
      }));
    }
  }, [minLoadingTime, maxLoadingTime, medicalContext, safeUpdateState, cleanupTimers]);

  // Set progress safely
  const setProgress = useCallback((progress: number) => {
    const safeProgress = Math.max(0, Math.min(100, progress));
    safeUpdateState(prev => ({ ...prev, progress: safeProgress }));
  }, [safeUpdateState]);

  // Set stage safely
  const setStage = useCallback((stage: string) => {
    safeUpdateState(prev => ({
      ...prev,
      stage,
      message: `${getMedicalLoadingMessage(medicalContext)} - ${stage}`,
    }));
  }, [medicalContext, safeUpdateState]);

  // Set error safely
  const setError = useCallback((error: string | null) => {
    safeUpdateState(prev => ({
      ...prev,
      error: error || undefined,
      isLoading: error ? false : prev.isLoading,
      loadingType: error ? 'idle' : prev.loadingType,
      progress: error ? 0 : prev.progress,
    }));
  }, [safeUpdateState]);

  // Clear all loading states
  const clearLoading = useCallback(() => {
    cleanupTimers();
    setLoadingState({
      isLoading: false,
      loadingType: 'idle',
      progress: 0,
      message: undefined,
      stage: undefined,
      error: undefined,
      isStable: true,
      renderKey: generateRenderKey(),
    });
  }, [cleanupTimers]);

  // Force refresh with new render key
  const forceRefresh = useCallback(() => {
    safeUpdateState(prev => ({ ...prev, renderKey: generateRenderKey() }));
  }, [safeUpdateState]);

  // Skeleton visibility logic with safety checks
  const shouldShowSkeleton = useMemo(() => {
    if (!enableSkeletonFallback || loadingState.error) return false;
    return loadingState.isLoading && loadingState.isStable;
  }, [enableSkeletonFallback, loadingState.isLoading, loadingState.error, loadingState.isStable]);

  // Stable loading indicator
  const isStableLoading = useMemo(() => {
    return loadingState.isLoading && loadingState.isStable;
  }, [loadingState.isLoading, loadingState.isStable]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanupTimers();
    };
  }, [cleanupTimers]);

  return {
    loadingState,
    setLoading,
    setProgress,
    setStage,
    setError,
    clearLoading,
    shouldShowSkeleton,
    isStableLoading,
    forceRefresh,
  };
}

export default useSafeLoadingState;
