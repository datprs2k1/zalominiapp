/**
 * Mobile Accessibility Enhancements
 * Comprehensive accessibility utilities for mobile footer navigation
 */

// Types
interface AccessibilityLabels {
  vietnamese: Record<string, string>;
  badges: {
    single: string;
    multiple: (count: number) => string;
    urgent: string;
  };
}

interface VoiceControlCommands {
  [key: string]: () => void;
}

interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
}

// Accessibility Labels for Vietnamese Healthcare App
export const accessibilityLabels: AccessibilityLabels = {
  vietnamese: {
    home: 'Trang chủ, điều hướng tab 1 trong 5',
    services: 'Dịch vụ y tế, điều hướng tab 2 trong 5',
    explore: 'Khám phá, điều hướng tab 3 trong 5',
    schedule: 'Lịch hẹn khám bệnh, điều hướng tab 4 trong 5',
    profile: 'Hồ sơ cá nhân, điều hướng tab 5 trong 5',
    
    // With notifications
    scheduleWithNotifications: (count: number) => 
      `Lịch hẹn khám bệnh, điều hướng tab 4 trong 5, có ${count} thông báo mới`,
    
    // Navigation instructions
    navigationInstructions: 'Sử dụng phím mũi tên để điều hướng giữa các tab. Nhấn Enter hoặc Space để kích hoạt tab đã chọn.',
    
    // Error messages
    networkError: 'Không thể kết nối. Vui lòng thử lại.',
    navigationError: 'Không thể chuyển trang. Vui lòng thử lại.',
    accessError: 'Không có quyền truy cập. Vui lòng đăng nhập.',
  },
  
  badges: {
    single: '1 thông báo mới',
    multiple: (count: number) => `${count} thông báo mới`,
    urgent: 'Thông báo khẩn cấp'
  }
};

// iOS VoiceOver Support
export class iOSVoiceOverManager {
  private customRotorItems: Array<{ label: string; element: string }>;
  
  constructor() {
    this.customRotorItems = [
      { label: 'Trang chủ', element: '#home-tab' },
      { label: 'Dịch vụ', element: '#services-tab' },
      { label: 'Khám phá', element: '#explore-tab' },
      { label: 'Lịch hẹn', element: '#schedule-tab' },
      { label: 'Hồ sơ', element: '#profile-tab' }
    ];
  }

  // Setup VoiceOver custom rotor
  public setupCustomRotor() {
    // This would integrate with iOS VoiceOver API if available
    console.log('Setting up VoiceOver custom rotor for healthcare navigation');
  }

  // Voice Control names
  public getVoiceControlNames() {
    return {
      home: ['Trang chủ', 'Home', 'Nhà'],
      services: ['Dịch vụ', 'Services', 'Khám bệnh'],
      explore: ['Khám phá', 'Explore', 'Tìm hiểu'],
      schedule: ['Lịch hẹn', 'Schedule', 'Đặt lịch'],
      profile: ['Hồ sơ', 'Profile', 'Tài khoản']
    };
  }

  // Dynamic Type support
  public getDynamicTypeMultiplier(): number {
    // This would read from iOS accessibility settings
    return parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--ios-dynamic-type-multiplier')) || 1;
  }
}

// Android TalkBack Support
export class AndroidTalkBackManager {
  private contentDescriptions: Record<string, string>;
  
  constructor() {
    this.contentDescriptions = {
      home: 'Trang chủ, tab, 1 trong 5',
      services: 'Dịch vụ y tế, tab, 2 trong 5',
      explore: 'Khám phá, tab, 3 trong 5',
      schedule: 'Lịch hẹn khám bệnh, tab, 4 trong 5',
      profile: 'Hồ sơ cá nhân, tab, 5 trong 5'
    };
  }

  // Get content description with notification count
  public getContentDescription(itemId: string, notificationCount?: number): string {
    const baseDescription = this.contentDescriptions[itemId] || itemId;
    
    if (notificationCount && notificationCount > 0) {
      return `${baseDescription}, có ${notificationCount} thông báo mới`;
    }
    
    return baseDescription;
  }

  // Touch exploration settings
  public getTouchExplorationSettings() {
    return {
      enabled: true,
      hapticFeedback: true,
      audioFeedback: true
    };
  }
}

