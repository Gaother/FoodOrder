import React from 'react';

const TabDeployedOrder = ({ order }) => {
    return (
        <div className="max-h-24 md:max-h-96 overflow-y-scroll bg-gray-100 rounded-lg shadow-inner p-4">
            <div>
                <h3 className="text-lg font-bold mb-4 border-b-2">Actions de la commande</h3>
                <div className="flex space-x-4 mb-4">
                    <div className="flex-1 bg-blue-100 rounded-lg p-4 shadow-md">
                        <h4 className="text-lg font-semibold mb-4">Pré-Commande</h4>
                        <div className="space-y-4">
                            <div>
                                <p>Signaler un produit commander aux fournisseurs.</p>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2">Signaler</button>
                            </div>
                            <div>
                                <p>Signaler un produit fournisseurs qui vient d'arriver.</p>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2">Signaler</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-green-100 rounded-lg p-4 shadow-md">
                        <h4 className="text-lg font-semibold mb-4">Commande</h4>
                        <div className="space-y-4">
                            <div>
                                <p>Signaler le début de la préparation de la commande.</p>
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2">Signaler</button>
                            </div>
                            <div>
                                <p>Signaler le passage au livreur.</p>
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2">Signaler</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-yellow-100 rounded-lg p-4 shadow-md">
                        <h4 className="text-lg font-semibold mb-4">Post-Commande</h4>
                        <div className="space-y-4">
                            <div>
                                <p>Signaler l'arriver prochaine du livreur.</p>
                                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2">Signaler</button>
                            </div>
                            <div>
                                <p>Demander un commentaire sur la commande.</p>
                                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2">Signaler</button>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-bold mb-4 border-b-2">Détails de la commande</h3>
                <div className="space-y-2">
                    <p><strong>Origine du site:</strong> {order.originSite.name} - {order.originSite.url}</p>
                    <p><strong>Transporteur:</strong> {order.carrier.name} <br /> {order.carrier.url}</p>
                    <p><strong>Numéro de référence de commande:</strong> {order.orderReference}</p>
                    <p><strong>ID Prestashop:</strong> {order.prestashopId}</p>
                    <p><strong>Numéro de suivi:</strong> {order.shippingNumber || 'Inconnu'}</p>
                    <p><strong>Date d'expédition:</strong> {order.dateDelivery === "0001-01-01T00:00:00.000Z" ? 'Inconnu' : new Date(order.dateDelivery).toLocaleDateString('fr-FR')}</p>
                    <p className='py-4 border-y-2'><strong>Produits associés:</strong></p>
                    <ul className="pl-4 list-disc">
                        {order.associatedProducts.map(product => (
                            <div key={product._id}>
                                <div className='border-b-2 py-2 flex flex-row items-center'>
                                    <div>
                                        <img src={product.imageLink} alt={product.designation} className="w-16 h-16 object-cover mr-4" />
                                    </div>
                                    <div>
                                        <strong>{product.designation}</strong> - {product.reference}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TabDeployedOrder;