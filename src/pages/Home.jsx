import React from 'react';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { motion } from 'framer-motion';

const Home = () => {
    const uiContext = useUI() || { setIsCompendiumOpen: () => { }, setIsCommentariesOpen: () => { }, setIsLexiconOpen: () => { } };
    const { setIsCompendiumOpen, setIsCommentariesOpen, setIsLexiconOpen } = uiContext;

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.19, 1, 0.22, 1] } }
    };

    const staggerCards = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.8 }
        }
    };

    return (
        <div className="relative min-h-[100dvh] bg-[#050505] text-[#E5E5E5] flex flex-col items-center justify-center overflow-hidden selection:bg-gold-primary/30">
            {/* Cinematic Background */}
            <motion.div
                initial={{ scale: 1.15, filter: 'blur(10px)', opacity: 0 }}
                animate={{ scale: 1, filter: 'blur(0px)', opacity: 0.3 }}
                transition={{ duration: 4, ease: "easeOut" }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-luminosity"
            />
            {/* Moody Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-[#050505] z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,199,162,0.06)_0%,transparent_70%)] z-0 pointer-events-none" />

            {/* Floating Top Navigation */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="absolute top-0 left-0 w-full z-50 px-6 sm:px-12 py-8 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold-primary text-xl">auto_stories</span>
                    <span className="text-gold-primary/80 text-[9px] tracking-[0.4em] uppercase font-bold hidden sm:block">Tibetan Book of the Dead</span>
                </div>

                <nav className="flex items-center gap-6 sm:gap-10">
                    {[
                        { name: 'Compendium', action: () => setIsCompendiumOpen(true) },
                        { name: 'Lexicon', action: () => setIsLexiconOpen(true) },
                        { name: 'Commentaries', action: () => setIsCommentariesOpen(true) }
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={item.action}
                            className="group relative text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors duration-300"
                        >
                            {item.name}
                            <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-gold-primary transition-all duration-500 ease-out group-hover:w-full"></span>
                        </button>
                    ))}
                </nav>
            </motion.header>

            {/* Main Hero Content */}
            <main className="relative z-10 w-full max-w-7xl px-4 sm:px-8 flex flex-col items-center mt-16 sm:mt-12">

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp}
                    className="flex flex-col items-center text-center space-y-4 mb-20 md:mb-32"
                >
                    <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 2 }}
                        className="text-gold-primary/50 text-[10px] md:text-sm font-noto tracking-[0.5em] font-light mb-2"
                    >
                        བར་དོ་ཐོས་གྲོལ
                    </motion.span>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-serif text-white/95 leading-[0.9] tracking-tighter uppercase font-extralight drop-shadow-2xl">
                        The Bardo <br />
                        <span className="gold-gradient-text italic font-light tracking-normal pr-4 mix-blend-normal">Thodol</span>
                    </h1>
                </motion.div>

                {/* Glassmorphism Cards Grid */}
                <motion.div
                    variants={staggerCards}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl"
                >
                    {/* Card 1 */}
                    <motion.div variants={fadeUp} className="h-full">
                        <Link to="/text" className="group relative flex flex-col h-[320px] sm:h-[420px] rounded-2xl overflow-hidden glass-panel premium-card isolation-auto bg-white/[0.01]">
                            <div className="absolute inset-0 z-0">
                                <img alt="Text" className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out" src="https://images.unsplash.com/photo-1510172951991-856a654063f9?q=80&w=600&auto=format&fit=crop" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 justify-end">
                                <span className="absolute top-6 left-6 text-gold-primary/80 text-[8px] font-bold tracking-[0.3em] uppercase">01 / Main Text</span>

                                <div className="w-8 h-[1px] bg-gold-primary/40 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500 ease-out" />
                                <h3 className="serif-title text-2xl md:text-3xl text-white/90 group-hover:text-gold-light transition-colors duration-500 mb-2">The Text</h3>
                                <p className="text-white/40 text-[13px] font-noto font-light group-hover:text-white/70 transition-colors duration-500 mb-6">
                                    티벳 사자의 서 본문 탐독
                                </p>

                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-gold-primary font-bold group-hover:translate-x-2 transition-transform duration-500">Explore</span>
                                    <span className="material-symbols-outlined text-[14px] text-gold-primary group-hover:translate-x-3 transition-transform duration-500 delay-75">arrow_right_alt</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div variants={fadeUp} className="h-full">
                        <Link to="/chapter" className="group relative flex flex-col h-[320px] sm:h-[420px] rounded-2xl overflow-hidden glass-panel premium-card isolation-auto bg-white/[0.01]">
                            <div className="absolute inset-0 z-0">
                                <img alt="Prayer" className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out" src="https://images.unsplash.com/photo-1600096582520-2dca1c37b38d?q=80&w=600&auto=format&fit=crop" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 justify-end">
                                <span className="absolute top-6 left-6 text-gold-primary/80 text-[8px] font-bold tracking-[0.3em] uppercase">02 / Sacred Prayers</span>

                                <div className="w-8 h-[1px] bg-gold-primary/40 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500 ease-out" />
                                <h3 className="serif-title text-2xl md:text-3xl text-white/90 group-hover:text-gold-light transition-colors duration-500 mb-2">The Prayer</h3>
                                <p className="text-white/40 text-[13px] font-noto font-light group-hover:text-white/70 transition-colors duration-500 mb-6">
                                    영혼을 달래는 성스러운 기도문
                                </p>

                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-gold-primary font-bold group-hover:translate-x-2 transition-transform duration-500">Discover</span>
                                    <span className="material-symbols-outlined text-[14px] text-gold-primary group-hover:translate-x-3 transition-transform duration-500 delay-75">arrow_right_alt</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div variants={fadeUp} className="h-full">
                        <Link to="/album" className="group relative flex flex-col h-[320px] sm:h-[420px] rounded-2xl overflow-hidden glass-panel premium-card isolation-auto bg-white/[0.01]">
                            <div className="absolute inset-0 z-0">
                                <img alt="Chants" className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out" src="https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600&auto=format&fit=crop" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 justify-end">
                                <span className="absolute top-6 left-6 text-gold-primary/80 text-[8px] font-bold tracking-[0.3em] uppercase">03 / Sonic Journey</span>

                                <div className="w-8 h-[1px] bg-gold-primary/40 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500 ease-out" />
                                <h3 className="serif-title text-2xl md:text-3xl text-white/90 group-hover:text-gold-light transition-colors duration-500 mb-2">The Chants</h3>
                                <p className="text-white/40 text-[13px] font-noto font-light group-hover:text-white/70 transition-colors duration-500 mb-6">
                                    티벳 전통 찬트와 소리의 파동
                                </p>

                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-gold-primary font-bold group-hover:translate-x-2 transition-transform duration-500">Listen</span>
                                    <span className="material-symbols-outlined text-[14px] text-gold-primary group-hover:translate-x-3 transition-transform duration-500 delay-75">headphones</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default Home;
