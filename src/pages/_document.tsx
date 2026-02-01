import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
        <meta
          name="description"
          content="StratTrust AI - 可信任的 AI 选币平台，为 MEME 币提供量化选币、策略回测和链上执行"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
