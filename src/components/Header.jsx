import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import Branding from './Header/Branding';
import ChapterNavigator from './Header/ChapterNavigator';
import ThemeToggle from './Header/ThemeToggle';
import MobileActions from './Header/MobileActions';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isAlbum = location.pathname === '/album';
    const isChapter = location.pathname.includes('/chapter');

    // UI 로직 안전 연동
    const uiContext = useUI() || {
        toggleSidebar: () => { },
        toggleReflections: () => { },
        activeVerse: null,
        setActiveVerse: () => { }
    };
    const {
        toggleSidebar,
        toggleReflections,
        activeVerse,
        setActiveVerse
    } = uiContext;

    // 다크모드 컨텍스트 연동
    const themeContext = useTheme() || { theme: 'light', toggleTheme: () => { } };
    const { theme, toggleTheme } = themeContext;

    // 드롭다운 상태 관리
    const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);
    const [isSutraMenuOpen, setIsSutraMenuOpen] = useState(false);
    const capsuleRef = useRef(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (capsuleRef.current && !capsuleRef.current.contains(event.target)) {
                setIsChapterMenuOpen(false);
                setIsSutraMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isHome || isAlbum) return null;

    return (
        <header className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-8 flex justify-between sm:justify-center text-center items-center transition-all duration-500 border-b border-sand-tertiary dark:border-dark-border/50 ${scrolled ? 'glass-panel py-2' : 'bg-transparent py-2 sm:py-3'} ${isChapter ? 'bg-white/80 dark:bg-[#070707]/80 backdrop-blur-md' : ''}`}>

            <MobileActions
                isChapter={isChapter}
                toggleSidebar={toggleSidebar}
                toggleReflections={toggleReflections}
            />

            <Branding isChapter={isChapter} />

            {isChapter && (
                <div className="flex-1 flex justify-end items-center gap-4">
                    <ChapterNavigator
                        capsuleRef={capsuleRef}
                        isChapterMenuOpen={isChapterMenuOpen}
                        setIsChapterMenuOpen={setIsChapterMenuOpen}
                        isSutraMenuOpen={isSutraMenuOpen}
                        setIsSutraMenuOpen={setIsSutraMenuOpen}
                        activeVerse={activeVerse}
                        setActiveVerse={setActiveVerse}
                    />

                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
            )}
        </header>
    );
};

export default React.memo(Header);
