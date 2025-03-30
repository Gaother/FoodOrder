const express = require('express');
const Cart = require('./models/destockdis-models/cart');
const Product = require('./models/destockdis-models/product');

const script = {
    async moveCartPrice(db) {
        
        const CartModel = db.model('Cart', Cart.schema);
        const ProductModel = db.model('Product', Product.schema);
        const carts = await CartModel.find();
        for (let cart of carts) {
            for (let product of cart.products) {
                if (!product.price || product.price === 0) {
                    const Product = await ProductModel.findById(product.product.toString());
                    if (Product) {
                        product.price = Product.price;
                    }
                }
            }
            await cart.save();
        }
    }
}
module.exports = script;
  

// // Créer un nouveau panier
// router.post('/', checkRole(['admin', 'superadmin']), async (req, res) => {
//     const { cart } = req.body;

//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);

//         const newCart = await CartModel.create({ cart });
//         res.status(201).json(newCart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la création du panier');
//     }
// });

// // Ajouter un produit à un panier
// router.post('/product', checkRole(['certifiate', 'admin', 'superadmin']), async (req, res) => {
//     const { productID, productQTY, cartID, productPrice } = req.body;

//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);
//         const BrandModel = req.db.model('Brand', Brand.schema);
//         let activeUserCart;
//         if (cartID) {
//             activeUserCart = await CartModel.findById(cartID);
//             if (activeUserCart.adminValidated || activeUserCart.adminCanceled || activeUserCart.userCanceled) {
//                 return res.status(404).send('Panier déjà validé ou annulé');
//             }
//         } else {
//             activeUserCart = await CartModel.findOne({ user: req.user.userId , adminValidated: false, adminCanceled: false, userValidated: false, userCanceled: false });
//         }
//         if (!activeUserCart) {
//             activeUserCart = await CartModel.create({ 
//                 user: req.user.userId,
//                 products: [{
//                     product: productID,
//                     quantity: productQTY,
//                     price: productPrice,
//                 }]
//             });
//         } else {
//             // ICI il faut vérifier si le produit à ajouter n'as pas la quantité supérieur à la quantité en stock
//             const existingProductIndex = activeUserCart.products.findIndex(p => p.product.toString() === productID);
//             if (existingProductIndex !== -1) {
//                 const product = await ProductModel.findById(productID);
//                 if (product.stock < activeUserCart.products[existingProductIndex].quantity + productQTY) {
//                     return res.status(404).send('Quantité supérieure à la quantité en stock');
//                 }
//                 // If the product already exists in the cart, update the quantity
//                 activeUserCart.products[existingProductIndex].quantity += productQTY;
//             } else {
//                 // If the product does not exist in the cart, add it
//                 activeUserCart.products.push({
//                     product: productID,
//                     quantity: productQTY,
//                     price: productPrice,
//                 });
//             }
//             await activeUserCart.save();
//         }
//         await activeUserCart.populate({
//             path: 'products',
//                 populate: {
//                     path: 'product',
//                     model: ProductModel,
//                     populate: {
//                         path: 'brand',
//                         model: BrandModel
//                     }
//                 }
//         });
//         res.status(201).json(activeUserCart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la création du panier');
//     }
// });

// router.post('/filter', checkRole(['admin', 'superadmin']), async (req, res) => {
//     const { ids, dateStart, dateEnd, userValidated, userCanceled, adminValidated, adminCanceled, userId, userName, page = 1, size = 100 } = req.body;

//     try {
//         const UserModel = req.db.model('User', User.schema);
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);
//         const BrandModel = req.db.model('Brand', Brand.schema);

//         let filterQuery = {};

//         // Filter by ids
//         if (ids && ids.length > 0) {
//             filterQuery.orderID = { $in: ids };
//         }

//         // Filter by date range
//         if (dateStart && dateEnd) {
//             filterQuery.dateUserValidation = { 
//             $gte: new Date(dateStart), 
//             $lt: new Date(new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)) 
//             };
//         } else if (dateStart) {
//             filterQuery.dateUserValidation = { $gte: new Date(dateStart) };
//         } else if (dateEnd) {
//             filterQuery.dateUserValidation = { $lt: new Date(new Date(dateEnd).setDate(new Date(dateEnd).getDate() + 1)) };
//         }

//         // Filter by userValidated, userCanceled, adminValidated, adminCanceled
//         if (typeof userValidated !== 'undefined') {
//             filterQuery.userValidated = userValidated;
//         }
//         if (typeof userCanceled !== 'undefined') {
//             filterQuery.userCanceled = userCanceled;
//         }
//         if (typeof adminValidated !== 'undefined') {
//             filterQuery.adminValidated = adminValidated;
//         }
//         if (typeof adminCanceled !== 'undefined') {
//             filterQuery.adminCanceled = adminCanceled;
//         }

