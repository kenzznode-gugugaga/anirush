// =====================================================
// ANIRUSH BACKEND - Anime Streaming Scraper API
// Menggunakan library animob - Verified Working [citation:1]
// =====================================================

const express = require('express');
const cors = require('cors');
const { ANIME } = require('animob');

// Inisialisasi provider - AnimePahe lebih stabil dengan Kwik extractor [citation:1][citation:10]
const provider = new ANIME.AnimePahe();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// =========================================
// ENDPOINTS
// =========================================

// 1. Homepage / Top Airing (menggunakan search kosong untuk data populer)
app.get('/api/home', async (req, res) => {
    try {
        // Gunakan library Anilist dari animob untuk trending
        const { META } = require('animob');
        const anilist = new META.Anilist();
        const trending = await anilist.fetchTrendingAnime();
        res.json(trending);
    } catch (error) {
        console.error('Home error:', error);
        res.status(500).json({ error: 'Failed to fetch home data' });
    }
});

// 2. Search Anime
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: 'Query parameter "q" required' });
        
        const results = await provider.search(query);
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Get Anime Info (Episode List)
app.get('/api/info/:id', async (req, res) => {
    try {
        const info = await provider.fetchAnimeInfo(req.params.id);
        res.json(info);
    } catch (error) {
        console.error('Info error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Get Streaming URL
app.get('/api/watch/:episodeId', async (req, res) => {
    try {
        const sources = await provider.fetchEpisodeSources(req.params.episodeId);
        res.json(sources);
    } catch (error) {
        console.error('Watch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 5. Get Available Servers (Opsional - untuk UI selector)
app.get('/api/servers/:episodeId', async (req, res) => {
    try {
        const sources = await provider.fetchEpisodeSources(req.params.episodeId);
        res.json({
            servers: sources.sources.map((s, i) => ({
                name: `Server ${i + 1}`,
                url: s.url,
                quality: s.quality
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =========================================
// START SERVER
// =========================================
app.listen(PORT, () => {
    console.log(`🔥 AniRush Backend running on port ${PORT}`);
    console.log(`   Base URL: http://localhost:${PORT}`);
});
