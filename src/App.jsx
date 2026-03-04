import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chapter from './pages/Chapter';
import Album from './pages/Album';
import Text from './pages/Text';
import { UIProvider } from './context/UIContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    // Global player state to maintain audio across route changes
    const [playbackRequest, setPlaybackRequest] = useState(null);

    return (
        <ThemeProvider>
            <UIProvider>
                <Router>
                    <Routes>
                        <Route element={<Layout playbackRequest={playbackRequest} setPlaybackRequest={setPlaybackRequest} />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/text" element={<Text />} />
                            <Route path="/chapter" element={<Chapter />} />
                            <Route path="/album" element={<Album />} />
                        </Route>
                    </Routes>
                </Router>
            </UIProvider>
        </ThemeProvider>
    );
}

export default App;
