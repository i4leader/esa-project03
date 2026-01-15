# Deployment Guide - CodeReview Pro

## Overview

This guide covers deploying CodeReview Pro to production using Alibaba Cloud ESA (Edge Security Acceleration) services.

## Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ESA Pages     │ ← Static Frontend (Vue SPA)
│  (Edge CDN)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ESA Functions  │ ← Serverless Backend
│  (Edge Compute) │
└────────┬────────┘
         │
         ├──────────────┐
         ▼              ▼
┌──────────────┐  ┌──────────────┐
│  ESA KV Store│  │ Aliyun LLM   │
│  (Caching)   │  │     API      │
└──────────────┘  └──────────────┘
```

## Prerequisites

1. **Alibaba Cloud Account**
   - Active account with billing enabled
   - ESA service activated

2. **Development Tools**
   - Node.js 18+
   - npm or yarn
   - Git

3. **API Access**
   - Aliyun LLM API credentials
   - Or Claude API key (alternative)

## Step 1: Frontend Deployment (ESA Pages)

### Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output will be in dist/ directory
```

### Deploy to ESA Pages

1. **Login to Alibaba Cloud Console**
   - Navigate to ESA service
   - Select "Pages" section

2. **Create New Site**
   - Click "Create Site"
   - Choose "Upload Files" or "Connect Git"

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: dist
   Node Version: 18.x
   ```

4. **Set Environment Variables**
   ```
   VITE_API_ENDPOINT=https://your-esa-function-url.com/api/review
   VITE_USE_MOCK_DATA=false
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Note the deployment URL

### Custom Domain (Optional)

1. Add your domain in ESA Pages settings
2. Configure DNS CNAME record
3. Enable HTTPS (automatic with ESA)

## Step 2: Backend Deployment (ESA Functions)

### Create Function Project

```bash
# Create new directory for backend
mkdir codereview-backend
cd codereview-backend

# Initialize project
npm init -y
npm install @alicloud/fc2 @alicloud/openapi-client
```

### Implement Review Function

Create `index.js`:

```javascript
const OpenAI = require('openai'); // Or Aliyun SDK

exports.handler = async (event, context) => {
  const { code, language, requestId } = JSON.parse(event.body);
  
  // Validate input
  if (!code || code.length > 50 * 1024) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 'error',
        message: 'Invalid code input'
      })
    };
  }
  
  // Check cache (ESA KV Store)
  const cacheKey = `review:${hashCode(code)}:${language}`;
  const cached = await context.kv.get(cacheKey);
  
  if (cached) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...cached,
        cached: true
      })
    };
  }
  
  // Call AI API
  const issues = await analyzeWithAI(code, language);
  
  const result = {
    status: 'success',
    requestId,
    issues,
    summary: calculateSummary(issues),
    cached: false
  };
  
  // Cache result (24 hours)
  await context.kv.put(cacheKey, result, { expirationTtl: 86400 });
  
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};

async function analyzeWithAI(code, language) {
  // Implement AI analysis
  // Use Aliyun LLM API or Claude API
}

function calculateSummary(issues) {
  // Calculate summary statistics
}

function hashCode(str) {
  // Simple hash function for caching
}
```

### Deploy Function

1. **Package Function**
   ```bash
   zip -r function.zip index.js node_modules/
   ```

2. **Deploy via Console**
   - Navigate to ESA Functions
   - Create new function
   - Upload function.zip
   - Configure:
     - Runtime: Node.js 18
     - Memory: 512MB
     - Timeout: 30s

3. **Set Environment Variables**
   ```
   ALIYUN_API_KEY=your-api-key
   ALIYUN_API_SECRET=your-api-secret
   ```

4. **Configure Triggers**
   - Add HTTP trigger
   - Enable CORS
   - Note the function URL

## Step 3: ESA KV Store Setup

### Create KV Namespace

1. Navigate to ESA KV Store
2. Create namespace: `codereview-cache`
3. Note the namespace ID

### Configure Access

1. Grant ESA Functions access to KV Store
2. Update function code with namespace ID
3. Test cache operations

## Step 4: Rate Limiting

### Implement Rate Limiting

Add to function code:

