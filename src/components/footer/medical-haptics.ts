/**
 * Medical Haptic Feedback System
 * iOS Hospital App-inspired haptic patterns for medical interactions
 * 
 * @version 1.0.0
 * @author Medical Development Team
 * @since 2024-08-06
 * 
 * @features
 * - Medical-specific haptic patterns for different interaction types
 * - Emergency haptic feedback with urgent patterns
 * - iOS-style haptic feedback integration
 * - Medical context-aware haptic responses
 * - Battery-aware haptic optimizations
 */

import { MEDICAL_FOOTER_THEME } from './medical-theme';

// Medical Haptic Types
export type MedicalHapticType = 
  | 'selection'           // Light tap for navigation selection
  | 'emergency'          // Strong pattern for emergency actions
  | 'urgent'             // Medium pattern for urgent notifications
  | 'routine'            // Light pattern for routine interactions
  | 'consultation'       // Gentle pattern for consultation booking
  | 'success'            // Confirmation pattern for successful actions
  | 'warning'            // Alert pattern for warnings
  | 'error'              // Strong pattern for errors
  | 'appointment'        // Specific pattern for appointment interactions
  | 'trust'              // Subtle pattern for trust indicators
  | 'medical_navigation' // Pattern for medical navigation
  | 'health_status';     // Pattern for health status updates

// Medical Context for Haptic Feedback
export interface MedicalHapticContext {
  type: MedicalHapticType;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  medicalCategory?: 'emergency' | 'urgent' | 'routine' | 'consultation';
  isEmergencyMode?: boolean;
  batteryLevel?: number; // 0-100, for battery-aware optimizations
  userPreferences?: {
    enableHaptics?: boolean;
    hapticIntensity?: 'light' | 'medium' | 'strong';
    emergencyHapticsOnly?: boolean;
  };
}

// Medical Haptic Patterns
const MEDICAL_HAPTIC_PATTERNS = {
  // Basic medical interactions
  selection: [10],
  routine: [15],
  consultation: [12, 30, 12],
  
  // Medical urgency patterns
  urgent: [25, 50, 25],
  emergency: [50, 100, 50, 100, 50],
  critical: [100, 50, 100, 50, 100, 50, 100],
  
  // Medical feedback patterns
  success: [10, 30, 10],
  warning: [30, 60, 30],
  error: [50, 100, 50],
  
  // Medical workflow patterns
  appointment: [15, 40, 15, 40, 15],
  trust: [8],
  medical_navigation: [12],
  health_status: [20, 40, 20],
  
  // Special medical patterns
  heartbeat: [30, 60, 30, 60], // For health monitoring
  pulse: [25, 50, 25], // For vital signs
  alert: [40, 80, 40, 80, 40], // For medical alerts
} as const;

// Medical Haptic Intensity Multipliers
const INTENSITY_MULTIPLIERS = {
  light: 0.6,
  medium: 1.0,
  strong: 1.4,
} as const;

// Battery-aware Haptic Optimization
const BATTERY_THRESHOLDS = {
  low: 20,      // Below 20% - reduce haptic intensity
  critical: 10, // Below 10% - emergency haptics only
} as const;

/**
 * Medical Haptic Feedback Class
 * Provides medical-context-aware haptic feedback with iOS patterns
 */
export class MedicalHapticFeedback {
  private isSupported: boolean;
  private isIOS: boolean;
  private isAndroid: boolean;
  private batteryLevel: number = 100;
  private userPreferences: MedicalHapticContext['userPreferences'] = {
    enableHaptics: true,
    hapticIntensity: 'medium',
    emergencyHapticsOnly: false,
  };

  constructor() {
    this.isSupported = 'vibrate' in navigator;
    this.isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    
    // Initialize battery monitoring
    this.initializeBatteryMonitoring();
  }

