import React, { useState } from 'react';
import api from '../../../api/api';
import { FaPrint } from 'react-icons/fa';

const DownloadProductExcelButton = ({ order }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownloadPDF = async () => {
        try {
            setIsLoading(true);
            // Make the API call to download the PDF as a blob
            const response = await api.downloadCartPdf(order._id, { responseType: 'blob' }); // Specify responseType as 'blob'

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${order.orderID}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Il y a eu un problème avec le téléchargement du fichier PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleDownloadPDF}
                className="whitespace-nowrap bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                disabled={isLoading}
            >
                {isLoading ? 'Chargement...' : <><FaPrint className="inline-block mr-2" />Imprimer la commande</>}
            </button>
        </div>
    );
};

export default DownloadProductExcelButton;