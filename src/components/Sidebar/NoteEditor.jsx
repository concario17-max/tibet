import React from 'react';

const NoteEditor = ({ activeVerseId, note, setNote }) => {
    return (
        <div className="flex min-h-0 flex-1 flex-col space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8FA0AD]">
                Entry {activeVerseId}
            </div>

            <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Write a short note, reflection, or study prompt for this passage."
                className="custom-scrollbar h-40 w-full resize-none rounded-2xl border border-gold-primary/20 bg-white/80 p-5 font-inter text-[14px] leading-relaxed text-text-primary shadow-inner backdrop-blur-xl transition-all placeholder:text-text-secondary/60 focus:border-gold-primary/50 focus:outline-none focus:ring-1 focus:ring-gold-primary/20 dark:border-dark-border dark:bg-dark-surface/60 dark:text-dark-text-primary dark:placeholder:text-dark-text-secondary/60"
            />
        </div>
    );
};

export default React.memo(NoteEditor);
