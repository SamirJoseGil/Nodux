import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ✅ Paleta Nodux Oficial
        nodux: {
          'black': '#000000',           // Negro puro - 0%
          'zafiro': '#000023',          // Azul Zafre Oscuro - 50%
          'neon': '#006FFF',            // Azul Neón - 35%
          'marino': '#00D9AC',          // Verde Marino - 5%
          'amarillo': '#F8D300',        // Amarillo - 5%
          'naranja': '#FF8F1B',         // Naranja - 5%
        },
        // Variaciones para estados
        'zafiro': {
          50: '#E6E6EC',
          100: '#CCCCDA',
          200: '#9999B4',
          300: '#66668F',
          400: '#333369',
          500: '#000023',  // Principal
          600: '#00001C',
          700: '#000015',
          800: '#00000E',
          900: '#000007',
        },
        'neon': {
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B1FF',
          400: '#3397FF',
          500: '#006FFF',  // Principal
          600: '#0059CC',
          700: '#004399',
          800: '#002D66',
          900: '#001733',
        },
      },
      fontFamily: {
        'thicker': ['Thicker', 'Inter', 'Arial', 'sans-serif'],  // Copys y títulos
        'inter': ['Inter', 'Arial', 'system-ui', 'sans-serif'],   // Cuerpos de texto
        'arial': ['Arial', 'system-ui', 'sans-serif'],             // Sistema
      },
      letterSpacing: {
        'tight-15': '-0.015em',  // Tracking: -15
        'tight-40': '-0.04em',   // Tracking: -40
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
        'glass-lg': '16px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(0, 111, 255, 0.1) 0%, rgba(0, 217, 172, 0.1) 100%)',
        'zafiro-gradient': 'linear-gradient(135deg, #000023 0%, #000035 100%)',
        'neon-gradient': 'linear-gradient(135deg, #006FFF 0%, #00D9AC 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 111, 255, 0.15)',
        'glass-hover': '0 12px 48px 0 rgba(0, 111, 255, 0.25)',
        'neon': '0 0 20px rgba(0, 111, 255, 0.5)',
        'neon-lg': '0 0 40px rgba(0, 111, 255, 0.6)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 111, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 111, 255, 0.8)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
