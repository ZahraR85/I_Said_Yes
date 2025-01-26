import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust based on your folder structure
    "./index.html",
  ],
  theme: {
    extend: { colors: {
      customBg: "#FAF9F5", 
      customBg1: "#FFF2F4",
      customBg2: "#f6e0e3",
      BgPinkLight: "#f5d0cb",
      BgPink: "#FCE5DC",
      BgPinkMiddle: "#EBBDAC",
      BgPinkDark : "#DEA58F",
      BgGray: "#d9dad0",
      BgCreme: "#e8dfcf",
      BgKhaki : "#d5c0b5",
      BgKhakiDark : "#888884",
      BgFont: "#624e40",
      LightGold: "#DBD084",
      DarkGold: "#DBC537",
      bgfooter: "#b39b81",
      bgbackground:"#e6e4df"
    },
    backgroundImage: {
      'custom-gradient': 'linear-gradient(90deg, rgba(118,154,110) 0%, rgba(31,66,32) 100%)',
    },},
  },
  plugins: [daisyui],
}

