/**
 * Enhanced Touch Interactions for Zalo Mini App Healthcare
 * Provides advanced touch, gesture, and haptic feedback utilities
 */

// Types
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchGesture {
  scale: number;
  center: TouchPoint;
  velocity: number;
}

export interface TouchInteractionConfig {
  swipeThreshold: number;
  swipeVelocityThreshold: number;
  longPressDelay: number;
  doubleTapDelay: number;
  pinchThreshold: number;
}

// Default configuration
const DEFAULT_CONFIG: TouchInteractionConfig = {
  swipeThreshold: 50,
  swipeVelocityThreshold: 0.3,
  longPressDelay: 500,
  doubleTapDelay: 300,
  pinchThreshold: 0.1,
};

// Enhanced Touch Interaction Manager
export class EnhancedTouchManager {
  private element: HTMLElement;
  private config: TouchInteractionConfig;
  private touchStart: TouchPoint | null = null;
  private touchHistory: TouchPoint[] = [];
  private longPressTimer: NodeJS.Timeout | null = null;
  private lastTapTime = 0;
  private tapCount = 0;
  private initialPinchDistance = 0;
  private lastPinchScale = 1;

  // Event handlers
  private onSwipe?: (gesture: SwipeGesture) => void;
  private onLongPress?: (point: TouchPoint) => void;
  private onDoubleTap?: (point: TouchPoint) => void;
  private onPinch?: (gesture: PinchGesture) => void;
  private onTouchStart?: (point: TouchPoint) => void;
  private onTouchEnd?: (point: TouchPoint) => void;

  constructor(element: HTMLElement, config: Partial<TouchInteractionConfig> = {}) {
    this.element = element;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.setupEventListeners();
  }

  // Set up event listeners
  private setupEventListeners() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });
  }

  // Handle touch start
  private handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    const point: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    this.touchStart = point;
    this.touchHistory = [point];

    // Handle multi-touch for pinch gestures
    if (event.touches.length === 2) {
      this.handlePinchStart(event);
    } else {
      // Single touch - start long press timer
      this.startLongPressTimer(point);
    }

    this.onTouchStart?.(point);
  }

  // Handle touch move
  private handleTouchMove(event: TouchEvent) {
    if (!this.touchStart) return;

    const touch = event.touches[0];
    const point: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    this.touchHistory.push(point);

    // Cancel long press if user moves finger
    this.cancelLongPress();

    // Handle pinch gestures
    if (event.touches.length === 2) {
      this.handlePinchMove(event);
    }

    // Prevent default scrolling for certain gestures
    if (this.shouldPreventDefault(point)) {
      event.preventDefault();
    }
  }

  // Handle touch end
  private handleTouchEnd(event: TouchEvent) {
    if (!this.touchStart) return;

    const touch = event.changedTouches[0];
    const point: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    this.cancelLongPress();

    // Handle tap gestures
    if (this.isTap(point)) {
      this.handleTap(point);
    } else {
      // Handle swipe gestures
      const swipe = this.detectSwipe(point);
      if (swipe) {
        this.onSwipe?.(swipe);
      }
    }

    this.onTouchEnd?.(point);
    this.reset();
  }

  // Handle touch cancel
  private handleTouchCancel() {
    this.cancelLongPress();
    this.reset();
  }

  // Handle pinch start
  private handlePinchStart(event: TouchEvent) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    this.initialPinchDistance = this.getDistance(touch1, touch2);
    this.lastPinchScale = 1;
  }

  // Handle pinch move
  private handlePinchMove(event: TouchEvent) {
    if (this.initialPinchDistance === 0) return;

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const currentDistance = this.getDistance(touch1, touch2);
    const scale = currentDistance / this.initialPinchDistance;

    if (Math.abs(scale - this.lastPinchScale) > this.config.pinchThreshold) {
      const center: TouchPoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        timestamp: Date.now(),
      };

      const gesture: PinchGesture = {
        scale,
        center,
        velocity: Math.abs(scale - this.lastPinchScale),
      };

      this.onPinch?.(gesture);
      this.lastPinchScale = scale;
    }
  }

  // Start long press timer
  private startLongPressTimer(point: TouchPoint) {
    this.longPressTimer = setTimeout(() => {
      this.onLongPress?.(point);
    }, this.config.longPressDelay);
  }

  // Cancel long press timer
  private cancelLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  // Handle tap gestures
  private handleTap(point: TouchPoint) {
    const now = Date.now();
    const timeSinceLastTap = now - this.lastTapTime;

    if (timeSinceLastTap < this.config.doubleTapDelay) {
      this.tapCount++;
    } else {
      this.tapCount = 1;
    }

    this.lastTapTime = now;

    // Check for double tap
    if (this.tapCount === 2) {
      this.onDoubleTap?.(point);
      this.tapCount = 0;
    }
  }

  // Detect if touch is a tap
  private isTap(endPoint: TouchPoint): boolean {
    if (!this.touchStart) return false;

    const distance = this.getDistance(this.touchStart, endPoint);
    const duration = endPoint.timestamp - this.touchStart.timestamp;

    return distance < 10 && duration < 300;
  }

  // Detect swipe gesture
  private detectSwipe(endPoint: TouchPoint): SwipeGesture | null {
    if (!this.touchStart) return null;

    const deltaX = endPoint.x - this.touchStart.x;
    const deltaY = endPoint.y - this.touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = endPoint.timestamp - this.touchStart.timestamp;

    if (distance < this.config.swipeThreshold || duration > 1000) {
      return null;
    }

    const velocity = distance / duration;
    if (velocity < this.config.swipeVelocityThreshold) {
      return null;
    }

    // Determine direction
    let direction: SwipeGesture['direction'];
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return {
      direction,
      distance,
      velocity,
      duration,
    };
  }

  // Get distance between two points
  private getDistance(point1: TouchPoint | Touch, point2: TouchPoint | Touch): number {
    const deltaX = point1.x - point2.x || point1.clientX - point2.clientX;
    const deltaY = point1.y - point2.y || point1.clientY - point2.clientY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  // Determine if default behavior should be prevented
  private shouldPreventDefault(point: TouchPoint): boolean {
    if (!this.touchStart) return false;

    const deltaX = Math.abs(point.x - this.touchStart.x);
    const deltaY = Math.abs(point.y - this.touchStart.y);

    // Prevent default for horizontal swipes to avoid back navigation
    return deltaX > deltaY && deltaX > 20;
  }

  // Reset touch state
  private reset() {
    this.touchStart = null;
    this.touchHistory = [];
    this.initialPinchDistance = 0;
    this.lastPinchScale = 1;
  }

  // Public methods to set event handlers
  public setSwipeHandler(handler: (gesture: SwipeGesture) => void) {
    this.onSwipe = handler;
    return this;
  }

  public setLongPressHandler(handler: (point: TouchPoint) => void) {
    this.onLongPress = handler;
    return this;
  }

  public setDoubleTapHandler(handler: (point: TouchPoint) => void) {
    this.onDoubleTap = handler;
    return this;
  }

  public setPinchHandler(handler: (gesture: PinchGesture) => void) {
    this.onPinch = handler;
    return this;
  }

  public setTouchStartHandler(handler: (point: TouchPoint) => void) {
    this.onTouchStart = handler;
    return this;
  }

  public setTouchEndHandler(handler: (point: TouchPoint) => void) {
    this.onTouchEnd = handler;
    return this;
  }

  // Cleanup
  public destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
    this.cancelLongPress();
  }
}

