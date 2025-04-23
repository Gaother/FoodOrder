require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const checkRole = require('../middleware/roleMiddleware');
const userHistoryLogger = require('../middleware/userHistoryMiddleware');
const notificationLogger = require('../middleware/userNotificationMiddleware');
const userNotification = require('../models/userNotification');
const pushNotificationService = require('../services/pushNotification.service');
const { path } = require('pdfkit');
const { model } = require('mongoose');
const router = express.Router();


// Inscription
router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName, phone } = req.body;
    try {
        await userHistoryLogger('register')(req);
        const UserModel = req.db.model('User', User.schema);  // Utilisez req.db pour accéder à la base

        let user = await UserModel.findOne({ email })
        if (user) return res.status(400).send('L\'utilisateur existe déjà');

        user = await UserModel.create({
            firstName,
            lastName,
            email,
            phone,
            password
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        user.token = token;

        await user.save();
        notificationLogger.logger(req.db, 'user', `Nouvel utilisateur inscrit : ${lastName} ${firstName}`, "", ['superadmin']);
        res.status(201).json({ message: 'Inscription réussie', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// Connexion
router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    try {
        const UserModel = req.db.model('User', User.schema);
        email = email.toLowerCase();

        let user = await UserModel.findOne({ email }).select('-resetToken');

        if (!user) return res.status(400).send('L\'utilisateur n\'existe pas');
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Le mot de passe est incorrect');
        
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
        user.token = token;
        await user.save();
        // Logger l'historique de connexion
        req.user = user; // Attacher l'utilisateur à la requête pour que le middleware puisse accéder à l'ID de l'utilisateur
        await userHistoryLogger('connexion')(req);
        res.status(200).json({ message: 'Connexion réussie', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// Déconnexion
router.post('/logout', async (req, res) => {
    // Effacer le cookie CSRF si vous le stockez dans un cookie
    // res.clearCookie('csrf-tokenM');
    
    // Envoyer une réponse indiquant que la déconnexion a réussi
    res.status(200).json({ message: 'Déconnexion réussie' });
});

// Marquer les notifications comme lues
router.post('/mark-as-read', async (req, res) => {
    let { notificationIds } = req.body;
    try {
        const UserModel = req.db.model('User', User.schema);

        let user = await UserModel.findById(req.user.userId);
        if (!user) return res.status(400).send('Utilisateur non trouvé');

        const notificationsToUpdate = user.notifications.filter(notification => 
            notificationIds.includes(notification._id.toString())
        );

        for (let notification of notificationsToUpdate) {
            notification.notificationIsRead = true;
        }

        await user.save();
        res.status(200).json({ message: 'Notifications marquées comme lues' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// Exemple de route pour enregistrer l'abonnement
router.post('/subscribe-to-push-notifications', async (req, res) => {
    const { subscription } = req.body;
    try {
        const UserModel = req.db.model('User', User.schema);
        let user = await UserModel.findById(req.user.userId);
        if (!user) return res.status(400).send('Utilisateur non trouvé');

        user.pushSubscription = subscription;
        user.pushNotificationsIsSubscribe = true;
        await user.save();

        setTimeout(() => {
            pushNotificationService.sendPushNotification([subscription], { title: 'Bienvenue', body: 'Vous êtes maintenant abonné aux notifications push' });
        }, 10000);

        res.status(200).json({ message: 'Abonnement enregistré avec succès' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// Renvoie le rôle de l'utilisateur (Tous les utilisateurs)
router.get('/role', async (req, res) => {
    try {
        const UserModel = req.db.model('User', User.schema);

        if (!req.user || !req.user.role) {
            return res.status(401).send('Utilisateur non authentifié ou rôle non défini');
        }

        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        res.json({ role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// Informations utilisateur
router.get('/info', async (req, res) => {
    try {
        const UserModel = req.db.model('User', User.schema);
        const userNotificationModel = req.db.model('userNotification', userNotification.schema);

        if (!req.user) {
            return res.status(401).send('Utilisateur non authentifié');
        }

        const user = await UserModel.findById(req.user.userId)
            .select('-token -password -resetToken')
            .populate({
                path: 'notifications.notification',
                model: 'userNotification',
            });
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        // Filtrer les notifications valides (exclure les notifications nulles)
        let validNotifications = user.notifications.filter(n => n.notification);

        // Trier les notifications par `createdAt` décroissant
        validNotifications.sort((a, b) => {
            return new Date(b.notification.createdAt) - new Date(a.notification.createdAt);
        });

        // Limiter aux 2 notifications les plus récentes
        validNotifications = validNotifications.slice(0, 100);

        // Mettre à jour l'objet utilisateur avec les notifications filtrées
        user.notifications = validNotifications;
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// CRUD Operations

// Créer un nouvel utilisateur (superadmin)
router.post('/', checkRole(['superadmin']), async (req, res) => {
    const { username, password, role, email, phone } = req.body;
    try {
        const UserModel = req.db.model('User', User.schema);

        let existingUser = await UserModel.findOne({ username });
        if (existingUser) return res.status(400).send('L\'utilisateur existe déjà');

        const newUser = await UserModel.create({ username, password, role, email, phone });
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// Lire tous les utilisateurs (superadmin seulement)
router.get('/', checkRole(['superadmin']), async (req, res) => {
    try {
        const UserModel = req.db.model('User', User.schema);

        const users = await UserModel.find().select('-token');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// Lire un utilisateur spécifique (superadmin seulement)
router.get('/:id', checkRole(['superadmin']), async (req, res) => {
    try {
        const UserModel = req.db.model('User', User.schema);

        const user = await UserModel.findById(req.params.id).select('-token');
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// Mettre à jour un utilisateur (admin seulement ou l'utilisateur lui-même)
router.put('/:id', async (req, res) => {
    const { firstName, lastName, password, role, email, phone, mailFeedSubscription, mailFeedMail, pushNotification } = req.body;

    try {
        const UserModel = req.db.model('User', User.schema);
        let user = await UserModel.findById(req.params.id);
        if (!user)
            return res.status(404).send('Utilisateur non trouvé');
        let userWhoAsk = await UserModel.findById(req.user.userId);
        if (!userWhoAsk)
            return res.status(404).send('Utilisateur non trouvé');
        // Vérification des permissions
        if (userWhoAsk.role !== 'superadmin' && userWhoAsk._id.toString() !== req.params.id) {
            return res.status(403).send('Accès refusé');
        }

        // Mise à jour de l'utilisateur
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (role && userWhoAsk.role === 'superadmin') user.role = role; // Seuls les admins peuvent changer le rôle
        if (email) user.email = email;
        if (password) user.password = password;
        if (phone) user.phone = phone;
        if (mailFeedSubscription){
            user.mailFeedSubscription = mailFeedSubscription;
        } else if (mailFeedSubscription === false) {
            user.mailFeedSubscription = mailFeedSubscription;
        }
        if (pushNotification){
            user.pushNotificationsIsSubscribe = pushNotification;
        } else if (pushNotification === false) {
            user.pushNotificationsIsSubscribe = pushNotification;
        }
        if (mailFeedMail) user.mailFeedMail = mailFeedMail;
        if (mailFeedMail === '') user.mailFeedMail = mailFeedMail;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// Supprimer un utilisateur (admin seulement)
router.delete('/:id', checkRole(['superadmin']), async (req, res) => {
    try {
        const UserModel = req.db.model('User', User.schema);

        const userId = req.params.id;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        if (user) {
            user.role = 'guest';
            await user.save();
        }
        res.json({ msg: 'Utilisateur supprimé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

module.exports = router;