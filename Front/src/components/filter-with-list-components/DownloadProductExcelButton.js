import React, { useState } from 'react';
import api from '../../api/api';
import { FaFileCsv } from 'react-icons/fa';

const DownloadProductExcelButton = ({ order }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownloadExcel = async () => {
        try {
            setIsLoading(true);
            // Make the API call to download the Excel as a blob
            const response = await api.downloadProductExcel({ responseType: 'blob' }); // Specify responseType as 'blob'

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/excel' }));
            const link = document.createElement('a');
            link.href = url;
            const date = new Date();
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getHours()}h${date.getMinutes()}`;
            link.setAttribute('download', `stockDestockdis-${formattedDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Il y a eu un problème avec le téléchargement du fichier Excel:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleDownloadExcel}
                className="whitespace- w-full flex items-center justify-center bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                disabled={isLoading}
            >
                {isLoading ? 'Chargement...' : <><FaFileCsv className="mr-2 text-xl" />Télécharge le stock au format Excel</>}
            </button>
        </div>
    );
};

export default DownloadProductExcelButton;