// Enhanced Haptic Feedback Manager
export class EnhancedHapticManager {
  private isSupported: boolean;
  private platform: 'ios' | 'android' | 'web';

  constructor() {
    this.isSupported = 'vibrate' in navigator;
    this.platform = this.detectPlatform();
  }

  private detectPlatform(): 'ios' | 'android' | 'web' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/android/.test(userAgent)) return 'android';
    return 'web';
  }

  // Platform-specific haptic patterns
  public selection() {
    if (!this.isSupported) return;

    switch (this.platform) {
      case 'ios':
        navigator.vibrate(10); // Light tap for iOS selection
        break;
      case 'android':
        navigator.vibrate(15); // Slightly stronger for Android
        break;
      default:
        navigator.vibrate(10);
    }
  }

  // Basic vibration patterns
  public light() {
    if (this.isSupported) {
      navigator.vibrate(this.platform === 'ios' ? 10 : 15);
    }
  }

  public medium() {
    if (this.isSupported) {
      navigator.vibrate(this.platform === 'ios' ? 20 : 25);
    }
  }

  public heavy() {
    if (this.isSupported) {
      navigator.vibrate(this.platform === 'ios' ? 30 : 40);
    }
  }

  // Impact feedback (iOS-style)
  public impactLight() {
    if (this.isSupported) {
      navigator.vibrate(10);
    }
  }

  public impactMedium() {
    if (this.isSupported) {
      navigator.vibrate(20);
    }
  }

  public impactHeavy() {
    if (this.isSupported) {
      navigator.vibrate(30);
    }
  }

  // Notification feedback patterns
  public notificationSuccess() {
    if (this.isSupported) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  public notificationWarning() {
    if (this.isSupported) {
      navigator.vibrate([20, 100, 20]);
    }
  }

  public notificationError() {
    if (this.isSupported) {
      navigator.vibrate([50, 100, 50]);
    }
  }

  // Medical-specific feedback patterns
  public success() {
    if (this.isSupported) {
      navigator.vibrate([10, 50, 10]);
    }
  }

  public warning() {
    if (this.isSupported) {
      navigator.vibrate([20, 100, 20]);
    }
  }

  public error() {
    if (this.isSupported) {
      navigator.vibrate([50, 100, 50]);
    }
  }

  // Navigation-specific patterns
  public navigationTap() {
    if (!this.isSupported) return;

    switch (this.platform) {
      case 'ios':
        navigator.vibrate(10); // Light selection feedback
        break;
      case 'android':
        navigator.vibrate(15); // Material Design feedback
        break;
      default:
        navigator.vibrate(10);
    }
  }

  public navigationSwitch() {
    if (!this.isSupported) return;

    switch (this.platform) {
      case 'ios':
        navigator.vibrate([10, 30, 10]); // iOS tab switch pattern
        break;
      case 'android':
        navigator.vibrate(25); // Single stronger pulse
        break;
      default:
        navigator.vibrate(15);
    }
  }

  // Emergency/urgent patterns
  public urgent() {
    if (this.isSupported) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }

  public emergency() {
    if (this.isSupported) {
      navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
    }
  }

  public notification() {
    if (this.isSupported) {
      navigator.vibrate([10, 50, 10, 50, 10]);
    }
  }

  public heartbeat() {
    if (this.isSupported) {
      navigator.vibrate([20, 100, 20, 100, 20]);
    }
  }

  // Custom pattern
  public custom(pattern: number | number[]) {
    if (this.isSupported) {
      navigator.vibrate(pattern);
    }
  }

  // Check if haptic feedback is supported
  public isHapticSupported(): boolean {
    return this.isSupported;
  }
}

