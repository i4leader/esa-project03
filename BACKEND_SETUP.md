# 后台环境配置指南

## 概述

CodeReview Pro 支持两种使用模式：

1. **前端直连模式**（推荐用于个人/小团队）：用户在 UI 中输入阿里云 API Key，前端直接调用阿里云通义千问 API
2. **后端服务模式**（推荐用于企业）：基于阿里云 ESA (Edge Security Acceleration) 架构，提供缓存、速率限制等企业级功能

## 模式 1：前端直连模式（推荐）

### 优点
- 无需部署后端服务
- 配置简单，开箱即用
- 适合个人开发者和小团队
- 成本透明，按实际使用付费

### 配置步骤

#### 1. 获取阿里云 API Key

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 登录您的阿里云账号
3. 开通通义千问服务
4. 创建 API Key 并复制

#### 2. 在应用中配置

1. 启动应用：`npm run dev`
2. 点击右上角的 "Setup API" 按钮
3. 输入您的阿里云 API Key
4. 点击保存

#### 3. 开始使用

- 上传或粘贴代码
- 点击 "审查代码" 按钮
- 等待 AI 分析结果

### 成本估算（前端直连模式）

- 通义千问 API：¥0.008/1K tokens
- 平均每次代码审查：约 2K-4K tokens
- 预估成本：¥0.016-0.032/次
- **月成本（100 次审查）**：¥1.6-3.2

---

## 模式 2：后端服务模式（企业级）

### 优点
- 统一管理 API Key
- 支持缓存，减少重复调用
- 速率限制，防止滥用
- 使用监控和日志
- 更好的安全性

### 必需的环境变量

创建 `.env` 文件（参考 `.env.example`）：

```bash
# 阿里云通义千问 API
VITE_ALIYUN_API_KEY=your_aliyun_api_key_here
VITE_ALIYUN_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
VITE_ALIYUN_MODEL=qwen-turbo

# ESA Functions 配置
VITE_ESA_FUNCTION_URL=https://your-esa-function.example.com/api/review

# 缓存配置
VITE_CACHE_ENABLED=true
VITE_CACHE_TTL=86400  # 24小时（秒）

# 速率限制
VITE_RATE_LIMIT_ENABLED=true
VITE_RATE_LIMIT_MAX_REQUESTS=100  # 每分钟最大请求数
```

## 阿里云 ESA 配置步骤

### 1. 创建 ESA Functions

