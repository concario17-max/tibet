import React from 'react';

const TibetanSection = ({ tibetan, pronunciation }) => {
    if (!tibetan && !pronunciation) return null;

    return (
        <>
            <section id="tibetan-original" className="mb-4 text-center px-4 sm:px-0 mt-12 bg-transparent">
                {tibetan && (
                    <p className="font-noto text-[#4A0404] dark:text-[#E27070] text-xl sm:text-[32px] leading-[1.8] tracking-[0.02em] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] break-keep max-w-[90%] mx-auto antialiased">
                        {tibetan.replace(/[\r\n]+/g, ' ')}
                    </p>
                )}
                {pronunciation && (
                    <p className="font-inter italic text-gold-muted/90 dark:text-gold-muted/80 text-sm sm:text-[15px] leading-relaxed tracking-[0.15em] mt-8 opacity-80 uppercase font-medium">
                        {pronunciation.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}<br />
                            </React.Fragment>
                        ))}
                    </p>
                )}
            </section>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-border/40 to-transparent mx-auto my-12"></div>
        </>
    );
};

export default React.memo(TibetanSection);
