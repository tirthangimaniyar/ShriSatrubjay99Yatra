/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yatra: {
          cream: '#FCF9F2',
          ivory: '#FFFDF8',
          sand: '#F5EEDB',
          maroon: '#7A0C1E',
          maroonDark: '#500511',
          maroonLight: '#9E1B32',
          purple: '#380B3B',
          purpleDark: '#240426',
          gold: '#C89326',
          goldLight: '#E8B958',
          goldDark: '#996C12',
          goldAccent: '#F3D27B',
          charcoal: '#221F1F',
          saffron: '#E65100',
        }
      },
      fontFamily: {
        gujarati: ['"Noto Sans Gujarati"', '"Shruti"', 'sans-serif'],
        serifHeading: ['"Cinzel"', '"Rozha One"', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 20px -2px rgba(200, 147, 38, 0.25)',
        'gold-lg': '0 10px 30px -4px rgba(200, 147, 38, 0.35)',
        'maroon-lg': '0 10px 30px -4px rgba(122, 12, 30, 0.35)',
      },
      backgroundImage: {
        'mandir-pattern': "radial-gradient(circle at 50% 50%, rgba(200, 147, 38, 0.08) 0%, transparent 60%)",
      }
    },
  },
  plugins: [],
}
