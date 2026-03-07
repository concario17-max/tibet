import React from 'react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { formatTime } from '../../utils/audioUtils';
import ReadingHeader from '../../components/Reading/ReadingHeader';
import TibetanSection from '../../components/Reading/TibetanSection';
import AudioPill from '../../components/Reading/AudioPill';
import TranslationSection from '../../components/Reading/TranslationSection';
import NavigationPill from '../../components/Reading/NavigationPill';

// 강제 불변성과 Zero Monolith 원칙을 준수하는 ReadingPanel
const ReadingPanel = ({ verse, globalIndex, hideAudio = false, onPrevious, onNext }) => {
    // 오디오 플레이어 로직 (Tibet 커스텀 훅 지원)
    const audioPlaylist = React.useMemo(() => {
        return verse.audioUrl ? [{ id: verse.id, title: verse.title, url: verse.audioUrl }] : [];
    }, [verse.id, verse.title, verse.audioUrl]);

    const { isPlaying, progress, currentTime, duration, togglePlay, seek } = useAudioPlayer(audioPlaylist);

    // 장과 구절 번호 파싱
    const [chapterStr, verseStr] = verse.id.split('.');

    return (
        <main className="flex-1 min-w-0 bg-transparent font-crimson text-text-primary dark:text-dark-text-primary transition-colors duration-500 overflow-y-auto scrollbar-hide relative z-10 pt-24 sm:pt-[100px] pb-48 sm:pb-32">
            <div className="mx-auto max-w-[1000px] px-4 sm:px-6">

                {/* 챕터 네비게이션 브레드크럼 */}
                <ReadingHeader
                    chapterStr={chapterStr}
                    verseStr={verseStr}
                    globalIndex={globalIndex}
                    verseId={verse.id}
                />

                {/* 티벳어 (Sanskrit 대체) */}
                <TibetanSection
                    tibetan={verse.text.tibetan}
                    pronunciation={verse.text.pronunciation}
                />

                {/* 오디오 플레이어 (Gita 스타일 Pill 디자인 이식) */}
                {!hideAudio && (
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
                )}

                {/* 번역 렌더링 영역 */}
                <TranslationSection
                    english={verse.text.english}
                    korean={verse.text.korean}
                />

                {/* 하단 네비게이션 알약 버튼 */}
                <NavigationPill
                    globalIndex={globalIndex}
                    verseId={verse.id}
                    onPrevious={onPrevious}
                    onNext={onNext}
                />

            </div>
        </main>
    );
};

export default React.memo(ReadingPanel, (prevProps, nextProps) => prevProps.verse.id === nextProps.verse.id);
