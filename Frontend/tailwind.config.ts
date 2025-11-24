import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta de colores Nodo
        nodo: {
          primary: '#006FFF',
          'primary-light': '#E6F2FF',
          'primary-dark': '#0056CC',
          secondary: '#F8FAFC',
          accent: '#1E293B',
          text: '#334155',
          'text-light': '#64748B',
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          neutral: '#F1F5F9',
        },
      },
      fontFamily: {
        // Tipografías Nodo
        'thicker': ['Thicker', 'sans-serif'], // Principal
        'inter': ['Inter', 'sans-serif'], // Soporte
        'arial': ['Arial', 'sans-serif'], // Sistema
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'nodo': '0 4px 6px -1px rgba(0, 111, 255, 0.1), 0 2px 4px -1px rgba(0, 111, 255, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config;
