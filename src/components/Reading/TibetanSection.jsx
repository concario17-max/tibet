import React from 'react';

const TibetanSection = ({ tibetan, pronunciation }) => {
    if (!tibetan && !pronunciation) return null;

    return (
        <>
            <section id="tibetan-original" className="mb-2 text-center px-4 sm:px-0 mt-6 bg-transparent">
                {tibetan && (
                    <p className="font-noto text-[#4A0404] dark:text-[#E27070] text-lg sm:text-[24px] leading-relaxed tracking-[0.01em] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] break-keep max-w-[90%] mx-auto antialiased">
                        {tibetan.replace(/[\r\n]+/g, ' ')}
                    </p>
                )}
                {pronunciation && (
                    <p className="font-inter italic text-gold-muted/90 dark:text-gold-muted/80 text-xs sm:text-[14px] leading-tight tracking-[0.12em] mt-4 opacity-70 uppercase font-medium">
                        {pronunciation.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}<br />
                            </React.Fragment>
                        ))}
                    </p>
                )}
            </section>
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-gold-border/30 to-transparent mx-auto my-6"></div>
        </>
    );
};

export default React.memo(TibetanSection);
