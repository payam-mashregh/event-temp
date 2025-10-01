// upto/backend/src/modules/registrations/registration.routes.js
const express = require('express');
const registrationService = require('./registration.service');

const router = express.Router();

router.post('/submit/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const result = await registrationService.registerParticipant(slug, req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;