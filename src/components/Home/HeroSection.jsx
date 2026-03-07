import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ fadeUp }) => {
    return (
        <div className="relative w-full flex flex-col items-center">
            {/* Elegant Background Texture */}
            <motion.div
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.12 }}
                transition={{ duration: 4, ease: "premium" }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=70&w=1600&auto=format&fit=crop&q=60')] bg-cover bg-center grayscale mix-blend-multiply"
            >
                <div className="noise-overlay" />
            </motion.div>

            {/* Soft Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F0]/95 via-[#F7F5F0]/70 to-[#F7F5F0] z-0 pointer-events-none" />

            <motion.div
                initial="hidden" animate="visible" variants={fadeUp}
                className="relative z-10 flex flex-col items-center text-center space-y-6 mb-12 md:mb-16"
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.5 }}
                    className="flex items-center gap-4 text-[#B29A62]/70 text-[10px] md:text-sm font-noto tracking-[0.8em] font-light mb-4"
                >
                    <div className="w-12 h-[1px] bg-gold-primary/30" />
                    <span>བར་དོ་ཐོས་གྲོལ</span>
                    <div className="w-12 h-[1px] bg-gold-primary/30" />
                </motion.div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] font-serif text-[#1A1A1A] leading-[0.85] tracking-tighter uppercase font-light">
                    The Bardo <br />
                    <span className="gold-gradient-text italic font-medium tracking-normal block mt-4">Thodol</span>
                </h1>
            </motion.div>
        </div>
    );
};

export default React.memo(HeroSection);
