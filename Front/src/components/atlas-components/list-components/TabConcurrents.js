import React from 'react';
import { FaSearch } from 'react-icons/fa';

const TabConcurrents = ({ product }) => {
    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Concurrents</h2>
            <div className="space-y-4">
                {product.recentPriceHistories.map(history => (
                    <div key={history._id} className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xl">{history.site}</span>
                            <span className='flex flex-row items-center'>
                                <span className='text-xl font-bold'>{history.price} €</span>
                                <div className='pl-4'>
                                    <a href={history.productURL} target="_blank" rel="noopener noreferrer"
                                        className="inline-block p-2 rounded-full bg-blue-500 hover:bg-blue-700">
                                        <FaSearch className="text-white" />
                                    </a>
                                </div>
                            </span>
                        </div>
                        <div className="text-gray-500 text-sm">
                            <p><u>Prix en promotion:</u> {history.discountPrice} €</p>
                            <p><u>Offre promotionnel:</u> {history.discountCode}</p>
                            <p><u>Information du stock:</u> {history.stockInfo}</p>
                            <p><u>Frais de livraison:</u> {history.shippingPrice} €</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabConcurrents;