import type { NextPage } from 'next';

const TestPage: NextPage = () => {
  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'bold' }}>
      <div>
        <h1 style={{ marginBottom: '20px' }}>✅ 测试页面成功加载</h1>
        <p style={{ fontSize: '24px', marginBottom: '20px' }}>这是一个简单的黑底白字测试</p>
        <p style={{ fontSize: '20px', color: '#60a5fa' }}>如果你能看到这个，说明页面渲染正常</p>
      </div>
    </div>
  );
};

export default TestPage;
