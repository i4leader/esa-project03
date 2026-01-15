import type { ReviewHistory, CodeAnalysis } from '@/types';

/**
 * HistoryManager Service
 * Manages storage and retrieval of code review history using LocalStorage
 * Implements LRU (Least Recently Used) eviction with a 20-item limit
 */

const STORAGE_KEY = 'codereview_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Get all history items from localStorage
 */
export const getHistory = (): ReviewHistory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    const history: ReviewHistory[] = JSON.parse(stored);
    
    // Sort by timestamp (most recent first)
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

/**
 * Save a code analysis to history
 */
export const saveToHistory = (analysis: CodeAnalysis): void => {
  try {
    const history = getHistory();
    
    // Create history item
    const historyItem: ReviewHistory = {
      id: analysis.id,
      code: analysis.code,
      language: analysis.language,
      timestamp: analysis.metadata.timestamp,
      issueCount: analysis.summary.totalIssues,
      summary: analysis.summary.severityBreakdown,
    };
    
    // Remove existing item with same ID if it exists
    const filteredHistory = history.filter(item => item.id !== historyItem.id);
    
    // Add new item at the beginning
    filteredHistory.unshift(historyItem);
    
    // Enforce 20-item limit (LRU eviction)
    const limitedHistory = filteredHistory.slice(0, MAX_HISTORY_ITEMS);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Failed to save to history:', error);
    
    // Check if quota exceeded
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Try to clear old items and retry
      try {
        const history = getHistory();
        const reducedHistory = history.slice(0, Math.floor(MAX_HISTORY_ITEMS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedHistory));
        
        // Retry saving
        saveToHistory(analysis);
      } catch (retryError) {
        console.error('Failed to save even after clearing space:', retryError);
      }
    }
  }
};

/**
 * Get a specific history item by ID
 */
export const getHistoryItem = (id: string): ReviewHistory | null => {
  const history = getHistory();
  return history.find(item => item.id === id) || null;
};

/**
 * Delete a specific history item
 */
export const deleteHistoryItem = (id: string): void => {
  try {
    const history = getHistory();
    const filteredHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
};

/**
 * Clear all history
 */
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

/**
 * Get history count
 */
export const getHistoryCount = (): number => {
  return getHistory().length;
};

/**
 * Check if history is at capacity
 */
export const isHistoryFull = (): boolean => {
  return getHistoryCount() >= MAX_HISTORY_ITEMS;
};

/**
 * Get formatted code preview (first 50 characters)
 */
export const getCodePreview = (code: string): string => {
  const preview = code.trim().substring(0, 50);
  return code.length > 50 ? `${preview}...` : preview;
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Export history as JSON
 */
export const exportHistory = (): string => {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
};

/**
 * Import history from JSON
 */
export const importHistory = (jsonData: string): boolean => {
  try {
    const imported: ReviewHistory[] = JSON.parse(jsonData);
    
    // Validate structure
    if (!Array.isArray(imported)) {
      throw new Error('Invalid history format');
    }
    
    // Merge with existing history
    const existing = getHistory();
    const merged = [...imported, ...existing];
    
    // Remove duplicates by ID
    const unique = merged.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    );
    
    // Sort and limit
    const sorted = unique.sort((a, b) => b.timestamp - a.timestamp);
    const limited = sorted.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    return true;
  } catch (error) {
    console.error('Failed to import history:', error);
    return false;
  }
};
