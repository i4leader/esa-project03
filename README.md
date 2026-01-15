# CodeReview Pro

[中文文档](./README.zh-CN.md) | English

An AI-powered code review assistant that helps developers identify security vulnerabilities, performance issues, and code style problems.

## ✨ Features

- 🤖 **AI-Powered Analysis** - Leverages Aliyun Qwen (通义千问) for intelligent code review
- 🔒 **Security Detection** - Identifies security vulnerabilities like hardcoded credentials, eval() usage, and more
- ⚡ **Performance Optimization** - Detects performance bottlenecks and suggests improvements
- 📝 **Code Style Checking** - Ensures code follows best practices and style guidelines
- 🌍 **Internationalization** - Supports English and Chinese (中文)
- 🎨 **Modern UI** - Beautiful, responsive interface with dark mode support
- 📊 **Export Reports** - Export analysis results as PDF, Markdown, or JSON
- 📜 **Review History** - Keep track of all your code reviews
- � **Line Highlighting** - Click on issues to highlight problematic code lines

## 🖼️ Screenshots

### Main Interface
![Main Interface](./public/project04-codereview001.png)

### Code Editor & Analysis
![Code Editor](./public/project04-codereview002.png)

### Issue Detection Results
![Issue Results](./public/project04-codereview003.png)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Aliyun DashScope API Key ([Get it here](https://dashscope.console.aliyun.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/codereview-pro.git
cd codereview-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

1. Open the application in your browser (default: http://localhost:5173)
2. Click the **"配置 API Key"** (Setup API) button in the top right corner
3. Enter your Aliyun DashScope API Key
4. Click Save

That's it! You're ready to start reviewing code.

## 📖 Usage

### 1. Upload or Paste Code

**Option A: Upload a file**
- Click the upload area or drag & drop a code file
- Supported formats: `.js`, `.ts`, `.py`, `.java`, `.go`, `.cpp`, `.cs`, `.php`, `.rb`, `.rs`
- Maximum file size: 50KB

**Option B: Paste code directly**
- Paste your code into the Monaco editor
- Select the programming language from the dropdown

### 2. Review Code

- Click the **"审查代码"** (Review Code) button
- Wait for AI analysis (typically 2-5 seconds)
- View detected issues categorized by severity and type

### 3. Analyze Results

Issues are categorized by:
- **Type**: Security 🔒, Performance ⚡, Style 📝
- **Severity**: Critical, High, Medium, Low

Each issue includes:
- Detailed description
- Suggested fix
- Code example (when applicable)
- Line numbers

### 4. Export Reports

Export your analysis results in multiple formats:
- **JSON** - For programmatic processing
- **Markdown** - For documentation
- **PDF** - For sharing and archiving

## 🛠️ Technology Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code editor)
- **AI Model**: Aliyun Qwen (通义千问)
- **Internationalization**: Vue I18n
- **Export**: jsPDF, html2canvas

## 🌐 Internationalization

The application supports:
- 🇺🇸 English
- 🇨🇳 中文 (Chinese)

Switch languages using the dropdown in the top right corner.

## 📦 Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory.

## 🔧 Development

### Project Structure

```
codereview-pro/
├── public/              # Static assets
├── src/
│   ├── components/      # Vue components
│   │   ├── CodeEditor.vue
│   │   ├── FileUpload.vue
│   │   ├── IssuePanel.vue
│   │   ├── IssueCard.vue
│   │   └── HistoryPanel.vue
│   ├── services/        # Business logic
│   │   ├── analysisEngine.ts
│   │   ├── historyManager.ts
│   │   └── exportService.ts
│   ├── i18n/           # Internationalization
│   │   └── locales/
│   ├── types/          # TypeScript types
│   ├── App.vue         # Main component
│   └── main.ts         # Entry point
├── .env.example        # Environment variables template
└── README.md
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔐 API Key Security

- API keys are stored locally in your browser's localStorage
- Keys are never sent to any server except Aliyun's API
- You have full control over your API key
- Clear your API key anytime from the settings modal

## 💰 Cost Estimation

Using Aliyun Qwen API:
- **Cost**: ¥0.008 per 1K tokens
- **Average review**: ~750 tokens (¥0.006 per review)
- **100 reviews/month**: ~¥0.60
- **1000 reviews/month**: ~¥6.00

Very affordable for individual developers and small teams!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [Aliyun DashScope](https://dashscope.aliyun.com/) - AI model platform

## � Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](./BACKEND_SETUP.md)
- Visit [Aliyun DashScope Console](https://dashscope.console.aliyun.com/)

---

<div align="center">
  <img src="./public/aliyun.png" alt="Aliyun ESA" width="200"/>
  
  **Powered by Aliyun ESA**
  
  This project is accelerated, computed, and protected by [Aliyun Edge Security Acceleration (ESA)](https://www.aliyun.com/product/esa)
  
  本项目由阿里云 ESA 提供加速、计算和保护
</div>

---

<div align="center">
  Made with ❤️ by developers, for developers
  
  © 2026 CodeReview Pro
</div>