//         // Filter by userId
//         if (userId) {
//             filterQuery.user = userId;
//         }

//         // Filter by userName (populate user and match firstName or lastName)
//         if (userName) {
//             const users = await UserModel.find({
//                 $or: [
//                     { firstName: { $regex: userName, $options: 'i' } },
//                     { lastName: { $regex: userName, $options: 'i' } }
//                 ]
//             });

//             const userIds = users.map(user => user._id);
//             if (userIds.length > 0) {
//                 filterQuery.user = { $in: userIds };
//             } else {
//                 return res.status(404).json({ message: 'No users found matching the name' });
//             }
//         }

//         // Pagination logic
        
//         const totalDocuments = await CartModel.countDocuments(filterQuery);
//         const maxPage = Math.ceil(totalDocuments / size);
        
//         const skip = (page - 1) * size;
        
//         // Query the carts based on the filters and sort by createdAt in descending order
//         const carts = await CartModel.find(filterQuery)
//             .populate({
//             path: 'products',
//             populate: {
//                 path: 'product',
//                 model: ProductModel,
//                 populate: {
//                 path: 'brand',
//                 model: BrandModel
//                 }
//             }
//             })
//             .populate({
//             path: 'user',
//             model: UserModel,
//             select: 'firstName lastName companyName email phone'
//             })
//             .sort({ createdAt: -1 }) // Sort by createdAt in descending order
//             .skip(skip)
//             .limit(size);

//         // Return the filtered and paginated carts
//         res.status(200).json({ maxPage, carts });
//     } catch (err) {
//         console.error('Error fetching carts:', err);
//         res.status(500).json({ message: 'Error fetching carts' });
//     }
// });


// // Lire tous les paniers
// router.get('/', async (req, res) => {
//     const { id, statut, dateStart, dateEnd,  } = req.body;
    
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);

//         const carts = await CartModel.find();
//         res.json(carts);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la récupération des paniers');
//     }
// });

// // Lire le panier actif d'un utilisateur
// router.get('/active-user-cart', async (req, res) => {
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);
//         const BrandModel = req.db.model('Brand', Brand.schema)

//         const cart = await CartModel.find({ user: req.user.userId , adminValidated: false, adminCanceled: false, userValidated: false, userCanceled: false }).populate({
//           path: 'products',
//             populate: {
//                 path: 'product',
//                 model: ProductModel,
//                 populate: {
//                     path: 'brand',
//                     model: BrandModel
//                 }
//             }  
//         });
//         if (!cart) {
//             return res.status(404).send('Aucun panier actif');
//         }
//         res.json(cart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la récupération des paniers');
//     }
// });

// router.get('/user-cart', async (req, res) => {
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);
//         const UserModel = req.db.model('User', User.schema);
//         const BrandModel = req.db.model('Brand', Brand.schema)

//         const cart = await CartModel.find({ user: req.user.userId, userValidated: true }).populate({
//           path: 'products',
//             populate: {
//                 path: 'product',
//                 model: ProductModel,
//                 populate: {
//                     path: 'brand',
//                     model: BrandModel
//                 }
//             }  
//         });
//         if (!cart) {
//             return res.status(404).send('Aucun panier actif');
//         }
//         res.json(cart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la récupération des paniers');
//     }
// });

// router.get('/download-pdf/:id', checkRole(['admin', 'superadmin']), async (req, res) => {
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);
//         const UserModel = req.db.model('User', User.schema);
//         const BrandModel = req.db.model('Brand', Brand.schema);

//         // Define the directory for PDF storage and ensure it exists
//         const directoryPath = path.join(__dirname, '../..', 'carts-pdf');
//         if (!fs.existsSync(directoryPath)) {
//             fs.mkdirSync(directoryPath, { recursive: true });
//         }

//         // Fetch the cart and populate the necessary data
//         const cart = await CartModel.findById(req.params.id).populate({
//             path: 'products',
//             populate: {
//                 path: 'product',
//                 model: ProductModel,
//                 populate: {
//                     path: 'brand',
//                     model: BrandModel
//                 }
//             },
//         }).populate({
//             path: 'user', model: UserModel,
//             select: 'firstName lastName companyName email phone'
//         });
//         if (!cart) {
//             return res.status(404).send('Panier non trouvé');
//         }
//         if (cart.adminCanceled || cart.userCanceled || !cart.userValidated || !cart.adminValidated) {
//             return res.status(404).send('Panier non validé ou annulé');
//         };

