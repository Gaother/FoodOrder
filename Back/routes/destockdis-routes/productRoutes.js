const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const Product = require('../../models/destockdis-models/product');
const Brand = require('../../models/destockdis-models/brand');
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
        const BrandModel = req.db.model('brand', Brand.schema);
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

        // Filtrage par marques
        if (filters.Marques && filters.Marques.length > 0) {
            const brands = await BrandModel.find({ brand: { $in: filters.Marques } });
            const brandIds = brands.map(brand => brand._id); // Obtenir les IDs des marques
            filterQuery.brand = { $in: brandIds };
        }
        // Filtrage par prix minimum et maximum
        if (filters.minprice || filters.maxprice) {
            filterQuery.price = {};
            if (filters.minprice) filterQuery.price.$gte = parseFloat(filters.minprice);
            if (filters.maxprice) filterQuery.price.$lte = parseFloat(filters.maxprice);
        }

        // Filtrage par recherche (search dans reference, designation, ean)
        if (filters.search) {
            const searchRegex = new RegExp(filters.search, 'i'); // Insensible à la casse
            filterQuery.$or = [
            { reference: searchRegex },
            { designation: searchRegex },
            { ean: searchRegex }
            ];
        }

                // Filtrage par spécifications (ex: Type de produit, Largeur, Taille de produit)
        const specificationsFilters = [];
        
        for (const [key, values] of Object.entries(filters)) {
            if (key !== 'Marques' && key !== 'minprice' && key !== 'maxprice' && key !== 'search') {
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
        if (user.role !== 'admin' && user.role !== 'superadmin') {
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
        }).populate({
            path: 'brand',
            model: BrandModel
        });
        // Trier les produits
        const sortedProducts = products.sort((a, b) => {
            // Obtenir les valeurs de "Taille de produit"
            const aSize = a.specifications.find(spec => spec.specification.name === 'Taille de produit');
            const bSize = b.specifications.find(spec => spec.specification.name === 'Taille de produit');
            const sizeOrder = { 'petit electromenager': 1, 'gros electromenager': 2, 'encastrable': 3 };
            const aSizeOrder = sizeOrder[aSize?.key] || 4; // 4 si pas trouvé
            const bSizeOrder = sizeOrder[bSize?.key] || 4;
            if (aSizeOrder !== bSizeOrder) return aSizeOrder - bSizeOrder;
            // Si la taille est la même, trier par "Type de produit"
            const aType = a.specifications.find(spec => spec.specification.name === 'Type de produit');
            const bType = b.specifications.find(spec => spec.specification.name === 'Type de produit');
            return (aType?.value || '').localeCompare(bType?.value || '', undefined, { sensitivity: 'base' });
        
        });
        
        // Retourner les produits filtrés et les stats maxPrice/minPrice
        // Logger l'historique de la recherche
        req.user = { _id: req.user._id }; // Assurer que req.user existe
        await userHistoryLogger('recherche')(req);
        res.json({ products: sortedProducts, maxPrice, minPrice });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Créer un nouveau produit
router.post('/', checkRole(['admin', 'superadmin']), async (req, res) => {
    const { brand, ean, reference, designation, price, stock, reception, comment, specifications } = req.body;

    try {
        const ProductModel = req.db.model('Product', Product.schema);
        

        const product = await ProductModel.create({
            brand,
            ean,
            reference,
            designation,
            price,
            stock,
            reception,
            comment,
            specifications
        });

        res.status(201).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la création du produit');
    }
});

router.post('/update-stock', checkRole(['admin', 'superadmin']), upload.single('csv'), async (req, res) => {
    if (!req.file) {
        console.log('Aucun fichier fourni');
        return res.status(400).json({ message: 'Aucun fichier fourni' });
    }
    // const ProductModel = req.db.model('Product', Product.schema);
    // const allProducts = await ProductModel.find();
    // for (const product of allProducts) {
    //     await product.save();
    // }

    const tempPath = req.file.path;
    const targetPath = tempPath + '.csv';
    fs.renameSync(tempPath, targetPath);
    try {
        const foreignProduct = [];
        fs.createReadStream(targetPath)
            .pipe(iconv.decodeStream('win1252'))
            .pipe(csv({ separator: ';' }))
            .on('data', async (row) => {
                const depotStock = row['Dépôt de stock'];
                const reference = row['Référence'];
                const quantity = parseInt(row['Stock disponible'], 10);
                const ProductModel = req.db.model('Product', Product.schema);
                if (!depotStock || !reference) {
                    return;
                }
                if (depotStock !== 'DEPOT PRINCIPAL') {
                    return;
                }
                const normalizedReference = reference.replace(/[\s/-]/g, '').toLowerCase();
                const product = await ProductModel.findOneAndUpdate(
                    { normalizedReference: normalizedReference },
                    { stock: quantity },
                );
                if (product && quantity <= 0) {
                    product.active = false;
                    await product.save();
                } else if (product && quantity > 0) {
                    product.active = true;
                    await product.save();
                } else if (quantity > 0) {
                    console.log('Produit non trouvé:', reference);
                    foreignProduct.push(reference);
                }
            })
            .on('end', async () => {
                console.log('Mise à jour du stock terminée');
                const fileName = `ProduitInconnu.txt`;
                const filePath = path.join(__dirname, "../../exports/", fileName);
                if (foreignProduct.length > 0) {                    
                    fs.writeFileSync(filePath, foreignProduct.join('\n'), 'utf8');
                    res.download(filePath, fileName, (err) => {
                        if (err) {
                            console.error('Error downloading the file:', err);
                            res.status(500).send('Error generating file');
                        } else {
                            fs.unlinkSync(filePath);
                        }
                    });
                } else {
                    res.status(200).json({ message: 'Mise à jour du stock terminée' });
                }
                fs.unlinkSync(targetPath);
            });
    } catch (err) {
        console.error(err.message);
        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
        }
        res.status(500).send('Erreur lors de la mise à jour du stock' + err.message);
    } finally {
        
    }
});

// Lire tous les produits
router.get('/', async (req, res) => {
    try {
        const ProductModel = req.db.model('Product', Product.schema);
        const brand = req.db.model('brand', Brand.schema);
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
        }).populate({
            path: 'brand',
            model: brand // Spécifiez explicitement le modèle Brand à utiliser
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
router.put('/:id', checkRole(['admin', 'superadmin']), async (req, res) => {
    const { brand, ean, reference, designation, price, stock, reception, comment, specifications, active } = req.body;

    try {
        const ProductModel = req.db.model('Product', Product.schema);

        let product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Produit non trouvé');
        }

        // Mettre à jour les champs
        if (brand) product.brand = brand;
        if (ean) product.ean = ean;
        if (reference) product.reference = reference;
        if (designation) product.designation = designation;
        if (price) product.price = price;
        if (stock) product.stock = stock;
        if (reception) product.reception = reception;
        if (comment || comment === "") product.comment = comment;
        if (specifications) product.specifications = specifications;
        if (active === false) product.active = false;
        if (active === true) product.active = true;

        if (parseInt(stock, 10) <= 0) product.active = false;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la mise à jour du produit');
    }
});

// Supprimer un produit par son ID
router.delete('/:id', checkRole(['admin', 'superadmin']), async (req, res) => {
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