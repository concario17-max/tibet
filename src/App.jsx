import { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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
                <Router>
                    <Suspense fallback={null}>
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
            </UIProvider>
        </ThemeProvider>
    );
}

export default App;
