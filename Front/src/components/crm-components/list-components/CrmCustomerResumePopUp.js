import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import CrmProductResumePopUpLeftInfo from './CrmCustomerResumePopUpLeftInfo';
import CrmCustomerResumePopUpRightInfo from './CrmCustomerResumePopUpRightInfo';
import api from '../../../api/api'; // Vérifiez le chemin d'accès

function CrmProductResumePopUp({ customer = null, graph_id = null, onClose }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [customerId, setCustomerId] = useState(null);
    const [customerData, setCustomerData] = useState(customer);

    useEffect(() => {
        if (customer) {
            setCustomerId(customer._id);
            setCustomerData(customer);
        } else if (graph_id) {
            setCustomerId(graph_id);
        } else {
            const urlGraphId = queryParams.get('graph_id');
            if (urlGraphId) {
                setCustomerId(urlGraphId);
            }
        }
    }, [graph_id, customer, queryParams]);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!customer && customerId) {
                try {
                    const response = await api.getProductById(customerId);
                    if (response.status === 200) {
                        setCustomerData(response.data);
                    } else {
                        console.error('Failed to fetch product data, status:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            }
        };

        fetchProductData();
    }, [customer, customerId]);

    useEffect(() => {
        if (customerId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [customerId]);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-filter backdrop-blur-sm" onClick={handleBackgroundClick}>
            <div className="bg-white rounded-lg p-4 max-w-6xl w-full shadow-lg overflow-y-auto relative flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="text-left text-xl font-bold pb-2 border-b-2">{customer.lastName} {customer.firstName}</div>
                <button
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl"
                    onClick={onClose}
                >
                    <FaTimes />
                </button>
                {customerData ? (
                    <div className="flex flex-col md:flex-row w-full">
                        <div className="w-full md:w-2/6 border-r-2">
                            <CrmProductResumePopUpLeftInfo customer={customerData} />
                        </div>
                        <div className="w-full md:w-4/6">
                            <CrmCustomerResumePopUpRightInfo customer={customerData} />
                        </div>
                    </div>
                ) : (
                    <p>Chargement des données...</p>
                )}
            </div>
        </div>
    );
}

export default CrmProductResumePopUp;