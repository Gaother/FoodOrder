// roleMiddleware.js
const User = require('../models/user');

const checkRole = roles => async (req, res, next) => {
    // Ici, vous devrez extraire le rôle de req (probablement après avoir vérifié le JWT)

    const UserModel = req.db.model('User', User.schema);
    if (!req.user || !req.user.role)
    return res.status(401).send('Utilisateur non authentifié ou rôle non défini');
    const user = await UserModel.findById(req.user.userId);
    if (!user)
    return res.status(404).send('Utilisateur non trouvé');


    const userRole = user.role;
    if (roles.includes(userRole)) {
        next();
    } else {
        res.status(403).send('Accès refusé');
    }
};
  
module.exports = checkRole;
  