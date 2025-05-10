import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaClock, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import DownloadOrderPdfButton from './DownloadOrderPdfButton';
import api from '../../../api/api';

const OrderItemComponent = ({ order, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editMode, setEditMode] = useState(null); // To track which product is being edited
  const [editValues, setEditValues] = useState({});
  const [apiError, setApiError] = useState('');

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = (action) => {
    onStatusChange(order._id, action);
  };

  const defineStatut = (order) => {
    if (order.adminCanceled) {
      return (
        <div className="flex items-center bg-red-100 text-red-600 rounded-full px-3 py-1">
          <FaTimesCircle className="mr-2" />
          Annulée par l'administrateur
        </div>
      );
    } else if (order.userCanceled) {
      return (
        <div className="flex items-center bg-yellow-100 text-yellow-600 rounded-full px-3 py-1">
          <FaExclamationTriangle className="mr-2" />
          Annulée par l'utilisateur
        </div>
      );
    } else if (order.adminValidated) {
      return (
        <div className="flex items-center bg-green-100 text-green-600 rounded-full px-3 py-1">
          <FaCheckCircle className="mr-2" />
          Payée
        </div>
      );
    } else if (order.userValidated) {
      return (
        <div className="flex items-center bg-blue-100 text-blue-600 rounded-full px-3 py-1">
          <FaClock className="mr-2" />
          Pas encore payée
        </div>
      );
    } else {
      return (
        <div className="flex items-center bg-gray-100 text-gray-600 rounded-full px-3 py-1">
          <FaClock className="mr-2" />
          Panier en cours
        </div>
      );
    }
  };

  const handleEditClick = (product) => {
    setEditMode(product._id);
    setEditValues({
      price: product.price,
      quantity: product.quantity,
    });
  };

  const handleEditCancel = () => {
    setEditMode(null);
    setEditValues({});
    setApiError('');
  };

  const handleEditConfirm = async (product) => {
    try {
      const body = {
        productID: product.product._id,
        productQuantity: editValues.quantity,
        productPrice: editValues.price,
      };
      await api.updateCart(order._id, body);
      setEditMode(null);
      setApiError('');
      // Update product values after successful API call
      product.price = editValues.price;
      product.quantity = editValues.quantity;
    } catch (error) {
      setApiError(error);
      setTimeout(() => setApiError(""),3000); // Réinitialiser après 1 seconde
    }
  };

  const formatDate = (date) => {
    let newDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return newDate.charAt(0).toUpperCase() + newDate.slice(1);
  }

  return (
    <div className="bg-white p-4 shadow rounded-lg w-full">
      <div className="flex lg:flex-row flex-col justify-between lg:items-center border-gray-200 ">
        <div className="lg:w-3/12">
          <p className="text-lg font-bold text-gray-600">{order.user.firstName} {order.user.lastName}</p>
          <p className="text-lg text-gray-600">{order.user.phone}</p>
        </div>
        <div className="lg:w-2/6 lg:text-center flex flex-col">
          <p className="text-lg text-gray-600 font-bold">
            {order.dateLivraison ? formatDate(new Date(order.dateLivraison)): 'N/A'}
          </p>
          <p className="text-lg text-gray-600">
            {order.lieuLivraison ? order.lieuLivraison : 'N/A'}
          </p>
        </div>
        <div className="lg:w-1/6 lg:text-center">
          <p>
            <span className="text-lg text-gray-600">
              {order.products.length > 1
                ? order.products.length + ' articles'
                : order.products?.[0].product.nom}
            </span>
          </p>
        </div>
        <div className="lg:w-2/6 flex flex-row justify-between whitespace-nowrap">
          <div className="lg:py-0 py-2">
            {defineStatut(order)}
          </div>
          <div className="flex lg:justify-center items-center">
            <button onClick={toggleExpand} className="bg-gray-200 p-2 rounded-full">
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          {order.adminValidated && !order.adminCanceled && <div className='mb-4 mr-1'><DownloadOrderPdfButton order={order}/></div>}
          <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2 mb-2 font-semibold">
            <p className="w-3/6 text-gray-800">Produit</p>
            <p className="w-1/6 text-gray-800">Prix Unitaire</p>
            <p className="w-1/6 text-gray-800">
              <span className="md:hidden">Qty</span>
              <span className="hidden md:inline">Quantité</span>
            </p>
            <p className="w-1/6 text-gray-800">Total</p>
            {!order.adminCanceled && !order.adminValidated && !order.userCanceled && order.userValidated && <p className="w-1/6 text-gray-800">
              <span className="md:hidden"></span>
              <span className="hidden md:inline">Action</span>
            </p>}
          </div>

          <ul className="">
            {order.products.map((item) => (
              <div key={item.product._id}>
                <li className="flex justify-between items-center py-4">
                  <div className="w-3/6 flex flex-col">
                    <p className="text-base font-semibold text-gray-900">{item.product.nom}</p>
                    {item.specifications.map(((spec, index) => (
                      <div key={index} className="flex items-center">
                        <p className="text-sm text-gray-500">{spec.nameParent} : {spec.value}</p>
                      </div>
                    )))}
                  </div>
                  <div className="w-1/6 flex justify-start">
                    {editMode === item._id ? (
                      <input type="number" value={editValues.price} onChange={(e) => setEditValues({ ...editValues, price: e.target.value })} className="border rounded-md p-1 max-w-14"/>
                    ) : (
                      <p className="text-sm text-gray-900">{item.price} €</p>
                    )}
                  </div>
                  <div className="w-1/6 flex justify-center md:justify-start">
                    {editMode === item._id ? (
                      <input type="number" value={editValues.quantity} onChange={(e) => setEditValues({ ...editValues, quantity: e.target.value })} className="border rounded-md p-1 max-w-14 "/>
                    ) : (
                      <p className="text-sm text-gray-900">{item.quantity}</p>
                    )}
                  </div>
                  <div className="w-1/6 flex justify-end md:justify-start">
                    <p className="text-sm text-gray-900">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                  {!order.adminCanceled && !order.adminValidated && !order.userCanceled && order.userValidated &&<div className="w-1/6 flex justify-end md:justify-start">
                    {editMode === item._id ? (
                      <>
                        <button onClick={() => handleEditConfirm(item)} className="text-green-500 ml-2"><FaCheck /></button>
                        <button onClick={handleEditCancel} className="text-red-500 ml-2"><FaTimes /></button>
                      </>
                    ) : (
                      <button onClick={() => handleEditClick(item)} className="text-blue-500"><FaPen /></button>
                    )}
                  </div>}
                </li>
                <div className="border-b-2 border-gray-200"/>
              </div>
            ))}
          </ul>

          {apiError && <p className="text-red-500 mt-2">{apiError}</p>}

          <div className="py-2 border-b-2 border-gray-200">
            <p className="text-md font-semibold text-gray-900">
              Commentaire: {order.comment ? order.comment : 'Aucun'}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Total: {order.products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} €
            </p>
            <br/>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => handleStatusChange('validate')}
              className={`px-4 py-2 rounded-md ${order.adminValidated || order.userCanceled || (order.userValidated === false) || order.adminCanceled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white'}`}
              disabled={order.adminValidated || order.userCanceled || order.adminCanceled || (order.userValidated === false)}
            >
              Valider
            </button>
            <button
              onClick={() => handleStatusChange('cancel')}
              className={`px-4 py-2 rounded-md ${order.adminCanceled || order.userCanceled || (order.userValidated === false) ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-red-500 text-white'}`}
              disabled={order.adminCanceled || order.userCanceled || (order.userValidated === false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItemComponent;