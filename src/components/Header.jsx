import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, Edit3, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import prayersData from '../data/prayers.json';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // UI 로직 안전 연동
    const uiContext = useUI() || { toggleSidebar: () => { }, toggleReflections: () => { }, activeVerse: null, setActiveVerse: () => { }, setIsCompendiumOpen: () => { }, setIsCommentariesOpen: () => { }, setIsLexiconOpen: () => { } };
    const { toggleSidebar, toggleReflections, activeVerse, setActiveVerse, setIsCompendiumOpen, setIsCommentariesOpen, setIsLexiconOpen } = uiContext;

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
            </div>

            {/* 비 챕터 페이지: 중앙 네비게이션 */}
            {!isChapter && (
                <nav className="flex flex-wrap items-center justify-center w-full mt-2 gap-y-2">
                    <button onClick={() => setIsCompendiumOpen(true)} className="nav-divider text-[11px] sm:text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary px-2 sm:px-0">
                        Compendium
                    </button>
                    <button onClick={() => setIsLexiconOpen(true)} className="nav-divider text-[11px] sm:text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary relative group flex items-center gap-2 px-2 sm:px-0 border-none sm:border-solid">
                        <span className="text-gold-primary tracking-widest text-[9px] sm:text-xs font-medium uppercase mt-[2px] opacity-0 group-hover:opacity-100 transition-opacity absolute -left-4 sm:-left-6">✧</span>
                        Lexicon
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-primary transition-all duration-300 group-hover:w-full"></span>
                    </button>
                    <button onClick={() => setIsCommentariesOpen(true)} className="nav-divider text-[11px] sm:text-sm font-medium tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-main dark:text-dark-text-primary px-2 sm:px-0 border-r-0">
                        Commentaries
                    </button>
                </nav>
            )}

            {/* 우측 챕터 선택기 캡슐 & 다크모드 버튼 (Chapter 화면 전용) */}
            {isChapter && (
                <div className="flex-1 flex justify-end items-center gap-4">
                    {/* PC 전용 캡슐 드롭다운 */}
                    <div ref={capsuleRef} className="hidden sm:flex items-center bg-white dark:bg-dark-surface border border-gold-border/40 dark:border-[#333] rounded-full px-5 py-2 shadow-sm relative group">

                        {/* 챕터 선택 부분 */}
                        <div className="relative">
                            <span
                                onClick={() => { setIsChapterMenuOpen(!isChapterMenuOpen); setIsSutraMenuOpen(false); }}
                                className="text-[12px] font-bold tracking-[0.1em] text-[#9A7B4F] uppercase mr-3 cursor-pointer hover:text-gold-primary transition-colors flex items-center"
                            >
                                CHAPTER {activeVerse ? activeVerse.id.split('.')[0] : '-'}
                                <span className={`material-symbols-outlined text-[14px] align-middle ml-1 transition-transform ${isChapterMenuOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                            </span>

                            {/* 챕터 드롭다운 메뉴 */}
                            {isChapterMenuOpen && (
                                <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-dark-surface border border-gold-border/20 dark:border-dark-border/50 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                        {prayersData.map((prayer) => (
                                            <button
                                                key={prayer.id}
                                                onClick={() => {
                                                    if (prayer.verses.length > 0) setActiveVerse(prayer.verses[0]);
                                                    setIsChapterMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-xs font-bold font-inter tracking-wide transition-colors ${activeVerse?.id.startsWith(prayer.id.replace('prayer-', '')) ? 'bg-gold-surface/50 dark:bg-dark-bg/50 text-[#9A7B4F]' : 'text-text-primary dark:text-dark-text-primary hover:bg-black/5 dark:hover:bg-white/5'}`}
                                            >
                                                CH {prayer.id.replace('prayer-', '')}. {prayer.chapterName}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-[1px] h-3 bg-gold-border/30 mx-1"></div>

                        {/* 수트라(구절) 선택 부분 */}
                        <div className="relative">
                            <span
                                onClick={() => { setIsSutraMenuOpen(!isSutraMenuOpen); setIsChapterMenuOpen(false); }}
                                className="text-[12px] font-bold tracking-[0.1em] text-text-secondary/60 dark:text-dark-text-secondary/60 uppercase ml-3 cursor-pointer hover:text-text-primary dark:hover:text-dark-text-primary transition-colors flex items-center"
                            >
                                SUTRA {activeVerse ? activeVerse.id.split('.')[1] : '-'}
                                <span className={`material-symbols-outlined text-[14px] align-middle ml-1 transition-transform ${isSutraMenuOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                            </span>

                            {/* 수트라 드롭다운 메뉴 */}
                            {isSutraMenuOpen && activeVerse && (
                                <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-dark-surface border border-gold-border/20 dark:border-dark-border/50 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                        {prayersData.find(p => p.id.replace('prayer-', '') === activeVerse.id.split('.')[0])?.verses.map((verse) => (
                                            <button
                                                key={verse.id}
                                                onClick={() => {
                                                    setActiveVerse(verse);
                                                    setIsSutraMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-xs font-medium font-inter tracking-wide transition-colors truncate ${activeVerse.id === verse.id ? 'bg-gold-surface/50 dark:bg-dark-bg/50 text-[#9A7B4F] font-bold' : 'text-text-secondary dark:text-dark-text-secondary hover:bg-black/5 dark:hover:bg-white/5'}`}
                                            >
                                                {verse.id} {verse.chapterTitle || verse.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 테마 토글 (제일 오른쪽) */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 -mr-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors ml-2"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
                    </button>

                    {/* 모바일 우측 토글 */}
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
