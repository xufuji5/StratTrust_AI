# StratTrust AI - 快速参考卡

## 🚀 启动项目 (30 秒)

```bash
# 1. 安装依赖
npm install

# 2. 配置环境（可选，使用默认 mock）
cp .env.example .env.local

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器
# 访问 http://localhost:3000
```

## 📋 项目核心结构

```
API 层 (src/pages/api/)
├── 因子管理: /api/factors[/*]
├── 推理: /api/infer
├── 策略: /api/strategies[/*]
└── 健康检查: /api/health

业务逻辑 (src/lib/)
├── 0G Storage: 0g-storage.ts
├── TEE 签名: tee-signature.ts
├── 审计: audit.ts
├── 合约: smart-contract.ts
└── 初始化: initialize.ts

前端页面 (src/pages/)
├── 首页: /
├── 因子库: /factors
├── 推理: /infer
├── 策略: /strategies
└── 审计: /audit

工具函数 (src/utils/)
├── 密码学: crypto.ts
└── 因子: factor.ts
```

## 🔑 关键 API 端点

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/factors` | 列出因子 |
| POST | `/api/factors` | 创建因子 |
| GET | `/api/factors/[id]/snapshots` | 获取快照 |
| POST | `/api/factors/[id]/snapshots` | 记录快照 |
| POST | `/api/infer` | 运行推理 |
| POST | `/api/strategies` | 创建策略 |
| POST | `/api/strategies/[id]/execute` | 执行策略 |
| GET | `/api/health` | 健康检查 |

## 🎯 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建项目
npm start               # 启动生产服务器

# 质量检查
npm run lint            # ESLint 检查
npm run type-check      # TypeScript 检查

# 部署
# 1. git push origin main
# 2. Vercel 自动部署
```

## 🔐 环境变量关键配置

```bash
# RPC 配置
NEXT_PUBLIC_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CHAIN_ID=1

# 0G 配置
0G_RPC_URL=https://evmrpc.0g.ai
0G_CHAIN_ID=16661

# TEE 配置（可选）
TEE_SERVICE_URL=https://tee-service.0g.ai

# 私钥（仅服务器端，保密！）
PRIVATE_KEY=your_private_key_here
```

## 📊 数据流

```
用户交互
    ↓
前端页面 (React)
    ↓
API 路由 (Next.js)
    ↓
业务逻辑 (lib/)
    ├→ 因子处理 (utils/)
    ├→ 0G 存储集成
    ├→ TEE 签名
    ├→ 审计记录
    └→ 合约交互
    ↓
JSON 响应
    ↓
前端渲染
```

## 🧪 测试 API

### 使用 curl

```bash
# 获取因子列表
curl http://localhost:3000/api/factors

# 创建因子
curl -X POST http://localhost:3000/api/factors \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test factor","author":"test@example.com","dataSource":["test"],"computeFrequency":"hourly"}'

# 运行推理
curl -X POST http://localhost:3000/api/infer \
  -H "Content-Type: application/json" \
  -d '{"factorSnapshots":[],"marketEnvironment":{"volatility":0.25},"riskConfig":{"maxSlippage":0.05}}'
```

### 使用浏览器开发者工具

```javascript
// 在浏览器控制台运行
fetch('/api/factors')
  .then(r => r.json())
  .then(d => console.log(d))
```

## 🐛 常见问题

**Q: 页面显示空白**  
A: 检查浏览器控制台是否有错误，确保 `npm run dev` 成功启动

**Q: API 返回 404**  
A: 检查 API 路由文件是否正确创建在 `src/pages/api/` 目录

**Q: 样式错乱**  
A: 运行 `npm install` 重新安装依赖，或清除 `.next` 缓存

**Q: 如何修改 API Mock 数据**  
A: 编辑 `src/pages/api/` 中的相应文件

## 📈 性能指标

- 首屏加载: <2s
- API 响应: <500ms
- Lighthouse 分数: 90+

## 🔍 调试技巧

```javascript
// 在页面中检查初始化状态
fetch('/api/health').then(r => r.json()).then(console.log)

// 在浏览器中查看 API 响应
// 打开 DevTools → Network → 点击 API 请求
```

## 📚 文档导航

| 文档 | 用途 |
|------|------|
| `README.md` | 项目简介和快速开始 |
| `DEPLOY.md` | 详细的部署指南 |
| `PROJECT_SUMMARY.md` | 项目完成报告 |
| `设计方案.md` | 原始设计文档 |

## 🚀 部署检查清单

- [ ] 环境变量已配置
- [ ] `npm run build` 成功
- [ ] 本地测试完成
- [ ] Git 提交并 push
- [ ] Vercel 导入完成
- [ ] 环境变量已在 Vercel 配置
- [ ] 部署完成且可访问

## 💡 下一步优化

1. **数据库** - 连接 PostgreSQL 或 MongoDB
2. **缓存** - 集成 Redis
3. **认证** - 实现用户登录
4. **实时数据** - WebSocket 推送
5. **监控** - Sentry 错误追踪

## 🎓 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [0G 文档](https://docs.0g.ai)
- [Vercel 部署](https://vercel.com/docs)

---

**快速参考卡** | 生成日期: 2024-01-31 | 版本: 1.0
