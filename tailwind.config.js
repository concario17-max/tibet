/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'gold-primary': '#D4AF37',
                'gold-dim': '#BD9732',
                'beige-base': '#F5F5DC',
                'bg-primary': '#FDFCF0',
                'charcoal': '#2C2C2C',
                'white-soft': '#FCFBF9',
            },
            fontFamily: {
                serif: ['Crimson Pro', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
