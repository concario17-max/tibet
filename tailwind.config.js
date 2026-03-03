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
                "sand-primary": "#F9F7F2",   // 메인 베이지/샌드 배경
                "sand-secondary": "#F0EDE4", // 뎁스 구분을 위한 약간 어두운 베이지
                "sand-tertiary": "#E2DAC8",  // 보더 및 디바이더 박스
                "gold-primary": "#B29A62",   // 활성화, 액센트 색상
                "gold-dim": "#D6C7A2",       // 텍스트 보조 골드
                "charcoal-main": "#1A1A1A",  // 기본 텍스트 및 주조색
                "charcoal-muted": "#4A4A4A", // 설명 텍스트 (Secondary)
            },
            fontFamily: {
                "sans": ["Inter", "sans-serif"],
                "serif": ["Playfair Display", "serif"],
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
    },
    plugins: [],
}