// Universal Accessibility Manager
export class MobileAccessibilityManager {
  private platform: 'ios' | 'android' | 'web';
  private voiceOverManager?: iOSVoiceOverManager;
  private talkBackManager?: AndroidTalkBackManager;
  private preferences: AccessibilityPreferences;

  constructor() {
    this.platform = this.detectPlatform();
    this.preferences = this.detectAccessibilityPreferences();
    this.initializePlatformManagers();
  }

  private detectPlatform(): 'ios' | 'android' | 'web' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/android/.test(userAgent)) return 'android';
    return 'web';
  }

  private detectAccessibilityPreferences(): AccessibilityPreferences {
    return {
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      largeText: window.matchMedia('(prefers-reduced-motion: no-preference)').matches,
      screenReader: this.isScreenReaderActive()
    };
  }

  private isScreenReaderActive(): boolean {
    // Detect if screen reader is active
    return !!(
      navigator.userAgent.match(/NVDA|JAWS|VoiceOver|TalkBack|Dragon/i) ||
      window.speechSynthesis ||
      document.querySelector('[aria-live]')
    );
  }

  private initializePlatformManagers() {
    switch (this.platform) {
      case 'ios':
        this.voiceOverManager = new iOSVoiceOverManager();
        break;
      case 'android':
        this.talkBackManager = new AndroidTalkBackManager();
        break;
    }
  }

  // Get appropriate ARIA label for navigation item
  public getAriaLabel(itemId: string, notificationCount?: number): string {
    const baseLabel = accessibilityLabels.vietnamese[itemId];
    
    if (notificationCount && notificationCount > 0) {
      const badgeText = notificationCount === 1 
        ? accessibilityLabels.badges.single
        : accessibilityLabels.badges.multiple(notificationCount);
      return `${baseLabel}, ${badgeText}`;
    }
    
    return baseLabel;
  }

  // Get platform-specific content description
  public getContentDescription(itemId: string, notificationCount?: number): string {
    switch (this.platform) {
      case 'android':
        return this.talkBackManager?.getContentDescription(itemId, notificationCount) || itemId;
      case 'ios':
        return this.getAriaLabel(itemId, notificationCount);
      default:
        return this.getAriaLabel(itemId, notificationCount);
    }
  }

  // Setup keyboard navigation
  public setupKeyboardNavigation(container: HTMLElement) {
    const navItems = container.querySelectorAll('[role="tab"]');
    
    navItems.forEach((item, index) => {
      item.addEventListener('keydown', (event) => {
        this.handleKeyboardNavigation(event as KeyboardEvent, index, navItems);
      });
    });
  }

  private handleKeyboardNavigation(
    event: KeyboardEvent, 
    currentIndex: number, 
    items: NodeListOf<Element>
  ) {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        (items[currentIndex] as HTMLElement).click();
        return;
    }
    
    if (newIndex !== currentIndex) {
      // Update tabindex
      items[currentIndex].setAttribute('tabindex', '-1');
      items[newIndex].setAttribute('tabindex', '0');
      (items[newIndex] as HTMLElement).focus();
    }
  }

  // Setup voice commands
  public setupVoiceCommands(navigationCallback: (itemId: string) => void) {
    const voiceCommands: VoiceControlCommands = {
      'đi trang chủ': () => navigationCallback('home'),
      'mở dịch vụ': () => navigationCallback('services'),
      'xem khám phá': () => navigationCallback('explore'),
      'xem lịch hẹn': () => navigationCallback('schedule'),
      'mở hồ sơ': () => navigationCallback('profile'),
      
      // English commands for international users
      'go home': () => navigationCallback('home'),
      'open services': () => navigationCallback('services'),
      'explore': () => navigationCallback('explore'),
      'schedule': () => navigationCallback('schedule'),
      'profile': () => navigationCallback('profile')
    };

    // This would integrate with Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      console.log('Voice commands available:', Object.keys(voiceCommands));
    }
  }

  // Announce to screen reader
  public announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Get accessibility preferences
  public getPreferences(): AccessibilityPreferences {
    return this.preferences;
  }

  // Update preferences when system settings change
  public updatePreferences() {
    this.preferences = this.detectAccessibilityPreferences();
  }
}

// Export singleton instance
export const mobileAccessibilityManager = new MobileAccessibilityManager();
