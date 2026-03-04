import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 테마 상태 초기화 (사이드 이펙트 방지를 위해 지연 초기화 사용, 불변성 유지)
    const [theme, setTheme] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    return savedTheme;
                }
            }
        } catch (e) {
            console.warn('로컬 스토리지 접근 불가:', e);
        }
        return 'light'; // 모바일 강제 다크모드 방지용 기본값
    });

    // 테마 변경 사이드 이펙트
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 테마 토글 함수
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    // Provider value 리렌더링 방지용 메모이제이션
    const providerValue = React.useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={providerValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
