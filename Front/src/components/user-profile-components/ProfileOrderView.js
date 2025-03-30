import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AuthContext } from '../../components/AuthContext'; 
import { FaPlus, FaMinus, FaTrash, FaShoppingCart, FaShoppingBag } from 'react-icons/fa';
import { set } from 'date-fns';

const ProfileOrderView = ({order, changeOrder}) => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState([]);
    const [error, setError] = useState(null);
    const [errorId, setErrorId] = useState(null);
  
    useEffect(() => {
      fetchCartData();
    }, []);
  
    const fetchCartData = async (response = "") => {
        if (response === "") {
            const cart = order; // Accéder au premier panier (si plusieurs)
            if (!cart) {
            setCartData([]);
            return;
            }
            setCartData(cart.products);
            changeOrder(order._id, order);
        } else {
            const cart = response.data; // Accéder au premier panier (si plusieurs)
            if (!cart) {
            setCartData([]);
            return;
            }
            setCartData(cart.products);
            changeOrder(order._id, response.data);
        };
    };
  
  
    const addProductQuantityToCart = async (productId, currentQty, change) => {
      try {
        const response = await api.addProductToCart({
            cartID: order._id,
          productID: productId,
          productQTY: change, // Ajoute ou retire 1 selon le bouton pressé
        });
        fetchCartData(response); // Recharger les données après la mise à jour
      } catch (error) {
        setError(error);
        setErrorId(productId);
        setTimeout(() => setError(""), 3000); // Réinitialiser après 1 seconde
        console.error('Erreur lors de la mise à jour de la quantité:', error);
      }
    };
  
    const removeProductQuantityToCart = async (productId, currentQty, change) => {
      try {
        const response = await api.removeProductInCart({
            cartID: order._id,
          productID: productId,
          productQTY: change, // Ajoute ou retire 1 selon le bouton pressé
        });
        fetchCartData(response); // Recharger les données après la mise à jour
      } catch (error) {
        setError(error);
        setErrorId(productId);
        setTimeout(() => setError(""), 3000); // Réinitialiser après 1 seconde
        console.error('Erreur lors de la mise à jour de la quantité:', error);
      }
    };
  
    const removeProductFromCart = async (productId, quantity) => {
      try {
        // Supprime la quantité totale pour enlever l'article du panier
        const response = await api.removeProductInCart({
            cartID: order._id,
          productID: productId,
          productQTY: quantity,
        });
        fetchCartData(response); // Recharger le panier après suppression
      } catch (error) {
        setError(error);
        setErrorId(productId);
        setTimeout(() => setError(""), 3000); // Réinitialiser après 1 seconde
        console.error('Erreur lors de la suppression du produit du panier:', error);
      }
    };
  
  return (
      <div className="flex justify-center bg-gray-50">
          {/* Bloc Gauche : Informations sur les produits du panier */}
          <div className="">
            <div className="p-6">
              <ul className="">
                <li className="flex justify-between items-center border-b pb-3">
                  <span className="text-lg font-semibold text-gray-700">Article(s)</span>
                  <span className="text-lg font-semibold text-gray-700">Quantité</span>
                </li>
                {cartData.map(item => (
                  <li key={item.product._id} className="flex flex-col w-auto items-center py-6 border-b">
                    <div className="flex flex-col w-full items-center">
                        {error && errorId === item.product._id && <p className="text-sm text-red-500 w-full">{error}</p>}
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="flex flex-col space-y-1">
                            <p className="text-base font-semibold text-gray-900">{item.product.designation}</p>
                            <p className="text-sm text-gray-500">Marque: {item.product.brand.brand}</p>
                            <p className="text-sm text-gray-500">Réf: {item.product.reference}</p>
                            <p className="text-sm text-gray-500">EAN: {item.product.ean}</p>
                            <p className="text-sm text-gray-500">Prix unitaire: {item.price} €</p>
                        </div>
                        <div className="flex flex-col items-center space-y-3">
                            <div className="flex items-start space-x-3">
                                {/* Bouton "-" pour diminuer la quantité */}
                                {!order.adminValidated && !order.adminCanceled && !order.userCanceled && <button
                                onClick={() => removeProductQuantityToCart(item.product._id, item.quantity, 1)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition"
                                disabled={item.quantity <= 0}
                                >
                                <FaMinus />
                                </button>}
            
                                {/* Champ pour afficher la quantité */}
                                <span className="text-lg font-semibold border-gray-300 border-2 py-1 px-4 text-center rounded-md">
                                {item.quantity}
                                </span>
            
                                {/* Bouton "+" pour augmenter la quantité */}
                                {!order.adminValidated && !order.adminCanceled && !order.userCanceled && <button
                                onClick={() => addProductQuantityToCart(item.product._id, item.quantity, 1)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition"
                                >
                                <FaPlus />
                                </button>}
                            </div>
                            {/* Bouton pour supprimer le produit */}
                            {!order.adminValidated && !order.adminCanceled && !order.userCanceled && <button
                                onClick={() => removeProductFromCart(item.product._id, item.quantity)}
                                className="text-red-500 hover:text-red-700 transition mt-2"
                                >
                                <FaTrash />
                            </button>}
                        </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* <div className="w-full lg:w-4/12 bg-gray-100 rounded-lg shadow p-6 ">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Récapitulatif</h2>
            <div className="mb-6">
              <span className="text-lg font-medium text-gray-600">Total des articles :</span><br />
              <span className="text-xl font-bold text-gray-800">{totalItems} produit(s)</span>
            </div>
            <button
              onClick={() => validateActiveCart()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
            >
              Valider ma commande
            </button>
          </div> */}
        </div>
    );
  };
  
  export default ProfileOrderView;