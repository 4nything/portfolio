/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "main-bg": "#0b1421",
        "main-highlight": "#3535d0",
      },
    },
  },
  plugins: [],
};
