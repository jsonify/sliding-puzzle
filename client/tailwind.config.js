/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./index.html",
    ],
    theme: {
      extend: {
        colors: {
          // You can define your 6 puzzle colors here
          puzzle: {
            red: '#EF4444',
            blue: '#3B82F6',
            green: '#10B981',
            yellow: '#F59E0B',
            purple: '#8B5CF6',
            orange: '#F97316',
          }
        },
        gridTemplateColumns: {
          // Custom 5x5 grid
          'puzzle': 'repeat(5, minmax(0, 1fr))',
        }
      },
    },
    plugins: [],
  }