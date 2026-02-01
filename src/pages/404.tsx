import type { NextPage } from 'next';
import Link from 'next/link';

const NotFoundPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-8 text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text mb-4">
            404
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">页面未找到</h1>
          <p className="text-slate-400 mb-8">
            您访问的页面不存在。请返回首页或检查 URL 是否正确。
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            ← 返回首页
          </Link>
          <Link
            href="/factors"
            className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-slate-700"
          >
            进入因子库
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-500 text-sm">StratTrust AI © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
