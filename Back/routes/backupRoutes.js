const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const EJSON = require('mongodb-extended-json');
const router = express.Router();
const checkRole = require('../middleware/roleMiddleware');


// Chemin du répertoire temporaire où les fichiers de sauvegarde seront enregistrés
const backupDir = path.join(__dirname, 'temp_backups');

// S'assurer que le répertoire de sauvegarde existe
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Fonction utilitaire pour vérifier et sérialiser les types MongoDB
const serializeValue = (value) => {
  if (value instanceof mongoose.Types.ObjectId) {
    return { $oid: value.toString() };
  } else if (value instanceof Date) {
    return { $date: value.toISOString() };
  } else if (value !== null && value.constructor && value.constructor.name === 'Decimal128') {
    return { $numberDecimal: value.toString() };
  } else if (value !== null && value.constructor && value.constructor.name === 'Long') {
    return { $numberLong: value.toString() };
  } else if (Buffer.isBuffer(value)) {
    return { $binary: value.toString('base64') };
  } else if (value instanceof RegExp) {
    return { $regex: value.source, $options: value.flags };
  } else if (Array.isArray(value)) {
    return value.map(serializeValue); // Serialize array elements
  } else if (value !== null && typeof value === 'object') {
    return serializeDocument(value); // Serialize sub-documents
  } else if (typeof value === 'boolean') {
    return value;
  } else if (typeof value === 'number' && Number.isInteger(value)) {
    return { $numberInt: value.toString() };
  } else if (typeof value === 'number') {
    return { $numberDouble: value.toString() };
  }
  return value;
};

// Fonction pour convertir les documents Mongoose en JSON avec des types MongoDB sérialisés
const serializeDocument = (doc) => {
  const serializedDoc = {};
  for (const key in doc) {
    if (doc.hasOwnProperty(key)) {
      try {
        serializedDoc[key] = serializeValue(doc[key]);
      } catch (err) {
        console.error(`Error serializing key ${key} with value ${doc[key]}:`, err);
      }
    }
  }
  return serializedDoc;
};

// Route pour générer les fichiers JSON de sauvegarde
router.get('/generate', checkRole(['admin', 'superadmin']), async (req, res) => {
  try {
    // Supprimer les fichiers précédents s'ils existent
    if (fs.existsSync(backupDir)) {
      fs.rmSync(backupDir, { recursive: true });
    }
    fs.mkdirSync(backupDir, { recursive: true });

    // Obtenir tous les noms des modèles enregistrés dans Mongoose
    const modelNames = mongoose.modelNames();

    // Parcourir tous les modèles et sauvegarder leurs données en JSON
    for (const modelName of modelNames) {
      const Model = mongoose.model(modelName);
      const data = await Model.find({}).lean(); // Obtenir toutes les données du modèle

      // Chemin du fichier de sauvegarde pour ce modèle
      const filePath = path.join(backupDir, `${modelName}.json`);

      // Écrire les données dans le fichier JSON en utilisant EJSON
      const serializedData = data.map(doc => serializeDocument(doc));
      fs.writeFileSync(filePath, EJSON.stringify(serializedData, null, 2), 'utf8');
    }

    const files = fs.readdirSync(backupDir);
    res.status(200).json({ files });
  } catch (error) {
    console.error('Erreur dans le processus de sauvegarde:', error);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde des données.' });
  }
});

// Route pour télécharger un fichier JSON spécifique
router.get('/download/:filename', checkRole(['admin', 'superadmin']), (req, res) => {
  const filePath = path.join(backupDir, req.params.filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, req.params.filename, (err) => {
      if (err) {
        console.error("Erreur lors de l'envoi du fichier:", err);
        res.status(500).send("Erreur lors du téléchargement du fichier.");
      } else {
        console.log(`Fichier ${req.params.filename} envoyé pour téléchargement`);
      }
    });
  } else {
    res.status(404).send("Fichier non trouvé");
  }
});

module.exports = router;