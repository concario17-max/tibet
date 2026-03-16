import { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PasswordGuard from './components/PasswordGuard';
import { UIProvider } from './context/UIContext';
import { ThemeProvider } from './context/ThemeContext';

const Home = lazy(() => import('./pages/Home'));
const Chapter = lazy(() => import('./pages/Chapter'));
const Album = lazy(() => import('./pages/Album'));
const Text = lazy(() => import('./pages/Text'));

function App() {
    // Global player state to maintain audio across route changes
    const [playbackRequest, setPlaybackRequest] = useState(null);

    return (
        <ThemeProvider>
            <UIProvider>
                <PasswordGuard>
                    <Router>
                        <Suspense
                            fallback={
                                <div className="min-h-screen bg-sand-primary dark:bg-dark-bg text-charcoal-main dark:text-dark-text-primary flex items-center justify-center px-6">
                                    <div className="text-center">
                                        <p className="text-sm uppercase tracking-[0.35em] text-gold-deep/80 dark:text-gold-light/80">Loading</p>
                                        <p className="mt-4 text-base md:text-lg">Preparing the next reading space...</p>
                                    </div>
                                </div>
                            }
                        >
                            <Routes>
                                <Route element={<Layout playbackRequest={playbackRequest} setPlaybackRequest={setPlaybackRequest} />}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/text" element={<Text />} />
                                    <Route path="/chapter" element={<Chapter />} />
                                    <Route path="/album" element={<Album />} />
                                </Route>
                            </Routes>
                        </Suspense>
                    </Router>
                </PasswordGuard>
            </UIProvider>
        </ThemeProvider>
    );
}

export default App;
