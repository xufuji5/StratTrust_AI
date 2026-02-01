import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize services on app load
    const initServices = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          console.log('Services initialized successfully');
        }
      } catch (error) {
        console.warn('Services initialization warning:', error);
      }
    };

    initServices();
  }, []);

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default App;
