const express = require('express');
const router = express.Router();
const Settings = require('../../models/settings');
const checkRole = require('../../middleware/roleMiddleware');

// Récupérer les paramètres (il ne doit y en avoir qu'un)
router.get('/', checkRole(['admin', 'superadmin']), async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.status(404).json({ message: 'Paramètres non trouvés' });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mettre à jour les paramètres (ou créer s'ils n'existent pas)
router.put('/', checkRole(['admin', 'superadmin']), async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
