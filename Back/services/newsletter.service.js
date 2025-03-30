const transporter = require('./mail.service');
const User = require('../models/user');
const Product = require('../models/destockdis-models/product');
const Brand = require('../models/destockdis-models/brand');
const path = require('path');
const fs = require('fs');
const excelJS = require('exceljs');  // Assurez-vous d'avoir installé cette bibliothèque avec `npm install exceljs`

const newsletterService = {
    async generateProductExcel(db) {
        try {
            const ProductModel = db.model('Product', Product.schema);
            const BrandModel = db.model('Brand', Brand.schema);
            // Récupérer tous les produits actifs et populater la marque
            const products = await ProductModel.find({ active: true }).populate({
                path: 'brand',
                model: BrandModel
            });
            // Définir le chemin et le nom du fichier Excel
            const timestamp = new Date();
            const fileName = `stockDestockdis-${timestamp.getDate()}-${timestamp.getMonth() + 1}-${timestamp.getFullYear()}-${timestamp.getHours()}h${timestamp.getMinutes()}m${timestamp.getSeconds()}.xlsx`;
            const directoryPath = path.join(__dirname, '..', 'excelNewsletter');
            const filePath = path.join(directoryPath, fileName);
            // Vérifier si le dossier "excelNewsletter" existe, sinon le créer
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            // Créer un nouveau fichier Excel
            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet('Produits');
            // Définir les en-têtes de colonnes
            worksheet.columns = [
                { header: 'Marque', key: 'brand', width: 20 },
                { header: 'Désignation', key: 'designation', width: 30 },
                { header: 'Référence', key: 'reference', width: 20 },
                { header: 'EAN', key: 'ean', width: 20 },
                { header: 'Prix Unitaire', key: 'price', width: 15 },
                { header: 'Stock', key: 'stock', width: 10 }
            ];
            // Ajouter les données de chaque produit
            products.forEach((product) => {
                worksheet.addRow({
                    brand: product.brand?.brand || 'N/A',
                    designation: product.designation,
                    reference: product.reference,
                    ean: product.ean,
                    price: product.price.toFixed(2),
                    stock: product.stock,
                });
            });
            // Enregistrer le fichier Excel
            await workbook.xlsx.writeFile(filePath);
            console.log('Fichier Excel généré pour la newsletter.');
            return filePath;  // Retourner le chemin du fichier pour l'utiliser comme pièce jointe
        } catch (error) {
            console.error('Erreur lors de la génération du fichier Excel:', error);
            throw error;
        }
    },

    async sendNewsletter(filePath, db) {
        try {
            const UserModel = db.model('User', User.schema);
            let users = await UserModel.find({ mailFeedSubscription: true });
            if (!users) return res.status(202).json({ message: 'Aucun utilisateur inscrit à la newsletter' });

            // Parcourir chaque utilisateur et envoyer un email si le champ `newsletterMail` existe
            for (let user of users) {
                const email = user.mailFeedMail || user.email; // Priorité à `newsletterMail` si présent
                
                // Définir le contenu de l'email
                const mailOptions = {
                    from: process.env.SMTP_MAIL,
                    to: email,
                    subject: 'Newsletter - DestockDis',
                    html: `
                        <div style="background-color:#f4f4f4; padding:20px;">
                            <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                                <div style="padding:20px; text-align:center; background-color:#000000;">
                                    <a href="https://stock.destockdis.com" target="_blank" style="text-decoration:none; color:#ffffff;">
                                        <img src="https://lofra-france.com/wp-content/uploads/2024/10/logoDestockdis.png" alt="DestockDis" style="max-width:250px; height:auto; max-height: 200px;">
                                    </a>
                                </div>
                                <div style="padding:20px;">
                                    <h2 style="font-family:Arial, sans-serif; font-size:24px; color:#333333; text-align:left;">Bonjour ${user.firstName} ${user.lastName},</h2>
                                    <p style="font-family:Arial, sans-serif; font-size:16px; color:#333333; text-align:left; line-height:1.5;">
                                        Voici les dernières nouvelles de <strong>stock.destockdis.com</strong> !
                                    </p>
                                    <p style="font-family:Arial, sans-serif; font-size:16px; color:#333333; text-align:left; line-height:1.5;">
                                        Découvrez nos nouveautés et offres exclusives.
                                    </p>
                                    <div style="text-align:center; margin:30px 0;">
                                        <a href="https://stock.destockdis.com" style="background-color:rgb(234,179,8); color:#ffffff; padding:15px 30px; text-decoration:none; font-size:16px; border-radius:5px; display:inline-block;">
                                            Visitez notre site
                                        </a>
                                    </div>
                                    <p style="font-family:Arial, sans-serif; font-size:14px; color:#666666; text-align:left; line-height:1.5;">
                                        Merci pour votre fidélité !
                                    </p>
                                </div>
                                <div style="padding:20px; text-align:center; background-color:#f9f9f9;">
                                    <p style="font-family:Arial, sans-serif; font-size:12px; color:#999999; text-align:center;">
                                        © 2024 DestockDis, Tous droits réservés. <br>
                                        <a href="https://stock.destockdis.com" style="color:#25B9D7; text-decoration:none;">Visitez notre site</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `,
                    attachments: [
                        {
                            filename: path.basename(filePath),
                            path: filePath,
                        }
                    ],
                };

                // Envoyer l'email via le transporteur
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`Erreur lors de l'envoi de l'email à ${email}:`, error);
                    } else {
                        console.log(`Email envoyé à ${email}:`, info.response);
                    }
                });
            }
            console.log("Tous les emails de newsletter ont été envoyés avec le fichier Excel en pièce jointe.");
        } catch (err) {
            console.error("Erreur lors de l'envoi de la newsletter:", err.message);
        }
    },
    async sendNewsletterWithAttachment(db) {
        try {
            // 1. Générer le fichier Excel
            const filePath = await this.generateProductExcel(db);

            // 2. Envoyer la newsletter avec le fichier en pièce jointe
            await this.sendNewsletter(filePath, db);
            console.log('Newsletter envoyée avec le fichier Excel en pièce jointe.');
            
        } catch (error) {
            console.error("Erreur lors de l'envoi de la newsletter avec pièce jointe:", error.message);
        }
    }
};

module.exports = newsletterService;