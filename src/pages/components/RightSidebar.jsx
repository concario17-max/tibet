import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookMarked, Edit3, Trash2, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import NoteEditor from '../../components/Sidebar/NoteEditor';
import ReflectionActions from '../../components/Sidebar/ReflectionActions';
import { flattenVerses } from '../../utils/textUtils';
import { buildSavedNotes, buildVerseMap, NOTE_META } from '../../utils/commentaryNotes';
import prayersDataUrl from '../../data/prayers.json?url';
import bookDataUrl from '../../data/book.json?url';

const RightSidebar = ({ activeVerseId, storagePrefix = 'prayer' }) => {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [savedNotes, setSavedNotes] = useState([]);
    const [prayerVerseMap, setPrayerVerseMap] = useState(() => new Map());
    const [bookVerseMap, setBookVerseMap] = useState(() => new Map());
    const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);
    const [loadError, setLoadError] = useState('');
    const navigate = useNavigate();

    const uiContext = useUI() || {
        isReflectionsOpen: true,
        setIsReflectionsOpen: () => {},
        isSidebarOpen: true,
        rightPanelMode: 'reflections',
        setActiveVerse: () => {},
    };
    const {
        isReflectionsOpen,
        setIsReflectionsOpen,
        isSidebarOpen,
        rightPanelMode,
        setActiveVerse,
    } = uiContext;
    const isCommentaryMode = rightPanelMode === 'commentary';
    const desktopWidthClass = isSidebarOpen ? 'xl:w-[400px]' : 'xl:w-[800px]';
    const noteKey = `tibet-${storagePrefix}-note-${activeVerseId}`;

    useEffect(() => {
        if (!activeVerseId || isCommentaryMode) return;
        const savedNote = localStorage.getItem(noteKey);
        setNote(savedNote || '');
    }, [activeVerseId, noteKey, isCommentaryMode]);

    useEffect(() => {
        if (isCommentaryMode) {
            setShowExportMenu(false);
        }
    }, [isCommentaryMode]);

    useEffect(() => {
        if (!isCommentaryMode) {
            setSavedNotes([]);
            setIsLoadingCommentary(false);
            setLoadError('');
            return;
        }

        let isMounted = true;

        const loadNotes = async () => {
            setIsLoadingCommentary(true);
            setLoadError('');

            try {
                const [prayersResponse, bookResponse] = await Promise.all([fetch(prayersDataUrl), fetch(bookDataUrl)]);
                const [prayersData, bookData] = await Promise.all([prayersResponse.json(), bookResponse.json()]);

                if (!isMounted) return;

                const nextPrayerVerseMap = buildVerseMap(prayersData.flatMap((chapter) => chapter.verses.map((verse) => verse)));
                const nextBookVerseMap = buildVerseMap(flattenVerses(bookData));

                setPrayerVerseMap(nextPrayerVerseMap);
                setBookVerseMap(nextBookVerseMap);
                setSavedNotes(buildSavedNotes({ prayerVerseMap: nextPrayerVerseMap, bookVerseMap: nextBookVerseMap, storage: localStorage }));
            } catch (error) {
                if (!isMounted) return;
                setLoadError('Unable to load commentary notes right now.');
            } finally {
                if (isMounted) setIsLoadingCommentary(false);
            }
        };

        loadNotes();

        return () => {
            isMounted = false;
        };
    }, [isCommentaryMode]);

    const handleSave = React.useCallback(() => {
        if (!activeVerseId) return;
        setIsSaving(true);
        localStorage.setItem(noteKey, note);
        setTimeout(() => setIsSaving(false), 1000);
    }, [activeVerseId, noteKey, note]);

    const handleExportCurrent = React.useCallback(() => {
        if (!activeVerseId) return;
        const element = document.createElement('a');
        const file = new Blob([note], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Tibet_Reflection_${activeVerseId}.txt`;
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    }, [activeVerseId, note]);

    const handleExportAll = React.useCallback(() => {
        let allNotesText = 'Tibet Prayers - All Reflections\n\n';
        const noteKeys = Object.keys(localStorage).filter((key) => key.startsWith(`tibet-${storagePrefix}-note-`));

        noteKeys.sort((a, b) => a.localeCompare(b));

        noteKeys.forEach((key) => {
            const vId = key.replace(`tibet-${storagePrefix}-note-`, '');
            const content = localStorage.getItem(key);
            if (content && content.trim()) {
                allNotesText += `--- Verse ${vId} ---\n${content}\n\n`;
            }
        });

        if (allNotesText === 'Tibet Prayers - All Reflections\n\n') {
            alert('No saved reflections found to export.');
            setShowExportMenu(false);
            return;
        }

        const element = document.createElement('a');
        const file = new Blob([allNotesText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'Tibet_All_Reflections.txt';
        document.body.appendChild(element);
        element.click();
        setShowExportMenu(false);
    }, [storagePrefix]);

    const handleJumpToNote = (noteItem) => {
        if (noteItem.type === 'prayer') {
            const targetVerse = prayerVerseMap.get(noteItem.id);
            if (!targetVerse) return;

            setActiveVerse?.(targetVerse);
            navigate('/chapter');
            return;
        }

        const targetVerse = bookVerseMap.get(noteItem.id);
        if (!targetVerse) return;

        localStorage.setItem('tibet_active_text_verse', JSON.stringify(targetVerse));
        navigate('/text');
    };

    const handleDeleteNote = (noteItem) => {
        if (!window.confirm(`Delete saved reflection ${noteItem.id}?`)) return;

        localStorage.removeItem(noteItem.noteKey);
        setSavedNotes((prev) => prev.filter((entry) => entry.noteKey !== noteItem.noteKey));
    };

    const emptyHint = useMemo(() => 'Saved reflections from the text and prayer pages will appear here.', []);

    if (!activeVerseId) return null;

    return (
        <>
            {isReflectionsOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden transition-opacity duration-300"
                    onClick={() => setIsReflectionsOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 right-0 z-50 w-[90vw] sm:w-[400px] bg-white/80 dark:bg-dark-bg/95 backdrop-blur-xl border-l border-gold-primary/20 dark:border-dark-border/50 h-full xl:h-[calc(100vh-64px)] xl:sticky xl:top-16 xl:translate-x-0 ${desktopWidthClass} transform transition-all duration-500 ${
                    isReflectionsOpen ? 'translate-x-0 overflow-hidden shadow-2xl xl:shadow-none' : 'translate-x-full'
                } flex flex-col font-inter`}
            >
                <div className="xl:hidden absolute top-4 right-4 z-50">
                    <button
                        onClick={() => setIsReflectionsOpen(false)}
                        className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 relative flex flex-col h-full min-h-0">
                    <div className="flex items-center gap-3 mb-6 shrink-0 border-b border-gold-border/30 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-border/25 bg-gold-surface/35 text-gold-deep">
                            {isCommentaryMode ? <BookMarked className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide">
                                {isCommentaryMode ? 'Commentary' : 'Reflections'}
                            </h2>
                            <p className="mt-1 text-[11px] text-text-secondary/70 dark:text-dark-text-secondary/70">
                                {isCommentaryMode
                                    ? 'Saved notes from the text and prayer pages.'
                                    : 'Write a reflection for the current verse.'}
                            </p>
                        </div>
                    </div>

                    {isCommentaryMode ? (
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                            {isLoadingCommentary ? (
                                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/75">
                                    <div className="h-14 w-14 rounded-full border border-gold-border/20 bg-gold-surface/30" />
                                    <p className="mt-5 font-serif text-lg text-charcoal-main">Loading commentary notes</p>
                                </div>
                            ) : loadError ? (
                                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/70">
                                    <p className="mt-5 font-serif text-lg text-charcoal-main">Unable to Load Notes</p>
                                    <p className="mt-2 max-w-md text-sm leading-7">{loadError}</p>
                                </div>
                            ) : savedNotes.length === 0 ? (
                                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.8rem] px-6 py-12 text-center text-charcoal-muted/70">
                                    <BookMarked className="h-12 w-12 opacity-35 text-gold-primary/60" />
                                    <p className="mt-5 font-serif text-lg text-charcoal-main">No saved notes yet</p>
                                    <p className="mt-2 max-w-md text-sm leading-7">{emptyHint}</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 sm:gap-5">
                                    {savedNotes.map((noteItem) => (
                                        <div
                                            key={noteItem.noteKey}
                                            className="rounded-[1.5rem] border border-gold-border/14 bg-white/70 p-5 shadow-[0_20px_45px_rgba(120,93,48,0.05)] transition-all duration-300 hover:shadow-[0_25px_55px_rgba(120,93,48,0.08)]"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-gold-surface/45 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#9A7B4F]">
                                                            {NOTE_META[noteItem.type].label}
                                                        </span>
                                                        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal-muted/60">
                                                            {noteItem.id}
                                                        </span>
                                                    </div>
                                                    <p className="mt-4 font-serif text-lg leading-snug text-[#9A7B4F]">{noteItem.title}</p>
                                                    <p className="mt-4 whitespace-pre-wrap font-korean text-[15px] leading-[1.9] text-charcoal-main">
                                                        {noteItem.content}
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2 sm:ml-4">
                                                    <button
                                                        onClick={() => handleJumpToNote(noteItem)}
                                                        className="inline-flex items-center gap-2 rounded-full border border-gold-border/20 bg-gold-surface/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A7B4F] transition-colors hover:bg-gold-surface/55 hover:text-charcoal-main"
                                                    >
                                                        Open
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteNote(noteItem)}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <NoteEditor activeVerseId={activeVerseId} note={note} setNote={setNote} />
                            <ReflectionActions
                                showExportMenu={showExportMenu}
                                setShowExportMenu={setShowExportMenu}
                                handleExportCurrent={handleExportCurrent}
                                handleExportAll={handleExportAll}
                                handleSave={handleSave}
                                isSaving={isSaving}
                            />
                        </>
                    )}
                </div>
            </aside>
        </>
    );
};

export default React.memo(RightSidebar, (prevProps, nextProps) => prevProps.activeVerseId === nextProps.activeVerseId);
