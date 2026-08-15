/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0B0F19',
        'card-surface': '#151B28',
        'primary': '#10B981',
        'secondary': '#D4AF37',
        'light-gray': '#A0AEC0',
        'surface-variant': '#293644',
        'on-surface-variant': '#bbcabf',
        'surface-container-lowest': '#020f1c',
        'on-surface': '#d6e4f7',
        'surface-container': '#13212e',
        'on-background': '#d6e4f7',
        'surface-container-low': '#0f1d2a',
        'surface-container-high': '#1e2b39',
        'primary-container': '#10b981',
        'secondary-container': '#af8d11',
        'on-primary-container': '#00422b',
        'on-secondary-container': '#342800',
        'surface-bright': '#2d3a49',
        'surface-dim': '#061422',
        'outline': '#86948a',
        'outline-variant': '#3c4a42',
        'error': '#ffb4ab',
        'error-container': '#93000a',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}