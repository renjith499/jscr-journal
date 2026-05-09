/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
<<<<<<< HEAD
    "./articles/**/*.{js,jsx}",
=======
    "./articles/**/*.{md,mdx}",
>>>>>>> 57859ea (Improve professional JSCR website UI and fix styling)
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F",
        accent: "#00B4D8",
        paper: "#F8FAFC",
        ink: "#1F2937",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Merriweather", "Georgia", "ui-serif", "serif"],
      },
      boxShadow: {
        soft: "0 18px 45px rgba(30, 58, 95, 0.10)",
        card: "0 12px 28px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
