/** Preset thiết kế dùng chung: web (Tailwind) và mobile (NativeWind). */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#8A4A20', hover: '#713B19', press: '#5C2D0F' },
        sand: { DEFAULT: '#C99B65', hover: '#B08D63', press: '#9A784F' },
        cream: '#F7EFE2',
        canvas: '#FFFCF7',
        ink: { DEFAULT: '#2F2118', muted: '#7D6A5B' },
        line: '#EADCCB',
        status: {
          available: '#4F7A4A',
          deposited: '#C8861A',
          rented: '#9B8C78',
        },
        'accent-warn': '#C07B4A',
        error: '#B5503C',
        warning: '#C8861A',
        success: '#4A7A34',
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
