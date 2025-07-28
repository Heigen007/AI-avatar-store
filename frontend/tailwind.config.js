// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
        colors: {
            primary: '#00E8F0',
            background: '#f0f9ff',
            glass: 'rgba(255,255,255,0.3)',
        },
        backdropBlur: {
            xs: '2px',
            sm: '4px',
            xl: '20px'
        }
    },
  },
  plugins: [],
}
