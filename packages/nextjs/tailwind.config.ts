import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        celo: {
          // Primary
          yellow: '#FCFF52',
          green: '#4E632A',
          // Base
          'lt-tan': '#FBF6F1',
          'dk-tan': '#E6E3D5',
          brown: '#635949',
          purple: '#1A0329',
          // Functional
          black: '#000000',
          white: '#FFFFFF',
          inactive: '#9B9B9B',
          body: '#666666',
          // Feedback
          success: '#329F3B',
          error: '#E70532',
          // Accent
          'lt-blue': '#8AC0F9',
          orange: '#F29E5F',
          pink: '#F2A9E7',
          lime: '#B2EBA1',
        }
      },
      fontFamily: {
        'alpina': ['GT Alpina', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': ['72px', { lineHeight: '84px', letterSpacing: '-0.01em', fontWeight: '250' }],
        'h2': ['54px', { lineHeight: '72px', letterSpacing: '-0.01em', fontWeight: '250' }],
        'h3': ['48px', { lineHeight: '48px', letterSpacing: '-0.01em', fontWeight: '250' }],
        'h4': ['40px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '250' }],
        'body-l': ['20px', { lineHeight: '26px', letterSpacing: '-0.01em', fontWeight: '250' }],
        'body-m': ['16px', { lineHeight: '26px', letterSpacing: '-0.01em', fontWeight: '250' }],
        'body-s': ['14px', { lineHeight: '18px', letterSpacing: '-0.01em', fontWeight: '250' }],
        'label': ['12px', { lineHeight: '16px', letterSpacing: '0em', fontWeight: '750' }],
      },
      fontWeight: {
        'thin': '250',
        'heavy': '750',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};

export default config;
