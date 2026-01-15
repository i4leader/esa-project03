# Quick Start Guide - CodeReview Pro

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A code editor (VS Code recommended)

## Installation

```bash
# 1. Clone or navigate to the project
cd esa-project03

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will open at `http://localhost:5173`

## First Review

### Option 1: Use Sample Files

1. Open the application
2. Click the upload area
3. Select `samples/sample-javascript.js`
4. Click "Review Code"
5. Explore the issues!

### Option 2: Paste Code

1. Open the application
2. Paste this code in the editor:

```javascript
const apiKey = "secret-key-123";

function processData(items) {
  var result = "";
  for (let i = 0; i < items.length; i++) {
    result += items[i];
  }
  console.log(result);
  return result;
}

eval("alert('test')");
```

3. Click "Review Code"
4. See the issues detected!

## Key Features to Try

### 1. Issue Filtering
- Click "Security" to see only security issues
- Click "Performance" for performance issues
- Click "Style" for style issues
- Click "All" to see everything

### 2. Line Highlighting
- Click any issue card
- Watch the editor highlight the problematic lines
- Click different issues to see different highlights

### 3. Dark Mode
- Click the sun/moon icon in the header
- Toggle between light and dark themes
- Your preference is saved automatically

### 4. Export Results
- After reviewing code, click "JSON", "MD", or "PDF"
- Download the results in your preferred format
- Share with your team!

### 5. History
- Review some code
- Check the History panel at the bottom
- Click any history item to restore it
- Delete items you don't need

## Common Tasks

### Review Different Languages

```bash
# Try Python
# Upload samples/sample-python.py

# Try TypeScript
# Upload samples/sample-typescript.ts
```

### Test File Upload

1. Drag any supported file onto the upload area
2. Supported: .js, .ts, .py, .java, .go, .cpp, .cs, .php, .rb, .rs
3. Language is auto-detected
4. Click "Review Code"

### Export to PDF

1. Review some code
2. Click the "PDF" button
3. A formatted PDF will download
4. Open and review the report

## Keyboard Shortcuts

- **Ctrl+Z** / **Cmd+Z** - Undo in editor
- **Ctrl+Y** / **Cmd+Y** - Redo in editor
- **Ctrl+A** / **Cmd+A** - Select all in editor
- **Tab** - Navigate between elements
- **Enter** - Activate focused element

## Troubleshooting

### Application Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build Fails

```bash
# Check Node version (should be 18+)
node --version

# Update dependencies
npm update

# Try building
npm run build
```

### Issues Not Showing

- Make sure code is not empty
- Check code size (must be under 50KB)
- Look for error messages in red
- Check browser console (F12)

## What to Expect

### Mock Analysis Detects:

**Security Issues:**
- Hardcoded API keys, passwords, tokens
- Use of eval() or Function()
- Missing error handling in async functions

**Performance Issues:**
- Inefficient loops with string concatenation
- Nested loops
- Array operations in loops

**Style Issues:**
- Use of `var` instead of `const`/`let`
- Console.log statements
- Naming convention issues

### Analysis Time

- Typical: 1.5-2.5 seconds
- Includes simulated API delay
- Real API would be similar

## Next Steps

### Learn More
- Read [USAGE.md](USAGE.md) for detailed features
- Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for overview
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

### Customize
- Modify `src/services/analysisEngine.ts` for different analysis patterns
- Update `src/App.vue` for UI changes
- Add new components in `src/components/`

### Deploy
- Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Set up Alibaba Cloud ESA services
- Connect real AI API

## Sample Workflow

1. **Start** → `npm run dev`
2. **Upload** → Drag `samples/sample-javascript.js`
3. **Review** → Click "Review Code"
4. **Explore** → Click different issues
5. **Filter** → Try Security/Performance/Style filters
6. **Export** → Download as PDF
7. **History** → Check the history panel
8. **Theme** → Toggle dark mode
9. **Repeat** → Try other sample files!

## Tips

- 💡 Use sample files to see realistic issues
- 💡 Try dark mode for comfortable viewing
- 💡 Export results to share with team
- 💡 Check history to compare reviews
- 💡 Click issues to see exact locations
- 💡 Filter by type to focus on specific concerns

## Getting Help

- Check [USAGE.md](USAGE.md) for detailed instructions
- Review [CHECKLIST.md](CHECKLIST.md) for feature status
- Look at sample files for examples
- Check browser console for errors

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

## Project Structure

```
esa-project03/
├── src/
│   ├── components/    # Vue components
│   ├── services/      # Business logic
│   ├── types/         # TypeScript types
│   └── App.vue        # Main app
├── samples/           # Sample code files
├── dist/              # Build output
└── docs/              # Documentation
```

## Success Checklist

- [ ] Application starts successfully
- [ ] Can upload or paste code
- [ ] Analysis completes and shows issues
- [ ] Can click issues to highlight lines
- [ ] Can filter by issue type
- [ ] Can toggle dark/light theme
- [ ] Can export results
- [ ] Can view and restore history

If all checked, you're ready to go! 🎉

## What's Next?

1. **Explore** - Try all the features
2. **Customize** - Modify to your needs
3. **Deploy** - Set up production environment
4. **Share** - Show your team!

Happy code reviewing! 🚀

---

**Need help?** Check the other documentation files or open an issue.