//         // Generate the file path for the PDF
//         const filePath = path.join(directoryPath, `${cart.orderID}.pdf`);
//         const doc = new PDFDocument();

//         // Start streaming the PDF data to the file
//         const writeStream = fs.createWriteStream(filePath);
//         doc.pipe(writeStream);

//         // Company Header
//         doc.fontSize(12).text('SDL\n2 ZAMIN 1ERE AVENUE\n59160 LOMME\nTél : 0972524636\nE-Mail : contact@cuisinieresgrandelargeur.com\nwww.cuisinieresgrandelargeur.com', { align: 'left' });
//         doc.moveDown(2);

//         // Invoice Header
//         doc.fontSize(12).text(`Facture N° ${cart.orderID}    Date : ${new Date().toLocaleDateString()}`, { align: 'right' });
//         doc.moveDown();

//         // Client Details
//         doc.fontSize(10).text(`Client N° ${cart.user._id}`, { align: 'left' });
//         doc.fontSize(10).text(`Entreprise : ${cart.user.companyName}`, { align: 'left' });
//         doc.text(`Client : M. ${cart.user.lastName} ${cart.user.firstName}`, { align: 'left' });
//         doc.moveDown();

//         // Invoice Title
//         doc.fontSize(16).text('F     A     C     T     U     R     E', { align: 'center', underline: true });
//         doc.moveDown();

//         // Order Details
//         doc.fontSize(10).text(`Réf. Commande : ${cart.orderID}`);
//         doc.text(`Intitulé commande : ${cart.comment || 'N/A'}`);
//         doc.moveDown();

//         // Table Headers
//         doc.moveDown();

//         // Table Header
//         const headerY = doc.y; 
//         doc.fontSize(10).text('Référence', 75, headerY, { width: 100, align: 'left' });
//         doc.text('Désignation', 175, headerY, { width: 200, align: 'left' });
//         doc.text('Quantité', 375, headerY, { width: 50, align: 'right' });
//         doc.text('PU HT', 425, headerY, { width: 50, align: 'right' });
//         doc.text('Montant HT', 475, headerY, { width: 50, align: 'right' });
//         doc.moveDown();

//         // Draw table borders
//         const tableTop = doc.y;
//         doc.moveTo(75, tableTop)
//             .lineTo(525, tableTop)
//             .stroke();

//         // Products List
//         let totalHT = 0;
//         cart.products.forEach((productItem, index) => {
//             const product = productItem.product;
//             const amountHT = productItem.price * productItem.quantity;
//             totalHT += amountHT;
//             doc.moveDown();
//             doc.y = doc.y + 10;
//             const y = doc.y;
//             doc.fontSize(10)
//             .text(`${product.reference} (${product.ean})`, 75, y, { width: 100, align: 'left' })
//             .text(`${product.designation} (${product.brand.brand})`, 175, y, { width: 200, align: 'left' })
//             .text(productItem.quantity, 375, y, { width: 50, align: 'right' })
//             .text(productItem.price.toFixed(2), 425, y, { width: 50, align: 'right' })
//             .text(amountHT.toFixed(2), 475, y, { width: 50, align: 'right' });
//             doc.moveDown();

//             // Draw row borders
//             const rowBottom = doc.y + 10;
//             doc.moveTo(75, rowBottom)
//             .lineTo(525, rowBottom)
//             .stroke();
//         });

//         // Summary Section
//         const VATRate = 20; // Example VAT rate of 20%
//         const VATAmount = (totalHT * VATRate) / 100;
//         const totalTTC = totalHT + VATAmount;

//         doc.moveDown(2);
//         const headerY2 = doc.y; 
//         doc.fontSize(10).text('Base HT', 350, headerY2, { width: 50, align: 'right' });
//         doc.text('Taux TVA', 400, headerY2, { width: 50, align: 'right' });
//         doc.text('Montant TVA', 450, headerY2, { width: 50, align: 'right' });
//         doc.moveDown();
//         const headerY3 = doc.y; 
//         doc.text(totalHT.toFixed(2), 350, headerY3, { width: 50, align: 'right' });
//         doc.text(`${VATRate.toFixed(2)}%`, 400, headerY3, { width: 50, align: 'right' });
//         doc.text(VATAmount.toFixed(2), 450, headerY3, { width: 50, align: 'right' });
//         doc.moveDown(2);
//         doc.text(`Total HT : ${totalHT.toFixed(2)} €`, 350, doc.y, { width: 150, align: 'right' });
//         doc.text(`Total TVA : ${VATAmount.toFixed(2)} €`, 350, doc.y, { width: 150, align: 'right' });
//         doc.text(`Total TTC : ${totalTTC.toFixed(2)} €`, 350, doc.y, { width: 150, align: 'right' });

