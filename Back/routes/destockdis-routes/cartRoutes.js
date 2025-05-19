const express = require('express');
const Cart = require('../../models/destockdis-models/cart');
const Product = require('../../models/destockdis-models/product');
const User = require ('../../models/user');
const checkRole = require('../../middleware/roleMiddleware');
const user = require('../../models/user');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const e = require('express');
const notificationLogger = require('../../middleware/userNotificationMiddleware');
const router = express.Router();

// Créer un nouveau panier
router.post('/', checkRole(['superadmin']), async (req, res) => {
    const { cart } = req.body;

    try {
        const CartModel = req.db.model('Cart', Cart.schema);

        const newCart = await CartModel.create({ cart });
        res.status(201).json(newCart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la création du panier');
    }
});

// Ajouter un produit à un panier
router.post('/product', checkRole(['superadmin', 'epitech', 'quadra', 'autre']), async (req, res) => {
    const { productID, productQTY, cartID, productPrice, specifications } = req.body;

    try {
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);
        let activeUserCart;
        if (cartID) {
            activeUserCart = await CartModel.findById(cartID);
            if (activeUserCart.adminValidated || activeUserCart.adminCanceled || activeUserCart.userCanceled) {
                return res.status(404).send('Panier déjà validé ou annulé');
            }
        } else {
            activeUserCart = await CartModel.findOne({ user: req.user.userId , adminValidated: false, adminCanceled: false, userValidated: false, userCanceled: false });
        }
        if (!activeUserCart) {
            activeUserCart = await CartModel.create({ 
                user: req.user.userId,
                products: [{
                    product: productID,
                    quantity: productQTY,
                    price: productPrice,
                    specifications: specifications,
                }]
            });
        } else {
            const existingProductIndex = activeUserCart
              .products.findIndex(p =>
                p.product.toString() === productID
                && (specifications && checkSameSpecification(p.specifications, specifications) || !specifications) // Check if specifications match
              );
            if (existingProductIndex !== -1) {
                // If the product already exists in the cart, update the quantity
                activeUserCart.products[existingProductIndex].quantity += productQTY;
            } else {
                // If the product does not exist in the cart, add it
                activeUserCart.products.push({
                    product: productID,
                    quantity: productQTY,
                    price: productPrice,
                    specifications: specifications,
                });
            }
            await activeUserCart.save();
        }
        await activeUserCart.populate({
            path: 'products',
                populate: {
                    path: 'product',
                    model: ProductModel,
                }
        });
        res.status(201).json(activeUserCart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la création du panier');
    }
});

router.post('/filter', checkRole(['superadmin']), async (req, res) => {
    const { ids, dateStart, dateEnd, userValidated, userCanceled, adminValidated, adminCanceled, userId, userName, page = 1, size = 100 } = req.body;

    try {
        const UserModel = req.db.model('User', User.schema);
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);

        let filterQuery = {};

        // Filter by ids
        if (ids && ids.length > 0) {
            filterQuery.orderID = { $in: ids };
        }

        // Filter by date range
        if (dateStart && dateEnd) {
            filterQuery.dateLivraison = {
            $gte: new Date(dateStart), 
            $lt: new Date(new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)) 
            };
        } else if (dateStart) {
            filterQuery.dateLivraison = { $gte: new Date(dateStart) };
        } else if (dateEnd) {
            filterQuery.dateLivraison = { $lt: new Date(new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)) };
        }

        // Filter by userValidated, userCanceled, adminValidated, adminCanceled
        if (typeof userValidated !== 'undefined') {
            filterQuery.userValidated = userValidated;
        }
        if (typeof userCanceled !== 'undefined') {
            filterQuery.userCanceled = userCanceled;
        }
        if (typeof adminValidated !== 'undefined') {
            filterQuery.adminValidated = adminValidated;
        }
        if (typeof adminCanceled !== 'undefined') {
            filterQuery.adminCanceled = adminCanceled;
        }

        // Filter by userId
        if (userId) {
            filterQuery.user = userId;
        }

        // Filter by userName (populate user and match firstName or lastName)
        if (userName) {
            const users = await UserModel.find({
                $or: [
                    { firstName: { $regex: userName, $options: 'i' } },
                    { lastName: { $regex: userName, $options: 'i' } }
                ]
            });

            const userIds = users.map(user => user._id);
            if (userIds.length > 0) {
                filterQuery.user = { $in: userIds };
            } else {
                return res.status(404).json({ message: 'No users found matching the name' });
            }
        }

        // Pagination logic
        
        const totalDocuments = await CartModel.countDocuments(filterQuery);
        const maxPage = Math.ceil(totalDocuments / size);
        
        const skip = (page - 1) * size;
        
        // Query the carts based on the filters and sort by createdAt in descending order
        const carts = await CartModel.find(filterQuery)
            .populate({
            path: 'products',
            populate: {
                path: 'product',
                model: ProductModel,
            }
            })
            .populate({
            path: 'user',
            model: UserModel,
            select: 'firstName lastName email phone'
            })
            .skip(skip)
            .limit(size);

        carts.sort((a, b) => {
            if (a.dateLivraison === null) return 1;
            if (b.dateLivraison === null) return -1;
            return new Date(a.dateLivraison) - new Date(b.dateLivraison);
        });

        // Return the filtered and paginated carts
        res.status(200).json({ maxPage, carts });
    } catch (err) {
        console.error('Error fetching carts:', err);
        res.status(500).json({ message: 'Error fetching carts' });
    }
});


