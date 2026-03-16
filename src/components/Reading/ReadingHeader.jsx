import React from 'react';

const ReadingHeader = ({ chapterStr, verseStr, globalIndex, verseId, title, chapterTitle }) => {
    const sectionLabel = verseStr ? `Chapter ${chapterStr}` : 'Text';
    const entryLabel = verseStr ? `Prayer ${globalIndex || `${chapterStr}-${verseStr}`}` : `Paragraph ${globalIndex || verseId}`;
    const displayTitle = title || chapterTitle || 'Untitled Passage';

    return (
        <div className="flex flex-col items-center justify-center mb-8 pt-2 sm:pt-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-gold-border/30 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-text-secondary/80 shadow-[0_10px_30px_rgba(166,139,92,0.08)] backdrop-blur-md dark:border-dark-border/60 dark:bg-dark-surface/70 dark:text-dark-text-secondary/80 sm:px-5">
                <span>{sectionLabel}</span>
                <span className="text-gold-primary/60 dark:text-gold-light/60">•</span>
                <span className="text-text-primary dark:text-dark-text-primary">{entryLabel}</span>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold-border/60" />
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-border/30 bg-gold-surface/30 text-[18px] text-gold-deep shadow-inner dark:border-gold-light/15 dark:bg-gold-primary/10 dark:text-gold-light">
                        ॐ
                    </div>
                    <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold-border/60" />
                </div>

                <div className="space-y-3 px-4">
                    <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.42em] text-gold-deep/70 dark:text-gold-light/65">
                        Sacred Reading
                    </p>
                    <h1 className="max-w-3xl font-serif text-[1.9rem] leading-tight text-text-primary dark:text-dark-text-primary sm:text-[2.5rem]">
                        {displayTitle}
                    </h1>
                    {chapterTitle && title && chapterTitle !== title ? (
                        <p className="font-korean text-sm tracking-[0.08em] text-text-secondary/85 dark:text-dark-text-secondary/85 sm:text-[15px]">
                            {chapterTitle}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ReadingHeader);
