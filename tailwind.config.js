/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-100": "#21262d",
        "dark-200": "#161b22",
        "dark-300": "#0d1117",
        "primary-200": "#7724f0",
        "primary-300": "#6a17e3",
      },
    },
  },
  plugins: [],
};
