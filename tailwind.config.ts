import type { Config } from 'tailwindcss';

export default {
  content: ['./src/pages/*.{js,ts,jsx,tsx,mdx}', './src/components/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        blackFist: '#181818',
        blackSecond: '#7B7B7B',
        blackThird: '#ACACAC',
        blackFourth: '#D2D2D2',
        blackFifth: '#DDDDDD',
        themeGreen: '#C3E006',
        'themeGreen-dark': '#AEC802',
        'gray-background': '#F5F5F5',
        'chat-bg': '#D3F83B',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
} satisfies Config;
