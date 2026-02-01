# StratTrust AI - Next.js 全栈项目

完整的 AI 量化选币平台，集成 0G Storage、0G Compute 和 TEE 签名，支持 Vercel 部署。

## 项目概览

**StratTrust AI** 是一个可信任的 AI 选币平台，为 MEME 币提供：
- 🧠 AI 推理和交易信号生成
- 📊 因子库管理和版本控制
- ✅ TEE 签名和可验证性保障
- 💾 0G Storage 上的策略快照存储
- 🔗 链上执行和风险管理
- 📋 完整的审计追踪

## 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn
- Git

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 环境配置

复制 `.env.example` 为 `.env.local` 并填入你的配置：

```bash
cp .env.example .env.local
```

关键环境变量：
- `NEXT_PUBLIC_RPC_URL`: 以太坊 RPC URL
- `0G_STORAGE_RPC`: 0G 存储 RPC
- `0G_CHAIN_ID`: 0G 链 ID（测试网: 16602，主网: 16661）
- `TEE_SERVICE_URL`: TEE 签名服务 URL
- `PRIVATE_KEY`: 执行器私钥（仅服务器端，保密！）

### 本地开发

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建和生产

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── pages/                  # Next.js 页面和 API 路由
│   ├── api/               # API 端点
│   │   ├── factors/       # 因子管理 API
│   │   ├── infer.ts       # AI 推理 API
│   │   └── strategies/    # 策略执行 API
│   ├── index.tsx          # 首页
│   ├── factors.tsx        # 因子库页面
│   ├── infer.tsx          # 推理页面
│   ├── audit.tsx          # 审计页面
│   └── ...
├── lib/                   # 核心业务逻辑
│   ├── 0g-storage.ts      # 0G Storage 集成
│   ├── tee-signature.ts   # TEE 签名和验证
│   ├── audit.ts           # 审计和追踪
│   ├── smart-contract.ts  # 智能合约交互
│   └── initialize.ts      # 服务初始化
├── types/                 # TypeScript 类型定义
│   └── index.ts           # 核心数据结构
├── utils/                 # 工具函数
│   ├── crypto.ts          # 密码学和加密
│   └── factor.ts          # 因子处理工具
└── styles/               # 样式
    └── globals.css       # 全局样式
```

## 核心功能

### 1. 因子管理

**API 端点:**
```bash
GET  /api/factors                 # 列出所有因子
POST /api/factors                 # 创建新因子
GET  /api/factors/[id]/snapshots  # 获取因子快照
POST /api/factors/[id]/snapshots  # 记录新快照
```

**使用示例:**
```typescript
// 创建因子
const response = await fetch('/api/factors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Sentiment Factor',
    description: '社交媒体情绪指数',
    author: 'user@example.com',
    dataSource: ['twitter', 'telegram'],
    computeFrequency: 'hourly',
    tags: ['sentiment', 'social'],
  })
});
```

### 2. AI 推理

**API 端点:**
```bash
POST /api/infer           # 运行 AI 推理
GET  /api/infer?traceId=  # 获取推理结果
```

**使用示例:**
```typescript
const response = await fetch('/api/infer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    factorSnapshots: [...],
    marketEnvironment: {
      volatility: 0.25,
      fundingRate: 0.0001,
    },
    riskConfig: {
      maxSlippage: 0.03,
      maxPositionSize: 0.1,
    }
  })
});
```

### 3. 策略执行

**API 端点:**
```bash
POST /api/strategies                    # 创建策略
GET  /api/strategies                    # 列出策略
POST /api/strategies/[id]/execute       # 执行策略
```

### 4. 审计跟踪

所有操作都会被自动记录到审计日志中，支持追踪、验证和合规审查。

## 0G 集成

### Storage 集成

```typescript
import { getZGStorage } from '@/lib/0g-storage';

const storage = getZGStorage();

// 上传策略快照
const result = await storage.uploadStrategy(strategy, metadata);
console.log(`Strategy stored with CID: ${result.cid}`);
```

### Compute 集成

通过 0G Compute broker 发送推理请求：
- 环境变量: `0G_COMPUTE_BROKER_URL`
- 支持 OpenAI 兼容 API
- 可选 TEE 执行以获取签名

### 数据可用性 (DA)

参考 `@0glabs/0g-da-rust-sdk` 用于跨链数据可用性。

## TEE 签名和可验证性

### 签名流程

```typescript
import { getTEEService } from '@/lib/tee-signature';

const tee = getTEEService();

// 签名推理结果
const signature = await tee.signInferenceResult(
  inferenceData,
  modelHash,
  inputHash
);

// 验证签名
const verification = await tee.verifySignature(signature, data);
```

### 证明链

平台支持创建完整的验证证明链：
- Input Hash (特征向量哈希)
- Model Hash (模型版本标识)
- Output Hash (推理结果哈希)
- TEE 签名和 Attestation

## 智能合约集成

### 执行配置

```typescript
const contractConfig = {
  address: '0x...',
  chainId: 1,
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/...',
};

const manager = initializeSmartContract(contractConfig);
```

### 交易模拟

```typescript
// 蜜罐检测 - 模拟小额买入和卖出
const simulation = await manager.simulateSwap(
  tokenIn,
  tokenOut,
  amount,
  slippage
);

if (simulation.isHoneypot) {
  console.log('Honeypot detected!');
}
```

## 风控参数

在 `.env.local` 中配置：

```
MAX_SLIPPAGE=0.05           # 最大滑点: 5%
MAX_POSITION_SIZE=0.1       # 最大仓位: 10%
MAX_DRAWDOWN=0.2            # 最大回撤: 20%
MAX_DAILY_LOSS=0.05         # 日最大亏损: 5%
```

## Vercel 部署

### 前置设置

1. 在 Vercel 中创建新项目
2. 关联 GitHub 仓库
3. 配置环境变量（在 Vercel 仪表板中）

### 关键配置

- **Node.js 版本**: 18.x 或更高
- **构建命令**: `next build`
- **输出目录**: `.next`
- **函数超时**: 30 秒（参考 vercel.json）

### 部署命令

```bash
npm run build
npm start
```

或直接通过 Git：

```bash
git push origin main  # 自动触发 Vercel 部署
```

### 监控和日志

- **Vercel Analytics**: 查看实时性能指标
- **Logs**: `vercel logs` 命令查看实时日志
- **Deployments**: Vercel 仪表板查看部署历史

## API 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2024-01-31T...",
    "version": "1.0.0"
  }
}
```

## 错误处理

API 返回标准错误格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## 最佳实践

### 安全性

- ❌ 不要在代码中硬编码私钥
- ✅ 使用环境变量或密钥管理服务（AWS KMS, Vault）
- ✅ 启用 HTTPS 和 CORS 保护
- ✅ 定期审计日志和交易记录

### 性能优化

- ✅ 启用批量操作（审计日志、存储上传）
- ✅ 使用缓存（Redis）加速数据查询
- ✅ 异步处理 cold path（审计、归档）
- ✅ 监控推理延迟和 RPC 响应时间

### 监控

```typescript
// 记录关键指标
console.log(`推理延迟: ${Date.now() - startTime}ms`);
console.log(`交易成功率: ${success / total}`);
console.log(`审计日志队列: ${queueSize}`);
```

## 故障排查

### 0G Storage 连接问题

```bash
# 测试 RPC 连接
curl https://evmrpc-testnet.0g.ai

# 检查账户余额
# 需要足够的 余额来支付存储费用
```

### TEE 服务不可用

```typescript
// 回退到本地签名
const signature = localSign(data, privateKey);
```

### 合约执行失败

```typescript
// 检查模拟结果
const simulation = await manager.simulateSwap(...);
if (!simulation.success) {
  console.error('Simulation failed:', simulation.error);
}
```

## 文档和资源

- [0G 官方文档](https://docs.0g.ai)
- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 部署指南](https://vercel.com/docs)
- [TEE 技术](https://en.wikipedia.org/wiki/Trusted_execution_environment)

## 路线图

- **MVP (现在)**: 基础因子库、本地推理、简单风控
- **V1 (3-6 个月)**: TEE 集成、因子市场、收益分成
- **V2 (6+ 个月)**: 高级 AI 模型、多链支持、自动参数优化

## 许可证

MIT

## 支持

如有问题，请提交 Issue 或联系项目团队。

---

**重要:** 这是一个 MVP 实现。在生产环境中使用前，请：
1. 进行充分的安全审计
2. 在测试网上充分测试
3. 实现适当的风控机制
4. 咨询法律顾问关于合规要求