```javascript
async function checkRateLimit(clientId, context) {
  const key = `ratelimit:${clientId}:${getCurrentHour()}`;
  const count = await context.kv.get(key) || 0;
  
  if (count >= 100) {
    return {
      allowed: false,
      retryAfter: 3600 - (Date.now() % 3600000) / 1000
    };
  }
  
  await context.kv.put(key, count + 1, { expirationTtl: 3600 });
  return { allowed: true };
}
```

## Step 5: Monitoring and Logging

### Enable Logging

1. Navigate to ESA Functions logs
2. Enable detailed logging
3. Configure log retention

### Set Up Alerts

1. Create CloudWatch-equivalent alerts
2. Monitor:
   - Function errors
   - Response times
   - Rate limit hits
   - Cache hit ratio

### Metrics to Track

- Request count
- Average response time
- Error rate
- Cache hit rate
- API costs

## Step 6: Security Configuration

### API Key Management

1. Store API keys in ESA Secrets Manager
2. Never commit keys to repository
3. Rotate keys regularly

### CORS Configuration

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};
```

### Input Validation

- Validate code size (50KB limit)
- Sanitize inputs
- Check for malicious patterns
- Rate limit by IP/user

## Step 7: Testing

### Test Deployment

```bash
# Test frontend
curl https://your-esa-pages-url.com

# Test backend
curl -X POST https://your-function-url.com/api/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(\"test\");",
    "language": "javascript",
    "requestId": "test-123",
    "timestamp": 1234567890
  }'
```

### Load Testing

```bash
# Use Apache Bench or similar
ab -n 1000 -c 10 https://your-function-url.com/api/review
```

## Step 8: Optimization

### Frontend Optimization

1. **Enable Compression**
   - Gzip/Brotli enabled by default on ESA Pages

2. **Cache Headers**
   - Configure in ESA Pages settings
   - Cache static assets aggressively

3. **Code Splitting**
   - Implement dynamic imports for large components
   - Lazy load Monaco Editor

### Backend Optimization

1. **Cold Start Reduction**
   - Keep functions warm with scheduled pings
   - Optimize package size

2. **Cache Strategy**
   - Cache aggressively (24 hours)
   - Implement cache warming for popular patterns

3. **Connection Pooling**
   - Reuse API connections
   - Implement connection pooling

## Rollback Procedure

### Frontend Rollback

1. Navigate to ESA Pages deployments
2. Select previous deployment
3. Click "Rollback"

### Backend Rollback

1. Keep previous function versions
2. Update routing to previous version
3. Monitor for issues

## Cost Optimization

### Estimated Costs

- **ESA Pages**: ~$5-20/month (depending on traffic)
- **ESA Functions**: ~$0.20 per million requests
- **ESA KV Store**: ~$0.25 per GB-month
- **AI API**: Variable (depends on usage)

### Cost Reduction Tips

1. Implement aggressive caching
2. Use rate limiting
3. Optimize function memory/timeout
4. Monitor and alert on unusual usage

## Maintenance

### Regular Tasks

- [ ] Monitor error rates
- [ ] Review logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Review and optimize costs monthly
- [ ] Test disaster recovery quarterly

### Updates

```bash
# Update frontend
npm run build
# Deploy via ESA Pages console

# Update backend
# Package and deploy new function version
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in function
   - Verify allowed origins

2. **Slow Response Times**
   - Check cache hit rate
   - Optimize AI API calls
   - Increase function memory

3. **Rate Limit Issues**
   - Adjust rate limits
   - Implement user-specific limits
   - Add retry logic

4. **Cache Issues**
   - Verify KV Store access
   - Check cache key generation
   - Monitor cache size

## Support

For deployment issues:
1. Check Alibaba Cloud documentation
2. Review ESA service status
3. Contact Alibaba Cloud support
4. Check application logs

## Checklist

Before going live:

- [ ] Frontend deployed to ESA Pages
- [ ] Backend function deployed and tested
- [ ] ESA KV Store configured
- [ ] Rate limiting implemented
- [ ] Monitoring and alerts set up
- [ ] Security review completed
- [ ] Load testing passed
- [ ] Documentation updated
- [ ] Rollback procedure tested
- [ ] Team trained on operations

## Next Steps

After deployment:
1. Monitor performance for first 24 hours
2. Gather user feedback
3. Iterate on AI prompts for better results
4. Implement additional features
5. Scale as needed

Good luck with your deployment! 🚀
