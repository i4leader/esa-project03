# CodeReview Pro - Usage Guide

## Getting Started

### 1. Starting the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### 2. Analyzing Code

#### Method 1: Paste Code
1. Click in the code editor
2. Paste your code (Ctrl+V / Cmd+V)
3. Select the programming language from the dropdown
4. Click "Review Code" button

#### Method 2: Upload File
1. Click the upload area or drag a file
2. Supported formats: .js, .ts, .py, .java, .go, .cpp, .cs, .php, .rb, .rs
3. Language is auto-detected from file extension
4. Click "Review Code" button

#### Method 3: Use Sample Files
Sample files are provided in the `samples/` directory:
- `sample-javascript.js` - JavaScript with common issues
- `sample-python.py` - Python with common issues
- `sample-typescript.ts` - TypeScript with common issues

### 3. Understanding Results

#### Issue Types
- 🔒 **Security** (Red) - Security vulnerabilities and risks
- ⚡ **Performance** (Yellow) - Performance optimization opportunities
- 📝 **Style** (Blue) - Code style and best practice recommendations

#### Severity Levels
- **Critical** - Must fix immediately
- **High** - Should fix soon
- **Medium** - Should address when possible
- **Low** - Nice to have improvements

#### Issue Cards
Each issue card shows:
- Type icon and severity badge
- Line numbers affected
- Description of the problem
- Suggested fix
- Optional code example

### 4. Interacting with Issues

#### Highlight Code
- Click any issue card to highlight the affected lines in the editor
- The editor will scroll to show the highlighted code
- Click another issue to change the highlight

#### Filter Issues
Use the filter buttons to show specific types:
- **All** - Show all issues
- **Security** - Show only security issues
- **Performance** - Show only performance issues
- **Style** - Show only style issues

#### View Summary
The summary section shows:
- Total issue count
- Breakdown by severity (Critical/High/Medium/Low)

### 5. Exporting Results

Click the export buttons to download results:
- **JSON** - Machine-readable format with complete data
- **MD** - Markdown format (works in GitHub, Notion, etc.)
- **PDF** - Formatted PDF document

Export includes:
- Code (if enabled)
- All issues with details
- Summary statistics
- Timestamp and metadata

### 6. Using History

#### View History
- History panel shows your last 20 code reviews
- Each entry shows:
  - Programming language
  - Time ago
  - Code preview (first 50 characters)
  - Issue summary by severity

#### Restore from History
- Click any history item to restore the code to the editor
- You can re-analyze or modify the code

#### Delete History
- Click the X button on any item to delete it
- Click "Clear All" to remove all history (requires confirmation)

### 7. Theme Support

#### Toggle Theme
- Click the sun/moon icon in the header
- Switches between light and dark mode
- Preference is saved automatically

#### Theme Features
- WCAG-compliant contrast ratios
- Consistent styling across all components
- Smooth transitions

### 8. Keyboard Shortcuts

#### Editor
- **Ctrl+Z / Cmd+Z** - Undo
- **Ctrl+Y / Cmd+Y** - Redo
- **Ctrl+A / Cmd+A** - Select all
- **Tab** - Navigate between elements

#### Navigation
- **Tab** - Move to next interactive element
- **Shift+Tab** - Move to previous element
- **Enter** - Activate focused element
- **Space** - Activate focused button/card

## Tips and Best Practices

### Code Size Limit
- Maximum code size: 50KB
- If exceeded, you'll see a warning
- Consider splitting large files

### Language Detection
- Upload files with proper extensions for auto-detection
- Manually select language if needed
- Supported: JavaScript, TypeScript, Python, Java, Go, C++, C#, PHP, Ruby, Rust

### Analysis Quality
- More code = more issues detected
- Include context for better analysis
- Review suggestions carefully

### History Management
- History limited to 20 items (oldest removed automatically)
- Stored in browser LocalStorage
- Cleared when browser data is cleared

### Export Best Practices
- **JSON** - For programmatic processing or backup
- **Markdown** - For documentation or sharing
- **PDF** - For formal reports or printing

## Troubleshooting

### Code Not Analyzing
- Check code size (must be under 50KB)
- Ensure code is not empty
- Check browser console for errors

### File Upload Not Working
- Verify file extension is supported
- Check file size (under 50KB)
- Try pasting code instead

### History Not Saving
- Check browser LocalStorage is enabled
- Clear browser cache if issues persist
- Export history as backup

### Theme Not Persisting
- Check browser LocalStorage is enabled
- Try manually toggling theme again

### Export Not Working
- Check browser allows downloads
- Try different export format
- Check browser console for errors

## Advanced Features

### Mock Analysis
The current version uses mock AI analysis that detects:
- Hardcoded credentials (API keys, passwords, tokens)
- Dangerous functions (eval, Function constructor)
- Performance issues (inefficient loops, string concatenation)
- Style issues (var usage, console statements)
- Missing error handling

### Production Integration
To connect to real AI services:
1. Set `VITE_USE_MOCK_DATA=false` in `.env`
2. Configure `VITE_API_ENDPOINT` to your backend
3. Implement ESA Functions backend
4. Connect to Aliyun LLM API or Claude API

## Support

For issues or questions:
1. Check this usage guide
2. Review the README.md
3. Check the spec documents in `.kiro/specs/ai-code-reviewer/`
4. Open an issue on the project repository

## Sample Workflow

1. **Start** - Open the application
2. **Upload** - Drag sample-javascript.js into the upload area
3. **Review** - Click "Review Code" button
4. **Explore** - Click different issues to see highlights
5. **Filter** - Try filtering by Security, Performance, Style
6. **Export** - Download results as PDF
7. **History** - Check the history panel
8. **Restore** - Click a history item to restore
9. **Theme** - Toggle dark mode
10. **Repeat** - Try with different code samples

Enjoy using CodeReview Pro! 🚀
