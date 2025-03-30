import React, { useState } from 'react';
import api from '../../api/api';
import { FaFileCsv } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

const UpdateProductStockButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    // Fonction pour gérer la sélection du fichier et son upload
    const handleFileSelect = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];

            if (file && window.confirm('Voulez-vous vraiment envoyer ce fichier ?')) {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('csv', file);

                try {
                    const response = await api.uploadOpenSiCSVToUpdateProductStock(formData);

                    // Création du fichier .txt à télécharger
                    const date = new Date();
                    const fileName = `Produit Inconnu ${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}h${date.getMinutes()}.txt`;

                    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/plain' }));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    window.location.reload();

                    // alert('Fichier CSV uploadé avec succès.');
                } catch (error) {
                    console.error('Erreur lors de l\'upload du fichier CSV:', error);
                    alert('Erreur lors de l\'upload du fichier CSV.');
                } finally {
                    setIsLoading(false);
                }
            }
        };

        // Ouvrir la fenêtre de sélection du fichier
        fileInput.click();
    };

    return (
        <div className='w-full flex items-center justify-center'>
            <button
                onClick={handleFileSelect}
                className="w-full flex items-center justify-center bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-4 rounded-md shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                disabled={isLoading}
                >
                {isLoading ? (
                    <FaSpinner className="animate-spin text-xl" />
                ) : (
                    <>
                        <FaFileCsv className="mr-2 text-xl sm:block hidden" />
                        Mettre à jour le stock
                    </>
                )}
            </button>
        </div>
    );
};

export default UpdateProductStockButton;