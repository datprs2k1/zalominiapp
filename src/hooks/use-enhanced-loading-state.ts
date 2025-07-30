import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import { useRouteTransition } from './use-route-transition';

// ===== SAFE LOADING STATE TYPES =====

interface SafeLoadingState {
  isLoading: boolean;
  loadingType: 'route' | 'content' | 'skeleton' | 'progressive' | 'idle';
  progress?: number;
  message?: string;
  stage?: string;
  error?: string;
  isStable: boolean; // Indicates if the state is stable (no rapid changes)
}

// ===== LOADING STATE TYPES =====

interface LoadingState extends SafeLoadingState {
  // Extends SafeLoadingState for backward compatibility
}

interface LoadingConfig {
  minLoadingTime?: number;
  maxLoadingTime?: number;
  showProgressBar?: boolean;
  enableSkeletonFallback?: boolean;
  medicalContext?: 'appointment' | 'doctor' | 'service' | 'department' | 'general';
  priority?: 'low' | 'normal' | 'high' | 'emergency';
}

interface EnhancedLoadingHookReturn {
  loadingState: LoadingState;
  setLoading: (loading: boolean, config?: Partial<LoadingState>) => void;
  setProgress: (progress: number) => void;
  setStage: (stage: string) => void;
  setError: (error: string | null) => void;
  clearLoading: () => void;
  isRouteLoading: boolean;
  isContentLoading: boolean;
  shouldShowSkeleton: boolean;
  loadingDuration: number;
}

// ===== ENHANCED LOADING STATE HOOK =====

/**
 * Enhanced loading state management with medical context awareness
 */
