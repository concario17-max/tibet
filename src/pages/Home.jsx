import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-10 scale-110" />
                <div className="absolute inset-0 bg-sand-primary mix-blend-multiply opacity-60" />

                <div className="relative z-10 text-center space-y-10 max-w-4xl px-4 animate-in fade-in zoom-in duration-1000">
                    <p className="text-gold-primary text-[10px] tracking-[1em] uppercase font-bold">Tibetan Book of the Dead</p>
                    <h1 className="text-6xl md:text-9xl font-serif text-charcoal-main leading-[0.9] tracking-tighter uppercase font-extralight py-4">
                        The Bardo <br /> <span className="gold-gradient-text italic font-medium">Thodol</span>
                    </h1>
                    <div className="w-12 h-px bg-gold-primary/30 mx-auto" />
                    <p className="text-charcoal-muted max-w-md mx-auto text-xs leading-loose font-bold tracking-widest uppercase">
                        Liberation Through Hearing in the Intermediate State
                    </p>

                    <div className="pt-10">
                        <Link to="/chapter" className="group relative px-12 py-5 overflow-hidden border border-gold-primary/30 rounded-none transition-all duration-700 hover:border-gold-primary inline-block">
                            <span className="relative z-10 text-[10px] tracking-[0.5em] uppercase text-charcoal-main transition-colors duration-700 group-hover:text-white font-bold">
                                Begin Journey
                            </span>
                            <div className="absolute inset-0 bg-gold-primary translate-y-full transition-transform duration-700 cubic-bezier(0.19, 1, 0.22, 1) group-hover:translate-y-0" />
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-6 opacity-30">
                    <div className="w-px h-24 bg-gradient-to-b from-transparent via-gold-primary to-transparent" />
                </div>
            </section>

            <section className="py-20 max-w-5xl mx-auto px-6 w-full">
                <div className="flex items-center justify-between mb-10 border-b border-sand-tertiary pb-4">
                    <h2 className="serif-title text-xl uppercase tracking-widest font-light text-charcoal-main">Featured Chapters</h2>
                    <Link to="/chapter" className="text-xs font-bold uppercase tracking-widest text-gold-primary flex items-center gap-2 hover:text-charcoal-main transition-colors">
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Chapter 1 */}
                    <Link to="/chapter" className="group flex flex-col bg-white border border-sand-tertiary rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gold-primary/5 transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                            <img alt="Chikhai Bardo" className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3Y7NmlY5THPMAn6q5XlXTMvsGi0ziB5RAYRM84aZvtCsX3-iRr4bgq4wAzFkr0XrQ0pnJ2W7Qp8UURaR-HW-tn3x-63NaluE72eWAn91sBgrvtVjLqAyyfdPcphi-iPzOLQ-QZbJiqBDaW6-doxAwfH1VuC3ExCwwqogWeBykbLM3Wq3gW7JeiyqaIuSv8Fed4sUUnWSh5pALLw8Zx1M2UOlVg11SIBQAZP25QvI2vJsp9Yk5GRVVJzCZVOgG0_W0tDRy9IIcqOU" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Part I</span>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1 bg-sand-primary">
                            <h3 className="serif-title text-xl mb-3 text-charcoal-main">Chikhai Bardo</h3>
                            <p className="text-charcoal-muted text-sm leading-relaxed mb-8 flex-1 font-serif">
                                The Bardo of the Moments of Death, exploring the luminous clarity of the Dharmakaya.
                            </p>
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal-main group-hover:text-gold-primary transition-colors">
                                Begin Reading <span className="material-symbols-outlined text-sm">menu_book</span>
                            </span>
                        </div>
                    </Link>

                    {/* Chapter 2 */}
                    <Link to="/chapter" className="group flex flex-col bg-white border border-sand-tertiary rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gold-primary/5 transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                            <img alt="Chonyid Bardo" className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWbg_7hTWFFEfhkEbsBsQnn7JMqP0dSZVJyWdkmQpEMgAtemy_jGlEm9mcfALy-ZwawB_dUD4XhVEr6g1pzbftfikJwgVxz7bna8RISLycTld5_SIEG3N02V4I4wvt6WmHK9p31NSnUnbqBTqTxim1hs-nqG0Y_R2IMabApGI7CTGxbbKhgJZxEplageh2iXJbjExww9s3xQx8e4osiztcvxmL5WmINMtmHmBXPoFftsYtH6nyveELBW3oIOepWD7Q5AMovzrqkKY" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Part II</span>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1 bg-sand-primary">
                            <h3 className="serif-title text-xl mb-3 text-charcoal-main">Chonyid Bardo</h3>
                            <p className="text-charcoal-muted text-sm leading-relaxed mb-8 flex-1 font-serif">
                                The Bardo of the Experiencing of Reality, where the peaceful and wrathful deities appear.
                            </p>
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal-main group-hover:text-gold-primary transition-colors">
                                Begin Reading <span className="material-symbols-outlined text-sm">menu_book</span>
                            </span>
                        </div>
                    </Link>

                    {/* Chapter 3 */}
                    <Link to="/chapter" className="group flex flex-col bg-white border border-sand-tertiary rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gold-primary/5 transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                            <img alt="Sidpa Bardo" className="w-full h-full object-cover grayscale opacity-70 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWyQZjksW6AnWRgPdnGDThtE-Phmyey5XdJVwc-OKgt3APQT3fqEv52XbSlfMCQuBuA6X0IOsD7pFMh_-840xhaV0Y41AM1sTud_rc9ych_5keDAfaSEHqCuK1cqP2ZXvAiEYG3yjgZO8Kn4Un1ue-zl7Alt9BI7fbG_zwuy5s5amYw7dB4xAG20-M8ziA8DfXjkrm8hcH4cbnpO4VsNTh6OAF8Etx8T2syfLnZxNSap6jEJ8k52HoyEVhVqm71rWrr2_Fkc8zOUc" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <span className="bg-sand-secondary border border-sand-tertiary text-charcoal-main text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Part III</span>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1 bg-sand-primary">
                            <h3 className="serif-title text-xl mb-3 text-charcoal-main">Sidpa Bardo</h3>
                            <p className="text-charcoal-muted text-sm leading-relaxed mb-8 flex-1 font-serif">
                                The Bardo of Rebirth, guiding the consciousness toward a favorable new existence.
                            </p>
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal-main group-hover:text-gold-primary transition-colors">
                                Begin Reading <span className="material-symbols-outlined text-sm">menu_book</span>
                            </span>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
