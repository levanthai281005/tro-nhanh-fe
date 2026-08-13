/** Preset thiết kế dùng chung: web (Tailwind) và mobile (NativeWind). */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8A4A20',
          hover: '#713B19',
          press: '#5C2D0F',
          soft: '#F5EFE6',
        },
        sand: {
          DEFAULT: '#C99B65',
          hover: '#B08D63',
          press: '#9A784F',
          soft: '#F0E7D6',
        },
        cream: '#F7EFE2',
        canvas: '#FFFCF7',
        surface: '#FFFFFF',
        ink: { DEFAULT: '#2F2118', muted: '#7D6A5B' },
        line: '#EADCCB',
        status: {
          available: { DEFAULT: '#4F7A4A', soft: '#EDF2E7' },
          deposited: { DEFAULT: '#C8861A', soft: '#FBF1DD' },
          rented: { DEFAULT: '#9B8C78', soft: '#EFE9DD' },
        },
        'accent-warn': '#C07B4A',
        error: {
          DEFAULT: '#B5503C',
          hover: '#9E4230',
          press: '#873727',
          soft: '#FBEDE9',
        },
        warning: { DEFAULT: '#C8861A', soft: '#FBF1DD' },
        success: { DEFAULT: '#4A7A34', soft: '#EDF2E7' },
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        md: '12px',
        lg: '14px',
        xl: '16px',
      },
    },
  },
};
