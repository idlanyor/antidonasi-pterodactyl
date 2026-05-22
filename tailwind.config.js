const colors = require('tailwindcss/colors');

const gray = {
    50: 'hsl(216, 33%, 97%)',
    100: 'hsl(214, 15%, 91%)',
    200: 'hsl(210, 16%, 82%)',
    300: 'hsl(211, 13%, 65%)',
    400: 'hsl(211, 10%, 53%)',
    500: 'hsl(211, 12%, 43%)',
    600: 'hsl(209, 14%, 37%)',
    700: 'hsl(209, 18%, 30%)',
    800: 'hsl(209, 20%, 25%)',
    900: 'hsl(210, 24%, 16%)',
};

module.exports = {
    darkMode: 'class',
    content: [
        './resources/scripts/**/*.{js,ts,tsx,css}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['Satoshi', '"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif'],
                sans: ['Satoshi', '"IBM Plex Sans"', '"Roboto"', 'system-ui', 'sans-serif'],
            },
            colors: {
                black: '#000000',
                'brand-navy': '#0F172A',
                'brand-slate': '#64748B',
                accent: {
                    pink: '#EC4899',
                    purple: '#7C3AED',
                    'purple-light': '#A855F7',
                    lavender: '#C084FC',
                    blue: '#2299DD',
                },
                'accent-pink': '#EC4899',
                'accent-purple': '#7C3AED',
                'accent-purple-light': '#A855F7',
                'accent-lavender': '#C084FC',
                'accent-blue': '#2299DD',
                neutral: {
                    ...gray,
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#A3A3A3',
                },
                status: {
                    error: '#EF4444',
                    success: '#10B981',
                    warning: '#F59E0B',
                    info: '#3B82F6',
                },
                'status-error': '#EF4444',
                'status-success': '#10B981',
                'status-warning': '#F59E0B',
                'status-info': '#3B82F6',
                primary: colors.blue,
                gray: gray,
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.200', 'currentColor'),
            }),
            boxShadow: {
                sm: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                md: '0 14px 30px 0 rgba(168, 85, 247, 0.24)',
                lg: '0 -10px 30px 0 rgba(15, 23, 42, 0.08)',
                xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                input: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
