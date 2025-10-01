// upto/backend/src/modules/news/news.service.js
const newsModel = require('./news.model');
const eventModel = require('../events/event.model');
const fs = require('fs');
const path = require('path');

const service = {};

service.getNewsByEventSlug = async (slug) => {
    const event = await eventModel.findBySlug(slug);
    if (!event) {
        throw new Error('رویداد با این آدرس یافت نشد.');
    }
    return await newsModel.findByEventId(event.id);
};

service.getAllNews = async () => {
    return await newsModel.findAll();
};

service.getNewsById = async (id) => {
    return await newsModel.findById(id);
};

service.getLatestNewsPerEvent = async (limit = 3) => {
    return await newsModel.findLatestNewsPerEvent(limit);
};

service.createNews = async (newsData, file) => {
    if (file) {
        newsData.image_url = `/uploads/${file.filename}`;
    }
    newsData.event_id = parseInt(newsData.event_id, 10);
    return await newsModel.create(newsData);
};

service.updateNews = async (id, newsData, file) => {
    const existingNews = await newsModel.findById(id);
    if (!existingNews) return null;

    const dataToUpdate = {
        title: newsData.title || existingNews.title,
        content: newsData.content || existingNews.content,
        tag: newsData.tag, // Allow tag to be updated or cleared
        image_url: existingNews.image_url,
    };

    if (file) {
        if (existingNews.image_url) {
            const oldPath = path.join(__dirname, '../../../public', existingNews.image_url);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        dataToUpdate.image_url = `/uploads/${file.filename}`;
    }
    return await newsModel.update(id, dataToUpdate);
};

service.deleteNews = async (id) => {
    const newsItem = await newsModel.findById(id);
    if (newsItem && newsItem.image_url) {
        const filePath = path.join(__dirname, '../../../public', newsItem.image_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return await newsModel.remove(id);
};

module.exports = service;