// upto/backend/src/modules/forms/form.controller.js
const formService = require('./form.service');

const formController = {};

formController.getFormByEventId = async (req, res) => {
    try {
        const { eventId } = req.params;
        const form = await formService.getByEventId(eventId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found for this event' });
        }
        res.json(form);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching form', error: error.message });
    }
};

formController.createOrUpdateForm = async (req, res) => {
    try {
        const { eventId } = req.params;
        const form = await formService.createOrUpdate(eventId, req.body);
        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({ message: 'Error saving form', error: error.message });
    }
};

formController.getFormSubmissions = async (req, res) => {
    try {
        const { formId } = req.params;
        const submissions = await formService.getSubmissions(formId);
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
};

formController.submitForm = async (req, res) => {
    try {
        const { formId } = req.params;
        const submission = await formService.createSubmission(formId, req.body);
        res.status(201).json(submission);
    } catch (error) {
        res.status(400).json({ message: 'Error submitting form', error: error.message });
    }
};


module.exports = formController;