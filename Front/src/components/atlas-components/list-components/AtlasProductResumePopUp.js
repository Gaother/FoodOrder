import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import AtlasProductResumePopUpLeftInfo from './AtlasProductResumePopUpLeftInfo';
import AtlasProductResumePopUpRightInfo from './AtlasProductResumePopUpRightInfo';
import api from '../../../api/api'; // Vérifiez le chemin d'accès

function AtlasProductResumePopUp({ product = null, graph_id = null, onClose }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [productId, setProductId] = useState(null);
    const [productData, setProductData] = useState(product);

    useEffect(() => {
        if (product) {
            setProductId(product.product._id);
            setProductData(product);
        } else if (graph_id) {
            setProductId(graph_id);
        } else {
            const urlGraphId = queryParams.get('graph_id');
            if (urlGraphId) {
                setProductId(urlGraphId);
            }
        }
    }, [graph_id, product, queryParams]);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!product && productId) {
                try {
                    const response = await api.getProductById(productId);
                    if (response.status === 200) {
                        setProductData(response.data);
                    } else {
                        console.error('Failed to fetch product data, status:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            }
        };

        fetchProductData();
    }, [product, productId]);

    useEffect(() => {
        if (productId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [productId]);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-filter backdrop-blur-sm" onClick={handleBackgroundClick}>
            <div className="bg-white rounded-lg p-4 max-w-6xl w-full shadow-lg overflow-y-auto relative flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="text-left text-xl font-bold pb-2 border-b-2">{product.product.designation}</div>
                <button
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl"
                    onClick={onClose}
                >
                    <FaTimes />
                </button>
                {productData ? (
                    <div className="flex w-full">
                        <div className="w-1/4 border-r-2">
                            <AtlasProductResumePopUpLeftInfo product={productData} />
                        </div>
                        <div className="w-3/4">
                            <AtlasProductResumePopUpRightInfo product={productData} />
                        </div>
                    </div>
                ) : (
                    <p>Chargement des données...</p>
                )}
            </div>
        </div>
    );
}

export default AtlasProductResumePopUp;