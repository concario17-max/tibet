import React from 'react';

const TranslationSection = ({ english, korean }) => {
    return (
        <section className="mb-10">
            {/* 영문 번역 */}
            {english && (
                <div className="mb-12">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-primary/70 dark:text-gold-light/60 text-center mb-4 font-inter">English</h3>
                    <p className="text-base sm:text-lg leading-loose text-text-primary dark:text-dark-text-primary font-inter min-h-[1.5em] text-center px-2 sm:px-4 italic">
                        {english.replace(/[\r\n]+/g, ' ')}
                    </p>
                </div>
            )}

            {/* 한글 번역 */}
            {korean && (
                <div className="mb-8">
                    {Array.isArray(korean) ? (
                        <div className="space-y-12 mt-4">
                            {korean.map((ko, index) => (
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
                                {String(korean).replace(/[\r\n]+/g, ' ')}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default React.memo(TranslationSection);
