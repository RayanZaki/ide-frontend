/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary cybersecurity palette
        cyber: {
          dark: '#0D1117',       // Deep space - for backgrounds
          primary: '#0F4C75',    // Navy blue - primary actions
          secondary: '#3282B8',  // Blue - secondary elements
          accent: '#1B98E0',     // Electric blue - accents and highlights
          alert: '#E63946',      // Alert red - for warnings and critical alerts
          success: '#2ECC71',    // Success green - for successful operations
          warning: '#F39C12',    // Warning orange - for caution states
          info: '#6C63FF',       // Info purple - for informational elements
          gray: {
            dark: '#1E1E2E',     // Dark gray for backgrounds
            medium: '#374151',   // Medium gray for borders
            light: '#9CA3AF',    // Light gray for inactive text
          },
          // Terminal-like colors for code or technical information
          terminal: {
            green: '#00FF00',    // Matrix-like green
            black: '#121212',    // Terminal black
          },
        },
      },
    },
  },
  plugins: [],
}