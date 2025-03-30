const express = require('express');
const ProductSpecifications = require('../../models/destockdis-models/productSpecifications');
const ProductSpecificationsValue = require('../../models/destockdis-models/productSpecificationsValue');
const user = require('../../models/user');
const checkRole = require('../../middleware/roleMiddleware');
const router = express.Router();

// Fonction pour gérer la génération d'index
const generateIndex = async (ProductSpecificationsModel) => {
    try {
        const lastSpec = await ProductSpecificationsModel.findOne().sort({ index: -1 });
        return lastSpec ? lastSpec.index + 1 : 1;
    } catch (error) {
        console.error('Erreur lors de la génération de l\'index:', error);
        throw new Error('Impossible de générer l\'index');
    }
};

// Créer une nouvelle spécification de produit
router.post('/', checkRole(['admin', 'superadmin']), async (req, res) => {
    const { name, values } = req.body;
    try {
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);

        const index = await generateIndex(ProductSpecificationsModel); // Générer l'index

        const newSpecification = await ProductSpecificationsModel.create({
            name,
            values,
            index
        });

        res.status(201).json(newSpecification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Récupérer toutes les spécifications de produit
router.get('/', async (req, res) => {
    try {
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);
        const productSpecificationsValue = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);

        const specifications = await ProductSpecificationsModel.find().populate({
            path: 'values',
            model: productSpecificationsValue // Spécifiez explicitement le modèle Brand à utiliser
        });
        res.json(specifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour récupérer les valeurs associées à une spécification de produit
router.get('/value/:specificationId', async (req, res) => {
    try {
        const { specificationId } = req.params;
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);

        // Trouver la spécification de produit par ID et peupler ses valeurs
        const specification = await ProductSpecificationsModel.findById(specificationId).populate('values');
        
        if (!specification) {
            return res.status(404).json({ message: 'Spécification de produit non trouvée' });
        }

        res.json(specification.values); // Renvoie les valeurs associées
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Récupérer une spécification de produit spécifique
router.get('/:id', async (req, res) => {
    try {
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);

        const specification = await ProductSpecificationsModel.findById(req.params.id);
        if (!specification) {
            return res.status(404).json({ message: 'Spécification de produit non trouvée' });
        }
        res.json(specification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour une spécification de produit
router.put('/:id', checkRole(['admin', 'superadmin']), async (req, res) => {
    try {
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);

        const specification = await ProductSpecificationsModel.findById(req.params.id);
        if (!specification) {
            return res.status(404).json({ message: 'Spécification de produit non trouvée' });
        }

        if (req.body.name != null) {
            specification.name = req.body.name;
        }

        if (req.body.index != null && req.body.index !== specification.index) {
            // Gérer le décalage des index lors de la modification
            const originalIndex = specification.index;
            const newIndex = req.body.index;

            if (newIndex < originalIndex) {
                await ProductSpecificationsModel.updateMany(
                    { index: { $gte: newIndex, $lt: originalIndex } },
                    { $inc: { index: 1 } }
                );
            } else if (newIndex > originalIndex) {
                await ProductSpecificationsModel.updateMany(
                    { index: { $gt: originalIndex, $lte: newIndex } },
                    { $inc: { index: -1 } }
                );
            }

            specification.index = newIndex;
        }

        const updatedSpecification = await specification.save();
        res.json(updatedSpecification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer une spécification de produit
router.delete('/:id', checkRole(['admin', 'superadmin']), async (req, res) => {
    try {
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);
        const ProductSpecificationsValueModel = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);
        const UserModel = req.db.model('User', user.schema);

        const specification = await ProductSpecificationsModel.findById(req.params.id);
        if (!specification) {
            return res.status(404).json({ message: 'Spécification de produit non trouvée' });
        }
        const deletedIndex = specification.index;
        const valueIds = specification.values;
        // Supprimer les valeurs associées
        await ProductSpecificationsValueModel.deleteMany({ _id: { $in: valueIds } });
        // Supprimer la spécification
        await ProductSpecificationsModel.deleteOne({ _id: req.params.id });
        // Réajuster les index après suppression
        await ProductSpecificationsModel.updateMany(
            { index: { $gt: deletedIndex } },
            { $inc: { index: -1 } }
        );
        // Retirer les IDs des valeurs de la liste `values` dans les utilisateurs associés
        await UserModel.updateMany(
            { 'values': { $in: valueIds } },
            { $pull: { values: { $in: valueIds } } },
            { multi: true }
        )
        res.json({ message: 'Spécification de produit et ses valeurs associées supprimées' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la spécification de produit:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;