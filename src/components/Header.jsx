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
                <div className="flex-1 flex justify-start lg:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            )}

            <nav className={`flex ${isChapter ? 'flex-none' : 'justify-center flex-col items-center w-full'}`}>
                <div className={`transition-all duration-500 flex items-center gap-3 ${isChapter ? 'scale-90' : 'scale-100 mb-4'}`}>
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <span className="material-symbols-outlined text-gold-primary text-3xl">auto_stories</span>
                        <span className="serif-title text-base sm:text-lg tracking-widest text-charcoal-main dark:text-dark-text-primary font-bold">The Bardo Thodol</span>
                    </Link>
                </div>

                {!isChapter && (
                    <div className="flex items-center justify-center">
                        <Link to="/chapter" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary">
                            Compendium
                        </Link>
                        <Link to="/album" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary">
                            Lexicon
                        </Link>
                        <Link to="/chapter" className="nav-divider text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary">
                            Commentaries
                        </Link>
                    </div>
                )}
            </nav>

            {/* 오른쪽 모바일 토글 (Chapter 화면 전용) */}
            {isChapter && (
                <div className="flex-1 flex justify-end xl:hidden">
                    <button
                        onClick={toggleReflections}
                        className="p-2 -mr-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors"
                    >
                        <Edit3 className="w-5 h-5" />
                    </button>
                </div>
            )}
        </header>
    );
};

export default React.memo(Header);