#### 1.1 登录阿里云控制台
- 访问 [阿里云 ESA 控制台](https://esa.console.aliyun.com/)
- 选择您的区域

#### 1.2 创建 Function
```bash
# 在 functions/ 目录创建以下文件结构：
functions/
├── review/
│   ├── index.ts          # 主处理函数
│   ├── package.json      # 依赖配置
│   └── tsconfig.json     # TypeScript 配置
└── shared/
    ├── ai-client.ts      # AI API 客户端
    ├── cache.ts          # 缓存逻辑
    └── rate-limiter.ts   # 速率限制
```

#### 1.3 Function 代码示例

**functions/review/index.ts:**
```typescript
import { Context, Request, Response } from '@alicloud/esa-functions';
import { analyzeCodeWithAI } from '../shared/ai-client';
import { getCachedResult, setCachedResult } from '../shared/cache';
import { checkRateLimit } from '../shared/rate-limiter';

export async function handler(request: Request, context: Context): Promise<Response> {
  try {
    // 1. 速率限制检查
    const clientId = request.headers['x-client-id'] || request.ip;
    const rateLimitOk = await checkRateLimit(clientId);
    
    if (!rateLimitOk) {
      return {
        statusCode: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        },
        body: JSON.stringify({
          error: 'Rate limit exceeded. Please try again later.'
        })
      };
    }

    // 2. 解析请求
    const { code, language } = JSON.parse(request.body);
    
    // 3. 验证输入
    if (!code || !language) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing code or language parameter' })
      };
    }

    // 4. 检查缓存
    const cacheKey = `review:${language}:${hashCode(code)}`;
    const cached = await getCachedResult(cacheKey);
    
    if (cached) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cached,
          metadata: { ...cached.metadata, cacheHit: true }
        })
      };
    }

    // 5. 调用 AI 分析
    const result = await analyzeCodeWithAI(code, language);
    
    // 6. 缓存结果
    await setCachedResult(cacheKey, result, 86400); // 24小时
    
    // 7. 返回结果
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    };
    
  } catch (error) {
    console.error('Analysis error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}

function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}
```

### 2. 配置 ESA KV Store（缓存）

#### 2.1 创建 KV 命名空间
```bash
# 在 ESA 控制台创建 KV 命名空间
名称: codereview-cache
描述: 代码审查结果缓存
TTL: 86400 秒（24小时）
```

#### 2.2 KV Store 使用示例

**functions/shared/cache.ts:**
```typescript
import { KVNamespace } from '@alicloud/esa-kv';

const cache = new KVNamespace('codereview-cache');

export async function getCachedResult(key: string): Promise<any | null> {
  try {
    const value = await cache.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCachedResult(
  key: string, 
  value: any, 
  ttl: number = 86400
): Promise<void> {
  try {
    await cache.put(key, JSON.stringify(value), { expirationTtl: ttl });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}
```

### 3. 配置 AI API

#### 获取阿里云通义千问 API Key

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 开通通义千问服务
3. 创建 API Key

**AI 客户端示例 (通义千问):**
```typescript
// functions/shared/ai-client.ts
export async function analyzeCodeWithAI(code: string, language: string) {
  const apiKey = process.env.ALIYUN_API_KEY;
  
  const response = await fetch(
    'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [{
            role: 'system',
            content: '你是一个专业的代码审查助手，擅长发现代码中的安全、性能和风格问题。'
          }, {
            role: 'user',
            content: `分析以下 ${language} 代码的安全、性能和风格问题...`
          }]
        },
        parameters: {
          result_format: 'message',
          temperature: 0.7,
          max_tokens: 2000
        }
      })
    }
  );

  const data = await response.json();
  return parseAIResponse(data.output.choices[0].message.content);
}
```

### 4. 部署到 ESA

#### 4.1 安装 ESA CLI
```bash
npm install -g @alicloud/esa-cli
```

#### 4.2 配置认证
```bash
esa configure
# 输入 Access Key ID
# 输入 Access Key Secret
# 选择区域
```

#### 4.3 部署 Functions
```bash
cd functions/review
esa deploy --function review --region cn-hangzhou
```

#### 4.4 配置触发器
```bash
# 创建 HTTP 触发器
esa trigger create \
  --function review \
  --type http \
  --path /api/review \
  --methods POST
```

### 5. 配置域名和 HTTPS

#### 5.1 绑定自定义域名
```bash
# 在 ESA 控制台绑定域名
域名: api.yourcodereview.com
证书: 上传或使用阿里云证书
```

#### 5.2 配置 CORS
```typescript
// 在 Function 中添加 CORS 头
return {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://yourcodereview.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },
  body: JSON.stringify(result)
};
```

## 前端配置

### 更新 API 端点

在 `src/services/analysisEngine.ts` 中更新 API URL：

```typescript
const API_URL = import.meta.env.VITE_ESA_FUNCTION_URL || 'http://localhost:3000/api/review';

export const analyzeCode = async (code: string, language: string): Promise<CodeAnalysis> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, language }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return await response.json();
};
```

## 监控和日志

### 1. 配置日志服务
```bash
# 在 ESA 控制台启用日志服务
日志项目: codereview-logs
日志库: function-logs
```

### 2. 查看日志
```bash
# 使用 ESA CLI 查看日志
esa logs --function review --tail
```

### 3. 配置告警
```bash
# 在阿里云监控控制台配置告警规则
- Function 错误率 > 5%
- Function 响应时间 > 3s
- 速率限制触发次数 > 100/分钟
```

## 成本估算

### ESA Functions
- 免费额度：每月 100 万次调用
- 超出部分：¥0.0000017/次

### ESA KV Store
- 免费额度：每月 1GB 存储
- 超出部分：¥0.5/GB/月

### 阿里云通义千问 API
- 通义千问 Turbo：¥0.008/1K tokens
- 通义千问 Plus：¥0.02/1K tokens

### 预估月成本（1000 用户，企业模式）
- ESA Functions: ¥50-100
- KV Store: ¥10-20
- 通义千问 API: ¥200-500
- **总计**: ¥260-620/月

### 预估月成本（个人/小团队，前端直连模式）
- 通义千问 API: ¥10-50/月（取决于使用频率）
- **总计**: ¥10-50/月

## 安全最佳实践

1. **API Key 管理**
   - 使用阿里云 KMS 加密存储
   - 定期轮换 API Keys
   - 使用环境变量，不要硬编码

2. **速率限制**
   - 实施 IP 级别限制
   - 实施用户级别限制
   - 使用滑动窗口算法

3. **输入验证**
   - 验证代码大小（50KB 限制）
   - 验证语言类型
   - 过滤恶意输入

4. **HTTPS Only**
   - 强制使用 HTTPS
   - 配置 HSTS 头
   - 使用有效的 SSL 证书

## 故障排查

### 常见问题

1. **Function 超时**
   - 增加超时时间（最大 60s）
   - 优化 AI API 调用
   - 使用异步处理

2. **缓存未命中**
   - 检查 KV Store 配置
   - 验证缓存 Key 生成逻辑
   - 检查 TTL 设置

3. **速率限制误触发**
   - 调整限制阈值
   - 使用更精确的客户端识别
   - 实施白名单机制

## 开发环境

### 本地测试

```bash
# 安装依赖
cd functions/review
npm install

# 本地运行
npm run dev

# 测试 API
curl -X POST http://localhost:3000/api/review \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(\"test\")","language":"javascript"}'
```

### 使用 Mock 数据

在开发阶段，可以使用 mock 数据：

```typescript
// src/services/analysisEngine.ts
const USE_MOCK = import.meta.env.DEV; // 开发环境使用 mock

if (USE_MOCK) {
  return generateMockAnalysis(code, language);
}
```

## 下一步

1. ✅ 配置环境变量
2. ✅ 创建 ESA Functions
3. ✅ 配置 KV Store
4. ✅ 获取 AI API Key
5. ✅ 部署到 ESA
6. ✅ 配置域名和 HTTPS
7. ✅ 测试端到端流程
8. ✅ 配置监控和告警

## 支持

如有问题，请参考：
- [阿里云 ESA 文档](https://help.aliyun.com/product/esa.html)
- [通义千问 API 文档](https://help.aliyun.com/document_detail/2712195.html)
- [DashScope 控制台](https://dashscope.console.aliyun.com/)