  /**
   * Initialize battery monitoring for haptic optimization
   */
  private async initializeBatteryMonitoring(): Promise<void> {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        this.batteryLevel = battery.level * 100;
        
        battery.addEventListener('levelchange', () => {
          this.batteryLevel = battery.level * 100;
        });
      }
    } catch (error) {
      console.warn('Battery API not available:', error);
    }
  }

  /**
   * Set user preferences for haptic feedback
   */
  setUserPreferences(preferences: MedicalHapticContext['userPreferences']): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };
  }

  /**
   * Check if haptic feedback should be triggered based on context
   */
  private shouldTriggerHaptic(context: MedicalHapticContext): boolean {
    // Check if haptics are enabled
    if (!this.userPreferences.enableHaptics) {
      return false;
    }

    // Check if device supports haptics
    if (!this.isSupported) {
      return false;
    }

    // Emergency haptics only mode
    if (this.userPreferences.emergencyHapticsOnly) {
      return context.type === 'emergency' || context.isEmergencyMode;
    }

    // Battery-aware optimization
    if (this.batteryLevel <= BATTERY_THRESHOLDS.critical) {
      return context.type === 'emergency' || context.priority === 'critical';
    }

    if (this.batteryLevel <= BATTERY_THRESHOLDS.low) {
      return ['emergency', 'urgent', 'error'].includes(context.type) || 
             ['high', 'critical'].includes(context.priority || 'medium');
    }

    return true;
  }

  /**
   * Get haptic pattern based on medical context
   */
  private getHapticPattern(context: MedicalHapticContext): number[] {
    let basePattern = MEDICAL_HAPTIC_PATTERNS[context.type] || MEDICAL_HAPTIC_PATTERNS.selection;
    
    // Emergency mode intensification
    if (context.isEmergencyMode && context.type !== 'emergency') {
      basePattern = basePattern.map(duration => Math.min(duration * 1.5, 100));
    }

    // Apply intensity multiplier
    const intensityMultiplier = INTENSITY_MULTIPLIERS[this.userPreferences.hapticIntensity || 'medium'];
    const adjustedPattern = basePattern.map(duration => Math.round(duration * intensityMultiplier));

    // Battery optimization
    if (this.batteryLevel <= BATTERY_THRESHOLDS.low) {
      return adjustedPattern.map(duration => Math.round(duration * 0.7));
    }

    return adjustedPattern;
  }

  /**
   * Trigger medical haptic feedback
   */
  trigger(context: MedicalHapticContext): void {
    if (!this.shouldTriggerHaptic(context)) {
      return;
    }

    const pattern = this.getHapticPattern(context);
    
    try {
      if (this.isIOS && 'vibrate' in navigator) {
        // iOS-specific haptic feedback
        navigator.vibrate(pattern);
      } else if (this.isAndroid && 'vibrate' in navigator) {
        // Android-specific haptic feedback
        navigator.vibrate(pattern);
      } else if ('vibrate' in navigator) {
        // Generic haptic feedback
        navigator.vibrate(pattern);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  /**
   * Medical-specific haptic methods
   */

  // Navigation haptics
  navigationSelection(): void {
    this.trigger({ type: 'medical_navigation', priority: 'low' });
  }

  // Medical interaction haptics
  emergencyAccess(): void {
    this.trigger({ 
      type: 'emergency', 
      priority: 'critical', 
      medicalCategory: 'emergency',
      isEmergencyMode: true 
    });
  }

  appointmentBooking(): void {
    this.trigger({ 
      type: 'appointment', 
      priority: 'medium', 
      medicalCategory: 'routine' 
    });
  }

  urgentNotification(): void {
    this.trigger({ 
      type: 'urgent', 
      priority: 'high', 
      medicalCategory: 'urgent' 
    });
  }

  consultationConfirm(): void {
    this.trigger({ 
      type: 'consultation', 
      priority: 'medium', 
      medicalCategory: 'consultation' 
    });
  }

  // Medical feedback haptics
  medicalSuccess(): void {
    this.trigger({ type: 'success', priority: 'medium' });
  }

  medicalWarning(): void {
    this.trigger({ type: 'warning', priority: 'high' });
  }

  medicalError(): void {
    this.trigger({ type: 'error', priority: 'high' });
  }

  // Trust and security haptics
  trustVerification(): void {
    this.trigger({ type: 'trust', priority: 'low' });
  }

  // Health status haptics
  healthStatusUpdate(): void {
    this.trigger({ type: 'health_status', priority: 'medium' });
  }

  // Emergency mode haptics
  emergencyModeActivated(): void {
    this.trigger({ 
      type: 'emergency', 
      priority: 'critical', 
      isEmergencyMode: true 
    });
  }

  emergencyModeDeactivated(): void {
    this.trigger({ 
      type: 'success', 
      priority: 'medium', 
      isEmergencyMode: false 
    });
  }

  /**
   * Get battery level for external monitoring
   */
  getBatteryLevel(): number {
    return this.batteryLevel;
  }

  /**
   * Check if haptics are supported
   */
  isHapticSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Get current user preferences
   */
  getUserPreferences(): MedicalHapticContext['userPreferences'] {
    return { ...this.userPreferences };
  }
}

// Singleton instance for medical haptic feedback
export const medicalHapticFeedback = new MedicalHapticFeedback();

// Convenience functions for common medical haptic patterns
export const medicalHaptics = {
  // Navigation
  select: () => medicalHapticFeedback.navigationSelection(),
  
  // Medical actions
  emergency: () => medicalHapticFeedback.emergencyAccess(),
  appointment: () => medicalHapticFeedback.appointmentBooking(),
  urgent: () => medicalHapticFeedback.urgentNotification(),
  consultation: () => medicalHapticFeedback.consultationConfirm(),
  
  // Feedback
  success: () => medicalHapticFeedback.medicalSuccess(),
  warning: () => medicalHapticFeedback.medicalWarning(),
  error: () => medicalHapticFeedback.medicalError(),
  
  // Trust
  trust: () => medicalHapticFeedback.trustVerification(),
  
  // Health
  healthUpdate: () => medicalHapticFeedback.healthStatusUpdate(),
  
  // Emergency mode
  emergencyOn: () => medicalHapticFeedback.emergencyModeActivated(),
  emergencyOff: () => medicalHapticFeedback.emergencyModeDeactivated(),
};

export default medicalHapticFeedback;
