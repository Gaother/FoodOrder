const express = require('express');
const ProductSpecificationsValue = require('../../models/destockdis-models/productSpecificationsValue');
const ProductSpecifications = require('../../models/destockdis-models/productSpecifications');  // Ajout du modèle des spécifications
const user = require('../../models/user');
const checkRole = require('../../middleware/roleMiddleware');
const router = express.Router();

// Créer une nouvelle valeur de spécification de produit
router.post('/', checkRole(['superadmin']), async (req, res) => {
    const { value, specification } = req.body;

    try {
        const ProductSpecificationsValueModel = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);

        // Créer la nouvelle valeur
        const newValue = await ProductSpecificationsValueModel.create({
            value,
            specification
        });

        // Ajouter l'ID de la nouvelle valeur à la spécification associée
        await ProductSpecificationsModel.findByIdAndUpdate(
            specification,
            { $push: { values: newValue._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(201).json(newValue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Récupérer toutes les valeurs de spécifications de produit
router.get('/', async (req, res) => {
    try {
        const ProductSpecificationsValueModel = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);

        const values = await ProductSpecificationsValueModel.find().populate('specification');
        res.json(values);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Récupérer une valeur de spécification de produit spécifique
router.get('/:id', async (req, res) => {
    try {
        const ProductSpecificationsValueModel = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);

        const value = await ProductSpecificationsValueModel.findById(req.params.id).populate('specification');
        if (!value) {
            return res.status(404).json({ message: 'Valeur de spécification de produit non trouvée' });
        }
        res.json(value);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour une valeur de spécification de produit
router.put('/:id', checkRole(['superadmin']), async (req, res) => {
    try {
        const ProductSpecificationsValueModel = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);

        const value = await ProductSpecificationsValueModel.findById(req.params.id);
        if (!value) {
            return res.status(404).json({ message: 'Valeur de spécification de produit non trouvée' });
        }

        if (req.body.value != null) {
            value.value = req.body.value;
        }

        const updatedValue = await value.save();
        res.json(updatedValue);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer une valeur de spécification de produit
router.delete('/:id', checkRole(['superadmin']), async (req, res) => {
    try {
        const ProductSpecificationsValueModel = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);
        const UserModel = req.db.model('User', user.schema);

        const value = await ProductSpecificationsValueModel.findById(req.params.id);
        if (!value) {
            console.log('Valeur de spécification de produit non trouvée');
            return res.status(404).json({ message: 'Valeur de spécification de produit non trouvée' });
        }
        const specificationId = value.specification;
        // Supprimer la valeur
        await ProductSpecificationsValueModel.deleteOne({ _id: value._id });
        // Retirer l'ID de la valeur de la liste `values` dans la spécification associée
        await ProductSpecificationsModel.findByIdAndUpdate(
            specificationId,
            { $pull: { values: value._id } },
            { new: true, useFindAndModify: false }
        );
        // Retirer l'ID de la valeur de la liste `values` dans les utilisateurs associés
        await UserModel.updateMany(
            { 'values': value._id },
            { $pull: { values: value._id } },
            { multi: true }
        );
        res.json({ message: 'Valeur de spécification de produit supprimée' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la valeur de spécification de produit:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;