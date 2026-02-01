import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Components
const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          StratTrust AI
        </span>
      </div>
      <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
        <Link href="/factors" className="hover:text-white transition-colors">因子库</Link>
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

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300 font-mono">Galileo Testnet Connected</span>
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-bold tracking-tight mb-8">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-purple-400 pb-4">
              StratTrust AI
            </span>
            <span className="block text-white text-4xl lg:text-6xl">可信 MEME 选币引擎</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-gray-400 mb-12 leading-relaxed">
            融合 <span className="text-white">0G Storage</span> 的去中心化存证与 <span className="text-white">TEE</span> 的硬件级安全推理。<br className="hidden md:block" />
            为 MEME 币市场提供可验证、不可篡改的智能投资决策。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/infer" className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              立即开始推理
            </Link>
            <Link href="/factors" className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm">
              查看因子市场
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DashboardPreview = () => {
  const data = [
    { time: '10:00', value: 4000, confidence: 75 },
    { time: '10:05', value: 3000, confidence: 72 },
    { time: '10:10', value: 2000, confidence: 80 },
    { time: '10:15', value: 2780, confidence: 85 },
    { time: '10:20', value: 1890, confidence: 82 },
    { time: '10:25', value: 2390, confidence: 88 },
    { time: '10:30', value: 3490, confidence: 92 },
  ];

  return (
    <div className="container mx-auto px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        
        <div className="relative p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-mono text-gray-400">inference_engine.py — 0G Compute</span>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
            <span>TEE: <span className="text-emerald-400">VERIFIED</span></span>
            <span>TRACE_ID: 8f7a-2b1c</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 h-[300px] bg-black/40 rounded-lg border border-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#333" />
                <YAxis stroke="#333" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-black/40 border border-white/5">
              <h3 className="text-sm text-gray-400 mb-2">最新信号</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-white">$PEPE</span>
                <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400">BUY</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>置信度</span>
                <span>85%</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/5">
              <h3 className="text-sm text-gray-400 mb-2">系统状态</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Node Status</span>
                  <span className="text-emerald-400">Operational</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gas Price</span>
                  <span className="text-white">12 gwei</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Block Height</span>
                  <span className="text-blue-400">18,293,102</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: string, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all group"
  >
    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: "📊",
      title: "可复用因子库",
      description: "支持因子注册、版本控制与元数据管理。涵盖情绪、成交量、链上深度等核心 MEME 因子。"
    },
    {
      icon: "🔒",
      title: "TEE 可信推理",
      description: "在可信执行环境中运行模型，生成不可篡改的推理证明（Attestation），确保策略私密且真实。"
    },
    {
      icon: "💾",
      title: "0G 存储溯源",
      description: "将策略快照与审计证据批量打包上传至 0G Storage，实现毫秒级响应与低成本审计的完美平衡。"
    },
    {
      icon: "⚡",
      title: "智能自动化执行",
      description: "集成动态滑点控制、蜜罐检测与 MEV 防护。支持收益自动分成与链上原子化交易。"
    }
  ];

  return (
    <div className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">核心功能模块</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">基于设计方案实现的全链路可信量化交易系统</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TrustStack = () => {
  return (
    <div className="py-24 bg-[#050505]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8">
              多重可信保障<br />
              <span className="text-blue-500">Security & Verifiability</span>
            </h2>
            <div className="space-y-6">
              {[
                { title: "最小证据集上链", desc: "仅存储 Input Hash 与 Model ID，在保证可重现性的同时极大降低存储成本。" },
                { title: "TEE 签名链路", desc: "由 TEE 私钥对推理结果进行硬件级签名，任何人都无法伪造交易信号。" },
                { title: "Hot/Cold 路径分离", desc: "执行路径追求毫秒级响应，审计路径异步批量上传，兼顾性能与合规。" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-8 backdrop-blur-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <div className="relative h-full flex flex-col justify-center items-center text-center">
                <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">可信执行环境 (TEE)</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  我们的推理引擎在 Intel SGX 中运行，所有输入数据通过加密通道传输，确保策略逻辑完全封闭。
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                    <div className="text-gray-500 mb-1">Status</div>
                    <div className="text-emerald-400">ENCLAVE_ACTIVE</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                    <div className="text-gray-500 mb-1">Version</div>
                    <div className="text-blue-400">v2.1.0-sec</div>
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

const Footer = () => (
  <footer className="border-t border-white/10 bg-black py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-8 md:mb-0">
          <span className="text-xl font-bold text-white">StratTrust AI</span>
          <p className="text-gray-500 mt-2 text-sm">© 2024 StratTrust AI. All rights reserved.</p>
        </div>
        <div className="flex space-x-6 text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Github</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
    </div>
  </footer>
);

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-blue-500/30">
      <Head>
        <title>StratTrust AI - 可信赖的 MEME 币选币平台</title>
        <meta name="description" content="基于 TEE 和 0G 的可信 AI 交易平台" />
      </Head>

      <Navbar />
      
      <main>
        <Hero />
        <DashboardPreview />
        <TrustStack />
        <Features />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
