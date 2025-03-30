const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const UserHistory = require('../../models/userHistory');
const checkRole = require('../../middleware/roleMiddleware');
const userHistoryLogger = require('../../middleware/userHistoryMiddleware');

router.get('/', checkRole(['superadmin', 'admin']), async (req, res) => {
    try {
        const UserModel = req.db.model('User', User.schema);  // Utilisez req.db pour accéder à la base
        const UserHistoryModel = req.db.model('UserHistory', UserHistory.schema);  // Utilisez req.db pour accéder à la base
        const userHistories = await UserHistoryModel.find().sort({ createdAt: -1 }).populate({
            path: 'userId',
            model: UserModel,
            select: 'firstName lastName companyName email phone'
        });
        res.status(200).json(userHistories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.get('/user-histories/:id', checkRole(['superadmin', 'admin']), async (req, res) => {
//     try {
//         const userHistory = await User.findById(req.params.id);
//         res.status(200).json(userHistory);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

module.exports = router;