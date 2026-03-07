import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ fadeUp }) => {
    return (
        <>
            {/* Elegant Background Texture */}
            <motion.div
                initial={{ scale: 1.15, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.08 }}
                transition={{ duration: 4, ease: "easeOut" }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-multiply"
            />
            {/* Soft Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F7F5F0]/90 via-[#F7F5F0]/60 to-[#F7F5F0] z-0 pointer-events-none" />

            <motion.div
                initial="hidden" animate="visible" variants={fadeUp}
                className="flex flex-col items-center text-center space-y-4 mb-8 md:mb-12"
            >
                <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 2 }}
                    className="text-[#B29A62]/70 text-[10px] md:text-sm font-noto tracking-[0.5em] font-light mb-2"
                >
                    བར་དོ་ཐོས་གྲོལ
                </motion.span>

                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7rem] font-serif text-[#1A1A1A] leading-[0.9] tracking-tight uppercase font-light">
                    The Bardo <br />
                    <span className="gold-gradient-text italic font-medium tracking-normal pr-4">Thodol</span>
                </h1>
            </motion.div>
        </>
    );
};

export default React.memo(HeroSection);