export function useEnhancedLoadingState(config: LoadingConfig = {}): EnhancedLoadingHookReturn {
  const {
    minLoadingTime = 300,
    maxLoadingTime = 10000,
    showProgressBar = false,
    enableSkeletonFallback = true,
    medicalContext = 'general',
    priority = 'normal',
  } = config;

  const location = useLocation();
  const navigation = useNavigation();
  const routeTransition = useRouteTransition();

  // Core loading state with stability tracking
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadingType: 'idle',
    progress: 0,
    message: undefined,
    stage: undefined,
    error: undefined,
    isStable: true,
  });

  // Stability tracking to prevent rapid state changes
  const stateChangeCount = useRef(0);
  const lastStateChange = useRef(Date.now());
  const stabilityTimer = useRef<NodeJS.Timeout>();

  // Timing and performance tracking
  const loadingStartTime = useRef<number>(0);
  const loadingTimer = useRef<NodeJS.Timeout>();
  const minTimeTimer = useRef<NodeJS.Timeout>();
  const [loadingDuration, setLoadingDuration] = useState(0);

  // Route-specific loading detection
  const isRouteLoading = useMemo(() => {
    return navigation.state === 'loading' || navigation.state === 'submitting' || routeTransition.isTransitioning;
  }, [navigation.state, routeTransition.isTransitioning]);

  // Content-specific loading detection
  const isContentLoading = useMemo(() => {
    return (
      loadingState.isLoading && (loadingState.loadingType === 'content' || loadingState.loadingType === 'progressive')
    );
  }, [loadingState.isLoading, loadingState.loadingType]);

  // Skeleton visibility logic
  const shouldShowSkeleton = useMemo(() => {
    if (!enableSkeletonFallback) return false;

    return (isRouteLoading || isContentLoading) && !loadingState.error && loadingDuration > 150; // Show skeleton after 150ms delay
  }, [isRouteLoading, isContentLoading, loadingState.error, loadingDuration, enableSkeletonFallback]);

  // Set loading state with enhanced configuration
  const setLoading = useCallback(
    (loading: boolean, stateConfig: Partial<LoadingState> = {}) => {
      if (loading) {
        loadingStartTime.current = performance.now();
        setLoadingDuration(0);

        // Clear existing timers
        if (loadingTimer.current) clearTimeout(loadingTimer.current);
        if (minTimeTimer.current) clearTimeout(minTimeTimer.current);

        // Set maximum loading timeout
        loadingTimer.current = setTimeout(() => {
          setLoadingState((prev) => ({
            ...prev,
            error: 'Thời gian tải quá lâu. Vui lòng thử lại.',
            isLoading: false,
            loadingType: 'idle',
          }));
        }, maxLoadingTime);

        // Update loading state
        setLoadingState((prev) => ({
          ...prev,
          isLoading: true,
          loadingType: stateConfig.loadingType || 'content',
          progress: stateConfig.progress || 0,
          message: stateConfig.message || getMedicalLoadingMessage(medicalContext),
          stage: stateConfig.stage,
          error: undefined,
        }));
      } else {
        const endTime = performance.now();
        const duration = endTime - loadingStartTime.current;
        setLoadingDuration(duration);

        // Ensure minimum loading time for better UX
        const remainingMinTime = Math.max(0, minLoadingTime - duration);

        if (remainingMinTime > 0) {
          minTimeTimer.current = setTimeout(() => {
            setLoadingState((prev) => ({
              ...prev,
              isLoading: false,
              loadingType: 'idle',
              progress: 100,
            }));
          }, remainingMinTime);
        } else {
          setLoadingState((prev) => ({
            ...prev,
            isLoading: false,
            loadingType: 'idle',
            progress: 100,
          }));
        }

        // Clear timers
        if (loadingTimer.current) clearTimeout(loadingTimer.current);
      }
    },
    [minLoadingTime, maxLoadingTime, medicalContext]
  );

  // Set progress (0-100)
  const setProgress = useCallback((progress: number) => {
    setLoadingState((prev) => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress)),
    }));
  }, []);

  // Set current loading stage
  const setStage = useCallback(
    (stage: string) => {
      setLoadingState((prev) => ({
        ...prev,
        stage,
        message: `${getMedicalLoadingMessage(medicalContext)} - ${stage}`,
      }));
    },
    [medicalContext]
  );

  // Set error state
  const setError = useCallback((error: string | null) => {
    setLoadingState((prev) => ({
      ...prev,
      error: error || undefined,
      isLoading: error ? false : prev.isLoading,
      loadingType: error ? 'idle' : prev.loadingType,
    }));
  }, []);

  // Clear all loading states
  const clearLoading = useCallback(() => {
    if (loadingTimer.current) clearTimeout(loadingTimer.current);
    if (minTimeTimer.current) clearTimeout(minTimeTimer.current);

    setLoadingState({
      isLoading: false,
      loadingType: 'idle',
      progress: 0,
      message: undefined,
      stage: undefined,
      error: undefined,
    });
    setLoadingDuration(0);
  }, []);

  // Track loading duration
  useEffect(() => {
    if (loadingState.isLoading) {
      const interval = setInterval(() => {
        const duration = performance.now() - loadingStartTime.current;
        setLoadingDuration(duration);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [loadingState.isLoading]);

  // Handle route changes
  useEffect(() => {
    if (isRouteLoading) {
      setLoading(true, {
        loadingType: 'route',
        message: 'Đang chuyển trang...',
      });
    } else {
      // Delay clearing route loading to allow content loading to take over
      const timer = setTimeout(() => {
        if (loadingState.loadingType === 'route') {
          setLoading(false);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isRouteLoading, setLoading, loadingState.loadingType]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
      if (minTimeTimer.current) clearTimeout(minTimeTimer.current);
    };
  }, []);

  return {
    loadingState,
    setLoading,
    setProgress,
    setStage,
    setError,
    clearLoading,
    isRouteLoading,
    isContentLoading,
    shouldShowSkeleton,
    loadingDuration,
  };
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get contextual loading messages for medical scenarios
 */
function getMedicalLoadingMessage(context: LoadingConfig['medicalContext']): string {
  switch (context) {
    case 'appointment':
      return 'Đang tải thông tin lịch hẹn...';
    case 'doctor':
      return 'Đang tải thông tin bác sĩ...';
    case 'service':
      return 'Đang tải dịch vụ y tế...';
    case 'department':
      return 'Đang tải thông tin khoa...';
    default:
      return 'Đang tải...';
  }
}

// ===== SPECIALIZED HOOKS =====

/**
 * Route-specific loading state hook
 */
export function useRouteLoadingState() {
  const navigation = useNavigation();
  const routeTransition = useRouteTransition();
  const [showRouteLoading, setShowRouteLoading] = useState(false);

  useEffect(() => {
    const isNavigating = navigation.state === 'loading' || navigation.state === 'submitting';
    const isTransitioning = routeTransition.isTransitioning;

    if (isNavigating || isTransitioning) {
      setShowRouteLoading(true);
    } else {
      // Delay hiding to prevent flashing
      const timer = setTimeout(() => {
        setShowRouteLoading(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [navigation.state, routeTransition.isTransitioning]);

  return {
    showRouteLoading,
    setShowRouteLoading,
    isNavigating: navigation.state === 'loading' || navigation.state === 'submitting',
    isTransitioning: routeTransition.isTransitioning,
    navigationState: navigation.state,
    transitionDirection: routeTransition.direction,
  };
}

/**
 * Progressive loading state hook for multi-stage loading
 */
export function useProgressiveLoadingState(stages: string[]) {
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState<Record<string, number>>({});

  const { loadingState, setLoading, setStage, setProgress } = useEnhancedLoadingState({
    enableSkeletonFallback: true,
    showProgressBar: true,
  });

  const nextStage = useCallback(() => {
    if (currentStage < stages.length - 1) {
      const nextIndex = currentStage + 1;
      setCurrentStage(nextIndex);
      setStage(stages[nextIndex]);

      // Update overall progress
      const overallProgress = ((nextIndex + 1) / stages.length) * 100;
      setProgress(overallProgress);
    }
  }, [currentStage, stages, setStage, setProgress]);

  const setStageProgressValue = useCallback(
    (stageName: string, progress: number) => {
      setStageProgress((prev) => ({
        ...prev,
        [stageName]: progress,
      }));

      // Update overall progress based on current stage
      const currentStageName = stages[currentStage];
      if (stageName === currentStageName) {
        const baseProgress = (currentStage / stages.length) * 100;
        const stageContribution = progress / stages.length;
        setProgress(baseProgress + stageContribution);
      }
    },
    [currentStage, stages, setProgress]
  );

  const startProgressiveLoading = useCallback(() => {
    setCurrentStage(0);
    setStageProgress({});
    setLoading(true, {
      loadingType: 'progressive',
      stage: stages[0],
    });
  }, [stages, setLoading]);

  const completeProgressiveLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [setLoading, setProgress]);

  return {
    ...loadingState,
    currentStage,
    currentStageName: stages[currentStage],
    stageProgress,
    nextStage,
    setStageProgress: setStageProgressValue,
    startProgressiveLoading,
    completeProgressiveLoading,
    totalStages: stages.length,
  };
}

export default useEnhancedLoadingState;
