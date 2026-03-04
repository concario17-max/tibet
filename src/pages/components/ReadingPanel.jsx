import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Bookmark } from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

// Gita 스타일 시간 포맷터 (순수 함수로 외부 분리)
const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 강제 불변성과 Zero Monolith 원칙을 준수하는 ReadingPanel
const ReadingPanel = ({ verse }) => {
    // 오디오 플레이어 로직 (Tibet 커스텀 훅 지원)
    const audioPlaylist = React.useMemo(() => {
        return verse.audioUrl ? [{ id: verse.id, title: verse.title, url: verse.audioUrl }] : [];
    }, [verse.id, verse.title, verse.audioUrl]);

    const { isPlaying, progress, togglePlay, playTrack, seek } = useAudioPlayer(audioPlaylist);

    // ... (rest remains same but replacing the previous audioPlaylist initialization and function)

    // UI 업데이트용 내부 시간 상태
    const [currentTime, setCurrentTime] = useState(0);

    // 장과 구절 번호 파싱
    const [chapterStr, verseStr] = verse.id.split('.');

    return (
        <main className="flex-1 min-w-0 bg-transparent font-crimson text-text-primary dark:text-dark-text-primary transition-colors duration-500 overflow-y-auto scrollbar-hide relative z-10 pt-6 pb-24">
            <div className="mx-auto max-w-[1000px] px-4 sm:px-6">

                {/* 챕터 네비게이션 브레드크럼 */}
                <div className="flex flex-col items-center justify-center mb-2 pt-4">
                    <nav className="flex items-center gap-2 text-[13px] text-text-secondary dark:text-dark-text-secondary font-inter mb-6">
                        <span className="text-text-secondary dark:text-dark-text-secondary transition-colors cursor-default">Chapter {chapterStr}</span>
                        <span>›</span>
                        <span className="text-text-primary dark:text-dark-text-primary font-bold">Prayer {verseStr}</span>
                    </nav>

                    {/* 고유 장식 아이콘 */}
                    <div className="w-8 h-8 rounded-full bg-gold-border/20 flex items-center justify-center mb-2 text-gold-primary">
                        <span className="font-serif leading-none">֍</span>
                    </div>
                </div>

                {/* 티벳어 (Sanskrit 대체) */}
                <section className="mb-4 text-center px-2 sm:px-0 mt-8">
                    {verse.text.tibetan && (
                        <p className="font-noto text-[#1F2937] dark:text-[#E5E7EB] text-xl sm:text-3xl leading-[1.8] whitespace-pre-line tracking-wide font-bold drop-shadow-sm">
                            {verse.text.tibetan}
                        </p>
                    )}
                </section>

                <div className="w-8 h-[1px] bg-gold-border/60 mx-auto my-8"></div>

                {/* 오디오 플레이어 (Gita 스타일 Pill 디자인 이식) */}
                <div className="mb-16 flex justify-center">
                    <div className="flex items-center justify-between w-full max-w-[400px] rounded-full border border-gold-primary/20 dark:border-dark-border/50 bg-white/40 dark:bg-[#111]/40 backdrop-blur-md px-5 py-2.5 shadow-sm hover:shadow-md transition-all hover:border-gold-primary/40">
                        <button
                            onClick={togglePlay}
                            disabled={!verse.audioUrl}
                            className={`text-gold-primary dark:text-gold-light hover:scale-110 transition-transform ${!verse.audioUrl ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>

                        <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums ml-4">
                            0:00
                        </span>

                        <div className="relative flex-1 mx-4 h-[2px] bg-gold-border/30 dark:bg-dark-border rounded-full cursor-pointer group"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const percentage = x / rect.width;
                                seek(percentage * 100);
                            }}>
                            <div
                                className="absolute top-0 left-0 h-full bg-[#A68B5C] transition-all"
                                style={{ width: `${progress}%` }}
                            ></div>
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#A68B5C] rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ left: `calc(${progress}% - 4px)` }}
                            ></div>
                        </div>

                        <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums">
                            --:--
                        </span>
                    </div>
                </div>

                {/* 번역 렌더링 영역 */}
                <section className="mb-10">
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-gold-muted/40 dark:text-gold-muted/30 tracking-[8px] text-xs">•••</span>
                    </div>
                    <h2 className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-gold-muted dark:text-gold-muted text-center font-inter">Translation</h2>

                    {/* 영문 번역 */}
                    {verse.text.english && (
                        <div className="mb-12">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-4 font-inter">English</h3>
                            <p className="text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary font-inter min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep italic">
                                {verse.text.english}
                            </p>
                        </div>
                    )}

                    {/* 한글 번역 */}
                    {verse.text.korean && (
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-4 font-inter">한글 (Korean)</h3>
                            <p className="font-noto-kr text-base sm:text-lg leading-[2.2] text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center max-w-3xl mx-auto px-2 sm:px-0 whitespace-pre-line break-keep font-medium">
                                {verse.text.korean}
                            </p>
                        </div>
                    )}
                </section>

                {/* 용어사전 UI 잔재 (선택적 유지) */}
                <div className="mt-24 border-t border-gold-border/30 pt-16">
                    <h3 className="font-crimson text-xl mb-6 text-text-primary dark:text-dark-text-primary text-center">Core Lexicon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        <div className="p-5 border border-gold-border/50 rounded-xl bg-white/40 dark:bg-dark-surface/40 hover:border-gold-primary transition-colors cursor-pointer group backdrop-blur-sm shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-text-primary dark:text-dark-text-primary group-hover:text-gold-primary transition-colors">Bardo (바르도)</h4>
                                <Bookmark size={16} className="text-text-secondary/50 group-hover:text-gold-primary transition-colors" />
                            </div>
                            <p className="text-[13px] text-text-secondary dark:text-dark-text-secondary leading-relaxed">죽음과 환생 사이의 중간계 상태.</p>
                        </div>
                        <div className="p-5 border border-gold-border/50 rounded-xl bg-white/40 dark:bg-dark-surface/40 hover:border-gold-primary transition-colors cursor-pointer group backdrop-blur-sm shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-text-primary dark:text-dark-text-primary group-hover:text-gold-primary transition-colors">Dharmakaya (법신)</h4>
                                <Bookmark size={16} className="text-text-secondary/50 group-hover:text-gold-primary transition-colors" />
                            </div>
                            <p className="text-[13px] text-text-secondary dark:text-dark-text-secondary leading-relaxed">궁극적 실체의 비현현 상태, 붓다의 진리의 몸.</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default React.memo(ReadingPanel, (prevProps, nextProps) => prevProps.verse.id === nextProps.verse.id);
