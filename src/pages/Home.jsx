import React from 'react';
import { useUI } from '../context/UIContext';
import { motion } from 'framer-motion';
import HeroSection from '../components/Home/HeroSection';
import HomeNavigation from '../components/Home/HomeNavigation';
import NavigationCard from '../components/Home/NavigationCard';

const Home = () => {
    const uiContext = useUI() || {
        setIsCompendiumOpen: () => { },
        setIsCommentariesOpen: () => { },
        setIsLexiconOpen: () => { }
    };
    const {
        setIsCompendiumOpen,
        setIsCommentariesOpen,
        setIsLexiconOpen
    } = uiContext;

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

            <HeroSection fadeUp={fadeUp} />

            {/* Main Hero Content */}
            <main className="relative z-10 w-full max-w-7xl px-4 sm:px-8 flex flex-col items-center mt-12 sm:mt-8 pb-16 md:pb-24">

                <HomeNavigation
                    setIsCompendiumOpen={setIsCompendiumOpen}
                    setIsLexiconOpen={setIsLexiconOpen}
                    setIsCommentariesOpen={setIsCommentariesOpen}
                />

                {/* Elegant Cards Grid */}
                <motion.div
                    variants={staggerCards}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl"
                >
                    <NavigationCard
                        to="/text"
                        label="Main Text"
                        title="The Text"
                        description="티벳 사자의 서 본문 탐독"
                        icon="auto_stories"
                        exploreLabel="Explore"
                        exploreIcon="arrow_right_alt"
                        fadeUp={fadeUp}
                    />

                    <NavigationCard
                        to="/chapter"
                        label="Sacred Prayers"
                        title="The Prayer"
                        description="영혼을 달래는 성스러운 기도문"
                        icon="self_improvement"
                        exploreLabel="Discover"
                        exploreIcon="arrow_right_alt"
                        fadeUp={fadeUp}
                    />

                    <NavigationCard
                        to="/album"
                        label="Sonic Journey"
                        title="The Chants"
                        description="티벳 전통 찬트와 소리의 파동"
                        icon="graphic_eq"
                        exploreLabel="Listen"
                        exploreIcon="headphones"
                        fadeUp={fadeUp}
                    />
                </motion.div>
            </main>
        </div>
    );
};

export default Home;