//         // Footer
//         doc.moveDown(2);
//         doc.fontSize(8).text('RESERVE DE PROPRIETE : loi du 12/05/1980 N°80335 - Le matériel livré reste l’entière propriété de LTF jusqu’au paiement intégral.', 75, doc.y, { align: 'center' });
//         doc.text('LTF - SAS au capital de 10 000 Euros - immatriculée au RCS LILLE 811 987 213 - N° TVA : FR69811987213 - Code NAF : 4791B', 75, doc.y, { align: 'center' });

//         // End and finalize the PDF document
//         doc.end();

//         // Wait for the PDF to be fully written, then download it
//         writeStream.on('finish', () => {
//             res.download(filePath, `${cart.orderID}.pdf`, (err) => {
//                 if (err) {
//                     console.error('Error downloading the PDF:', err);
//                     res.status(500).send('Error generating PDF');
//                 }
//             });
//         });

//         // Handle errors during file writing
//         writeStream.on('error', (err) => {
//             console.error('Error writing PDF file:', err);
//             res.status(500).send('Error generating PDF');
//         });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la récupération du panier');
//     }
// });

// // Lire un panier spécifique par son ID
// router.get('/:id', async (req, res) => {
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);

//         const cart = await CartModel.findById(req.params.id);
//         if (!cart) {
//             return res.status(404).send('Panier non trouvé');
//         }
//         res.json(cart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la récupération du panier');
//     }
// });

// router.put('/active-cart-user-action', async (req, res) => {
//     const { action, cartID, user, comment } = req.body;
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);
//         let userCart;
//         if (action === 'validate') {
//             userCart = await CartModel.findOne({ user: req.user.userId , adminValidated: false, adminCanceled: false, userValidated: false, userCanceled: false });
//             if (!userCart)
//                 return res.status(404).send('Panier non trouvé');
//             for (let product of userCart.products) {
//                 const existingProduct = await ProductModel.findById(product.product);
//                 if (!existingProduct) {
//                     return res.status(404).send(`Produit avec l'ID ${product.product} non trouvé`);
//                 }
//                 if (existingProduct.stock < product.quantity) {
//                     return res.status(404).send(`Quantité désirée pour le produit ${existingProduct.reference} supérieure à la quantité en stock`);
//                 }
//             }
//             userCart.userValidated = true;
//             userCart.dateUserValidation = new Date();
//             if (comment) userCart.comment = comment
//         } else if (action === 'cancel') {
//             userCart = await CartModel.findById(cartID);
//             if (!userCart) {
//                 return res.status(404).send('Panier non trouvé');
//             } else if (userCart.adminCanceled || userCart.adminValidated || userCart.userCanceled) {
//                 return res.status(404).send('Panier déjà validé ou annulé');
//             }
//             userCart.userCanceled = true;
//         } else { ytfcx 
//             return res.status(404).send('Action non trouvée');
//         }
//         await userCart.save();
//         res.json(userCart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la mise à jour du panier');
//     }
// });

// router.put('/admin-action', checkRole(['admin', 'superadmin']), async (req, res) => {
//     const { action, cartID } = req.body;
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);
        
//         let userCart;
//         if (action === 'validate') {
//             userCart = await CartModel.findOne({ 
//                 _id: cartID, 
//                 adminValidated: false, 
//                 adminCanceled: false, 
//                 userValidated: true, 
//                 userCanceled: false 
//             });
//             if (!userCart) {
//                 return res.status(404).send('Panier non trouvé');
//             }
//             userCart.adminValidated = true;
//             userCart.dateAdminValidation = new Date();
//             for (let product of userCart.products) {
//                 const existingProduct = await ProductModel.findById(product.product);
//                 existingProduct.stock -= product.quantity;
//                 if (existingProduct.stock < 0) {
//                     return res.status(404).send(`Quantité désirée pour le produit ${existingProduct.reference} supérieure à la quantité en stock`);
//                 } else if (existingProduct.stock === 0) {
//                     existingProduct.active = false;
//                 }
//                 await existingProduct.save();
//             }
//         } else if (action === 'cancel') {
//             userCart = await CartModel.findOne({ 
//                 _id: cartID, 
//                 adminCanceled: false, 
//                 userValidated: true, 
//                 userCanceled: false 
//             });
//             if (!userCart) {
//                 return res.status(404).send('Panier non trouvé');
//             }
//             userCart.adminCanceled = true;
//             if (userCart.adminValidated) {
//                 for (let product of userCart.products) {
//                     const existingProduct = await ProductModel.findById(product.product);
//                     existingProduct.stock += product.quantity;
//                     existingProduct.active = true;
//                     await existingProduct.save();
//                 }
//             }
//         } else {
//             return res.status(404).send('Action non trouvée');
//         }
//         await userCart.save();
//         res.json(userCart);
//     } catch (err) {
//         console.error("Error during cart update process:", err.message);
//         res.status(500).send('Erreur lors de la mise à jour du panier');
//     }
// });