// Lire tous les paniers
router.get('/', async (req, res) => {
    const { id, statut, dateStart, dateEnd,  } = req.body;
    
    try {
        const CartModel = req.db.model('Cart', Cart.schema);

        const carts = await CartModel.find();
        res.json(carts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération des paniers');
    }
});

// Lire le panier actif d'un utilisateur
router.get('/active-user-cart', async (req, res) => {
    try {
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);

        const cart = await CartModel.find({ user: req.user.userId , adminValidated: false, adminCanceled: false, userValidated: false, userCanceled: false }).populate({
          path: 'products',
            populate: {
                path: 'product',
                model: ProductModel,
            }  
        });
        if (!cart) {
            return res.status(404).send('Aucun panier actif');
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération des paniers');
    }
});

router.get('/user-cart', async (req, res) => {
    try {
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);
        const UserModel = req.db.model('User', User.schema);

        const cart = await CartModel.find({ user: req.user.userId, userValidated: true }).populate({
          path: 'products',
            populate: {
                path: 'product',
                model: ProductModel,
            }  
        });
        if (!cart) {
            return res.status(404).send('Aucun panier actif');
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération des paniers');
    }
});

router.get('/download-pdf/:id', checkRole(['superadmin']), async (req, res) => {
    try {
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);
        const UserModel = req.db.model('User', User.schema);

        // Define the directory for PDF storage and ensure it exists
        const directoryPath = path.join(__dirname, '../..', 'carts-pdf');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Fetch the cart and populate the necessary data
        const cart = await CartModel.findById(req.params.id).populate({
            path: 'products',
            populate: {
                path: 'product',
                model: ProductModel,
            },
        }).populate({
            path: 'user', model: UserModel,
            select: 'firstName lastName email phone'
        });
        if (!cart) {
            return res.status(404).send('Panier non trouvé');
        }
        if (cart.adminCanceled || cart.userCanceled || !cart.userValidated || !cart.adminValidated) {
            return res.status(404).send('Panier non validé ou annulé');
        };

        // Generate the file path for the PDF
        const filePath = path.join(directoryPath, `${cart.orderID}.pdf`);
        const doc = new PDFDocument();

        // Start streaming the PDF data to the file
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Company Header
        doc.fontSize(12).text('SDL\n37 BIS DE LA 4EME AVENUE\n59160 LOMME - LILLE\nTél : +33 7 82 27 23 97\nE-Mail : theronguillaume@destockdis.fr\nstock.destockdis.com', { align: 'left' });
        doc.moveDown(2);

        // Invoice Header
        doc.fontSize(12).text(`Commande N° ${cart.orderID}    Date : ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Client Details
        doc.fontSize(10).text(`Client N° ${cart.user._id}`, { align: 'left' });
        doc.text(`Client : M. ${cart.user.lastName} ${cart.user.firstName}`, { align: 'left' });
        doc.moveDown();

        // Invoice Title
        doc.fontSize(16).text('C     O     M     M     A     N     D     E', { align: 'center', underline: true });
        doc.moveDown();

        // Order Details
        doc.fontSize(10).text(`Réf. Commande : ${cart.orderID}`);
        doc.text(`Commentaire commande : ${cart.comment || 'N/A'}`);
        doc.moveDown();

        // Table Headers
        doc.moveDown();

        function checkPageBreak(doc, y) {
            const margin = 50;
            const pageHeight = doc.page.height;
            const rowHeight = 60;
            const bottomMargin = 50;
            if (y + rowHeight > pageHeight - bottomMargin) {
                doc.addPage();
                y = margin; // Réinitialisation de la hauteur après ajout de page
                drawTableHeader(doc, y);
                y += rowHeight; // Espacement après l'en-tête du tableau
            }
            return y;
        }

        function drawTableHeader(doc) {
            // Table Header
            const headerY = doc.y; 
            doc.fontSize(10).text('Référence', 75, headerY, { width: 100, align: 'left' });
            doc.text('Désignation', 175, headerY, { width: 200, align: 'left' });
            doc.text('Quantité', 375, headerY, { width: 50, align: 'right' });
            doc.text('PU HT', 425, headerY, { width: 50, align: 'right' });
            doc.text('Montant HT', 475, headerY, { width: 50, align: 'right' });
            doc.moveDown();

            // Draw table borders
            const tableTop = doc.y;
            doc.moveTo(75, tableTop)
                .lineTo(525, tableTop)
                .stroke();
        }
        drawTableHeader(doc);

        // Products List
        let totalHT = 0;
        let first = true;
        cart.products.forEach((productItem, index) => {
            const product = productItem.product;
            const amountHT = productItem.price * productItem.quantity;
            totalHT += amountHT;
            if (!first) {
                doc.moveDown();
            }
            first = false;
            doc.y = checkPageBreak(doc, doc.y);
            doc.y = doc.y + 10;
            const y = doc.y;
            doc.fontSize(10)
                .text(`${product.reference} (${product.ean})`, 75, y, { width: 100, align: 'left' })
                .text(`${product.nom}`, 175, y, { width: 200, align: 'left' })
                .text(productItem.quantity, 375, y, { width: 50, align: 'right' })
                .text(productItem.price.toFixed(2), 425, y, { width: 50, align: 'right' })
                .text(amountHT.toFixed(2), 475, y, { width: 50, align: 'right' });
            doc.moveDown();

            // Draw row borders
            const rowBottom = doc.y + 10;
            doc.moveTo(75, rowBottom)
                .lineTo(525, rowBottom)
                .stroke();
        });

        // Summary Section
        const VATRate = 20; // Example VAT rate of 20%
        const VATAmount = (totalHT * VATRate) / 100;
        const totalTTC = totalHT + VATAmount;

        doc.moveDown(2);
        const headerY2 = doc.y; 
        doc.fontSize(10).text('Base HT', 350, headerY2, { width: 50, align: 'right' });
        doc.text('Taux TVA', 400, headerY2, { width: 50, align: 'right' });
        doc.text('Montant TVA', 450, headerY2, { width: 50, align: 'right' });
        doc.moveDown();
        const headerY3 = doc.y; 
        doc.text(totalHT.toFixed(2), 350, headerY3, { width: 50, align: 'right' });
        doc.text(`${VATRate.toFixed(2)}%`, 400, headerY3, { width: 50, align: 'right' });
        doc.text(VATAmount.toFixed(2), 450, headerY3, { width: 50, align: 'right' });
        doc.moveDown(2);
        doc.text(`Total HT : ${totalHT.toFixed(2)} €`, 350, doc.y, { width: 150, align: 'right' });
        doc.text(`Total TVA : ${VATAmount.toFixed(2)} €`, 350, doc.y, { width: 150, align: 'right' });
        doc.text(`Total TTC : ${totalTTC.toFixed(2)} €`, 350, doc.y, { width: 150, align: 'right' });

        // Footer
        doc.moveDown(2);
        doc.fontSize(8).text('RESERVE DE PROPRIETE : loi du 12/05/1980 N°80335 - Le matériel livré reste l’entière propriété de SDL jusqu’au paiement intégral.', 75, doc.y, { align: 'center' });
        doc.text('SDL - SAS au capital de 15 000 Euros - immatriculée au RCS LILLE 514 844 752 - N° TVA : FR67514844752 - Code NAF : 4690Z', 75, doc.y, { align: 'center' });

        // Ajouter un espace avant le tableau
        doc.moveDown(2);

        // Ajouter le titre du tableau
        doc.fontSize(10).text('Nos coordonnées bancaires', 75, doc.y, { align: 'left' });
        doc.moveDown();

        // Définition des colonnes
        const tableStartY = doc.y;
        const col1X = 75;  // Position de IBAN
        const col2X = 235; // Position de BIC
        const col3X = 305; // Position de Domiciliation
        const tableWidth = 450;
        const rowHeight = 10;

        // Dessiner l'en-tête du tableau
        doc.rect(col1X, tableStartY, tableWidth, rowHeight +10 ).stroke();
        doc.rect(col1X, tableStartY, 160, rowHeight +10 ).stroke(); // Séparation IBAN
        doc.rect(col2X, tableStartY, 70, rowHeight +10 ).stroke(); // Séparation BIC
        doc.rect(col3X, tableStartY, 220, rowHeight +10 ).stroke(); // Séparation Domiciliation

        // Ajouter le texte des en-têtes
        doc.fontSize(10).text('IBAN', col1X + 5, tableStartY + 5, { width: 155, align: 'left' });
        doc.text('BIC', col2X + 5, tableStartY + 5, { width: 95, align: 'left' });
        doc.text('Domiciliation', col3X + 5, tableStartY + 5, { width: 215, align: 'left' });

        // Déplacer le curseur à la ligne suivante
        doc.moveDown();
        const rowY = doc.y;

        // Dessiner la ligne de données
        doc.rect(col1X, rowY, tableWidth, rowHeight + 10).stroke();
        doc.rect(col1X, rowY, 160, rowHeight + 10).stroke();
        doc.rect(col2X, rowY, 70, rowHeight + 10).stroke();
        doc.rect(col3X, rowY, 220, rowHeight + 10).stroke();

        // Ajouter les informations bancaires
        doc.fontSize(10)
            .text('FR761027800256002007930175', col1X + 5, rowY + 5, { width: 155, align: 'left' })
            .text('CMCIFR2A', col2X + 5, rowY + 5, { width: 65, align: 'left' })
            .text('CREDIT MUTUEL - 59290 WASQUEHAL', col3X + 5, rowY + 5, { width: 215, align: 'left' });

        // Terminer le PDF
        doc.end();

        // Wait for the PDF to be fully written, then download it
        writeStream.on('finish', () => {
            res.download(filePath, `${cart.orderID}.pdf`, (err) => {
                if (err) {
                    console.error('Error downloading the PDF:', err);
                    res.status(500).send('Error generating PDF');
                }
            });
        });

        // Handle errors during file writing
        writeStream.on('error', (err) => {
            console.error('Error writing PDF file:', err);
            res.status(500).send('Error generating PDF');
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération du panier');
    }
});

// Lire un panier spécifique par son ID
router.get('/:id', async (req, res) => {
    try {
        const CartModel = req.db.model('Cart', Cart.schema);

        const cart = await CartModel.findById(req.params.id);
        if (!cart) {
            return res.status(404).send('Panier non trouvé');
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la récupération du panier');
    }
});

//Diverse actions sur le panier (Valider, Cancel, ...)
router.put('/active-cart-user-action', async (req, res) => {
    const { action, cartID, user, comment, dateLivraison, lieuLivraison } = req.body;
    try {
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);
        let userCart;
        if (action === 'validate') {
            userCart = await CartModel.findOne({ user: req.user.userId , adminValidated: false, adminCanceled: false, userValidated: false, userCanceled: false });
            if (!userCart)
                return res.status(404).send('Panier non trouvé');
            for (let product of userCart.products) {
                const existingProduct = await ProductModel.findById(product.product);
                if (!existingProduct) {
                    return res.status(404).send(`Produit avec l'ID ${product.product} non trouvé`);
                }
            }
            userCart.userValidated = true;
            userCart.dateUserValidation = new Date();
            if (comment) userCart.comment = comment
            if (dateLivraison) userCart.dateLivraison = dateLivraison
            if (lieuLivraison) userCart.lieuLivraison = lieuLivraison
            await userCart.save();
            notificationLogger.logger(req.db, 'order', `Nouvelle commande validée, numéro ${userCart.orderID}`, "", ['superadmin']);
        } else if (action === 'cancel') {
            userCart = await CartModel.findById(cartID);
            if (!userCart) {
                return res.status(404).send('Panier non trouvé');
            } else if (userCart.adminCanceled || userCart.adminValidated || userCart.userCanceled) {
                return res.status(404).send('Panier déjà validé ou annulé');
            }
            userCart.userCanceled = true;
            await userCart.save();
            notificationLogger.logger(req.db, 'order', `Nouvelle commande annulée, numéro ${userCart.orderID}`, "", ['superadmin']);
        } else {
            return res.status(404).send('Action non trouvée');
        }
        res.json(userCart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la mise à jour du panier');
    }
});

