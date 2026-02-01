import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Strategy {
  id: string;
  name: string;
  version: string;
  factorIds: string[];
  creator: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'testing';
  performanceYTD?: number;
  totalReturn?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  winRate?: number;
  trades?: number;
  hash?: string;
}

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
        <Link href="/infer" className="hover:text-white transition-colors">AI 推理</Link>
        <Link href="/strategies" className="hover:text-white transition-colors text-white">策略</Link>
        <Link href="/audit" className="hover:text-white transition-colors">审计</Link>
      </div>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
        连接钱包
      </button>
    </div>
  </nav>
);

const mockStrategies: Strategy[] = [
  {
    id: 'strat_1',
    name: 'MEME 币热度选币',
    version: 'v1.0.0',
    factorIds: ['sentiment', 'volume', 'liquidity'],
    creator: 'StratTrust AI',
    createdAt: '2026-01-25',
    status: 'active',
    performanceYTD: 0.245,
    totalReturn: 0.35,
    sharpeRatio: 1.82,
    maxDrawdown: -0.18,
    winRate: 0.68,
    trades: 45,
    hash: '0x8f42...7v8',
  },
  {
    id: 'strat_2',
    name: '价值投资策略',
    version: 'v1.2.0',
    factorIds: ['market_cap', 'holder', 'on_chain'],
    creator: 'Research Team',
    createdAt: '2026-01-20',
    status: 'testing',
    performanceYTD: 0.128,
    totalReturn: 0.18,
    sharpeRatio: 1.45,
    maxDrawdown: -0.12,
    winRate: 0.62,
    trades: 32,
    hash: '0x7d2a...z678',
  },
  {
    id: 'strat_3',
    name: '流动性挖矿策略',
    version: 'v2.0.0',
    factorIds: ['liquidity', 'apr', 'risk'],
    creator: 'StratTrust AI',
    createdAt: '2026-01-10',
    status: 'active',
    performanceYTD: 0.185,
    totalReturn: 0.28,
    sharpeRatio: 1.65,
    maxDrawdown: -0.15,
    winRate: 0.71,
    trades: 58,
    hash: '0x1a2b...4s5',
  },
];

const StrategiesPage: NextPage = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStrategies(mockStrategies);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'testing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-xs text-purple-400 font-mono">Automated Execution Pipeline</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">策略中心</h1>
            <p className="text-gray-400 text-lg">组合多个因子，构建并在链上执行自动化交易策略</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            + 创建新策略
          </button>
        </div>

        {/* Strategies List */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            [1, 2].map(i => (
              <div key={i} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 h-48 animate-pulse" />
            ))
          ) : (
            strategies.map(strategy => (
              <div key={strategy.id} className="group bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-2xl font-bold group-hover:text-purple-400 transition-colors">{strategy.name}</h3>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(strategy.status)}`}>
                        {strategy.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-2">🧩</span>
                        {strategy.factorIds.join(', ')}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👤</span>
                        {strategy.creator}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        {strategy.createdAt}
                      </div>
                      {strategy.hash && (
                        <div className="flex items-center text-blue-400/80 font-mono text-[10px]">
                          <span className="mr-2">🔗</span>
                          Hash: {strategy.hash.substring(0, 12)}...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-8">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">年化收益</div>
                      <div className="text-xl font-bold text-green-400">+{(strategy.performanceYTD! * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">夏普比率</div>
                      <div className="text-xl font-bold text-white">{strategy.sharpeRatio}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">胜率</div>
                      <div className="text-xl font-bold text-white">{(strategy.winRate! * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">交易次数</div>
                      <div className="text-xl font-bold text-white">{strategy.trades}</div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-3">
                    <button className="flex-1 lg:w-32 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-colors">
                      运行
                    </button>
                    <button className="flex-1 lg:w-32 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-colors">
                      详情
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Simplified Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">创建新策略</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">策略名称</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" placeholder="输入名称..." />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">关联因子 (ID)</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" placeholder="用逗号分隔..." />
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">取消</button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 transition-colors">创建</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategiesPage;
