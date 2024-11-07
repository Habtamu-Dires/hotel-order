module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Add this line
  ],
  theme: {
    extend: {
      colors:{
        grn:'#1c594e',
        gry:'#ced9d1'
      },
      height:{
        '98': '25rem'
      },
      screens:{
        'sm': '576px',
        'md': '1000px',
        'lg': '1440px',
      }
    },
  },
  plugins: [],
}