router.put('/admin-action', checkRole(['superadmin']), async (req, res) => {
    const { action, cartID } = req.body;
    try {
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);
        
        let userCart;
        if (action === 'validate') {
            userCart = await CartModel.findOne({ 
                _id: cartID, 
                adminValidated: false, 
                adminCanceled: false, 
                userValidated: true, 
                userCanceled: false 
            });
            if (!userCart) {
                return res.status(404).send('Panier non trouvé');
            }
            userCart.adminValidated = true;
            userCart.dateAdminValidation = new Date();
            for (let product of userCart.products) {
                const existingProduct = await ProductModel.findById(product.product);
                await existingProduct.save();
            }
            await userCart.save();
            notificationLogger.logger(req.db, 'order', `L'administrateur à validé votre commande numéro ${userCart.orderID}`, [userCart.user], "");
        } else if (action === 'cancel') {
            userCart = await CartModel.findOne({ 
                _id: cartID, 
                adminCanceled: false, 
                userValidated: true, 
                userCanceled: false 
            });
            if (!userCart) {
                return res.status(404).send('Panier non trouvé');
            }
            userCart.adminCanceled = true;
            if (userCart.adminValidated) {
                console.log('Admin validated cart is being canceled');
                for (let product of userCart.products) {
                    const existingProduct = await ProductModel.findById(product.product);
                    existingProduct.active = true;
                    await existingProduct.save();
                }
            }
            await userCart.save();
            notificationLogger.logger(req.db, 'order', `L'administrateur à annulé votre commande numéro ${userCart.orderID}`, [userCart.user], "");
        } else {
            return res.status(404).send('Action non trouvée');
        }
        res.json(userCart);
    } catch (err) {
        console.error("Error during cart update process:", err.message);
        res.status(500).send('Erreur lors de la mise à jour du panier');
    }
});

