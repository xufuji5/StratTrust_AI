import type { NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';

interface TradeSignal {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  weight: number;
  confidence: number;
  reason: string;
  expectedReturn?: number;
}

interface InferenceData {
  traceId: string;
  signals: TradeSignal[];
  portfolio: {
    totalWeight: number;
    diversification: number;
    expectedReturn: number;
    expectedVolatility: number;
  };
  metadata: {
    confidence: number;
    warnings: string[];
    timestamp: string;
    modelVersion: string;
    inputHash: string;
    teeSignature: string;
    attestationReport?: string;
  };
}

// Mock trade signals
const mockSignals: TradeSignal[] = [
  {
    symbol: 'PEPE',
    action: 'BUY',
    weight: 0.25,
    confidence: 0.87,
    reason: '社交情绪高涨，流动性充足',
    expectedReturn: 0.35,
  },
  {
    symbol: 'SHIB',
    action: 'BUY',
    weight: 0.20,
    confidence: 0.82,
    reason: '持有者分布改善，交易活跃',
    expectedReturn: 0.28,
  },
  {
    symbol: 'DOGE',
    action: 'HOLD',
    weight: 0.15,
    confidence: 0.71,
    reason: '市场饱和，等待回调机会',
    expectedReturn: 0.08,
  },
  {
    symbol: 'FLOKI',
    action: 'BUY',
    weight: 0.22,
    confidence: 0.79,
    reason: '新项目热度上升，因子评分高',
    expectedReturn: 0.32,
  },
  {
    symbol: 'BONK',
    action: 'SELL',
    weight: -0.18,
    confidence: 0.75,
    reason: '基本面恶化，持有者抛售',
    expectedReturn: -0.15,
  },
];

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            StratTrust AI
          </span>
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
        <Link href="/factors" className="hover:text-white transition-colors">因子库</Link>
        <Link href="/infer" className="hover:text-white transition-colors text-white">AI 推理</Link>
        <Link href="/strategies" className="hover:text-white transition-colors">策略</Link>
        <Link href="/audit" className="hover:text-white transition-colors">审计</Link>
      </div>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
        连接钱包
      </button>
    </div>
  </nav>
);

