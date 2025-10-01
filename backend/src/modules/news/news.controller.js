// upto/backend/src/modules/news/news.controller.js
const newsService = require('./news.service');

const newsController = {};

newsController.getNewsByEventSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const news = await newsService.getNewsByEventSlug(slug);
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news for the event', error: error.message });
    }
};

newsController.getAllNews = async (req, res) => {
    try {
        const allNews = await newsService.getAllNews();
        res.json(allNews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

newsController.getNewsById = async (req, res) => {
    try {
        const news = await newsService.getNewsById(req.params.id);
        if (news) res.json(news);
        else res.status(404).json({ message: 'News not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

newsController.getLatestNewsPerEvent = async (req, res) => {
    try {
        const latestNews = await newsService.getLatestNewsPerEvent();
        res.json(latestNews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

newsController.createNews = async (req, res) => {
    try {
        const newNews = await newsService.createNews(req.body, req.file);
        res.status(201).json(newNews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

newsController.updateNews = async (req, res) => {
    try {
        const updatedNews = await newsService.updateNews(req.params.id, req.body, req.file);
        if (updatedNews) res.json(updatedNews);
        else res.status(404).json({ message: 'News not found' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

newsController.deleteNews = async (req, res) => {
    try {
        const result = await newsService.deleteNews(req.params.id);
        if (result) res.status(204).send();
        else res.status(404).json({ message: 'News not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = newsController;