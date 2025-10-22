import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta de colores Nodo
        nodo: {
          black: '#000000',
          'dark-blue': '#000023',
          'neon-blue': '#006FFF',
          yellow: '#f8d300',
          orange: '#FF8F1B',
          green: '#00D9AC',
        },
      },
      fontFamily: {
        // Tipografías Nodo
        'thicker': ['Thicker', 'sans-serif'], // Principal
        'inter': ['Inter', 'sans-serif'], // Soporte
        'arial': ['Arial', 'sans-serif'], // Sistema
      },
    },
  },
  plugins: [],
} satisfies Config;
