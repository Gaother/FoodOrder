import React, { useState } from 'react';
import api from '../../api/api';

const DownloadDbBackupButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const handleDownloadJSON = async (filename) => {
        try {
            const response = await api.getDBBackupItem(filename);

            const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Il y a eu un problème avec le téléchargement du fichier JSON:', error);
        }
    };

    const handleDownloadAll = async () => {
        try {
            setIsLoading(true); // Définir isLoading à true pour afficher l'animation de chargement

            const response = await api.getDBBackupList();
            const files = response.data.files;
            setFiles(files);

            // Télécharger chaque fichier
            for (const file of files) {
                await handleDownloadJSON(file);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des fichiers de sauvegarde:', error);
        } finally {
            setIsLoading(false); // Définir isLoading à false pour arrêter l'animation de chargement
        }
    };

    return (
        <div className='flex flex-col items-center'>
            <button
                onClick={handleDownloadAll}
                className="mt-8 w-full whitespace-nowrap bg-yellow-500 text-white active:bg-yellow-600 hover:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                disabled={isLoading} // Désactiver le bouton pendant le chargement
            >
                {isLoading ? 'Chargement...' : 'DB Backup'}
            </button>
        </div>
    );
};

export default DownloadDbBackupButton;