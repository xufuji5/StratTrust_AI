module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#0f172a',
          900: '#0f172a',
        },
      },
      backdropFilter: {
        none: 'none',
        sm: 'blur(4px)',
        md: 'blur(12px)',
        lg: 'blur(16px)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
};
