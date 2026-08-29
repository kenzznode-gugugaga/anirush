const express = require('express');
const cors = require('cors');
const { ANIME } = require('@consumet/extensions');

const app = express();
app.use(cors());
app.use(express.json());

// Pilih provider: Gogoanime (paling sering dipakai)
const gogo = new ANIME.Gogoanime();

// Search
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: 'Query required' });
        const results = await gogo.search(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Info (episode list)
app.get('/api/info/:id', async (req, res) => {
    try {
        const info = await gogo.fetchAnimeInfo(req.params.id);
        res.json(info);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Stream
app.get('/api/watch/:episodeId', async (req, res) => {
    try {
        const sources = await gogo.fetchEpisodeSources(req.params.episodeId);
        res.json(sources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AniRush Backend running on port ${PORT}`));
