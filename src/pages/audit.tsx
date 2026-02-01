import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AuditLog {
  id: string;
  traceId: string;
  timestamp: string;
  action: 'inference' | 'execution' | 'verification' | 'settlement';
  actor: string;
  status: 'success' | 'pending' | 'failed';
  details: Record<string, any>;
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
        <Link href="/strategies" className="hover:text-white transition-colors">策略</Link>
        <Link href="/audit" className="hover:text-white transition-colors text-white">审计</Link>
      </div>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
        连接钱包
      </button>
    </div>
  </nav>
);

const AuditPage: NextPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Mock data
  useEffect(() => {
    const now = new Date();
    const mockLogs: AuditLog[] = [
      {
        id: 'log_1',
        traceId: 'trace_67890_abc123',
        timestamp: new Date(now.getTime() - 300000).toLocaleString('zh-CN'),
        action: 'inference',
        actor: 'system',
        status: 'success',
        details: {
          factorVersion: 'v1.2.0',
          inputHash: '0x7a3c8f2...e91b',
          signals: 5,
          confidence: 0.87,
          modelVersion: 'v1.2.0',
        },
        hash: '0xef45a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
      },
      {
        id: 'log_2',
        traceId: 'trace_67890_abc123',
        timestamp: new Date(now.getTime() - 180000).toLocaleString('zh-CN'),
        action: 'verification',
        actor: 'tee_signer',
        status: 'success',
        details: {
          algorithm: 'ECDSA-256',
          attestation: 'valid',
          signatureValid: true,
          timestamp: new Date(now.getTime() - 180000).toISOString(),
        },
        hash: '0x1234567890abcdef1234567890abcdef',
      },
      {
        id: 'log_3',
        traceId: 'trace_67890_abc123',
        timestamp: new Date(now.getTime() - 60000).toLocaleString('zh-CN'),
        action: 'execution',
        actor: 'executor_agent',
        status: 'success',
        details: {
          strategyId: 'strat_1',
          txHash: '0xabcd1234efgh5678ijkl9012mnop3456',
          gasUsed: '125000',
          network: '0G Testnet',
          timestamp: new Date(now.getTime() - 60000).toISOString(),
        },
        hash: '0xabcdef1234567890abcdef1234567890',
      },
      {
        id: 'log_4',
        traceId: 'trace_45678_def456',
        timestamp: new Date(now.getTime() - 1800000).toLocaleString('zh-CN'),
        action: 'settlement',
        actor: 'settlement_engine',
        status: 'success',
        details: {
          profit: '0.0234',
          profitShare: '0.0187',
          platformFee: '0.0047',
          settlementTime: new Date(now.getTime() - 1800000).toISOString(),
        },
        hash: '0x9876543210fedcba9876543210fedcba',
      },
      {
        id: 'log_5',
        traceId: 'trace_23456_ghi789',
        timestamp: new Date(now.getTime() - 3600000).toLocaleString('zh-CN'),
        action: 'inference',
        actor: 'system',
        status: 'pending',
        details: {
          factorVersion: 'v1.1.0',
          inputHash: '0x1a2b3c4d5e6f7g8h9i0j...',
          signals: 4,
          confidence: 0.78,
          modelVersion: 'v1.1.0',
        },
      },
    ];
    setLogs(mockLogs);
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'inference': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'execution': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'verification': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'settlement': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400 font-mono">0G Storage Immutable Logs</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">审计日志</h1>
          <p className="text-gray-400 text-lg">所有决策与执行路径均在 0G Network 存证，支持全链路可追溯审计</p>
        </div>

        {/* Audit Table */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/10">
                  <th className="px-6 py-6 font-medium">时间戳</th>
                  <th className="px-6 py-6 font-medium">操作类型</th>
                  <th className="px-6 py-6 font-medium">主体</th>
                  <th className="px-6 py-6 font-medium">Trace ID</th>
                  <th className="px-6 py-6 font-medium">存证哈希 (0G)</th>
                  <th className="px-6 py-6 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-6 text-sm text-gray-400">{log.timestamp}</td>
                    <td className="px-6 py-6">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm font-medium">{log.actor}</td>
                    <td className="px-6 py-6 text-sm font-mono text-gray-500">{log.traceId}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2 text-xs font-mono text-blue-400">
                        <span className="max-w-[120px] truncate">{log.hash || 'N/A'}</span>
                        {log.hash && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">🔗</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                        <span className={`text-sm ${log.status === 'success' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>显示 {logs.length} 条记录</span>
              <span className="text-gray-700">|</span>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>0G Storage 已同步</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 font-mono">
              <span>Merkle Root:</span>
              <span className="text-gray-400">0x7d2a...z678</span>
            </div>
          </div>
        </div>

        {/* Log Detail Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold">节点存证详情 (0G Storage Immutable Logs)</h3>
            <div className="space-y-4">
              {logs.slice(0, 3).map((log) => (
                <div key={log.id} className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 
                        'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                      }`} />
                      <span className="font-mono text-sm text-white uppercase">{log.action}</span>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <div className="text-xs font-mono text-gray-500">ID: {log.id}</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-blue-300/80 border border-white/5 overflow-x-auto whitespace-pre">
                    {JSON.stringify({
                      trace_id: log.traceId,
                      ts: Math.floor(new Date(log.timestamp).getTime() / 1000),
                      action: log.action,
                      details: log.details,
                      hash: log.hash,
                      "0g_proof": "valid_merkle_path"
                    }, null, 2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">可信保障体系</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-sm font-bold text-white mb-1">最小证据集上链</div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    仅将模型接收的特征向量哈希、模型版本指纹及推理结果摘要上链，兼顾隐私与成本。
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-sm font-bold text-white mb-1">0G Storage 永存</div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    所有操作日志通过 Merkle Tree 聚合，rootHash 记录在链上，原始数据存储在 0G 分布式节点。
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-sm font-bold text-white mb-1">热/冷路径分离</div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    热路径处理毫秒级交易决策，冷路径处理全量异步存证与 TEE 审计。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditPage;

