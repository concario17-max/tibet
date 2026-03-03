/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#f4c025",
                "background-light": "#fcfbf8",
                "background-dark": "#1c180d",
                "champagne": "#f4f0e7",
                "muted-gold": "#9c8749",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "serif": ["Crimson Pro", "serif"],
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
    },
    plugins: [],
}
