import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useUI } from '../context/UIContext';
import lexiconData from '../data/lexicon.json';

const LexiconModal = () => {
    const uiContext = useUI();
    const [searchTerm, setSearchTerm] = useState('');

    if (!uiContext) return null;

    const { isLexiconOpen, setIsLexiconOpen } = uiContext;

    // Lock scroll when modal is open
    React.useEffect(() => {
        if (isLexiconOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isLexiconOpen]);

    // Group terms by first letter (alphabetical sorting)
    const groupedLexicon = useMemo(() => {
        const filtered = lexiconData.filter(item =>
            item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.definition.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort alphabetically by English term
        filtered.sort((a, b) => a.term.localeCompare(b.term));

        const groups = {};
        filtered.forEach(item => {
            const firstChar = item.term.charAt(0).toUpperCase();
            // Handle cases where the first character might be non-alphabetic
            const key = /[A-Z]/.test(firstChar) ? firstChar : '#';
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });

        // Sort keys
        const sortedKeys = Object.keys(groups).sort();
        const sortedGroups = sortedKeys.map(key => ({
            letter: key,
            items: groups[key]
        }));

        return sortedGroups;
    }, [searchTerm]);

    return (
        <AnimatePresence>
            {isLexiconOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-charcoal-main/60 backdrop-blur-sm z-[100]"
                        onClick={() => setIsLexiconOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-sand-primary w-full max-w-3xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col pointer-events-auto border border-gold-primary/20 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex flex-col gap-4 px-5 py-4 sm:px-8 sm:py-6 border-b border-sand-tertiary bg-white/50 shrink-0">
                                <div className="flex justify-between items-center">
                                    <h2 className="serif-title text-2xl text-[#9A7B4F] font-medium tracking-wide">Lexicon</h2>
                                    <button
                                        onClick={() => setIsLexiconOpen(false)}
                                        className="p-1 rounded-full text-charcoal-muted hover:text-charcoal-main hover:bg-sand-secondary transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-charcoal-muted/70" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search terms or definitions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-sand-tertiary rounded-lg leading-5 bg-white/80 placeholder-charcoal-muted/50 focus:outline-none focus:ring-1 focus:ring-[#9A7B4F] focus:border-[#9A7B4F] sm:text-sm transition-colors text-charcoal-main"
                                    />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 space-y-8 sm:space-y-10 text-charcoal-main font-sans scroll-smooth custom-scrollbar">
                                {groupedLexicon.length > 0 ? (
                                    groupedLexicon.map(group => (
                                        <div key={group.letter} className="space-y-4">
                                            {/* Letter Header */}
                                            <h3 className="serif-title text-2xl text-[#9A7B4F]/40 font-bold border-b border-sand-tertiary/50 pb-2 sticky top-0 bg-sand-primary/95 backdrop-blur-sm z-10 py-1">
                                                {group.letter}
                                            </h3>

                                            {/* Terms */}
                                            <div className="space-y-6 sm:space-y-8 pl-1">
                                                {group.items.map((item, index) => {
                                                    // Parse out the primary term (usually uppercase) and the rest
                                                    // The term is structured like: "Abhirati mngon-par dga’-ba, Skt. Abhirati"
                                                    // We render the first word bolder.
                                                    const termParts = item.term.split(' ');
                                                    const primaryTerm = termParts[0];
                                                    const secondaryTerm = termParts.slice(1).join(' ');

                                                    return (
                                                        <div key={index} className="space-y-1 sm:space-y-2 group">
                                                            <h4 className="text-[16px] sm:text-[17px] font-medium text-[#9A7B4F] flex flex-wrap items-baseline gap-x-2">
                                                                <span className="font-bold">{primaryTerm}</span>
                                                                {secondaryTerm && (
                                                                    <span className="text-charcoal-muted text-[13px] sm:text-[14px] italic font-normal">
                                                                        {secondaryTerm}
                                                                    </span>
                                                                )}
                                                            </h4>
                                                            <p className="text-[14px] sm:text-[15px] leading-relaxed text-charcoal-main/90 group-hover:text-charcoal-main transition-colors text-justify">
                                                                {item.definition}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-charcoal-muted">
                                        No terms found matching "{searchTerm}"
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
