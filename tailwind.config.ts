import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FAF9F5',
          100: '#F4F1EA',
          200: '#EBE7DC',
          300: '#DFDACB',
        },
        ink: {
          900: '#1A1917',
          800: '#292724',
          700: '#3D3A35',
          600: '#57534D',
          500: '#736E65',
          400: '#9C968B',
        },
      },
      boxShadow: {
        tactile: '0 1px 2px rgba(26, 25, 23, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'tactile-hover': '0 4px 14px -2px rgba(26, 25, 23, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1)',
        'tactile-card': '0 1px 3px rgba(26, 25, 23, 0.04), 0 0 0 1px rgba(26, 25, 23, 0.05)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