const InferencePage: NextPage = () => {
  const [inference, setInference] = useState<InferenceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>(['sentiment', 'liquidity', 'volume']);

  const availableFactors = [
    { id: 'sentiment', name: '社交情绪' },
    { id: 'liquidity', name: '流动性' },
    { id: 'volume', name: '交易量' },
    { id: 'holder', name: '持有者分布' },
    { id: 'market_cap', name: '市值' },
  ];

  const runInference = async () => {
    try {
      setLoading(true);
      setError('');

      // Mock inference data
      const mockInference: InferenceData = {
        traceId: `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        signals: mockSignals,
        portfolio: {
          totalWeight: 0.84,
          diversification: 0.78,
          expectedReturn: 0.202,
          expectedVolatility: 0.18,
        },
        metadata: {
          confidence: 0.82,
          warnings: [
            '市场波动率较高，请谨慎交易',
            'MEME 币 market 风险较大，建议控制仓位',
            '建议在流动性充足时入场',
          ],
          timestamp: new Date().toLocaleString('zh-CN'),
          modelVersion: 'v1.2.0',
          inputHash: '0x7a3c8f2...e91b',
          teeSignature: '0xef45a1b2c3d4e5f6a7b8c9d0e1f2a3b4...',
        },
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setInference(mockInference);
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误');
    } finally {
      setLoading(false);
    }
  };

  const toggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(f => f !== factorId)
        : [...prev, factorId]
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs text-blue-400 font-mono">TEE Trusted Inference</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">AI 推理引擎</h1>
          <p className="text-gray-400 text-lg">基于多维度因子实时生成交易信号和投资组合建议</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 sticky top-32">
              <h2 className="text-xl font-bold mb-6">推理配置</h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-400 mb-4 block uppercase tracking-wider">选择因子</label>
                  <div className="space-y-3">
                    {availableFactors.map(factor => (
                      <label
                        key={factor.id}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedFactors.includes(factor.id)
                            ? 'bg-blue-600/10 border-blue-500/50 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">{factor.name}</span>
                        <input
                          type="checkbox"
                          checked={selectedFactors.includes(factor.id)}
                          onChange={() => toggleFactor(factor.id)}
                          className="hidden"
                        />
                        {selectedFactors.includes(factor.id) && (
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={runInference}
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      正在进行 TEE 推理...
                    </span>
                  ) : '运行推理'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2 space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                {error}
              </div>
            )}

            {!inference && !loading && (
              <div className="h-[600px] flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl text-gray-500">🤖</span>
                </div>
                <h3 className="text-xl font-bold mb-2">等待推理任务</h3>
                <p className="text-gray-500 max-w-sm">
                  请在左侧选择需要参与推理的因子，点击“运行推理”按钮获取由 TEE 加密生成的投资建议。
                </p>
              </div>
            )}

            {inference && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '预期回报', value: `${(inference.portfolio.expectedReturn * 100).toFixed(2)}%`, color: 'text-green-400' },
                    { label: '波动率', value: `${(inference.portfolio.expectedVolatility * 100).toFixed(2)}%`, color: 'text-orange-400' },
                    { label: '多样化', value: `${(inference.portfolio.diversification * 100).toFixed(1)}%`, color: 'text-blue-400' },
                    { label: '置信度', value: `${(inference.metadata.confidence * 100).toFixed(1)}%`, color: 'text-purple-400' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{item.label}</div>
                      <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold">策略组合建议</h3>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                        TEE 已验证
                      </span>
                    </div>
                    <div className="space-y-4">
                      {mockSignals.map((signal) => (
                        <div key={signal.symbol} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <div>
                            <div className="font-bold text-white">{signal.symbol}</div>
                            <div className="text-xs text-gray-500">{signal.reason}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${signal.action === 'BUY' ? 'text-emerald-400' : signal.action === 'SELL' ? 'text-rose-400' : 'text-gray-400'}`}>
                              {signal.action} {Math.abs(signal.weight * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">置信度: {(signal.confidence * 100).toFixed(0)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
                      <h3 className="text-lg font-bold mb-6">可信推理证据 (Minimum Evidence Set)</h3>
                      <div className="space-y-4 font-mono text-xs">
                        <div>
                          <div className="text-gray-500 mb-1">Trace ID</div>
                          <div className="text-gray-300 break-all bg-black/30 p-2 rounded border border-white/5">
                            {inference.traceId}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Input Hash (SHA-256)</div>
                          <div className="text-gray-300 break-all bg-black/30 p-2 rounded border border-white/5">
                            {inference.metadata.inputHash}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Model ID (IPFS CID)</div>
                          <div className="text-gray-300 break-all bg-black/30 p-2 rounded border border-white/5">
                            QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">TEE Signature (ECDSA)</div>
                          <div className="text-gray-300 break-all bg-black/30 p-2 rounded border border-white/5">
                            {inference.metadata.teeSignature}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link href="/audit" className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1">
                          <span>在 0G Storage 查看完整审计日志</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk & Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
                    <h3 className="font-bold mb-4 flex items-center text-yellow-500">
                      <span className="mr-2">⚠️</span> 风险提示
                    </h3>
                    <ul className="space-y-2">
                      {inference.metadata.warnings.map((w, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start">
                          <span className="mr-2">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl">
                    <h3 className="font-bold mb-4">元数据</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">推理时间</span>
                        <span className="text-gray-300">{inference.metadata.timestamp}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">模型版本</span>
                        <span className="text-gray-300 font-mono">{inference.metadata.modelVersion}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">可信等级</span>
                        <span className="text-blue-400 font-bold">L3 - TEE Hardware Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InferencePage;
