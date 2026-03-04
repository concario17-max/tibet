import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden py-8 px-4 md:px-6">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-10 scale-110" />
            <div className="absolute inset-0 bg-sand-primary mix-blend-multiply opacity-60" />

            <div className="relative z-10 w-full max-w-5xl flex flex-col gap-8 md:gap-12 animate-in fade-in duration-1000 mt-12 md:mt-20">

                {/* Hero Section */}
                <div className="text-center space-y-5 md:space-y-6">
                    <p className="text-gold-primary text-[10px] tracking-[1em] uppercase font-bold">Tibetan Book of the Dead</p>
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-charcoal-main leading-[0.9] tracking-tighter uppercase font-extralight">
                        The Bardo <br /> <span className="gold-gradient-text italic font-medium">Thodol</span>
                    </h1>
                    <div className="w-12 h-px bg-gold-primary/30 mx-auto" />
                    <p className="text-charcoal-muted max-w-md mx-auto text-[10px] md:text-xs leading-loose font-bold tracking-widest uppercase">
                        Liberation Through Hearing in the Intermediate State
                    </p>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
                    {/* Card 1: Text */}
                    <Link to="/text" className="group flex flex-col bg-white border border-sand-tertiary rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gold-primary/5 transition-all duration-300">
                        <div className="h-28 md:h-36 overflow-hidden relative">
                            <img alt="Bardo Text" className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3Y7NmlY5THPMAn6q5XlXTMvsGi0ziB5RAYRM84aZvtCsX3-iRr4bgq4wAzFkr0XrQ0pnJ2W7Qp8UURaR-HW-tn3x-63NaluE72eWAn91sBgrvtVjLqAyyfdPcphi-iPzOLQ-QZbJiqBDaW6-doxAwfH1VuC3ExCwwqogWeBykbLM3Wq3gW7JeiyqaIuSv8Fed4sUUnWSh5pALLw8Zx1M2UOlVg11SIBQAZP25QvI2vJsp9Yk5GRVVJzCZVOgG0_W0tDRy9IIcqOU" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                            <div className="absolute bottom-3 left-4 md:left-6">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest">Main Text</span>
                            </div>
                        </div>
                        <div className="p-5 md:p-6 flex flex-col flex-1 bg-sand-primary">
                            <h3 className="serif-title text-lg md:text-xl mb-2 text-charcoal-main">Text</h3>
                            <p className="text-charcoal-main/80 text-sm leading-relaxed mb-4 md:mb-6 flex-1 font-sans font-medium line-clamp-2 md:line-clamp-none">
                                티벳 사자의 서 본문
                            </p>
                            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-charcoal-main group-hover:text-gold-primary transition-colors mt-auto">
                                Begin Reading <span className="material-symbols-outlined text-[12px] md:text-sm">menu_book</span>
                            </span>
                        </div>
                    </Link>

                    {/* Card 2: Prayer */}
                    <Link to="/chapter" className="group flex flex-col bg-white border border-sand-tertiary rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gold-primary/5 transition-all duration-300">
                        <div className="h-28 md:h-36 overflow-hidden relative">
                            <img alt="Bardo Prayers" className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWbg_7hTWFFEfhkEbsBsQnn7JMqP0dSZVJyWdkmQpEMgAtemy_jGlEm9mcfALy-ZwawB_dUD4XhVEr6g1pzbftfikJwgVxz7bna8RISLycTld5_SIEG3N02V4I4wvt6WmHK9p31NSnUnbqBTqTxim1hs-nqG0Y_R2IMabApGI7CTGxbbKhgJZxEplageh2iXJbjExww9s3xQx8e4osiztcvxmL5WmINMtmHmBXPoFftsYtH6nyveELBW3oIOepWD7Q5AMovzrqkKY" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                            <div className="absolute bottom-3 left-4 md:left-6">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest">Sacred Prayers</span>
                            </div>
                        </div>
                        <div className="p-5 md:p-6 flex flex-col flex-1 bg-sand-primary">
                            <h3 className="serif-title text-lg md:text-xl mb-2 text-charcoal-main">Prayer</h3>
                            <p className="text-charcoal-main/80 text-sm leading-relaxed mb-4 md:mb-6 flex-1 font-sans font-medium line-clamp-2 md:line-clamp-none">
                                티벳 사자의 서 기도문
                            </p>
                            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-charcoal-main group-hover:text-gold-primary transition-colors mt-auto">
                                Begin Reading <span className="material-symbols-outlined text-[12px] md:text-sm">menu_book</span>
                            </span>
                        </div>
                    </Link>

                    {/* Card 3: Chants */}
                    <Link to="/album" className="group flex flex-col bg-white border border-sand-tertiary rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gold-primary/5 transition-all duration-300">
                        <div className="h-28 md:h-36 overflow-hidden relative">
                            <img alt="Bardo Chants" className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWyQZjksW6AnWRgPdnGDThtE-Phmyey5XdJVwc-OKgt3APQT3fqEv52XbSlfMCQuBuA6X0IOsD7pFMh_-840xhaV0Y41AM1sTud_rc9ych_5keDAfaSEHqCuK1cqP2ZXvAiEYG3yjgZO8Kn4Un1ue-zl7Alt9BI7fbG_zwuy5s5amYw7dB4xAG20-M8ziA8DfXjkrm8hcH4cbnpO4VsNTh6OAF8Etx8T2syfLnZxNSap6jEJ8k52HoyEVhVqm71rWrr2_Fkc8zOUc" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                            <div className="absolute bottom-3 left-4 md:left-6">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest">Sacred Audio</span>
                            </div>
                        </div>
                        <div className="p-5 md:p-6 flex flex-col flex-1 bg-sand-primary">
                            <h3 className="serif-title text-lg md:text-xl mb-2 text-charcoal-main">Chants</h3>
                            <p className="text-charcoal-main/80 text-sm leading-relaxed mb-4 md:mb-6 flex-1 font-sans font-medium line-clamp-2 md:line-clamp-none">
                                티벳 음악 앨범
                            </p>
                            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-charcoal-main group-hover:text-gold-primary transition-colors mt-auto">
                                Listen Now <span className="material-symbols-outlined text-[12px] md:text-sm">headphones</span>
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
