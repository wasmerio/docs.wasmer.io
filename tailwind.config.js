/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,md,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        typing: {
          '0%': {
            width: '0%',
          },
          '100%': {
            width: '100%',
          },
        },
      },
      animation: {
        typing: 'typing 2s steps(500)',
      },
    },
  },
  plugins: [],
  darkMode: ['class', 'html[class~="dark"]'],
}
