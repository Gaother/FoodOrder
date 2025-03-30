import React, { useState } from 'react';
import api from '../../api/api';

const ProductReportsCSVButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownloadCSV = async () => {
        try {
            setIsLoading(true); // Définir isLoading à true pour afficher l'animation de chargement

            const response = await api.getCSVProductReport();
            const blob = new Blob([response.data], { type: 'text/csv; charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'download.csv';
            if (contentDisposition) {
                const decodedHeader = decodeURIComponent(contentDisposition);
                const fileNameMatch = decodedHeader.match(/filename="?(.+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    fileName = fileNameMatch[1].substring(0, fileNameMatch[1].length - 1);
                }
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Il y a eu un problème avec le téléchargement du fichier CSV:', error);
        } finally {
            setIsLoading(false); // Définir isLoading à false pour arrêter l'animation de chargement
        }
    };

    return (
        <button
            onClick={handleDownloadCSV}
            className="whitespace-nowrap bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            disabled={isLoading} // Désactiver le bouton pendant le chargement
        >
            {isLoading ? 'Chargement...' : 'Télécharger le CSV'}
        </button>
    );
};

export default ProductReportsCSVButton;
