require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const checkRole = require('../../middleware/roleMiddleware');
const router = express.Router();
const transporter = require('../../services/mail.service');


// Inscription
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const UserModel = req.db.model('User', User.schema);  // Utilisez req.db pour accéder à la base
        const lowerCaseEmail = email.toLowerCase();
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(lowerCaseEmail)) {
            return res.status(202).json({ message: 'Email invalide' });
        }
        let user = await UserModel.findOne({ email: lowerCaseEmail });
        if (!user) return res.status(202).json({ message: 'L\'utilisateur n\'existe pas'});
        const token = jwt.sign({ userId: user.id, role: user.role, timestamp: Date.now() }, JWT_SECRET, { expiresIn: '15m' });
        user.resetToken = token;
        await user.save();

        const mail = {
            from: process.env.SMTP_MAIL,
            to: lowerCaseEmail,
            subject: 'Réinitialisation du mot de passe',
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
                                Vous avez demandé la réinitialisation de votre mot de passe pour votre compte sur <strong>stock.destockdis.com</strong>.
                            </p>
                            <p style="font-family:Arial, sans-serif; font-size:16px; color:#333333; text-align:left; line-height:1.5;">
                                Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :
                            </p>
                            <div style="text-align:center; margin:30px 0;">
                                <a href="https://stock.destockdis.com/change-password?token=${token}" style="background-color:rgb(234,179,8) ; color:#ffffff; padding:15px 30px; text-decoration:none; font-size:16px; border-radius:5px; display:inline-block;">
                                    Réinitialiser mon mot de passe
                                </a>
                            </div>
                            <p style="font-family:Arial, sans-serif; font-size:14px; color:#666666; text-align:left; line-height:1.5;">
                                Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.
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
        };
        transporter.sendMail(mail, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email'});
            }
            console.log('Email sent:', info.response);
        });

        res.status(201).json({ message: 'Email envoyé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json(err.message);
    }
});

// Inscription
router.put('/:token', async (req, res) => {
    const { password } = req.body;
    try {
        const UserModel = req.db.model('User', User.schema);  // Utilisez req.db pour accéder à la base

        let user = await UserModel.findOne({ resetToken: req.params.token });
        if (!user)
            return res.status(202).json({ message: 'Le lien est invalide'});
        jwt.verify(req.params.token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(202).json({ message: 'Le lien est expiré'});
            } else {
                user.resetToken = null;
                user.password = password;
                user.save();
                res.status(201).json({ message: 'Mot de passe réinitialisé. Redirection en cours' });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json(err.message);
    }
});


module.exports = router;