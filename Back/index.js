// server.js
require('dotenv').config();

const SESSION_SECRET = process.env.SESSION_SECRET;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const CSRF_SECRET = process.env.CSRF_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const jwt = require('jsonwebtoken');
const express = require('express');
const swagger = require('./docs/swagger')
const path = require('path');
const logger = require('./middleware/loggerMiddleware');
const connectDB = require('./mongodb_link');
const newsletterService = require('./services/newsletter.service');
const cron = require('node-cron');
const session = require('express-session');
const User = require('./models/user');
var cors = require('cors')

const userRoutes = require('./routes/userRoutes');
const userHistoriesRoutes = require('./routes/user-routes/userHistories.route');
const resetPasswordRoutes = require('./routes/user-routes/resetPassword.route');
const brandRoutes = require('./routes/destockdis-routes/brandRoutes');

const backupRoutes = require('./routes/backupRoutes');

const productRoutes = require('./routes/destockdis-routes/productRoutes');
const productSpecificationsRoutes = require('./routes/destockdis-routes/productSpecificationsRoutes');
const productSpecificationsValueRoutes = require('./routes/destockdis-routes/productSpecificationsValueRoutes');

const cartRoutes = require('./routes/destockdis-routes/cartRoutes');

const app = express();

// Création d'un profil Admin si il n'existe pas
async function initializeAdminUser(db) {
    try {
        const UserModel = db.model('User', User.schema); // Utilisez le modèle
        // Vérifier si l'administrateur existe
        const adminExists = await UserModel.findOne({ role: 'superadmin' });

        if (!adminExists) {
            // Si l'administrateur n'existe pas, créez-le sans utiliser `new`
            const adminUser = {
                firstName: 'SuperAdmin',
                lastName: 'SuperAdmin',
                password: 'P@ssw0rdP@ssw0rd',
                email: "admin@mail.fr",
                phone: '0000000000',
                role: 'superadmin'
            };

            await UserModel.create(adminUser);
            console.log('Compte administrateur créé');
        }
    } catch (error) {
        console.error('Erreur lors de la création du compte administrateur', error);
    }
}

// Connexion à MongoDB

// Middleware pour vérifier le JWT, sauf pour les routes 'register' et 'login' |  req.path === '/api/users/register' ||
const verifyJwt = (req, res, next) => {
    if (req.path === '/api/users/login' || req.path === '/api/users/register' || req.path === '/api-docs/' || req.path === '/api-docs') {
        return next();
    }
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé, token non fourni' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.user._id = decoded.userId; // Ajouter le champ _id à req.user
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token invalide' });
    }
};

connectDB().then((db) => {
    initializeAdminUser(db)
    // Gestion de session/*
    app.use(session({
        secret: SESSION_SECRET, // Remplacez par votre secret de session
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: false, secure: true }
    }));

    app.use(express.json());
    app.use(logger);


    const publicPath = path.join(__dirname, 'public');
    app.use('/public', express.static(publicPath));


    app.use(express.urlencoded({extended: true}));

    //const whitelist = ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:2700']
    const whitelist = ['https://stock.destockdis.com']
    const corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true
    }

    app.use(cors());
    // Routes
    app.use((req, res, next) => {
        req.db = db; // Passez la connexion MongoDB à toutes les routes
        next();
    });



    swagger(app)
    app.use('/api/reset-password', resetPasswordRoutes);
    app.use(verifyJwt);

    cron.schedule('0 * * * *', () => {
        const now = new Date();
        const currentHour = now.getHours();
        if (currentHour === 8) {
            console.log('Il est 8h du matin, lancement de stockNewsletter()');
            newsletterService.sendNewsletterWithAttachment(db);
        }
    });

    // Définir les routes
    app.use('/api/users', userRoutes);
    app.use('/api/user-histories', userHistoriesRoutes);

    app.use('/api/backup', backupRoutes);
    app.use('/api/brands', brandRoutes);

    app.use('/api/products', productRoutes);
    app.use('/api/product-specifications', productSpecificationsRoutes);
    app.use('/api/product-specifications-values', productSpecificationsValueRoutes);

    app.use('/api/cart', cartRoutes);

    const PORT = process.env.PORT || 2700;
    app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
});
