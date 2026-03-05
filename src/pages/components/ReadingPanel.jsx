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
const ReadingPanel = ({ verse, hideAudio = false }) => {
    // 오디오 플레이어 로직 (Tibet 커스텀 훅 지원)
    const audioPlaylist = React.useMemo(() => {
        return verse.audioUrl ? [{ id: verse.id, title: verse.title, url: verse.audioUrl }] : [];
    }, [verse.id, verse.title, verse.audioUrl]);

    const { isPlaying, progress, currentTime, duration, togglePlay, playTrack, seek } = useAudioPlayer(audioPlaylist);

    // 장과 구절 번호 파싱
    const [chapterStr, verseStr] = verse.id.split('.');

    return (
        <main className="flex-1 min-w-0 bg-transparent font-crimson text-text-primary dark:text-dark-text-primary transition-colors duration-500 overflow-y-auto scrollbar-hide relative z-10 pt-24 sm:pt-[100px] pb-48 sm:pb-32">
            <div className="mx-auto max-w-[1000px] px-4 sm:px-6">

                {/* 챕터 네비게이션 브레드크럼 */}
                <div className="flex flex-col items-center justify-center mb-2 pt-4">
                    <nav className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] tracking-wider uppercase font-inter mb-10">
                        <span className="text-text-secondary/80 dark:text-dark-text-secondary/80 font-medium transition-colors cursor-default">
                            Chapter {chapterStr}
                        </span>
                        <span className="text-text-secondary/50 text-[8px] font-bold mt-0.5">›</span>
                        <span className="text-text-primary dark:text-dark-text-primary font-bold">
                            Sutra {chapterStr}-{verseStr}
                        </span>
                    </nav>

                    {/* 고유 장식 아이콘 */}
                    <div className="w-8 h-8 rounded-full bg-gold-border/20 flex items-center justify-center mb-2 text-gold-primary">
                        <span className="font-serif leading-none">֍</span>
                    </div>
                </div>

                {/* 티벳어 (Sanskrit 대체) */}
                <section className="mb-4 text-center px-2 sm:px-0 mt-8">
                    {verse.text.tibetan && (
                        <p className="font-noto text-[#1F2937] dark:text-[#E5E7EB] text-xl sm:text-3xl leading-[1.8] tracking-wide font-bold drop-shadow-sm break-keep">
                            {verse.text.tibetan.replace(/[\r\n]+/g, ' ')}
                        </p>
                    )}
                    {verse.text.pronunciation && (
                        <p className="font-inter italic text-gold-muted/80 dark:text-gold-muted/80 text-sm sm:text-base leading-relaxed tracking-widest mt-6">
                            {verse.text.pronunciation.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}<br />
                                </React.Fragment>
                            ))}
                        </p>
                    )}
                </section>

                <div className="w-8 h-[1px] bg-gold-border/60 mx-auto my-8"></div>

                {/* 오디오 플레이어 (Gita 스타일 Pill 디자인 이식) */}
                {!hideAudio && (
                    <div className="mb-16 flex justify-center">
                        <div className="flex items-center justify-between w-full max-w-[400px] rounded-full border border-gold-primary/20 dark:border-dark-border/50 bg-white/40 dark:bg-[#111]/40 backdrop-blur-md px-5 py-2.5 shadow-sm hover:shadow-md transition-all hover:border-gold-primary/40">
                            <button
                                onClick={togglePlay}
                                disabled={!verse.audioUrl}
                                className={`text-gold-primary dark:text-gold-light hover:scale-110 transition-transform ${!verse.audioUrl ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                            </button>

                            <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums ml-4 w-8 text-right">
                                {formatTime(currentTime)}
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

                            <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums w-8">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>
                )}

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
                            <p className="text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary font-inter min-h-[1.5em] text-center px-2 sm:px-4 italic">
                                {verse.text.english.replace(/[\r\n]+/g, ' ')}
                            </p>
                        </div>
                    )}

                    {/* 한글 번역 */}
                    {verse.text.korean && (
                        <div className="mb-8">
                            {Array.isArray(verse.text.korean) ? (
                                <div className="space-y-12 mt-4">
                                    {verse.text.korean.map((ko, index) => (
                                        <div key={index} className="relative">
                                            {index > 0 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gold-border/30 dark:bg-dark-border"></div>}
                                            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-4 font-inter">
                                                <span className="opacity-80 font-korean tracking-wide">{ko.translator} 역</span>
                                            </h3>
                                            <p className="font-korean text-base sm:text-[17px] leading-[1.8] text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center px-2 sm:px-4 break-keep font-[400] tracking-[-0.01em]">
                                                {ko.text.replace(/[\r\n]+/g, ' ')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-4 font-inter">한글 (Korean)</h3>
                                    <p className="font-korean text-base sm:text-[17px] leading-[1.8] text-text-primary dark:text-dark-text-primary min-h-[1.5em] text-center px-2 sm:px-4 break-keep font-[400] tracking-[-0.01em]">
                                        {String(verse.text.korean).replace(/[\r\n]+/g, ' ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </section>



            </div>
        </main>
    );
};

export default React.memo(ReadingPanel, (prevProps, nextProps) => prevProps.verse.id === nextProps.verse.id);
