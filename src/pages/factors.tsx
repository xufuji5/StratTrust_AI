import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FactorData {
  id: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  computeFrequency: string;
  isPublic: boolean;
  author?: string;
  historicalPerformance?: number;
  dependencies?: string[];
  lastUpdated?: string;
  window?: string;
  cid?: string;
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
        <Link href="/factors" className="hover:text-white transition-colors text-white">因子库</Link>
        <Link href="/infer" className="hover:text-white transition-colors">AI 推理</Link>
        <Link href="/strategies" className="hover:text-white transition-colors">策略</Link>
        <Link href="/audit" className="hover:text-white transition-colors">审计</Link>
      </div>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
        连接钱包
      </button>
    </div>
  </nav>
);

const mockFactors: FactorData[] = [
  {
    id: 'factor_market_cap',
    name: '市值因子',
    description: '基于代币总市值的因子，反映市场规模',
    version: 'v1.2.0',
    tags: ['市场', '基础面'],
    computeFrequency: '每小时',
    isPublic: true,
    author: 'StratTrust AI',
    historicalPerformance: 0.78,
    window: '24小时',
    lastUpdated: '2026-01-31 10:30',
    cid: 'QmPZ9gcCEpqKTo6aq61g2mWVSqow6K8Tkt37E8f2e22',
    hash: '0x8f42...7v8',
  },
  {
    id: 'factor_sentiment',
    name: '社交情绪因子',
    description: '基于推特、Telegram 等社交媒体的情绪分析',
    version: 'v2.0.0',
    tags: ['情绪', '社交'],
    computeFrequency: '实时',
    isPublic: true,
    author: 'StratTrust AI',
    historicalPerformance: 0.82,
    window: '6小时',
    lastUpdated: '2026-01-31 14:22',
    dependencies: ['sentiment_nlp'],
    cid: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6',
    hash: '0x7d2a...z6',
  },
  {
    id: 'factor_liquidity',
    name: '流动性因子',
    description: '衡量交易对的流动性深度和交易活跃度',
    version: 'v1.5.0',
    tags: ['流动性', 'DEX'],
    computeFrequency: '每30分钟',
    isPublic: true,
    author: 'StratTrust AI',
    historicalPerformance: 0.75,
    window: '1小时',
    lastUpdated: '2026-01-31 13:15',
    cid: 'QmT5NvUtoM5nWFfr6C9P282TsvU6o9X46B6y7f8',
    hash: '0x1a2b...4s5',
  },
  {
    id: 'factor_holder_dist',
    name: '持有者分布因子',
    description: '分析代币持有者的地址分布和集中度',
    version: 'v1.0.0',
    tags: ['持有者', '链上数据'],
    computeFrequency: '每天',
    isPublic: false,
    author: 'Research Team',
    historicalPerformance: 0.71,
    window: '7天',
    lastUpdated: '2026-01-30 20:00',
  },
  {
    id: 'factor_trading_volume',
    name: '交易量因子',
    description: '24小时交易量及其变化趋势',
    version: 'v1.3.0',
    tags: ['交易', '活跃度'],
    computeFrequency: '每小时',
    isPublic: true,
    author: 'StratTrust AI',
    historicalPerformance: 0.80,
    window: '24小时',
    lastUpdated: '2026-01-31 12:45',
  },
];

const FactorsPage: NextPage = () => {
  const [factors, setFactors] = useState<FactorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setFactors(mockFactors);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const allTags = Array.from(new Set(factors.flatMap(f => f.tags)));

  const filteredFactors = selectedTag
    ? factors.filter(f => f.tags.includes(selectedTag))
    : factors;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-blue-400 font-mono">Decentralized Factor Library</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">因子市场</h1>
            <p className="text-gray-400 text-lg">探索、上传并集成多维度的 MEME 币选币因子</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            + 提交新因子
          </button>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedTag('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTag === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === tag 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 h-64 animate-pulse">
                <div className="h-6 w-1/3 bg-white/5 rounded mb-4" />
                <div className="h-4 w-full bg-white/5 rounded mb-2" />
                <div className="h-4 w-2/3 bg-white/5 rounded mb-8" />
                <div className="flex gap-2">
                  <div className="h-6 w-12 bg-white/5 rounded-full" />
                  <div className="h-6 w-12 bg-white/5 rounded-full" />
                </div>
              </div>
            ))
          ) : (
            filteredFactors.map(factor => (
              <div key={factor.id} className="group bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{factor.name}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6 flex-grow">{factor.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg border border-blue-500/20">
                    {factor.version}
                  </span>
                  {factor.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-lg border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">计算频率</span>
                    <span className="text-gray-300">{factor.computeFrequency}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">历史胜率</span>
                    <span className="text-emerald-400">{(factor.historicalPerformance! * 100).toFixed(0)}%</span>
                  </div>
                  {factor.cid && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">存证 CID</span>
                      <span className="text-gray-400 font-mono">{factor.cid.substring(0, 10)}...</span>
                    </div>
                  )}
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
            <h2 className="text-2xl font-bold mb-6">提交新因子</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">因子名称</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="输入名称..." />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">描述</label>
                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors h-24" placeholder="简要描述因子的逻辑..." />
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">取消</button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-colors">提交</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactorsPage;
