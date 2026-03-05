import React from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';

const Home = () => {
    const uiContext = useUI() || { setIsCompendiumOpen: () => { }, setIsCommentariesOpen: () => { }, setIsLexiconOpen: () => { } };
    const { setIsCompendiumOpen, setIsCommentariesOpen, setIsLexiconOpen } = uiContext;

    return (
        <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden py-8 px-4 md:px-6">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-10 scale-110" />
            <div className="absolute inset-0 bg-sand-primary mix-blend-multiply opacity-60" />

            <div className="relative z-10 w-full max-w-5xl flex flex-col gap-8 md:gap-12 animate-in fade-in duration-1000 mt-2 md:mt-4">

                {/* Hero Section */}
                <div className="text-center space-y-5 md:space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-gold-primary text-[40px]">auto_stories</span>
                        <p className="text-gold-primary text-[10px] tracking-[1em] uppercase font-bold mt-2">Tibetan Book of the Dead</p>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-serif text-charcoal-main leading-[1.1] tracking-widest uppercase font-extralight py-2">
                        The Bardo <br /> <span className="gold-gradient-text italic font-light tracking-normal pr-2">Thodol</span>
                    </h1>
                    <div className="w-12 h-px bg-gold-primary/30 mx-auto" />
                    <div className="flex flex-wrap items-center justify-center w-full gap-x-6 gap-y-3 pt-4">
                        <button onClick={() => setIsCompendiumOpen(true)} className="text-[10px] md:text-xs font-bold tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-muted">
                            Compendium
                        </button>
                        <span className="text-sand-tertiary text-xs">|</span>
                        <button onClick={() => setIsLexiconOpen(true)} className="text-[10px] md:text-xs font-bold tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-muted relative group flex items-center">
                            <span className="text-gold-primary tracking-widest text-[9px] md:text-[10px] font-medium uppercase mt-[1px] opacity-0 group-hover:opacity-100 transition-opacity absolute -left-3 md:-left-4">✧</span>
                            Lexicon
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold-primary transition-all duration-300 group-hover:w-full"></span>
                        </button>
                        <span className="text-sand-tertiary text-xs">|</span>
                        <button onClick={() => setIsCommentariesOpen(true)} className="text-[10px] md:text-xs font-bold tracking-widest uppercase hover:text-gold-primary transition-colors text-charcoal-muted">
                            Commentaries
                        </button>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 w-full animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200 px-2 sm:px-0">
                    {/* Card 1: Text */}
                    <Link to="/text" className="group flex flex-col bg-white border border-sand-tertiary/60 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-gold-primary/10 transition-all duration-500 hover:-translate-y-1 relative before:absolute before:inset-0 before:border before:border-gold-primary/0 hover:before:border-gold-primary/20 before:transition-colors before:duration-500 before:z-10 before:rounded-xl">
                        <div className="h-32 sm:h-36 md:h-48 overflow-hidden relative">
                            <img alt="Bardo Text" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out" src="https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=800&auto=format&fit=crop" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                            <div className="absolute bottom-4 left-5 md:left-6 z-20">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[8px] sm:text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-[0.2em] shadow-sm backdrop-blur-sm bg-opacity-90">Main Text</span>
                            </div>
                        </div>
                        <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-sand-primary z-20 relative">
                            <div className="absolute top-0 right-6 w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <h3 className="serif-title text-lg sm:text-xl md:text-2xl mb-2 text-charcoal-main group-hover:text-[#8C6D45] transition-colors duration-300">Text</h3>
                            <p className="text-charcoal-muted text-[13px] sm:text-sm leading-relaxed mb-6 md:mb-8 flex-1 font-sans font-medium line-clamp-2">
                                티벳 사자의 서 본문
                            </p>
                            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-charcoal-main/60 group-hover:text-gold-primary transition-all duration-300 mt-auto w-fit group-hover:translate-x-1">
                                Begin Reading <span className="material-symbols-outlined text-[13px] sm:text-[14px]">menu_book</span>
                            </span>
                        </div>
                    </Link>

                    {/* Card 2: Prayer */}
                    <Link to="/chapter" className="group flex flex-col bg-white border border-sand-tertiary/60 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-gold-primary/10 transition-all duration-500 hover:-translate-y-1 relative before:absolute before:inset-0 before:border before:border-gold-primary/0 hover:before:border-gold-primary/20 before:transition-colors before:duration-500 before:z-10 before:rounded-xl">
                        <div className="h-32 sm:h-36 md:h-48 overflow-hidden relative">
                            <img alt="Bardo Prayers" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out" src="https://images.unsplash.com/photo-1548625361-ecb9eb81c815?q=80&w=800&auto=format&fit=crop" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                            <div className="absolute bottom-4 left-5 md:left-6 z-20">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[8px] sm:text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-[0.2em] shadow-sm backdrop-blur-sm bg-opacity-90">Sacred Prayers</span>
                            </div>
                        </div>
                        <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-sand-primary z-20 relative">
                            <div className="absolute top-0 right-6 w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <h3 className="serif-title text-lg sm:text-xl md:text-2xl mb-2 text-charcoal-main group-hover:text-[#8C6D45] transition-colors duration-300">Prayer</h3>
                            <p className="text-charcoal-muted text-[13px] sm:text-sm leading-relaxed mb-6 md:mb-8 flex-1 font-sans font-medium line-clamp-2">
                                티벳 사자의 서 기도문
                            </p>
                            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-charcoal-main/60 group-hover:text-gold-primary transition-all duration-300 mt-auto w-fit group-hover:translate-x-1">
                                Begin Reading <span className="material-symbols-outlined text-[13px] sm:text-[14px]">menu_book</span>
                            </span>
                        </div>
                    </Link>

                    {/* Card 3: Chants */}
                    <Link to="/album" className="group flex flex-col bg-white border border-sand-tertiary/60 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-gold-primary/10 transition-all duration-500 hover:-translate-y-1 relative before:absolute before:inset-0 before:border before:border-gold-primary/0 hover:before:border-gold-primary/20 before:transition-colors before:duration-500 before:z-10 before:rounded-xl">
                        <div className="h-32 sm:h-36 md:h-48 overflow-hidden relative">
                            <img alt="Bardo Chants" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out" src="https://images.unsplash.com/photo-1516280440502-39f8f4a7c8be?q=80&w=800&auto=format&fit=crop" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                            <div className="absolute bottom-4 left-5 md:left-6 z-20">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[8px] sm:text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-[0.2em] shadow-sm backdrop-blur-sm bg-opacity-90">Sacred Audio</span>
                            </div>
                        </div>
                        <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-sand-primary z-20 relative">
                            <div className="absolute top-0 right-6 w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <h3 className="serif-title text-lg sm:text-xl md:text-2xl mb-2 text-charcoal-main group-hover:text-[#8C6D45] transition-colors duration-300">Chants</h3>
                            <p className="text-charcoal-muted text-[13px] sm:text-sm leading-relaxed mb-6 md:mb-8 flex-1 font-sans font-medium line-clamp-2">
                                티벳 음악 앨범
                            </p>
                            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] text-charcoal-main/60 group-hover:text-gold-primary transition-all duration-300 mt-auto w-fit group-hover:translate-x-1">
                                Listen Now <span className="material-symbols-outlined text-[13px] sm:text-[14px]">headphones</span>
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
