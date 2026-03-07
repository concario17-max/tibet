import React from 'react';

const TibetanSection = ({ tibetan, pronunciation }) => {
    if (!tibetan && !pronunciation) return null;

    return (
        <>
            <section className="mb-4 text-center px-2 sm:px-0 mt-8">
                {tibetan && (
                    <p className="font-noto text-[#1F2937] dark:text-[#E5E7EB] text-xl sm:text-3xl leading-[1.8] tracking-wide font-bold drop-shadow-sm break-keep">
                        {tibetan.replace(/[\r\n]+/g, ' ')}
                    </p>
                )}
                {pronunciation && (
                    <p className="font-inter italic text-gold-muted/80 dark:text-gold-muted/80 text-sm sm:text-base leading-relaxed tracking-widest mt-6">
                        {pronunciation.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}<br />
                            </React.Fragment>
                        ))}
                    </p>
                )}
            </section>
            <div className="w-8 h-[1px] bg-gold-border/60 mx-auto my-8"></div>
        </>
    );
};

export default React.memo(TibetanSection);
