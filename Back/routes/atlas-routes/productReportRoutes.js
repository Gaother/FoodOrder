// Dans un nouveau fichier, par exemple reportRoutes.js
const express = require('express');
const Product = require('../../models/destockdis-models/product');
const PriceHistory = require('../../models/atlas-models/priceHistory');
const ProductReport = require('../../models/atlas-models/productReport'); // Assurez-vous que le chemin d'accès est correct
const router = express.Router();
const checkRole = require('../../middleware/roleMiddleware');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { Parser } = require('json2csv');

// Crée un rapport tous les produits
router.get('/gen', async (req, res) => {
    try {
        const products = await Product.find({})
        .populate({
            path: 'priceHistories',
            options: { limit: 5, sort: { $natural: -1 } } // Limite à 5 éléments et trie par ordre naturel décroissant
        })
        .populate({
            path: 'originHistory',
            options: { limit: 5, sort: { $natural: -1 } } // Limite à 5 éléments et trie par ordre naturel décroissant
        });
        // Fonction pour trouver le plus récent historique par site
        const findMostRecentHistory = (histories) => {
        return histories.reduce((acc, history) => {
            const site = history.site;
            if (!acc[site] || new Date(acc[site].date) < new Date(history.date)) {
            acc[site] = history;
            }
            return acc;
        }, {});
        };
        // Traitement pour chaque produit
        for (const product of products) {
            const mostRecentPriceHistories = findMostRecentHistory(product.priceHistories);
            const mostRecentOriginHistories = findMostRecentHistory(product.originHistory);
            console.log('mostRecentPriceHistories:', mostRecentPriceHistories);
            const countMostRecentPriceHistoriesNonZero = Object.values(mostRecentPriceHistories).filter(history => history.price > 0).length;
            let discount = false; // Initialiser discount à false
            // Vérifiez si un discount est appliqué dans les mostRecentPriceHistories
            Object.values(mostRecentPriceHistories).forEach(history => {
                if ((history.discountPrice && history.discountPrice !== 0) || (history.discountCode && history.discountCode !== "N/A")) {
                    discount = true; // Mettre à jour discount à true si condition remplie
                }
            });
            let leastCostPriceHistory = null;
            let leastCostOriginHistory = null;
            Object.values(mostRecentPriceHistories).forEach(history => {
                if (!leastCostPriceHistory || (history.price < leastCostPriceHistory.price && history.price > 0)) {
                leastCostPriceHistory = history;
                }
            });
            Object.values(mostRecentOriginHistories).forEach(history => {
                if (!leastCostOriginHistory || (history.price < leastCostOriginHistory.price && history.price > 0)) {
                leastCostOriginHistory = history;
                }
            });
            let lesscost = null;
            if (leastCostPriceHistory && leastCostOriginHistory && leastCostPriceHistory.price === 0) {
                lesscost = leastCostOriginHistory;
            } else if (leastCostPriceHistory && leastCostOriginHistory) {
                if (leastCostPriceHistory.price === leastCostOriginHistory.price){
                lesscost = leastCostOriginHistory; // Privilégier OriginHistory en cas d'égalité
                } else {
                lesscost = leastCostPriceHistory.price < leastCostOriginHistory.price ? leastCostPriceHistory : leastCostOriginHistory;
                }
            } else {
                lesscost = leastCostOriginHistory || leastCostPriceHistory; // Prendre celui qui n'est pas nul
            }
            let diff = leastCostPriceHistory && leastCostOriginHistory
                ? Math.abs(leastCostPriceHistory.price - leastCostOriginHistory.price)
                : 0;
            let diff_pourcent = diff && leastCostOriginHistory.price
                ? (diff / leastCostOriginHistory.price) * 100
                : 0;
            diff = Number(diff.toFixed(2));
            diff_pourcent = Number(diff_pourcent.toFixed(2));
            let lessOrigin = mostRecentOriginHistories.hasOwnProperty(lesscost.site) && mostRecentOriginHistories[lesscost.site]._id.equals(lesscost._id);
            if (lessOrigin == false && diff < 5) {
                lessOrigin = true
            }
            const newReport = new ProductReport({
                product: product._id,
                recentPriceHistories: Object.keys(mostRecentPriceHistories).map(key => mostRecentPriceHistories[key]._id),
                recentOriginHistory: Object.keys(mostRecentOriginHistories).map(key => mostRecentOriginHistories[key]._id),
                lessCost: lesscost ? lesscost._id : null,
                nearestConcurrent: leastCostPriceHistory && leastCostPriceHistory.price != 0 ? leastCostPriceHistory._id : null,
                nbConcurrent: countMostRecentPriceHistoriesNonZero,
                diff: diff,
                diff_pourcent: diff_pourcent,
                lessOrigin: lessOrigin,
                discount: discount
            });
            await newReport.save();
            // Ajouter l'ID du rapport créé au produit
            product.reportHistories.push(newReport._id);
            await product.save();
        }
        res.json({ message: 'Rapports créés et sauvegardés avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Générer un CSV pour le rapport le plus récent de chaque produit
router.get('/gen-csv', async (req, res) => {
    try {
        // Charger tous les produits et leur dernier ProductReport
        const products = await Product.find({}).populate({
            path: 'reportHistories',
            options: { sort: { 'date': -1 } }, // Assurez-vous de charger le dernier rapport en premier
            populate: [
                { path: 'recentPriceHistories', populate: { path: 'product' } },
                { path: 'recentOriginHistory', populate: { path: 'product' } },
                { path: 'lessCost', populate: { path: 'product' } }
            ],
            perDocumentLimit: 1 // Limite à 1 pour n'obtenir que le dernier rapport par produit
        });

        // Initialisation de la liste des sites uniques pour les colonnes
        let uniqueSites = new Set();
        products.forEach(product => {
            const latestReport = product.reportHistories[0];
            if (latestReport) {
                latestReport.recentOriginHistory.forEach(origin => {
                    uniqueSites.add(origin.site);
                });
            }
        });
        uniqueSites = Array.from(uniqueSites).sort();

        // Préparation des données pour le CSV
        const reportsData = products.map(product => {
            const latestReport = product.reportHistories[0];
            if (!latestReport) return null; // Sauter si aucun rapport n'est trouvé

            const dataStructure = {
                "Nom": product.nom,
                "Référence": product.reference,
            };

            // Préparation des colonnes Origin avec valeurs par défaut
            uniqueSites.forEach(site => {
                dataStructure[`Origin_${site}`] = "Non disponible";
            });

            // Remplir avec les données réelles
            latestReport.recentOriginHistory.forEach(origin => {
                dataStructure[`Origin_${origin.site}`] = origin.price || "Non disponible";
            });

            // Informations supplémentaires des PriceHistories
            latestReport.recentPriceHistories.forEach(priceHistory => {
                const siteName = `Concurrent_${priceHistory.site}`;
                dataStructure[siteName] = priceHistory.price || "Non disponible";
                dataStructure[`${siteName}_DiscountPrice`] = priceHistory.discountPrice || "Non disponible";
                dataStructure[`${siteName}_DiscountCode`] = priceHistory.discountCode || "Non disponible";
                dataStructure[`${siteName}_StockInfo`] = priceHistory.stockInfo || "Non disponible";
                dataStructure[`${siteName}_ShippingPrice`] = priceHistory.shippingPrice || "Non disponible";
            });

            // Champs finaux
            dataStructure['Diff'] = latestReport.diff || 0;
            dataStructure['Diff Pourcent'] = latestReport.diff_pourcent || 0;
            dataStructure['Less Cost Price'] = latestReport.lessCost ? latestReport.lessCost.price : "Non disponible";

            return dataStructure;
        }).filter(report => report !== null); // Filtrer les rapports non disponibles

        // Configuration et génération du CSV
        const csvParserOptions = { delimiter: ';', };
        const csvParser = new Parser(csvParserOptions);
        let csvData = csvParser.parse(reportsData);
        csvData = '\ufeff' + csvData; // Ajout du BOM UTF-8

        // Préparation du chemin et du nom de fichier
        const exportsDir = path.join(__dirname, '../../exports');
        const dateTimeStamp = moment().format('YYYY-MM-DD_HH-mm-ss');
        const fileName = `productReports_${dateTimeStamp}.csv`;
        const filePath = path.join(exportsDir, fileName);

        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }

        fs.writeFileSync(filePath, csvData, 'utf8');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.download(filePath, fileName, err => {
            if (err) {
                console.error('Erreur lors du téléchargement du fichier:', err);
                res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la génération du CSV:', error);
        res.status(500).json({ message: 'Erreur lors de la génération du CSV'});
    }
});

// Lire tous les rapports
router.post('/', async (req, res) => {
    try {
        const { name, size, page = 1, lesscost, maxdiff, maxdiffpourcent, discount, rate } = req.query;
        const id = req.body.id;
        const skip = (page - 1) * size;
        let reports = [];

        if (id) {
            const idsFilter = id.split(',').map(idTrimmed => idTrimmed.trim());
            reports = await ProductReport.find({
                '_id': { $in: idsFilter }
            })
            .populate('product')
            .populate('recentPriceHistories')
            .populate('recentOriginHistory')
            .populate('lessCost')
            .populate('nearestConcurrent');

        } else {
            // Récupérer tous les produits avec les conditions de recherche sur le nom, si spécifiées
            let productQuery = {};
            // Extension de la requête pour inclure la recherche par nom, si spécifiée
            if (name) {
                const nameLower = name.toLowerCase();
                productQuery['$or'] = [
                    { reference: { $regex: new RegExp(nameLower, 'i') } },
                    { nom: { $regex: new RegExp(nameLower, 'i') } }
                ];
            }
            const products = await Product.find(productQuery);
            // Récupérer le dernier reportHistory ID pour chaque produit
            const lastReportIds = products.map(product => {
                if (product.reportHistories.length > 0) {
                    return product.reportHistories[product.reportHistories.length - 1];
                }
                return null;
            }).filter(id => id !== null);
    
            // Récupérer les derniers reports pour chaque produit
            reports = await ProductReport.find({
                '_id': { $in: lastReportIds }
            })
            .populate('product')
            .populate('recentPriceHistories')
            .populate('recentOriginHistory')
            .populate('lessCost')
            .populate('nearestConcurrent');
        }

        // Appliquer les filtres après population
        if (name) {
            reports = reports.filter(report => 
                report.product.reference.toLowerCase().includes(name.toLowerCase()) ||
                report.product.nom.toLowerCase().includes(name.toLowerCase())
            );
        }

        if (['true', 'false'].includes(lesscost)) {
            const lesscostBool = lesscost === 'true';
            reports = reports.filter(report => report.lessOrigin === lesscostBool);
        }

        if (['true', 'false'].includes(discount)) {
            const discountBool = discount === 'true';
            reports = reports.filter(report => report.discount === discountBool);
        }

        if (['true', 'false'].includes(maxdiff)) {
            reports.sort((a, b) => maxdiff === 'true' ? b.diff - a.diff : a.diff - b.diff);
        }

        if (['true', 'false'].includes(maxdiffpourcent)) {
            reports.sort((a, b) => maxdiffpourcent === 'true' ? b.diff_pourcent - a.diff_pourcent : a.diff_pourcent - b.diff_pourcent);
        }

        let filteredSize = reports.length;
        let totalPages = 1;
        let paginatedReports = reports;

        if (rate) {
            switch (rate) {
                case 'comp':
                    reports = reports.filter(report => report.lessOrigin === true && report.diff > 2);
                    break;
                case 'equal':
                    reports = reports.filter(report => report.lessOrigin === true && report.diff <= 2);
                    break;
                case 'non-comp':
                    reports = reports.filter(report => report.lessOrigin === false && report.diff > 2);
                    break;
                case 'promo':
                    reports = reports.filter(report => report.discount === true);
                    break;
            }
        }

        if (id) {
            const idsFilter = id.split(',').map(idTrimmed => idTrimmed.trim());
            reports = reports.filter(report => idsFilter.includes(report._id.toString()));
        }

        if (size) {
            filteredSize = reports.length;
            totalPages = Math.ceil(filteredSize / Number(size));
            paginatedReports = reports.slice(skip, skip + Number(size));
        }

        res.json({
            infos: {
                totalfilteredproducts: filteredSize,
                totalpages: totalPages,
            },
            products: paginatedReports
        });
    } catch (error) {
        console.error('Error fetching product reports:', error);
        res.status(500).json({ message: 'Error fetching product reports' });
    }
});


// Lire plusieurs rapports spécifiques par leurs ID
router.get('/:ids', checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const ids = req.params.ids.split(',').map(id => id.trim());
        const reports = await ProductReport.find({
            '_id': { $in: ids }
        })
        .populate('product')
        .populate('recentPriceHistories')
        .populate('recentOriginHistory')
        .populate('lessCost')
        .populate('nearestConcurrent');

        if (!reports.length) {
            return res.status(404).json({ message: 'Rapports non trouvés' });
        }
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
  

  
// Supprimer un rapport
router.delete('/:id', checkRole(['admin', 'manager']), async (req, res) => {
    try {
        await ProductReport.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rapport supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
  

module.exports = router;
