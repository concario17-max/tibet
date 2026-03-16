import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles, X } from 'lucide-react';
import { useUI } from '../context/UIContext';
import lexiconDataUrl from '../data/lexicon.json?url';

const LexiconModal = () => {
    const uiContext = useUI();
    const [searchTerm, setSearchTerm] = useState('');
    const [lexiconData, setLexiconData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    if (!uiContext) return null;

    const { isLexiconOpen, setIsLexiconOpen } = uiContext;

    React.useEffect(() => {
        let isMounted = true;

        if (isLexiconOpen) {
            document.body.style.overflow = 'hidden';

            if (lexiconData.length === 0) {
                setIsLoading(true);
                fetch(lexiconDataUrl)
                    .then((response) => response.json())
                    .then((data) => {
                        if (!isMounted) return;
                        setLexiconData(data);
                        setIsLoading(false);
                    });
            }
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            isMounted = false;
            document.body.style.overflow = 'unset';
        };
    }, [isLexiconOpen, lexiconData.length]);

    const groupedLexicon = useMemo(() => {
        const filtered = lexiconData.filter((item) =>
            item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.definition.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        filtered.sort((a, b) => a.term.localeCompare(b.term));

        const groups = {};
        filtered.forEach((item) => {
            const firstChar = item.term.charAt(0).toUpperCase();
            const key = /[A-Z]/.test(firstChar) ? firstChar : '#';
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        return Object.keys(groups)
            .sort()
            .map((key) => ({
                letter: key,
                items: groups[key],
            }));
    }, [lexiconData, searchTerm]);

    return (
        <AnimatePresence>
            {isLexiconOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="modal-backdrop fixed inset-0 z-[100]"
                        onClick={() => setIsLexiconOpen(false)}
                    />

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="modal-shell w-full max-w-4xl max-h-[90vh] rounded-[2rem] flex flex-col pointer-events-auto overflow-hidden"
                        >
                            <div className="modal-header shrink-0 px-5 py-4 sm:px-8 sm:py-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <p className="modal-kicker">Glossary Index</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep">
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="serif-title text-2xl text-[#9A7B4F] font-medium tracking-[0.08em]">Lexicon</h2>
                                                <p className="mt-1 text-sm text-charcoal-muted">Search terms, names, and doctrinal references while you read.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsLexiconOpen(false)} className="modal-close rounded-full p-2">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="relative mt-5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Search className="h-4 w-4 text-charcoal-muted/70" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search terms or definitions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-[1.1rem] border border-sand-tertiary bg-white/80 py-3 pl-11 pr-4 leading-5 text-charcoal-main placeholder-charcoal-muted/50 transition-colors focus:border-[#9A7B4F] focus:outline-none focus:ring-1 focus:ring-[#9A7B4F] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="modal-body overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 space-y-8 text-charcoal-main font-sans scroll-smooth custom-scrollbar">
                                {isLoading ? (
                                    <div className="empty-state-card flex min-h-[320px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/75">
                                        <p className="font-serif text-lg text-charcoal-main">Preparing the lexicon</p>
                                        <p className="mt-2 max-w-sm text-sm leading-7">용어와 해설을 차분히 정리해 불러오고 있습니다.</p>
                                    </div>
                                ) : groupedLexicon.length > 0 ? (
                                    groupedLexicon.map((group) => (
                                        <div key={group.letter} className="space-y-4">
                                            <div className="sticky top-0 z-10 -mx-2 rounded-xl bg-sand-primary/92 px-2 py-2 backdrop-blur-sm">
                                                <h3 className="serif-title text-2xl font-bold text-[#9A7B4F]/45">{group.letter}</h3>
                                            </div>

                                            <div className="space-y-5">
                                                {group.items.map((item, index) => {
                                                    const termParts = item.term.split(' ');
                                                    const primaryTerm = termParts[0];
                                                    const secondaryTerm = termParts.slice(1).join(' ');

                                                    return (
                                                        <div key={index} className="rounded-[1.4rem] border border-gold-border/12 bg-white/70 px-4 py-4 shadow-[0_14px_30px_rgba(120,93,48,0.04)] sm:px-5">
                                                            <h4 className="flex flex-wrap items-baseline gap-x-2 text-[#9A7B4F]">
                                                                <span className="font-serif text-[20px] font-semibold">{primaryTerm}</span>
                                                                {secondaryTerm ? (
                                                                    <span className="text-[13px] italic text-charcoal-muted sm:text-[14px]">
                                                                        {secondaryTerm}
                                                                    </span>
                                                                ) : null}
                                                            </h4>
                                                            <p className="mt-3 text-[14px] leading-[1.9] text-charcoal-main/92 sm:text-[15px]">
                                                                {item.definition}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state-card flex min-h-[320px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/75">
                                        <p className="font-serif text-lg text-charcoal-main">No matching terms</p>
                                        <p className="mt-2 max-w-sm text-sm leading-7">"{searchTerm}"에 해당하는 결과를 찾지 못했습니다.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LexiconModal;
