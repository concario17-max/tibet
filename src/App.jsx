import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chapter from './pages/Chapter';
import Album from './pages/Album';

function App() {
    // Global player state to maintain audio across route changes
    const [playbackRequest, setPlaybackRequest] = useState(null);

    return (
        <Router>
            <Routes>
                <Route element={<Layout playbackRequest={playbackRequest} setPlaybackRequest={setPlaybackRequest} />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/chapter" element={<Chapter />} />
                    <Route path="/album" element={<Album />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