// Mettre à jour un panier par son ID
router.put('/:id', checkRole(['superadmin']), async (req, res) => {
    const { productID, productQuantity, productPrice } = req.body;

    try {
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);

        let existingCart = await CartModel.findById(req.params.id);
        if (!existingCart) {
            return res.status(404).send('Panier non trouvée');
        }
        if (existingCart.adminValidated || existingCart.adminCanceled || existingCart.userCanceled)
            return res.status(404).send('Panier déjà validé ou annulé');

        if ((productID && productQuantity) || (productID && productPrice)) {
            const existingProductIndex = existingCart.products.findIndex(p => p.product.toString() === productID.toString());
            if (existingProductIndex === -1)
                return res.status(404).send('Produit non présent dans le panier');
            if (productQuantity) {
                const product = await ProductModel.findById(productID);
                existingCart.products[existingProductIndex].quantity = productQuantity;
            }
            if (productPrice)
                existingCart.products[existingProductIndex].price = productPrice;
        }
        await existingCart.save();
        res.json(existingCart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la mise à jour du panier');
    }
});

// Supprimer un produit d'un panier par son ID
router.delete('/product', async (req, res) => {
    const { productID, productQTY, cartID } = req.body;
    try {
        const CartModel = req.db.model('Cart', Cart.schema);
        const ProductModel = req.db.model('Product', Product.schema);
        let activeUserCart;
        if (cartID) {
            activeUserCart = await CartModel.findById(cartID);
        } else {
            activeUserCart = await CartModel.findOne({ user: req.user.userId , adminValidated: false, adminCanceled: false, userValidated: false, userCanceled: false });
        }
        if (!activeUserCart) {
            return res.status(404).send('Panier non trouvé');
        } else {
            const existingProductIndex = activeUserCart.products.findIndex(p => p.product.toString() === productID);
            if (existingProductIndex !== -1) {
                // If the product already exists in the cart, update the quantity
                activeUserCart.products[existingProductIndex].quantity -= productQTY;
                if (activeUserCart.products[existingProductIndex].quantity <= 0) {
                    activeUserCart.products.splice(existingProductIndex, 1);
                }
                if (activeUserCart.products.length === 0) {
                    await CartModel.findByIdAndDelete(activeUserCart._id);
                    return res.json(activeUserCart.populate({
                        path: 'products',
                          populate: {
                              path: 'product',
                              model: ProductModel,
                          }  
                      }));
                }
                await activeUserCart.save();
            } else {
                // If the product does not exist in the cart, add it
                return res.status(404).send('Produit non présent dans le panier');
            }
        }
        await activeUserCart.populate({
            path: 'products',
            populate: {
                path: 'product',
                model: ProductModel,
                }
            });
        res.status(201).json(activeUserCart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la suppression du produit du panier');
    }
});

// Supprimer un panier par son ID
router.delete('/:id', checkRole(['superadmin']), async (req, res) => {
    try {
        const CartModel = req.db.model('Cart', Cart.schema);

        const cart = await CartModel.findByIdAndDelete(req.params.id);
        if (!cart) {
            return res.status(404).send('Panier non trouvé');
        }

        res.json({ msg: 'Panier supprimé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur lors de la suppression du panier');
    }
});

const checkSameSpecification = (productSpec, newSpec) => {
    if (!productSpec || !newSpec) return false;
    if (productSpec.length !== newSpec.length) return false;
    for (let i = 0; i < productSpec.length; i++) {
        if (productSpec[i].value !== newSpec[i].value) return false;
    }
    return true;
}

module.exports = router;