// // Mettre à jour un panier par son ID
// router.put('/:id', checkRole(['admin', 'superadmin']), async (req, res) => {
//     const { productID, productQuantity, productPrice } = req.body;

//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);

//         let existingCart = await CartModel.findById(req.params.id);
//         if (!existingCart) {
//             return res.status(404).send('Panier non trouvée');
//         }
//         if (existingCart.adminValidated || existingCart.adminCanceled || existingCart.userCanceled)
//             return res.status(404).send('Panier déjà validé ou annulé');

//         if ((productID && productQuantity) || (productID && productPrice)) {
//             const existingProductIndex = existingCart.products.findIndex(p => p.product.toString() === productID.toString());
//             if (existingProductIndex === -1)
//                 return res.status(404).send('Produit non présent dans le panier');
//             if (productQuantity) {
//                 const product = await ProductModel.findById(productID);
//                 if (product.stock < productQuantity) {
//                     return res.status(404).send('Quantité supérieure à la quantité en stock pour le produit ' + product.reference + ", quantité en stock: " + product.stock);
//                 }
//                 existingCart.products[existingProductIndex].quantity = productQuantity;
//             }
//             if (productPrice)
//                 existingCart.products[existingProductIndex].price = productPrice;
//         }
//         await existingCart.save();
//         res.json(existingCart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la mise à jour du panier');
//     }
// });

// // Supprimer un produit d'un panier par son ID
// router.delete('/product', checkRole(['certifiate', 'admin', 'superadmin']), async (req, res) => {
//     const { productID, productQTY, cartID } = req.body;
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);
//         const ProductModel = req.db.model('Product', Product.schema);
//         const BrandModel = req.db.model('Brand', Brand.schema)
//         let activeUserCart;
//         if (cartID) {
//             activeUserCart = await CartModel.findById(cartID);
//         } else {
//             activeUserCart = await CartModel.findOne({ user: req.user.userId , adminValidated: false, adminCanceled: false, userValidated: false, userCanceled: false });
//         }
//         if (!activeUserCart) {
//             return res.status(404).send('Panier non trouvé');
//         } else {
//             const existingProductIndex = activeUserCart.products.findIndex(p => p.product.toString() === productID);
//             if (existingProductIndex !== -1) {
//                 // If the product already exists in the cart, update the quantity
//                 activeUserCart.products[existingProductIndex].quantity -= productQTY;
//                 if (activeUserCart.products[existingProductIndex].quantity <= 0) {
//                     activeUserCart.products.splice(existingProductIndex, 1);
//                 }
//                 if (activeUserCart.products.length === 0) {
//                     await CartModel.findByIdAndDelete(activeUserCart._id);
//                     return res.json(activeUserCart.populate({
//                         path: 'products',
//                           populate: {
//                               path: 'product',
//                               model: ProductModel,
//                               populate: {
//                                   path: 'brand',
//                                   model: BrandModel
//                               }
//                           }  
//                       }));
//                 }
//                 await activeUserCart.save();
//             } else {
//                 // If the product does not exist in the cart, add it
//                 return res.status(404).send('Produit non présent dans le panier');
//             }
//         }
//         await activeUserCart.populate({
//             path: 'products',
//             populate: {
//                 path: 'product',
//                 model: ProductModel,
//                     populate: {
//                         path: 'brand',
//                         model: BrandModel
//                     }
//                 }
//             });
//         res.status(201).json(activeUserCart);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la suppression du produit du panier');
//     }
// });

// // Supprimer un panier par son ID
// router.delete('/:id', checkRole(['admin', 'superadmin']), async (req, res) => {
//     try {
//         const CartModel = req.db.model('Cart', Cart.schema);

//         const cart = await CartModel.findByIdAndDelete(req.params.id);
//         if (!cart) {
//             return res.status(404).send('Panier non trouvé');
//         }

//         res.json({ msg: 'Panier supprimé' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Erreur lors de la suppression du panier');
//     }
// });

// module.exports = router;