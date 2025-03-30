import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import api from '../../../api/api';
import TabDeployedOrder from './TabDeployedOrder'; // Assurez-vous d'importer correctement le composant

const TabCommandes = ({ customer }) => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orderIds = customer.orders.map(order => order._id);
                const response = await api.getOrdersByIds(customer.orders);
                setOrders(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des commandes :", error);
            }
        };

        fetchOrders();
    }, [customer.orders]);

    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null); // Si l'ID est déjà déplié, repliez-le
        } else {
            setExpandedOrderId(orderId); // Sinon, dépliez la commande sélectionnée
        }
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Commandes</h2>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order._id}>
                        <div 
                            className="bg-white rounded-lg shadow-md p-4"
                            
                        >
                            <div className="flex justify-between text-gray-500 cursor-pointer" onClick={() => toggleOrderDetails(order._id)}>
                                <div className="w-1/4">
                                    <p className='text-sm'><u>Date ajout:</u></p>
                                    <p>{new Date(order.dateAdd).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                </div>
                                <div className="w-1/4">
                                    <p className='text-sm'><u>État actuel:</u></p>
                                    <p>{order.currentState.name}</p>
                                </div>
                                <div className="w-1/4">
                                    <p className='text-sm'><u>Référence de commande:</u></p>
                                    <p>{order.orderReference}</p>
                                </div>
                                <div className="w-1/4">
                                    <p className='text-sm'><u>ID Prestashop:</u></p>
                                    <p>{order.prestashopId}</p>
                                </div>
                            </div>
                        {expandedOrderId === order._id && (
                            <div className="mt-4">
                                <TabDeployedOrder order={order} />
                            </div>
                        )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabCommandes;