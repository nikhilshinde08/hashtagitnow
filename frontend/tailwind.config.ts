import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        bauhaus: {
          bg: '#F0F0F0',
          fg: '#121212',
          red: '#D02020',
          blue: '#1040C0',
          yellow: '#F0C020',
          muted: '#E0E0E0',
        },
      },
      boxShadow: {
        'hard-sm': '3px 3px 0px 0px #121212',
        'hard': '4px 4px 0px 0px #121212',
        'hard-md': '6px 6px 0px 0px #121212',
        'hard-lg': '8px 8px 0px 0px #121212',
        'hard-white': '4px 4px 0px 0px #ffffff',
        'hard-white-lg': '8px 8px 0px 0px #ffffff',
      },
    },
  },
  plugins: [],
};

export default config;