// Enhanced Gesture Manager with Platform-Specific Behaviors
export class EnhancedGestureManager {
  private element: HTMLElement;
  private callbacks: GestureCallbacks;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchStartTime: number = 0;
  private isLongPress: boolean = false;
  private longPressTimer: number | null = null;
  private platform: 'ios' | 'android' | 'web';
  private hapticManager: EnhancedHapticManager;
  private swipeThreshold: number = 50;
  private longPressDelay: number = 500;

  constructor(element: HTMLElement, callbacks: GestureCallbacks) {
    this.element = element;
    this.callbacks = callbacks;
    this.platform = this.detectPlatform();
    this.hapticManager = new EnhancedHapticManager();
    this.setupPlatformSpecificSettings();
    this.setupEventListeners();
  }

  private detectPlatform(): 'ios' | 'android' | 'web' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/android/.test(userAgent)) return 'android';
    return 'web';
  }

  private setupPlatformSpecificSettings() {
    switch (this.platform) {
      case 'ios':
        this.swipeThreshold = 40; // iOS users expect more sensitive swipes
        this.longPressDelay = 500; // iOS standard long press
        break;
      case 'android':
        this.swipeThreshold = 60; // Android users expect less sensitive swipes
        this.longPressDelay = 600; // Android standard long press
        break;
      default:
        this.swipeThreshold = 50;
        this.longPressDelay = 500;
    }
  }

  private setupEventListeners() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));

    // Add mouse events for desktop testing
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.isLongPress = false;

    // Start long press timer
    this.longPressTimer = window.setTimeout(() => {
      this.isLongPress = true;
      this.hapticManager.medium(); // Haptic feedback for long press
      this.callbacks.onLongPress?.(event);
    }, this.longPressDelay);

    this.callbacks.onTouchStart?.(event);
  }

  private handleTouchMove(event: TouchEvent) {
    // Cancel long press if user moves finger
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    this.callbacks.onTouchMove?.(event);
  }

  private handleTouchEnd(event: TouchEvent) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    const deltaTime = Date.now() - this.touchStartTime;

    // Check for swipe gestures
    if (Math.abs(deltaX) > this.swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.hapticManager.light(); // Haptic feedback for swipe
        this.callbacks.onSwipeRight?.(event);
      } else {
        this.hapticManager.light();
        this.callbacks.onSwipeLeft?.(event);
      }
    } else if (Math.abs(deltaY) > this.swipeThreshold && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0) {
        this.hapticManager.light();
        this.callbacks.onSwipeDown?.(event);
      } else {
        this.hapticManager.light();
        this.callbacks.onSwipeUp?.(event);
      }
    } else if (!this.isLongPress && deltaTime < 300) {
      // Regular tap
      this.hapticManager.selection();
      this.callbacks.onTap?.(event);
    }

    this.callbacks.onTouchEnd?.(event);
  }

  private handleTouchCancel(event: TouchEvent) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.callbacks.onTouchCancel?.(event);
  }

  // Mouse event handlers for desktop testing
  private handleMouseDown(event: MouseEvent) {
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
    this.touchStartTime = Date.now();
    this.isLongPress = false;

    this.longPressTimer = window.setTimeout(() => {
      this.isLongPress = true;
      this.callbacks.onLongPress?.(event as any);
    }, this.longPressDelay);
  }

  private handleMouseMove(event: MouseEvent) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private handleMouseUp(event: MouseEvent) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const deltaX = event.clientX - this.touchStartX;
    const deltaY = event.clientY - this.touchStartY;
    const deltaTime = Date.now() - this.touchStartTime;

    if (Math.abs(deltaX) > this.swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        this.callbacks.onSwipeRight?.(event as any);
      } else {
        this.callbacks.onSwipeLeft?.(event as any);
      }
    } else if (Math.abs(deltaY) > this.swipeThreshold && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0) {
        this.callbacks.onSwipeDown?.(event as any);
      } else {
        this.callbacks.onSwipeUp?.(event as any);
      }
    } else if (!this.isLongPress && deltaTime < 300) {
      this.callbacks.onTap?.(event as any);
    }
  }

  public destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));
    this.element.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.removeEventListener('mouseup', this.handleMouseUp.bind(this));

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }
}
