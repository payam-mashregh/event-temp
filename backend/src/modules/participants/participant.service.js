// upto/backend/src/modules/participants/participant.service.js
const participantModel = require('./participant.model');

const participantService = {};

participantService.getByEventSlug = async (slug) => {
    // In the future, you could add business logic here,
    // like checking if the event is active before fetching participants.
    return await participantModel.findByEventSlug(slug);
};

participantService.getAll = async () => {
    return await participantModel.findAll();
};

participantService.getById = async (id) => {
    return await participantModel.findById(id);
};

participantService.create = async (data) => {
    // Add validation or sanitation logic here if needed
    const existingParticipant = await participantModel.findByEmail(data.email);
    if (existingParticipant) {
        throw new Error('A participant with this email already exists.');
    }
    return await participantModel.create(data);
};

participantService.update = async (id, data) => {
    return await participantModel.update(id, data);
};

participantService.remove = async (id) => {
    return await participantModel.remove(id);
};

module.exports = participantService;