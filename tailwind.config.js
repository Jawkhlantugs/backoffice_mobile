/** @type {import('tailwindcss').Config} */
// Токенууд энд ганц удаа тодорхойлогдоно (§15). Компонентод hex, magic
// number бичихгүй — эдгээр нэрсийг л ашиглана.
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        // Card-аас нэг шат дээш: drawer, tab bar, bottom sheet.
        elevated: 'var(--color-elevated)',
        popover: 'var(--color-popover)',
        'popover-foreground': 'var(--color-popover-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        destructive: 'var(--color-destructive)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
        'destructive-subtle': 'var(--color-destructive-subtle)',
        success: 'var(--color-success)',
        'success-foreground': 'var(--color-success-foreground)',
        'success-subtle': 'var(--color-success-subtle)',
        warning: 'var(--color-warning)',
        'warning-foreground': 'var(--color-warning-foreground)',
        'warning-subtle': 'var(--color-warning-subtle)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '10px',
        xl: '16px',
        '2xl': '20px',
      },
      fontSize: {
        // [хэмжээ, мөрийн өндөр] — design-tokens.md §4
        tiny: ['11px', '14px'],
        caption: ['12px', '16px'],
        body: ['14px', '20px'],
        'body-lg': ['16px', '24px'],
        title: ['18px', '24px'],
        heading: ['22px', '28px'],
        display: ['28px', '34px'],
      },
    },
  },
  plugins: [],
}
