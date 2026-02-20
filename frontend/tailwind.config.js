/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ed: {
          bg: '#f7f5f2',
          surface: '#f0ede8',
          card: '#ffffff',
          elevated: '#ece9e4',
          tp: '#1c1917',
          ts: '#6b6460',
          tm: '#a8a09a',
          accent: '#1e40af',
          ah: '#1e3a8a',
          ad: '#dbeafe',
          border: '#e4e0da',
          bl: '#d6d0c8',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        ui: ['Syne', 'sans-serif'],
        body: ['Lora', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      typography: {
        ed: {
          css: {
            // ── Cores base ──────────────────────────────────────────────
            '--tw-prose-body':          '#6b6460',
            '--tw-prose-headings':      '#1c1917',
            '--tw-prose-lead':          '#6b6460',
            '--tw-prose-links':         '#1e40af',
            '--tw-prose-bold':          '#1c1917',
            '--tw-prose-counters':      '#a8a09a',
            '--tw-prose-bullets':       '#a8a09a',
            '--tw-prose-hr':            '#e4e0da',
            '--tw-prose-quotes':        '#6b6460',
            '--tw-prose-quote-borders': '#1e40af',
            '--tw-prose-captions':      '#a8a09a',
            '--tw-prose-code':          '#1c1917',
            '--tw-prose-pre-code':      '#1c1917',
            '--tw-prose-pre-bg':        '#ece9e4',
            '--tw-prose-th-borders':    '#e4e0da',
            '--tw-prose-td-borders':    '#e4e0da',

            // ── Tipografia ──────────────────────────────────────────────
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '1.0625rem',
            lineHeight: '1.85',

            // ── Headings ────────────────────────────────────────────────
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontWeight: '400',
              color: '#1c1917',
            },
            h2: { fontSize: '1.5rem',  marginTop: '2.5rem', marginBottom: '0.75rem' },
            h3: { fontSize: '1.2rem',  marginTop: '2rem',   marginBottom: '0.5rem' },
            h4: { fontSize: '1.05rem', marginTop: '1.5rem', marginBottom: '0.4rem' },

            // ── Links ────────────────────────────────────────────────────
            a: {
              color: '#1e40af',
              textDecoration: 'underline',
              textDecorationColor: '#dbeafe',
              fontWeight: '500',
              '&:hover': { textDecorationColor: '#1e40af' },
            },

            // ── Blockquotes ──────────────────────────────────────────────
            blockquote: {
              borderLeftColor: '#1e40af',
              borderLeftWidth: '3px',
              color: '#6b6460',
              fontStyle: 'normal',
              backgroundColor: '#f0ede8',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              paddingLeft: '1.25rem',
              paddingRight: '1rem',
              borderRadius: '0 2px 2px 0',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after':   { content: 'none' },

            // ── Código inline ────────────────────────────────────────────
            code: {
              color: '#1c1917',
              backgroundColor: '#ece9e4',
              fontWeight: '500',
              fontSize: '0.875em',
              borderRadius: '3px',
              paddingTop: '0.15em',
              paddingBottom: '0.15em',
              paddingLeft: '0.4em',
              paddingRight: '0.4em',
            },
            'code::before': { content: 'none' },
            'code::after':  { content: 'none' },

            // ── Blocos de código ─────────────────────────────────────────
            pre: {
              backgroundColor: '#ece9e4',
              color: '#1c1917',
              border: '1px solid #e4e0da',
              borderRadius: '4px',
              fontSize: '0.85rem',
              lineHeight: '1.7',
              overflowX: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              borderRadius: '0',
            },

            // ── Tabelas ──────────────────────────────────────────────────
            'thead th': {
              color: '#1c1917',
              fontFamily: 'Syne, sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: '600',
              borderBottom: '2px solid #e4e0da',
            },
            'tbody tr': {
              borderBottomColor: '#e4e0da',
            },
            'tbody tr:hover': {
              backgroundColor: '#f0ede8',
            },

            // ── HR ───────────────────────────────────────────────────────
            hr: { borderColor: '#e4e0da', marginTop: '2.5rem', marginBottom: '2.5rem' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
