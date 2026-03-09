import React from 'react';

const ReadingHeader = ({ chapterStr, verseStr, globalIndex, verseId }) => {
    return (
        <div className="flex flex-col items-center justify-center mb-2 pt-4">
            <nav className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] tracking-wider uppercase font-inter mb-10">
                {verseStr ? (
                    <>
                        <span className="text-text-secondary/80 dark:text-dark-text-secondary/80 font-medium transition-colors cursor-default">
                            Chapter {chapterStr}
                        </span>
                        <span className="text-text-secondary/50 text-[8px] font-bold mt-0.5">›</span>
                        <span className="text-text-primary dark:text-dark-text-primary font-bold">
                            Sutra {globalIndex || `${chapterStr}-${verseStr}`}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-text-secondary/80 dark:text-dark-text-secondary/80 font-medium transition-colors cursor-default">
                            Text
                        </span>
                        <span className="text-text-secondary/50 text-[8px] font-bold mt-0.5">›</span>
                        <span className="text-text-primary dark:text-dark-text-primary font-bold">
                            Paragraph {globalIndex || verseId}
                        </span>
                    </>
                )}
            </nav>

            <div className="w-8 h-8 rounded-full bg-gold-border/20 dark:bg-gold-primary/10 flex items-center justify-center mb-2 text-gold-primary dark:text-gold-light">
                <span className="font-serif leading-none">֍</span>
            </div>
        </div>
    );
};

export default React.memo(ReadingHeader);
