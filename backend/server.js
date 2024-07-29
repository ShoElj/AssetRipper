const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const baseUrl = new URL(url);

    const images = [];
    const videos = [];

    $('img').each((i, el) => {
      let src = $(el).attr('src');
      if (src) {
        src = new URL(src, baseUrl).href;
        images.push(src);
      }
    });

    $('video').each((i, el) => {
      let src = $(el).attr('src');
      if (src) {
        src = new URL(src, baseUrl).href;
        videos.push(src);
      }
    });

    res.json({ images, videos });
  } catch (error) {
    console.error('Error scraping website:', error);
    res.status(500).json({ error: 'Failed to scrape website.' });
  }
});
