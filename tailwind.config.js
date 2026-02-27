/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'gold-primary': '#c5a059',
                'gold-dim': '#8B703B',
                'bg-primary': '#080808',
                'charcoal': '#1a1a1a',
                'white-soft': '#cbd5e1',
            },
            fontFamily: {
                serif: ['Cinzel', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
