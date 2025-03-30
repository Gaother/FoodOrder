import React from 'react';

const TabStatistiques = ({ product }) => {
    if (!product) return null;

    const getStatus = () => {
        if (product.lessOrigin) {
            return 'Compétitif';
        } else if (product.diff <= 2) {
            return 'Prix égal';
        } else {
            return 'Non compétitif';
        }
    };

    const getStatusColor = () => {
        if (product.lessOrigin) {
            return 'text-green-500';
        } else if (product.diff <= 2) {
            return 'text-blue-500';
        } else {
            return 'text-red-500';
        }
    };

    return (
        <div className=''>
            <h2 className="text-lg font-bold mb-4">Statistiques</h2>
            <div className="space-y-2">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between">
                        <span>Status :</span>
                        <span className={getStatusColor()}>{getStatus()}</span>
                    </div>
                </div>
                {product.discount ? (
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between">
                            <span>Promotion :</span>
                            <span className='text-orange-500'>Oui</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between">
                            <span>Promotion :</span>
                            <span>Non</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TabStatistiques;