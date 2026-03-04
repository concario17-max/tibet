import React, { useState, useEffect } from 'react';
import { Search, Menu, Edit3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUI } from '../context/UIContext';
// import ThemeToggle from './ThemeToggle'; // 추후 ThemeToggle 통합 예정

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // UI 로직 안전 연동
    const uiContext = useUI() || { toggleSidebar: () => { }, toggleReflections: () => { } };
    const { toggleSidebar, toggleReflections } = uiContext;

    // Hide navigations on Chapter page for 3-Column focus
    const isChapter = location.pathname.includes('/chapter');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-8 flex justify-between sm:justify-center text-center items-center transition-all duration-500 border-b border-sand-tertiary dark:border-dark-border/50 ${scrolled ? 'glass-panel py-2' : 'bg-transparent py-2 sm:py-3'} ${isChapter ? 'bg-white/80 dark:bg-[#070707]/80 backdrop-blur-md' : ''}`}>

            {/* 왼쪽 모바일 토글 (Chapter 화면 전용) */}
            {isChapter && (
                <div className="flex justify-start lg:hidden mr-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* 좌측 타이틀 (로고 + THE BARDO THODOL) */}
            <div className={`transition-all duration-500 flex items-center gap-3 ${isChapter ? 'scale-90 sm:scale-100 flex-1' : 'scale-100 mb-4 justify-center w-full'}`}>
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-gold-primary text-[28px]">auto_stories</span>
                    <span className="font-serif text-[15px] sm:text-[17px] tracking-[0.15em] text-charcoal-main dark:text-dark-text-primary font-bold uppercase mt-0.5">
                        The Bardo Thodol
                    </span>
                </Link>
                {isChapter && (
                    <button className="ml-4 p-1.5 rounded-full hover:bg-black/5 transition-colors hidden sm:block">
                        <svg className="w-5 h-5 text-gold-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* 비 챕터 페이지: 중앙 네비게이션 */}
            {!isChapter && (
                <nav className="flex items-center justify-center w-full mt-2">
                    <Link to="/chapter" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary">
                        Compendium
                    </Link>
                    <Link to="/album" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary">
                        Lexicon
                    </Link>
                    <Link to="/chapter" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary">
                        Commentaries
                    </Link>
                </nav>
            )}

            {/* 우측 챕터 선택기 캡슐 (Chapter 화면 전용) */}
            {isChapter && (
                <div className="flex-1 flex justify-end items-center gap-4">
                    <div className="hidden sm:flex items-center bg-white dark:bg-dark-surface border border-gold-border/40 dark:border-[#333] rounded-full px-5 py-2 shadow-sm relative group cursor-pointer hover:border-gold-primary/40 transition-colors">
                        <span className="text-[12px] font-bold tracking-[0.1em] text-[#9A7B4F] uppercase mr-3">
                            CHAPTER {activeVerse ? activeVerse.id.split('.')[0] : '-'}
                            <span className="material-symbols-outlined text-[14px] align-middle ml-1">keyboard_arrow_down</span>
                        </span>
                        <div className="w-[1px] h-3 bg-gold-border/30 mx-1"></div>
                        <span className="text-[12px] font-bold tracking-[0.1em] text-text-secondary/60 dark:text-dark-text-secondary/60 uppercase ml-3">
                            SUTRA {activeVerse ? activeVerse.id.split('.')[1] : '-'}
                            <span className="material-symbols-outlined text-[14px] align-middle ml-1">keyboard_arrow_down</span>
                        </span>
                    </div>

                    <div className="flex xl:hidden">
                        <button
                            onClick={toggleReflections}
                            className="p-2 -mr-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                        >
                            <Edit3 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default React.memo(Header);
