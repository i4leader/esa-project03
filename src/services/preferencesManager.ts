import type { UserPreferences } from '@/types';

/**
 * PreferencesManager Service
 * Manages user preferences and settings using LocalStorage
 */

const STORAGE_KEY = 'codereview_preferences';

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  editor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: true,
  },
  analysis: {
    autoAnalyze: false,
    enabledTypes: ['security', 'performance', 'style'],
    severityFilter: ['critical', 'high', 'medium', 'low'],
  },
};

/**
 * Get user preferences from localStorage
 */
export const getPreferences = (): UserPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }
    
    const preferences: UserPreferences = JSON.parse(stored);
    
    // Merge with defaults to ensure all properties exist
    return {
      ...DEFAULT_PREFERENCES,
      ...preferences,
      editor: {
        ...DEFAULT_PREFERENCES.editor,
        ...preferences.editor,
      },
      analysis: {
        ...DEFAULT_PREFERENCES.analysis,
        ...preferences.analysis,
      },
    };
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Save user preferences to localStorage
 */
export const savePreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

/**
 * Update specific preference
 */
export const updatePreference = <K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void => {
  const preferences = getPreferences();
  preferences[key] = value;
  savePreferences(preferences);
};

/**
 * Reset preferences to defaults
 */
export const resetPreferences = (): void => {
  savePreferences(DEFAULT_PREFERENCES);
};

/**
 * Get theme preference
 */
export const getTheme = (): 'light' | 'dark' | 'auto' => {
  return getPreferences().theme;
};

/**
 * Set theme preference
 */
export const setTheme = (theme: 'light' | 'dark' | 'auto'): void => {
  updatePreference('theme', theme);
};

/**
 * Get language preference
 */
export const getLanguage = (): 'en' | 'zh-CN' => {
  return getPreferences().language;
};

/**
 * Set language preference
 */
export const setLanguage = (language: 'en' | 'zh-CN'): void => {
  updatePreference('language', language);
};

/**
 * Get editor preferences
 */
export const getEditorPreferences = () => {
  return getPreferences().editor;
};

/**
 * Update editor preferences
 */
export const updateEditorPreferences = (
  editorPrefs: Partial<UserPreferences['editor']>
): void => {
  const preferences = getPreferences();
  preferences.editor = {
    ...preferences.editor,
    ...editorPrefs,
  };
  savePreferences(preferences);
};

/**
 * Get analysis preferences
 */
export const getAnalysisPreferences = () => {
  return getPreferences().analysis;
};

/**
 * Update analysis preferences
 */
export const updateAnalysisPreferences = (
  analysisPrefs: Partial<UserPreferences['analysis']>
): void => {
  const preferences = getPreferences();
  preferences.analysis = {
    ...preferences.analysis,
    ...analysisPrefs,
  };
  savePreferences(preferences);
};

/**
 * Export preferences as JSON
 */
export const exportPreferences = (): string => {
  const preferences = getPreferences();
  return JSON.stringify(preferences, null, 2);
};

/**
 * Import preferences from JSON
 */
export const importPreferences = (jsonData: string): boolean => {
  try {
    const imported: UserPreferences = JSON.parse(jsonData);
    
    // Validate structure
    if (!imported.theme || !imported.language) {
      throw new Error('Invalid preferences format');
    }
    
    savePreferences(imported);
    return true;
  } catch (error) {
    console.error('Failed to import preferences:', error);
    return false;
  }
};
