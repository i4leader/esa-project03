// Core type definitions for AI Code Reviewer
export type IssueType = 'security' | 'performance' | 'style';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Issue {
  id: string;
  type: IssueType;
  severity: SeverityLevel;
  title: string;
  description: string;
  suggestion: string;
  codeExample?: string;
  line: [number, number];
  column: [number, number];
}

export interface AnalysisSummary {
  totalIssues: number;
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  typeBreakdown: {
    security: number;
    performance: number;
    style: number;
  };
}

export interface CodeAnalysis {
  id: string;
  code: string;
  language: string;
  issues: Issue[];
  metadata: {
    timestamp: number;
    processingTime: number;
    aiModel: string;
    cacheHit: boolean;
  };
  summary: AnalysisSummary;
}

export interface ReviewRequest {
  code: string;
  language: string;
  requestId: string;
  timestamp: number;
}

export interface ReviewResponse {
  status: 'success' | 'error';
  requestId: string;
  issues: Issue[];
  summary: {
    totalIssues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    processingTime: number;
  };
  cached: boolean;
}

export interface ErrorResponse {
  status: 'error';
  code: string;
  message: string;
  requestId: string;
}

export interface ReviewHistory {
  id: string;
  code: string;
  language: string;
  timestamp: number;
  issueCount: number;
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'zh-CN';
  editor: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
  analysis: {
    autoAnalyze: boolean;
    enabledTypes: IssueType[];
    severityFilter: SeverityLevel[];
  };
}

export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'json';
  includeCode: boolean;
  includeMetadata: boolean;
  severityFilter?: SeverityLevel[];
  typeFilter?: IssueType[];
}

export interface ExportResult {
  format: string;
  content: string | Blob;
  filename: string;
  size: number;
}
