const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const Product = require('../../models/destockdis-models/product');
const ProductSpecificationsValue = require('../../models/destockdis-models/productSpecificationsValue');
const ProductSpecifications = require('../../models/destockdis-models/productSpecifications');
const User = require('../../models/user');
const checkRole = require('../../middleware/roleMiddleware');
const userHistoryLogger = require('../../middleware/userHistoryMiddleware');
const newsletterService = require('../../services/newsletter.service');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

function forceUTF8(str) {
    return Buffer.from(str, 'utf8').toString('utf8');
}

function removeAccents(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Route pour filtrer les produits
router.post('/filter', async (req, res) => {
    try {
        const UserModel = req.db.model('User', User.schema);
        if (!req.user || !req.user.role)
        return res.status(401).send('Utilisateur non authentifié ou rôle non défini');
        const user = await UserModel.findById(req.user.userId);
        if (!user)
        return res.status(404).send('Utilisateur non trouvé');

        
        const ProductModel = req.db.model('Product', Product.schema);
        const ProductSpecificationsValueModel = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);
        const ProductSpecificationsModel = req.db.model('productSpecifications', ProductSpecifications.schema);
        // Calculer le prix maximum et minimum sur tous les produits avant filtrage
        const priceStats = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    maxPrice: { $max: "$price" },
                    minPrice: { $min: "$price" }
                }
            }
        ]);

        const maxPrice = priceStats[0]?.maxPrice || 0;
        const minPrice = priceStats[0]?.minPrice || 0;

        // Récupérer les filtres envoyés dans le body
        const filters = req.body;
        let filterQuery = {}; // Objet pour construire la requête de filtre

        // Filtrage par prix minimum et maximum
        if (filters.minprice || filters.maxprice) {
            filterQuery.price = {};
            if (filters.minprice) filterQuery.price.$gte = parseFloat(filters.minprice);
            if (filters.maxprice) filterQuery.price.$lte = parseFloat(filters.maxprice);
        }

        // Filtrage par recherche (search dans reference, nom)
        if (filters.search) {
            const searchRegex = new RegExp(filters.search, 'i'); // Insensible à la casse
            filterQuery.$or = [
            { reference: searchRegex },
            { nom: searchRegex }
            ];
        }

        // Filtrage par spécifications (ex: Sauce, Piquant, etc. dans le body)
        const specificationsFilters = [];
        
        for (const [key, values] of Object.entries(filters)) {
            if (key !== 'minprice' && key !== 'maxprice' && key !== 'search') {
                // Trouver les IDs des valeurs de spécifications correspondant aux valeurs données
                const specValues = await ProductSpecificationsValueModel.find({
                    key: { $in: Array.isArray(values) ? values : [values] }
                });
        
                if (specValues.length > 0) {
                    const specValueIds = specValues.map(spec => spec._id);
                    specificationsFilters.push({ specifications: { $in: specValueIds } });
                }
            }
        }
                
        // Si des filtres de spécifications existent, ajouter un $and
        if (specificationsFilters.length > 0) {
            filterQuery.$and = specificationsFilters;
        }
        if (user.role !== 'superadmin') {
            filterQuery.active = true; // Filtrer les produits actifs uniquement si pas un admin
        }
        
        // Récupérer les produits filtrés
        const products = await ProductModel.find(filterQuery).populate({
            path: 'specifications',
            model: ProductSpecificationsValueModel,
            populate: {
                path: 'specification',
                model: ProductSpecificationsModel
            }
        });
        
        // Retourner les produits filtrés et les stats maxPrice/minPrice
        // Logger l'historique de la recherche
        req.user = { _id: req.user._id }; // Assurer que req.user existe
        await userHistoryLogger('recherche')(req);
        res.json({ products: products, maxPrice, minPrice });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Créer un nouveau produit
