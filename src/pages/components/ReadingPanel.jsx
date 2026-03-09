import React from 'react';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { formatTime } from '../../utils/audioUtils';
import ReadingHeader from '../../components/Reading/ReadingHeader';
import TibetanSection from '../../components/Reading/TibetanSection';
import AudioPill from '../../components/Reading/AudioPill';
import TranslationSection from '../../components/Reading/TranslationSection';
import NavigationPill from '../../components/Reading/NavigationPill';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            cubicBezier: [0.16, 1, 0.3, 1]
        }
    }
};

/**
 * ReadingPanel - 챕터 상세 내용 (Interaction Refined)
 */
const ReadingPanel = ({ verse, globalIndex, hideAudio = false, onPrevious, onNext }) => {
    const audioPlaylist = React.useMemo(() => {
        return verse.audioUrl ? [{ id: verse.id, title: verse.title, url: verse.audioUrl }] : [];
    }, [verse.id, verse.title, verse.audioUrl]);

    const { isPlaying, progress, currentTime, duration, togglePlay, seek } = useAudioPlayer(audioPlaylist);

    const [chapterStr, verseStr] = verse.id.split('.');

    return (
        <motion.main
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex-1 min-w-0 bg-transparent font-crimson text-text-primary dark:text-dark-text-primary transition-colors duration-500 overflow-y-auto scrollbar-hide relative z-10 pt-20 sm:pt-24 pb-32 sm:pb-20"
        >
            <div className="mx-auto max-w-[1000px] px-4 sm:px-8">
                <motion.div variants={itemVariants}>
                    <ReadingHeader
                        chapterStr={chapterStr}
                        verseStr={verseStr}
                        globalIndex={globalIndex}
                        verseId={verse.id}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <TibetanSection
                        tibetan={verse.text.tibetan}
                        pronunciation={verse.text.pronunciation}
                    />
                </motion.div>

                {!hideAudio && (
                    <motion.div variants={itemVariants}>
                        <AudioPill
                            isPlaying={isPlaying}
                            progress={progress}
                            currentTime={currentTime}
                            duration={duration}
                            togglePlay={togglePlay}
                            seek={seek}
                            audioUrl={verse.audioUrl}
                            formatTime={formatTime}
                        />
                    </motion.div>
                )}

                <motion.div variants={itemVariants}>
                    <TranslationSection
                        english={verse.text.english}
                        korean={verse.text.korean}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <NavigationPill
                        globalIndex={globalIndex}
                        verseId={verse.id}
                        onPrevious={onPrevious}
                        onNext={onNext}
                    />
                </motion.div>
            </div>
        </motion.main>
    );
};

export default React.memo(ReadingPanel, (prevProps, nextProps) => prevProps.verse.id === nextProps.verse.id);
