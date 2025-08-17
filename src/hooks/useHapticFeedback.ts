import { useCallback } from 'react';

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection' | 'impact';

interface HapticFeedbackOptions {
  type?: HapticFeedbackType;
  enabled?: boolean;
}

/**
 * Custom hook for haptic feedback on mobile devices
 * Provides tactile feedback for better mobile UX
 */
export function useHapticFeedback() {
  const triggerHaptic = useCallback((options: HapticFeedbackOptions = {}) => {
    const { type = 'light', enabled = true } = options;

    if (!enabled) return;

    // Check if device supports haptic feedback
    if (typeof window === 'undefined') return;

    try {
      // Modern Haptic API (iOS Safari 13+)
      if ('DeviceMotionEvent' in window && 'requestPermission' in (DeviceMotionEvent as any)) {
        // iOS haptic feedback
        if (navigator.vibrate) {
          const patterns = {
            light: [10],
            medium: [20],
            heavy: [30],
            selection: [5],
            impact: [15, 10, 15],
          };
          navigator.vibrate(patterns[type]);
        }
      } 
      // Android and other devices
      else if (navigator.vibrate) {
        const patterns = {
          light: [25],
          medium: [50],
          heavy: [75],
          selection: [10],
          impact: [30, 20, 30],
        };
        navigator.vibrate(patterns[type]);
      }
    } catch (error) {
      // Silently fail if haptic feedback is not supported
      console.debug('Haptic feedback not supported:', error);
    }
  }, []);

  const triggerSelectionFeedback = useCallback(() => {
    triggerHaptic({ type: 'selection' });
  }, [triggerHaptic]);

  const triggerImpactFeedback = useCallback(() => {
    triggerHaptic({ type: 'impact' });
  }, [triggerHaptic]);

  const triggerLightFeedback = useCallback(() => {
    triggerHaptic({ type: 'light' });
  }, [triggerHaptic]);

  return {
    triggerHaptic,
    triggerSelectionFeedback,
    triggerImpactFeedback,
    triggerLightFeedback,
  };
}
