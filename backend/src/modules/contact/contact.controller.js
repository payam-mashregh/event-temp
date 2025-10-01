// upto/backend/src/modules/contact/contact.controller.js
const contactService = require('./contact.service');

const contactController = {};

contactController.getAllMessagesForEventSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const messages = await contactService.getAllByEventSlug(slug);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages for the event', error: error.message });
    }
};

contactController.createMessage = async (req, res) => {
    try {
        // Basic validation
        const { event_id, full_name, email, message } = req.body;
        if (!event_id || !full_name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newMessage = await contactService.create(req.body);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: 'Error creating message', error: error.message });
    }
};

contactController.markMessageAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMessage = await contactService.updateReadStatus(id, true);
        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.json(updatedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error updating message status', error: error.message });
    }
};

contactController.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await contactService.remove(id);
        if (!result) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
};

module.exports = contactController;