






// FICHIER PLUS UTILISÉ










const express = require('express');
const Brand = require('../../models/destockdis-models/brand');
const checkRole = require('../../middleware/roleMiddleware');
const router = express.Router();

// Créer une nouvelle marque
router.post('/', checkRole(['superadmin']), async (req, res) => {
    const { brand } = req.body;

    try {
        const BrandModel = req.db.model('Brand', Brand.schema);

        const newBrand = await BrandModel.create({ brand });
        res.status(201).json(newBrand);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la création de la marque');
    }
});

// Lire toutes les marques
router.get('/', async (req, res) => {
    try {
        const BrandModel = req.db.model('Brand', Brand.schema);

        const brands = await BrandModel.find().sort({ brand: 1 });
        res.json(brands);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération des marques');
    }
});

// Lire une marque spécifique par son ID
router.get('/:id', async (req, res) => {
    try {
        const BrandModel = req.db.model('Brand', Brand.schema);

        const brand = await BrandModel.findById(req.params.id);
        if (!brand) {
            return res.status(404).send('Marque non trouvée');
        }
        res.json(brand);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération de la marque');
    }
});

// Mettre à jour une marque par son ID
router.put('/:id', checkRole(['superadmin']), async (req, res) => {
    const { brand } = req.body;

    try {
        const BrandModel = req.db.model('Brand', Brand.schema);

        let existingBrand = await BrandModel.findById(req.params.id);
        if (!existingBrand) {
            return res.status(404).send('Marque non trouvée');
        }

        if (brand) existingBrand.brand = brand;

        await existingBrand.save();
        res.json(existingBrand);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la mise à jour de la marque');
    }
});

// Supprimer une marque par son ID
router.delete('/:id', checkRole(['admin', 'superadmin']), async (req, res) => {
    try {
        const BrandModel = req.db.model('Brand', Brand.schema);

        const brand = await BrandModel.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).send('Marque non trouvée');
        }

        res.json({ msg: 'Marque supprimée' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la suppression de la marque');
    }
});

module.exports = router;