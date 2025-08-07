// Content management hook for About page
// Provides centralized content management with i18n support

import { useState, useEffect, useMemo } from 'react';
import { 
  getContent, 
  getCurrentLanguage, 
  formatPhoneNumber,
  getLocalizedAriaLabel,
  type SupportedLanguage,
  type I18nContent 
} from '../constants/i18n';

interface ContentManagementOptions {
  language?: SupportedLanguage;
  fallbackLanguage?: SupportedLanguage;
  enableCaching?: boolean;
}

interface ContentManagementReturn {
  content: I18nContent;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  formatPhone: (phone: string) => string;
  getAriaLabel: (key: keyof I18nContent['accessibility']) => string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for managing content with internationalization support
 */
export const useContentManagement = (
  options: ContentManagementOptions = {}
): ContentManagementReturn => {
  const {
    language: initialLanguage,
    fallbackLanguage = 'vi',
    enableCaching = true,
  } = options;

  const [language, setLanguage] = useState<SupportedLanguage>(
    initialLanguage || getCurrentLanguage()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentCache, setContentCache] = useState<Map<SupportedLanguage, I18nContent>>(
    new Map()
  );

  // Memoized content retrieval
  const content = useMemo(() => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first if caching is enabled
      if (enableCaching && contentCache.has(language)) {
        const cachedContent = contentCache.get(language)!;
        setIsLoading(false);
        return cachedContent;
      }

      // Get content for current language
      let currentContent: I18nContent;
      try {
        currentContent = getContent(language);
      } catch (err) {
        console.warn(`Failed to load content for language: ${language}, falling back to ${fallbackLanguage}`);
        currentContent = getContent(fallbackLanguage);
      }

      // Cache the content if caching is enabled
      if (enableCaching) {
        setContentCache(prev => new Map(prev).set(language, currentContent));
      }

      setIsLoading(false);
      return currentContent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      setIsLoading(false);
      // Return fallback content
      return getContent(fallbackLanguage);
    }
  }, [language, fallbackLanguage, enableCaching, contentCache]);

  // Phone number formatter
  const formatPhone = useMemo(() => {
    return (phone: string) => formatPhoneNumber(phone, language);
  }, [language]);

  // Aria label getter
  const getAriaLabel = useMemo(() => {
    return (key: keyof I18nContent['accessibility']) => 
      getLocalizedAriaLabel(key, language);
  }, [language]);

  // Language change handler
  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    
    // Store language preference in localStorage
    try {
      localStorage.setItem('preferred-language', newLanguage);
    } catch (err) {
      console.warn('Failed to save language preference:', err);
    }
  };

  // Load saved language preference on mount
  useEffect(() => {
    if (!initialLanguage) {
      try {
        const savedLanguage = localStorage.getItem('preferred-language') as SupportedLanguage;
        if (savedLanguage && ['vi', 'en'].includes(savedLanguage)) {
          setLanguage(savedLanguage);
        }
      } catch (err) {
        console.warn('Failed to load language preference:', err);
      }
    }
  }, [initialLanguage]);

  return {
    content,
    language,
    setLanguage: handleLanguageChange,
    formatPhone,
    getAriaLabel,
    isLoading,
    error,
  };
};

/**
 * Hook for content validation and quality assurance
 */
export const useContentValidation = (content: I18nContent) => {
  const validationResults = useMemo(() => {
    const issues: string[] = [];
    
    // Check for missing required content
    if (!content.about.title) issues.push('Missing about title');
    if (!content.about.brandName) issues.push('Missing brand name');
    if (!content.about.slogan) issues.push('Missing slogan');
    if (content.about.paragraphs.length === 0) issues.push('Missing about paragraphs');
    if (content.stats.items.length === 0) issues.push('Missing statistics');
    
    // Check for accessibility content
    if (!content.accessibility.skipToContent) issues.push('Missing skip to content text');
    if (!content.accessibility.loading) issues.push('Missing loading text');
    if (!content.accessibility.error) issues.push('Missing error text');
    
    // Check content length limits
    if (content.about.title.length > 100) issues.push('About title too long');
    if (content.about.slogan.length > 200) issues.push('Slogan too long');
    
    // Check for proper formatting
    content.about.paragraphs.forEach((paragraph, index) => {
      if (paragraph.length < 50) {
        issues.push(`Paragraph ${index + 1} too short`);
      }
      if (paragraph.length > 500) {
        issues.push(`Paragraph ${index + 1} too long`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      score: Math.max(0, 100 - (issues.length * 10)), // Simple scoring system
    };
  }, [content]);

  return validationResults;
};

/**
 * Hook for content analytics and performance tracking
 */
export const useContentAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    languageSwitches: 0,
    contentInteractions: 0,
    averageTimeOnPage: 0,
  });

  const trackPageView = () => {
    setAnalytics(prev => ({ ...prev, pageViews: prev.pageViews + 1 }));
  };

  const trackLanguageSwitch = (from: SupportedLanguage, to: SupportedLanguage) => {
    setAnalytics(prev => ({ ...prev, languageSwitches: prev.languageSwitches + 1 }));
    
    // In a real application, you would send this to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`Language switched from ${from} to ${to}`);
    }
  };

  const trackContentInteraction = (type: string, content: string) => {
    setAnalytics(prev => ({ ...prev, contentInteractions: prev.contentInteractions + 1 }));
    
    // In a real application, you would send this to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`Content interaction: ${type} - ${content}`);
    }
  };

  const trackTimeOnPage = (startTime: number) => {
    const timeSpent = Date.now() - startTime;
    setAnalytics(prev => ({
      ...prev,
      averageTimeOnPage: (prev.averageTimeOnPage + timeSpent) / 2,
    }));
  };

  return {
    analytics,
    trackPageView,
    trackLanguageSwitch,
    trackContentInteraction,
    trackTimeOnPage,
  };
};

/**
 * Hook for content search and filtering
 */
export const useContentSearch = (content: I18nContent) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    type: string;
    title: string;
    content: string;
    relevance: number;
  }>>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: typeof searchResults = [];

    // Search in about content
    if (content.about.title.toLowerCase().includes(query)) {
      results.push({
        type: 'title',
        title: 'Tiêu đề chính',
        content: content.about.title,
        relevance: 1.0,
      });
    }

    if (content.about.slogan.toLowerCase().includes(query)) {
      results.push({
        type: 'slogan',
        title: 'Phương châm',
        content: content.about.slogan,
        relevance: 0.9,
      });
    }

    // Search in paragraphs
    content.about.paragraphs.forEach((paragraph, index) => {
      if (paragraph.toLowerCase().includes(query)) {
        results.push({
          type: 'paragraph',
          title: `Đoạn văn ${index + 1}`,
          content: paragraph,
          relevance: 0.7,
        });
      }
    });

    // Search in features
    content.about.features.forEach((feature, index) => {
      if (feature.title.toLowerCase().includes(query) || feature.description.toLowerCase().includes(query)) {
        results.push({
          type: 'feature',
          title: feature.title,
          content: feature.description,
          relevance: 0.8,
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    setSearchResults(results);
  }, [searchQuery, content]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    hasResults: searchResults.length > 0,
  };
};
