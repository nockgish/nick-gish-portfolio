import type { Config } from "tailwindcss";

// const config: Config = {
//   content: [
//     "./src/app/**/*.{js,ts,jsx,tsx}",
//     "./src/components/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         heading: ["var(--font-heading)", "serif"],
//       },
//     },
//     screens: {
//       sm: "48.75rem",   // ← your custom breakpoint (780px)
//       md: "64rem",
//       lg: "80rem",
//       xl: "96rem",
//     },
//     extend: {},
//   }, 
//   plugins: []
// }

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "48.75rem",   // ← your custom breakpoint (780px)
      md: "48.75rem",
      lg: "80rem",
      xl: "96rem",
    },
    extend: {},
  },
  plugins: [],
};




export default config;
