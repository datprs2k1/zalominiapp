import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, EmergencyContact } from '@/components/preferences/UserPreferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  // Display preferences
  theme: 'auto',
  language: 'vi',
  fontSize: 'medium',
  reducedMotion: false,
  
  // Medical preferences
  preferredSpecialties: [],
  preferredDoctors: [],
  preferredHospitals: [],
  emergencyContacts: [],
  
  // Notification preferences
  appointmentReminders: true,
  medicationReminders: true,
  testResultNotifications: true,
  promotionalNotifications: false,
  emailNotifications: true,
  smsNotifications: true,
  
  // Privacy preferences
  shareDataForResearch: false,
  allowLocationTracking: true,
  showProfileToOthers: true,
  
  // Booking preferences
  preferredTimeSlots: ['morning'],
  preferredConsultationType: 'both',
  autoBookingEnabled: false,
  
  // Accessibility preferences
  highContrast: false,
  screenReaderOptimized: false,
  keyboardNavigationOnly: false
};

interface UseUserPreferencesOptions {
  persistToStorage?: boolean;
  autoSave?: boolean;
  syncWithServer?: boolean;
}

export const useUserPreferences = (options: UseUserPreferencesOptions = {}) => {
  const {
    persistToStorage = true,
    autoSave = false,
    syncWithServer = false
  } = options;

  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load preferences from storage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        if (persistToStorage) {
          const stored = localStorage.getItem('user-preferences');
          if (stored) {
            const parsed = JSON.parse(stored);
            setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
          }
        }

        if (syncWithServer) {
          // TODO: Load from server
          // const serverPrefs = await fetchUserPreferences();
          // setPreferences(prev => ({ ...prev, ...serverPrefs }));
        }
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [persistToStorage, syncWithServer]);

  // Auto-save when preferences change
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        savePreferences();
      }, 1000); // Auto-save after 1 second of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [preferences, hasUnsavedChanges, autoSave]);

  // Apply theme changes to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (preferences.theme === 'dark') {
        root.classList.add('dark');
      } else if (preferences.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // Auto theme based on system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }

      // Apply font size
      root.style.fontSize = preferences.fontSize === 'small' ? '14px' : 
                           preferences.fontSize === 'large' ? '18px' : '16px';

      // Apply high contrast
      if (preferences.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }

      // Apply reduced motion
      if (preferences.reducedMotion) {
        root.style.setProperty('--animation-duration', '0s');
        root.style.setProperty('--transition-duration', '0s');
      } else {
        root.style.removeProperty('--animation-duration');
        root.style.removeProperty('--transition-duration');
      }
    };

    applyTheme();
  }, [preferences.theme, preferences.fontSize, preferences.highContrast, preferences.reducedMotion]);

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
    setHasUnsavedChanges(true);
  }, []);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const savePreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      if (persistToStorage) {
        localStorage.setItem('user-preferences', JSON.stringify(preferences));
      }

      if (syncWithServer) {
        // TODO: Save to server
        // await saveUserPreferences(preferences);
      }

      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save user preferences:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [preferences, persistToStorage, syncWithServer]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    setHasUnsavedChanges(true);
  }, []);

  const resetToDefaults = useCallback(async () => {
    setPreferences(DEFAULT_PREFERENCES);
    if (persistToStorage) {
      localStorage.removeItem('user-preferences');
    }
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  }, [persistToStorage]);

  // Emergency contact management
  const addEmergencyContact = useCallback((contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setPreferences(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const updateEmergencyContact = useCallback((id: string, updates: Partial<EmergencyContact>) => {
    setPreferences(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(contact =>
        contact.id === id ? { ...contact, ...updates } : contact
      )
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removeEmergencyContact = useCallback((id: string) => {
    setPreferences(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(contact => contact.id !== id)
    }));
    setHasUnsavedChanges(true);
  }, []);

  const setPrimaryEmergencyContact = useCallback((id: string) => {
    setPreferences(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === id
      }))
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Specialty management
  const addPreferredSpecialty = useCallback((specialty: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredSpecialties: [...prev.preferredSpecialties, specialty]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removePreferredSpecialty = useCallback((specialty: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredSpecialties: prev.preferredSpecialties.filter(s => s !== specialty)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Doctor management
  const addPreferredDoctor = useCallback((doctorId: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredDoctors: [...prev.preferredDoctors, doctorId]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removePreferredDoctor = useCallback((doctorId: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredDoctors: prev.preferredDoctors.filter(id => id !== doctorId)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Time slot management
  const addPreferredTimeSlot = useCallback((timeSlot: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredTimeSlots: [...prev.preferredTimeSlots, timeSlot]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removePreferredTimeSlot = useCallback((timeSlot: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredTimeSlots: prev.preferredTimeSlots.filter(slot => slot !== timeSlot)
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Notification preferences helpers
  const enableAllNotifications = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      appointmentReminders: true,
      medicationReminders: true,
      testResultNotifications: true,
      promotionalNotifications: true,
      emailNotifications: true,
      smsNotifications: true
    }));
    setHasUnsavedChanges(true);
  }, []);

  const disableAllNotifications = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      appointmentReminders: false,
      medicationReminders: false,
      testResultNotifications: false,
      promotionalNotifications: false,
      emailNotifications: false,
      smsNotifications: false
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Privacy helpers
  const enableAllPrivacyFeatures = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      shareDataForResearch: true,
      allowLocationTracking: true,
      showProfileToOthers: true
    }));
    setHasUnsavedChanges(true);
  }, []);

  const disableAllPrivacyFeatures = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      shareDataForResearch: false,
      allowLocationTracking: false,
      showProfileToOthers: false
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Accessibility helpers
  const enableAccessibilityFeatures = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      highContrast: true,
      screenReaderOptimized: true,
      keyboardNavigationOnly: true,
      reducedMotion: true,
      fontSize: 'large'
    }));
    setHasUnsavedChanges(true);
  }, []);

  return {
    preferences,
    isLoading,
    hasUnsavedChanges,
    lastSaved,
    
    // Core functions
    updatePreferences,
    updatePreference,
    savePreferences,
    resetPreferences,
    resetToDefaults,
    
    // Emergency contacts
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    setPrimaryEmergencyContact,
    
    // Specialties
    addPreferredSpecialty,
    removePreferredSpecialty,
    
    // Doctors
    addPreferredDoctor,
    removePreferredDoctor,
    
    // Time slots
    addPreferredTimeSlot,
    removePreferredTimeSlot,
    
    // Bulk operations
    enableAllNotifications,
    disableAllNotifications,
    enableAllPrivacyFeatures,
    disableAllPrivacyFeatures,
    enableAccessibilityFeatures
  };
};
