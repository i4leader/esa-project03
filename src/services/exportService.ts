import type { CodeAnalysis, ExportOptions, ExportResult } from '@/types';
import jsPDF from 'jspdf';

/**
 * ExportService
 * Handles exporting code review results in multiple formats (PDF, Markdown, JSON)
 */

/**
 * Export as JSON
 */
export const exportAsJSON = (analysis: CodeAnalysis, options: ExportOptions): ExportResult => {
  const data = {
    code: options.includeCode ? analysis.code : undefined,
    language: analysis.language,
    timestamp: options.includeMetadata ? new Date(analysis.metadata.timestamp).toISOString() : undefined,
    processingTime: options.includeMetadata ? analysis.metadata.processingTime : undefined,
    issues: analysis.issues.filter(issue => {
      const severityMatch = !options.severityFilter || options.severityFilter.includes(issue.severity);
      const typeMatch = !options.typeFilter || options.typeFilter.includes(issue.type);
      return severityMatch && typeMatch;
    }),
    summary: analysis.summary,
  };
  
  const content = JSON.stringify(data, null, 2);
  const filename = `code-review-${Date.now()}.json`;
  
  return {
    format: 'json',
    content,
    filename,
    size: new Blob([content]).size,
  };
};

/**
 * Export as Markdown
 */
export const exportAsMarkdown = (analysis: CodeAnalysis, options: ExportOptions): ExportResult => {
  let markdown = '# Code Review Report\n\n';
  
  // Metadata
  if (options.includeMetadata) {
    markdown += `**Date:** ${new Date(analysis.metadata.timestamp).toLocaleString()}\n`;
    markdown += `**Language:** ${analysis.language}\n`;
    markdown += `**Processing Time:** ${analysis.metadata.processingTime}ms\n\n`;
  }
  
  // Summary
  markdown += '## Summary\n\n';
  markdown += `- **Total Issues:** ${analysis.summary.totalIssues}\n`;
  markdown += `- **Critical:** ${analysis.summary.severityBreakdown.critical}\n`;
  markdown += `- **High:** ${analysis.summary.severityBreakdown.high}\n`;
  markdown += `- **Medium:** ${analysis.summary.severityBreakdown.medium}\n`;
  markdown += `- **Low:** ${analysis.summary.severityBreakdown.low}\n\n`;
  
  // Code
  if (options.includeCode) {
    markdown += '## Code\n\n';
    markdown += '```' + analysis.language + '\n';
    markdown += analysis.code + '\n';
    markdown += '```\n\n';
  }
  
  // Issues
  markdown += '## Issues\n\n';
  
  const filteredIssues = analysis.issues.filter(issue => {
    const severityMatch = !options.severityFilter || options.severityFilter.includes(issue.severity);
    const typeMatch = !options.typeFilter || options.typeFilter.includes(issue.type);
    return severityMatch && typeMatch;
  });
  
  filteredIssues.forEach((issue, index) => {
    const icon = issue.type === 'security' ? '🔒' : issue.type === 'performance' ? '⚡' : '📝';
    markdown += `### ${index + 1}. ${icon} ${issue.title}\n\n`;
    markdown += `**Type:** ${issue.type} | **Severity:** ${issue.severity}\n`;
    markdown += `**Lines:** ${issue.line[0]}-${issue.line[1]}\n\n`;
    markdown += `**Description:** ${issue.description}\n\n`;
    markdown += `**Suggestion:** ${issue.suggestion}\n\n`;
    
    if (issue.codeExample) {
      markdown += '**Example:**\n\n';
      markdown += '```' + analysis.language + '\n';
      markdown += issue.codeExample + '\n';
      markdown += '```\n\n';
    }
    
    markdown += '---\n\n';
  });
  
  const filename = `code-review-${Date.now()}.md`;
  
  return {
    format: 'markdown',
    content: markdown,
    filename,
    size: new Blob([markdown]).size,
  };
};

/**
 * Export as PDF
 */
export const exportAsPDF = (analysis: CodeAnalysis, options: ExportOptions): ExportResult => {
  const doc = new jsPDF();
  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Helper to add text with page break handling
  const addText = (text: string, fontSize = 12, isBold = false) => {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const lines = doc.splitTextToSize(text, 170);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };
  
  // Title
  addText('Code Review Report', 18, true);
  yPosition += 5;
  
  // Metadata
  if (options.includeMetadata) {
    addText(`Date: ${new Date(analysis.metadata.timestamp).toLocaleString()}`, 10);
    addText(`Language: ${analysis.language}`, 10);
    addText(`Processing Time: ${analysis.metadata.processingTime}ms`, 10);
    yPosition += 5;
  }
  
  // Summary
  addText('Summary', 14, true);
  addText(`Total Issues: ${analysis.summary.totalIssues}`, 10);
  addText(`Critical: ${analysis.summary.severityBreakdown.critical}`, 10);
  addText(`High: ${analysis.summary.severityBreakdown.high}`, 10);
  addText(`Medium: ${analysis.summary.severityBreakdown.medium}`, 10);
  addText(`Low: ${analysis.summary.severityBreakdown.low}`, 10);
  yPosition += 10;
  
  // Issues
  addText('Issues', 14, true);
  yPosition += 5;
  
  const filteredIssues = analysis.issues.filter(issue => {
    const severityMatch = !options.severityFilter || options.severityFilter.includes(issue.severity);
    const typeMatch = !options.typeFilter || options.typeFilter.includes(issue.type);
    return severityMatch && typeMatch;
  });
  
  filteredIssues.forEach((issue, index) => {
    addText(`${index + 1}. ${issue.title}`, 12, true);
    addText(`Type: ${issue.type} | Severity: ${issue.severity}`, 10);
    addText(`Lines: ${issue.line[0]}-${issue.line[1]}`, 10);
    addText(`Description: ${issue.description}`, 10);
    addText(`Suggestion: ${issue.suggestion}`, 10);
    yPosition += 5;
  });
  
  const pdfBlob = doc.output('blob');
  const filename = `code-review-${Date.now()}.pdf`;
  
  return {
    format: 'pdf',
    content: pdfBlob,
    filename,
    size: pdfBlob.size,
  };
};

/**
 * Download export result
 */
export const downloadExport = (result: ExportResult): void => {
  const blob = result.content instanceof Blob 
    ? result.content 
    : new Blob([result.content], { type: 'text/plain' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export with default options
 */
export const exportAnalysis = (
  analysis: CodeAnalysis,
  format: 'pdf' | 'markdown' | 'json'
): void => {
  const options: ExportOptions = {
    format,
    includeCode: true,
    includeMetadata: true,
  };
  
  let result: ExportResult;
  
  switch (format) {
    case 'pdf':
      result = exportAsPDF(analysis, options);
      break;
    case 'markdown':
      result = exportAsMarkdown(analysis, options);
      break;
    case 'json':
      result = exportAsJSON(analysis, options);
      break;
  }
  
  downloadExport(result);
};
