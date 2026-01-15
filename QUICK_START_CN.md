# 快速开始指南

## 🚀 5 分钟快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量（可选）

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件（开发环境可以跳过此步骤）
# 默认使用 Mock 数据，无需配置 API
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:5173

### 4. 测试功能

1. **上传代码文件** 或 **直接粘贴代码**
2. 点击 **"审查代码"** 按钮
3. 查看分析结果
4. 尝试切换 **中文/英文** 界面
5. 尝试切换 **深色/浅色** 主题

## 📦 生产环境部署

### 方式 1: 静态部署（推荐用于测试）

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 部署 dist 目录到任何静态托管服务
# - Vercel
# - Netlify
# - GitHub Pages
# - 阿里云 OSS
```

### 方式 2: 阿里云 ESA 部署（推荐用于生产）

详细步骤请参考 [BACKEND_SETUP.md](./BACKEND_SETUP.md)

## 🔧 后台配置（生产环境必需）

### 快速配置清单

- [ ] 1. 获取 AI API Key（Claude 或 通义千问）
- [ ] 2. 创建阿里云 ESA Functions
- [ ] 3. 配置 ESA KV Store（缓存）
- [ ] 4. 部署 Functions 到 ESA
- [ ] 5. 配置自定义域名和 HTTPS
- [ ] 6. 更新前端 API 端点

### AI API 选择

#### 选项 1: Claude API（国际）

**优点:**
- 代码理解能力强
- 响应速度快
- 文档完善

**获取方式:**
1. 访问 https://console.anthropic.com/
2. 注册账号
3. 创建 API Key
4. 配置到 `.env`:
```bash
VITE_CLAUDE_API_KEY=sk-ant-api03-your-key-here
```

**定价:** $0.003/1K tokens (输入), $0.015/1K tokens (输出)

#### 选项 2: 阿里云通义千问（国内）

**优点:**
- 国内访问速度快
- 中文理解能力强
- 与阿里云生态集成好

**获取方式:**
1. 访问 https://dashscope.console.aliyun.com/
2. 开通通义千问服务
3. 创建 API Key
4. 配置到 `.env`:
```bash
VITE_ALIYUN_API_KEY=sk-your-aliyun-key-here
```

**定价:** ¥0.008/1K tokens

### 最小化配置（仅用于测试）

如果只是想测试功能，可以使用 Mock 数据：

```bash
# .env 文件
VITE_USE_MOCK_DATA=true
```

这样就不需要配置任何 API，应用会使用模拟数据。

## 🎨 界面特性

### 现代化设计
- ✨ 渐变色背景
- 🪟 毛玻璃效果卡片
- 🎭 流畅的动画过渡
- 🌓 深色/浅色主题
- 🌍 中文/英文切换

### 核心功能
- 📤 文件上传（拖放支持）
- 💻 Monaco 代码编辑器
- 🔍 AI 代码分析
- 📊 问题分类和筛选
- 📜 审查历史管理
- 📥 多格式导出（PDF/MD/JSON）

## 📱 支持的编程语言

- JavaScript / TypeScript
- Python
- Java
- Go
- C++ / C
- C#
- PHP
- Ruby
- Rust

## 🔒 安全说明

### 开发环境
- Mock 数据模式下，代码不会发送到任何服务器
- 所有数据存储在浏览器 LocalStorage

### 生产环境
- 使用 HTTPS 加密传输
- API Key 存储在服务器端
- 支持速率限制
- 缓存敏感数据加密

## 🐛 常见问题

### 1. 端口被占用

```bash
# 错误: Port 5173 is in use
# 解决: 修改端口
npm run dev -- --port 3000
```

### 2. 构建失败

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 3. 深色模式不工作

检查 `tailwind.config.js`:
```javascript
darkMode: 'selector', // 确保是 'selector' 而不是 'class'
```

### 4. 语言切换不生效

清除浏览器缓存或使用无痕模式测试。

### 5. Mock 数据不显示

确保 `.env` 文件中:
```bash
VITE_USE_MOCK_DATA=true
```

## 📚 相关文档

- [完整 README](./README.md) - 项目概述
- [中文 README](./README.zh-CN.md) - 中文文档
- [后台配置](./BACKEND_SETUP.md) - 详细的后台配置指南
- [UI 优化说明](./UI_IMPROVEMENTS.md) - 界面设计说明
- [部署指南](./DEPLOYMENT.md) - 部署步骤
- [使用指南](./USAGE.md) - 功能使用说明

## 🆘 获取帮助

### 问题反馈
- GitHub Issues: [提交问题](https://github.com/your-repo/issues)
- 邮件: support@codereview.pro

### 技术支持
- 阿里云 ESA: https://help.aliyun.com/product/esa.html
- Claude API: https://docs.anthropic.com/
- 通义千问: https://help.aliyun.com/document_detail/2712195.html

## 🎯 下一步

1. ✅ 启动开发服务器
2. ✅ 测试基本功能
3. ✅ 尝试不同主题和语言
4. 📖 阅读 [BACKEND_SETUP.md](./BACKEND_SETUP.md) 配置生产环境
5. 🚀 部署到生产环境

## 💡 提示

- 开发时使用 Mock 数据可以节省 API 调用费用
- 生产环境建议配置缓存以提高性能
- 定期备份审查历史数据
- 监控 API 使用量避免超出配额

---

**祝您使用愉快！** 🎉

如有问题，请参考文档或联系技术支持。
