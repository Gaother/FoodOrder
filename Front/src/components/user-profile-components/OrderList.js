import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { FaTimesCircle, FaCheckCircle, FaExclamationTriangle, FaClock, FaChevronRight } from 'react-icons/fa'; // Icons
import Loading from '../LoadingComponent';
import ProfileOrderView from './ProfileOrderView';
import DownloadOrderPdfButton from '../back-office-components/orders/DownloadOrderPdfButton'

const OrderList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null); // Gérer l'état du menu ouvert

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      const response = await api.getUserCart();
      const orders = response.data;
      if (!orders) {
        setOrders([]);
        return;
      }
      setOrders(orders.reverse());
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
    }
  };

  const changeOrder = (orderID, newOrder) => {
    setOrders((prevOrders) =>
      !newOrder.products
        ? prevOrders.filter((order) => order._id !== orderID)
        : prevOrders.map((order) => (order._id === orderID ? newOrder : order))
    );
  };

  const defineStatut = (order) => {
    if (order.adminCanceled === true) {
      return (
        <div className="flex items-center bg-red-100 text-[#C60C30] rounded-full px-3 py-1">
          <FaTimesCircle className="mr-2" />
          Annulée par l'administrateur
        </div>
      );
    } else if (order.userCanceled === true) {
      return (
        <div className="flex items-center bg-yellow-100 text-yellow-600 rounded-full px-3 py-1">
          <FaExclamationTriangle className="mr-2" />
          Annulée par l'utilisateur
        </div>
      );
    } else if (order.adminValidated === true) {
      return (
        <>
          <div className="flex items-center bg-green-100 text-green-600 rounded-full px-3 py-1">
            <FaCheckCircle className="mr-2" />
            Paiement reçu
          </div>
          {/*<div className="flex self-center mt-2">
            <DownloadOrderPdfButton order={order} />
          </div>*/}
        </>
      );
    } else if (order.userValidated === true) {
      return (
        <div className="flex items-center bg-[#FFFBF3] text-[#948C1D] border border-[#948C1D] rounded-full px-3 py-1">
          <FaCheckCircle className="mr-2" />
          Paiement pas encore reçu
        </div>
      );
    } else {
      return (
        <div className="flex items-center bg-gray-100 text-gray-600 rounded-full px-3 py-1">
          <FaClock className="mr-2" />
          En attente de validation
        </div>
      );
    }
  };

  const toggleOrderDetails = (orderId) => {
    setOpenOrderId((prevOrderId) => (prevOrderId === orderId ? null : orderId)); // Ouvrir/fermer le menu
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <Loading color="orange" />
      </div>
    );
  }

  const userCancelOrder = async (cartID) => {
    try {
        await api.activeCartUserAction({ action: 'cancel', cartID });
        fetchOrdersData();
    } catch (error) {
        console.error('Erreur lors de la validation du panier:', error);
    }
  };

  if (orders.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center">
            <div className="text-center p-6 max-w-md">
                <h2 className="text-2xl font-bold mb-2">Vous n'avez pas de commandes</h2>
                <p className="text-gray-500 mb-6">
                    Vous n'avez pas encore valider de panier.
                </p>
            </div>
        </div>
    );
  }

  return (
    <div className="mx-auto my-8 overflow-y-auto" style={{ maxHeight: "100vh" }}>
      <ul className="space-y-4">
        {orders.map(order => {
          const totalQuantity = order.products.reduce((sum, product) => sum + product.quantity, 0);
          return (
            <li key={order._id} className="p-6 md:mr-4 bg-[#FFFBF3] shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 border-2 border-[#948C1D]">
              <div className="flex flex-col justify-between items-start w-full">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      <strong>Ref. Commande :</strong> {order.orderID}
                    </p>
                    <p className="text-gray-600">
                      <strong>Nombre de référence{order.products.length > 1 ? 's' : ''} :</strong> {order.products.length}
                    </p>
                    <p className="text-gray-600">
                      <strong>Nombre de produit{totalQuantity > 1 ? 's' : ''} :</strong> {totalQuantity}
                    </p>
                    <p className="text-gray-600">
                      <strong>Date de création :</strong> {new Date(order.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-600">
                      <strong>Dernière Modification :</strong> {new Date(order.updatedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-gray-600">
                      <strong>Commentaire :</strong> {order.comment ? order.comment : 'Aucun'}
                    </p>
                  </div>
                </div>

                <div className='flex flex-row items-start justify-between w-full'>
                  <div className="mt-2">
                    <p className="text-gray-600 font-semibold">Statut :</p>
                    <div className='flex flex-col'>
                      {defineStatut(order)}
                      <button
                        onClick={() => userCancelOrder(order._id)}
                        className={`py-1 px-2 mt-2 rounded-md transition font-semibold ${
                          order.adminValidated || order.adminCanceled || order.userCanceled
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#C60C30] hover:bg-red-600 text-white'
                        }`}
                        disabled={order.adminValidated || order.adminCanceled || order.userCanceled}
                        >
                        Annuler
                      </button>
                    </div>
                  </div>
                  <div className="self-end">
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className={`transform transition-transform duration-300 ${openOrderId === order._id ? 'rotate-90' : ''}`}
                      >
                      <FaChevronRight className="text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Détails de la commande : ProfileOrderView */}
                <div
                  className={`w-full overflow-y-scroll mt-4 transition-all duration-500 ease-in-out ${openOrderId === order._id ? 'max-h-96' : 'max-h-0'}`}
                >
                  {openOrderId === order._id && (
                    <div className="">
                      <ProfileOrderView order={order} changeOrder={changeOrder}/>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderList;