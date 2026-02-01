# 🚀 StratTrust AI: Trusted AI-Powered MEME Coin Selection Platform

**StratTrust AI** is a comprehensive full-stack solution built with Next.js, designed for AI-driven quantitative MEME coin selection, strategy management, and verifiable on-chain execution.

---

## 🌍 English Version

### ✨ Core Features

- 🧠 **AI Inference Engine** - Generate real-time trading signals and portfolio recommendations using advanced models.
- 📊 **Factor Library Management** - Create, version, and manage quantitative factors (Sentiment, Volume, Velocity, etc.).
- ✅ **TEE Verifiable Execution** - Ensure trust with TEE-backed verifiable inference and cryptographic signatures.
- 💾 **0G Storage Integration** - Decentralized, immutable storage for strategy snapshots and audit logs.
- 🔗 **Smart Contract Execution** - Secure on-chain trade execution with built-in risk management and slippage control.
- � **Full Audit Trail** - Real-time audit logs and transaction tracking for complete transparency and accountability.
- 🚀 **Vercel Deployment Ready** - Optimized for production-grade deployment with out-of-the-box configurations.

### 🏗️ System Architecture

1. **Data Layer**: Collects on-chain events, K-line data, and social sentiment (Twitter, Telegram).
2. **Factor Service**: Manages factor metadata, registration, and versioning.
3. **AI Inference**: Requests TEE-protected inference for strategy generation.
4. **Storage Layer**: Immutable audit logs and snapshots stored on 0G Storage.
5. **Execution Layer**: Smart contracts for trade execution and risk control.

### 🚀 Quick Start

#### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

#### Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Key variables include RPC URLs, 0G Chain configurations, TEE service URLs, and private keys (keep these secure!).

### 📚 API Endpoints

- `GET /api/health` - Health check
- `GET /api/factors` - List all factors
- `POST /api/factors` - Create a new factor
- `GET /api/factors/[id]/snapshots` - Get factor snapshots
- `POST /api/infer` - Run AI inference
- `POST /api/strategies` - Create a strategy
- `POST /api/strategies/[id]/execute` - Execute a strategy

---

## 🇨🇳 中文版本

### ✨ 核心特性

- 🧠 **AI 推理引擎** - 使用先进模型实时生成交易信号和投资组合建议。
- 📊 **因子库管理** - 创建、版本化和管理量化因子（如情绪、成交量、变化率等）。
- ✅ **TEE 可验证执行** - 通过 TEE 支持的可验证推理和加密签名确保信任。
- 💾 **0G Storage 集成** - 为策略快照和审计日志提供去中心化、不可篡改的存储。
- 🔗 **智能合约执行** - 安全的链上交易执行，内置风险管理和滑点控制。
- 📋 **完整审计链** - 实时审计日志和交易追踪，确保完全透明和可追溯性。
- 🚀 **Vercel 部署就绪** - 开箱即用的生产级部署配置。

### 🏗️ 系统架构

1. **数据层**: 采集链上事件、K 线数据和社交情绪（Twitter, Telegram）。
2. **因子服务**: 管理因子元数据、注册和版本控制。
3. **AI 推理**: 请求受 TEE 保护的推理以生成策略。
4. **存储层**: 在 0G Storage 上存储不可篡改的审计日志和快照。
5. **执行层**: 用于交易执行和风险控制的智能合约。

### 🚀 快速开始

#### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器
# http://localhost:3000
```

#### 环境配置

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

关键变量包括 RPC URL、0G 链配置、TEE 服务 URL 和私钥（请确保这些信息的安全！）。

### � API 接口

- `GET /api/health` - 健康检查
- `GET /api/factors` - 列出所有因子
- `POST /api/factors` - 创建新因子
- `GET /api/factors/[id]/snapshots` - 获取因子快照
- `POST /api/infer` - 运行 AI 推理
- `POST /api/strategies` - 创建策略
- `POST /api/strategies/[id]/execute` - 执行策略

---

## 🛠️ Tech Stack | 技术栈

- **Frontend/Backend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Storage**: [0G Storage](https://0g.ai/)
- **Infrastructure**: [Vercel](https://vercel.com/)
- **Security**: TEE (Trusted Execution Environment)

---

Developed with ❤️ by the StratTrust AI Team.
