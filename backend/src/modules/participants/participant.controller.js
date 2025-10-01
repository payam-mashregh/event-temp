// upto/backend/src/modules/participants/participant.controller.js
const participantService = require('./participant.service');

const participantController = {};

participantController.getParticipantsByEventSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const participants = await participantService.getByEventSlug(slug);
        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching participants for the event', error: error.message });
    }
};

participantController.getAllParticipants = async (req, res) => {
    try {
        const participants = await participantService.getAll();
        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all participants', error: error.message });
    }
};

participantController.createParticipant = async (req, res) => {
    try {
        const newParticipant = await participantService.create(req.body);
        res.status(201).json(newParticipant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = participantController;