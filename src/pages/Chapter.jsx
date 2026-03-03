import React from 'react';

const Chapter = () => {
    return (
        <div className="pt-32 pb-20 max-w-5xl mx-auto px-6 w-full flex-1 min-h-screen">
            <h1 className="serif-title text-4xl mb-12 text-center text-slate-900 dark:text-slate-100">Read the Chapters</h1>

            <section className="mb-20">
                <div className="bg-champagne/50 dark:bg-slate-800/30 rounded-xl p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-gold ml-1">Select a Chapter</label>
                            <div className="relative">
                                <select className="w-full bg-white dark:bg-slate-900 border border-champagne dark:border-slate-700 rounded-lg py-4 px-5 appearance-none focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-700 dark:text-slate-200">
                                    <option>The Chikhai Bardo</option>
                                    <option>The Chonyid Bardo</option>
                                    <option>The Sidpa Bardo</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-muted-gold pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-gold ml-1">Select a Verse</label>
                            <div className="relative">
                                <input type="number" placeholder="Enter verse number..." className="w-full bg-white dark:bg-slate-900 border border-champagne dark:border-slate-700 rounded-lg py-4 px-5 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-slate-700 dark:text-slate-200" />
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-muted-gold pointer-events-none">search</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="prose dark:prose-invert max-w-none prose-p:font-display prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-loose">
                <h2 className="serif-title text-3xl mb-8 text-slate-900 dark:text-slate-100">The Chikhai Bardo</h2>
                <p>
                    O nobly-born, the time hath now come for thee to seek the Path. Thy breathing is about to cease. Thy guru hath set thee face to face before with the Clear Light; and now thou art about to experience it in its Reality in the Bardo state, wherein all things are like the void and cloudless sky, and the naked, spotless intellect is like unto a transparent vacuum without circumference or centre.
                </p>
                <p>
                    At this moment, know thou thyself; and abide in that state. I, too, at this time, am setting thee face to face.
                </p>
            </section>
        </div>
    );
};

export default Chapter;
