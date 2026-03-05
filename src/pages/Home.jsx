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
            transition: { staggerChildren: 0.15, delayChildren: 0.6 }
        }
    };

    return (
        <div className="relative min-h-[100dvh] bg-[#F7F5F0] text-[#1A1A1A] flex flex-col items-center justify-center overflow-hidden selection:bg-gold-primary/30">
            {/* Elegant Background Texture */}
            <motion.div
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.08 }}
                transition={{ duration: 4, ease: "easeOut" }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-multiply"
            />
            {/* Soft Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F0]/90 via-[#F7F5F0]/60 to-[#F7F5F0] z-0 pointer-events-none" />

            {/* Floating Top Navigation */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="absolute top-0 left-0 w-full z-50 px-6 sm:px-12 py-8 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#B29A62] text-xl">auto_stories</span>
                    <span className="text-[#B29A62]/90 text-[9px] tracking-[0.4em] uppercase font-bold hidden sm:block">Tibetan Book of the Dead</span>
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
                            className="group relative text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A]/60 hover:text-[#B29A62] transition-colors duration-300"
                        >
                            {item.name}
                            <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-[#B29A62] transition-all duration-500 ease-out group-hover:w-full"></span>
                        </button>
                    ))}
                </nav>
            </motion.header>

            {/* Main Hero Content */}
            <main className="relative z-10 w-full max-w-7xl px-4 sm:px-8 flex flex-col items-center mt-12 sm:mt-8">

                <motion.div
                    initial="hidden" animate="visible" variants={fadeUp}
                    className="flex flex-col items-center text-center space-y-4 mb-20 md:mb-32"
                >
                    <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 2 }}
                        className="text-[#B29A62]/70 text-[10px] md:text-sm font-noto tracking-[0.5em] font-light mb-2"
                    >
                        བར་དོ་ཐོས་གྲོལ
                    </motion.span>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-serif text-[#1A1A1A] leading-[0.9] tracking-tight uppercase font-light">
                        The Bardo <br />
                        <span className="gold-gradient-text italic font-medium tracking-normal pr-4">Thodol</span>
                    </h1>
                </motion.div>

                {/* Elegant Cards Grid */}
                <motion.div
                    variants={staggerCards}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl"
                >
                    {/* Card 1 */}
                    <motion.div variants={fadeUp} className="h-full">
                        <Link to="/text" className="group relative flex flex-col h-[320px] sm:h-[420px] rounded-xl overflow-hidden bg-white/60 border border-[#D6C7A2]/40 hover:border-[#B29A62]/60 hover:shadow-2xl hover:shadow-[#B29A62]/10 transition-all duration-700 ease-[0.19,1,0.22,1] hover:-translate-y-2 backdrop-blur-md">
                            <div className="absolute inset-0 h-[55%] z-0 overflow-hidden bg-[#F5F2EA] flex items-center justify-center">
                                <span className="material-symbols-outlined text-8xl md:text-[100px] text-[#D6C7A2]/60 group-hover:text-[#B29A62]/80 transition-all duration-700 ease-out group-hover:scale-110 mb-8 pb-4">auto_stories</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent pointer-events-none" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 justify-end">
                                <span className="absolute top-6 left-6 bg-white/90 backdrop-blur text-[#1A1A1A] px-2.5 py-1 rounded text-[8px] font-bold tracking-[0.2em] uppercase border border-[#D6C7A2]/50 shadow-sm">Main Text</span>

                                <div className="w-8 h-[1px] bg-[#B29A62]/60 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500 ease-out" />
                                <h3 className="serif-title text-2xl md:text-3xl text-[#1A1A1A] group-hover:text-[#8C6D45] transition-colors duration-500 mb-2">The Text</h3>
                                <p className="text-[#1A1A1A]/60 text-[13px] font-noto font-light group-hover:text-[#1A1A1A]/80 transition-colors duration-500 mb-6">
                                    티벳 사자의 서 본문 탐독
                                </p>

                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#B29A62] font-bold group-hover:translate-x-2 transition-transform duration-500">Explore</span>
                                    <span className="material-symbols-outlined text-[14px] text-[#B29A62] group-hover:translate-x-3 transition-transform duration-500 delay-75">arrow_right_alt</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div variants={fadeUp} className="h-full">
                        <Link to="/chapter" className="group relative flex flex-col h-[320px] sm:h-[420px] rounded-xl overflow-hidden bg-white/60 border border-[#D6C7A2]/40 hover:border-[#B29A62]/60 hover:shadow-2xl hover:shadow-[#B29A62]/10 transition-all duration-700 ease-[0.19,1,0.22,1] hover:-translate-y-2 backdrop-blur-md">
                            <div className="absolute inset-0 h-[55%] z-0 overflow-hidden bg-[#F5F2EA] flex items-center justify-center">
                                <span className="material-symbols-outlined text-8xl md:text-[100px] text-[#D6C7A2]/60 group-hover:text-[#B29A62]/80 transition-all duration-700 ease-out group-hover:scale-110 mb-8 pb-4">self_improvement</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent pointer-events-none" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 justify-end">
                                <span className="absolute top-6 left-6 bg-white/90 backdrop-blur text-[#1A1A1A] px-2.5 py-1 rounded text-[8px] font-bold tracking-[0.2em] uppercase border border-[#D6C7A2]/50 shadow-sm">Sacred Prayers</span>

                                <div className="w-8 h-[1px] bg-[#B29A62]/60 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500 ease-out" />
                                <h3 className="serif-title text-2xl md:text-3xl text-[#1A1A1A] group-hover:text-[#8C6D45] transition-colors duration-500 mb-2">The Prayer</h3>
                                <p className="text-[#1A1A1A]/60 text-[13px] font-noto font-light group-hover:text-[#1A1A1A]/80 transition-colors duration-500 mb-6">
                                    영혼을 달래는 성스러운 기도문
                                </p>

                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#B29A62] font-bold group-hover:translate-x-2 transition-transform duration-500">Discover</span>
                                    <span className="material-symbols-outlined text-[14px] text-[#B29A62] group-hover:translate-x-3 transition-transform duration-500 delay-75">arrow_right_alt</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div variants={fadeUp} className="h-full">
                        <Link to="/album" className="group relative flex flex-col h-[320px] sm:h-[420px] rounded-xl overflow-hidden bg-white/60 border border-[#D6C7A2]/40 hover:border-[#B29A62]/60 hover:shadow-2xl hover:shadow-[#B29A62]/10 transition-all duration-700 ease-[0.19,1,0.22,1] hover:-translate-y-2 backdrop-blur-md">
                            <div className="absolute inset-0 h-[55%] z-0 overflow-hidden bg-[#F5F2EA] flex items-center justify-center">
                                <span className="material-symbols-outlined text-8xl md:text-[100px] text-[#D6C7A2]/60 group-hover:text-[#B29A62]/80 transition-all duration-700 ease-out group-hover:scale-110 mb-8 pb-4">graphic_eq</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent pointer-events-none" />
                            </div>

                            <div className="relative z-10 flex flex-col h-full p-6 md:p-8 justify-end">
                                <span className="absolute top-6 left-6 bg-white/90 backdrop-blur text-[#1A1A1A] px-2.5 py-1 rounded text-[8px] font-bold tracking-[0.2em] uppercase border border-[#D6C7A2]/50 shadow-sm">Sonic Journey</span>

                                <div className="w-8 h-[1px] bg-[#B29A62]/60 mb-4 transform origin-left group-hover:scale-x-150 transition-transform duration-500 ease-out" />
                                <h3 className="serif-title text-2xl md:text-3xl text-[#1A1A1A] group-hover:text-[#8C6D45] transition-colors duration-500 mb-2">The Chants</h3>
                                <p className="text-[#1A1A1A]/60 text-[13px] font-noto font-light group-hover:text-[#1A1A1A]/80 transition-colors duration-500 mb-6">
                                    티벳 전통 찬트와 소리의 파동
                                </p>

                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#B29A62] font-bold group-hover:translate-x-2 transition-transform duration-500">Listen</span>
                                    <span className="material-symbols-outlined text-[14px] text-[#B29A62] group-hover:translate-x-3 transition-transform duration-500 delay-75">headphones</span>
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