router.post('/', upload.single('image'), checkRole(['superadmin']), async (req, res) => {
    const { reference, nom, price, reception, comment, specifications } = req.body;
    let imageUrl = null;

    try {
        const ProductModel = req.db.model('Product', Product.schema);

        if (req.file) {
            const filePath = req.file.path;

            const data = fs.readFileSync(filePath); // Lecture synchrone du fichier
            const base64Image = data.toString('base64'); // Conversion en base64
            const mimeType = req.file.mimetype;

            fs.unlinkSync(filePath); // Supprimer le fichier après lecture

            imageUrl = `data:${mimeType};base64,${base64Image}`;
        }

        const product = await ProductModel.create({
            reference,
            nom,
            price,
            reception,
            comment,
            imageUrl,
            specifications
        });

        res.status(201).json(product);
    } catch (err) {
        console.log(err)
        console.error(err.message);
        res.status(500).send('Erreur lors de la création du produit');
    }
});

// Lire tous les produits
router.get('/', async (req, res) => {
    try {
        const ProductModel = req.db.model('Product', Product.schema);
        const productSpecificationsValue = req.db.model('productSpecificationsValue', ProductSpecificationsValue.schema);
        const productSpecifications = req.db.model('productSpecifications', ProductSpecifications.schema);

        // Calculer le prix maximum et minimum
        const priceStats = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    maxPrice: { $max: "$price" },
                    minPrice: { $min: "$price" }
                }
            }
        ]);

        const maxPrice = priceStats[0]?.maxPrice || 0;
        const minPrice = priceStats[0]?.minPrice || 0;

        // Populate la liste "specifications" et dans chaque spécification, populate l'object_id "specification"
        const products = await ProductModel.find().populate({
            path: 'specifications',
            model: productSpecificationsValue,
            populate: {
                path: 'specification',
                model: productSpecifications // Assurez-vous que le modèle 'Specification' est correct
            }
        });
        res.json({ products, maxPrice, minPrice });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération des produits');
    }
});

router.get('/download-excel', async (req, res) => {
    try {
        const excelPath = await newsletterService.generateProductExcel(req.db);
        const fileName = path.basename(excelPath);

        res.download(excelPath, `${fileName}.xlsx`, (err) => {
            if (err) {
                console.error('Error downloading the Excel:', err);
                res.status(500).send('Error generating PDF');
            } else {
                // Supprimer le fichier après le téléchargement
                fs.unlink(excelPath, (unlinkErr) => {
                    if (unlinkErr) {
                    console.error('Error deleting the Excel file:', unlinkErr);
                    }
                });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération du panier');
    }
});


// Lire un produit spécifique par son ID
router.get('/:id', async (req, res) => {
    try {
        const ProductModel = req.db.model('Product', Product.schema);

        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Produit non trouvé');
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération du produit');
    }
});

// Mettre à jour un produit par son ID
router.put('/:id', upload.single('image'), checkRole(['superadmin']), async (req, res) => {
    const { reference, nom, price, reception, comment, specifications, active } = req.body;
    let imageUrl = null;
    try {
        const ProductModel = req.db.model('Product', Product.schema);

        if (req.file) {
            const filePath = req.file.path;

            const data = fs.readFileSync(filePath); // Lecture synchrone du fichier
            const base64Image = data.toString('base64'); // Conversion en base64
            const mimeType = req.file.mimetype;

            fs.unlinkSync(filePath); // Supprimer le fichier après lecture

            imageUrl = `data:${mimeType};base64,${base64Image}`;
        }

        let product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Produit non trouvé');
        }

        // Mettre à jour les champs
        if (reference) product.reference = reference;
        if (nom) product.nom = nom;
        if (price) product.price = price;
        if (reception) product.reception = reception;
        if (comment || comment === "") product.comment = comment;
        if (imageUrl) product.imageUrl = imageUrl;
        if (specifications) product.specifications = specifications;
        if (active) product.active = active;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la mise à jour du produit');
    }
});

// Supprimer un produit par son ID
router.delete('/:id', checkRole(['superadmin']), async (req, res) => {
    try {
        const ProductModel = req.db.model('Product', Product.schema);

        const product = await ProductModel.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send('Produit non trouvé');
        }

        res.json({ msg: 'Produit supprimé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la suppression du produit');
    }
});

module.exports = router;