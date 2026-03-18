import React from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import HeroSection from '../components/Home/HeroSection';
import HomeNavigation from '../components/Home/HomeNavigation';
import NavigationCard from '../components/Home/NavigationCard';

const Home = () => {
    const uiContext = useUI() || {
        setIsCompendiumOpen: () => {},
        setIsCommentariesOpen: () => {},
        setIsLexiconOpen: () => {},
    };
    const { setIsCompendiumOpen, setIsCommentariesOpen, setIsLexiconOpen } = uiContext;

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.19, 1, 0.22, 1] } },
    };

    const staggerCards = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.6 },
        },
    };

    return (
        <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#F7F5F0] text-[#1A1A1A] selection:bg-gold-primary/30">
            <HeroSection fadeUp={fadeUp} />

            <main className="relative z-10 mt-12 flex w-full max-w-7xl flex-col items-center px-4 pb-16 sm:mt-8 sm:px-8 md:pb-24">
                <HomeNavigation
                    setIsCompendiumOpen={setIsCompendiumOpen}
                    setIsLexiconOpen={setIsLexiconOpen}
                    setIsCommentariesOpen={setIsCommentariesOpen}
                />

                <motion.div
                    variants={staggerCards}
                    initial="hidden"
                    animate="visible"
                    className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8"
                >
                    <NavigationCard
                        to="/text"
                        label="Main Text"
                        title="The Text"
                        description="사자의 서 본문을 차분히 읽고 여러 번역을 나란히 비교하며 따라갑니다."
                        icon="auto_stories"
                        exploreLabel="Explore"
                        exploreIcon="arrow_right_alt"
                        fadeUp={fadeUp}
                    />

                    <NavigationCard
                        to="/chapter"
                        label="Sacred Prayers"
                        title="The Prayer"
                        description="기도문과 낭송 구절을 음성과 함께 천천히 따라가며 읽고 들을 수 있습니다."
                        icon="self_improvement"
                        exploreLabel="Discover"
                        exploreIcon="arrow_right_alt"
                        fadeUp={fadeUp}
                    />

                    <NavigationCard
                        to="/album"
                        label="Sonic Journey"
                        title="The Chants"
                        description="티베트 전통 챈트와 의식 음악을 깊이 있는 분위기 속에서 감상합니다."
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
