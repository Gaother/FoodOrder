import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AuthContext } from '../../components/AuthContext'; 
import { FaPlus, FaMinus, FaTrash, FaShoppingCart, FaShoppingBag } from 'react-icons/fa';
import Loading from '../../components/LoadingComponent';


const CartPage = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [comment, setComment] = useState('');
  const [totalItems, setTotalItems] = useState(0); // Nombre total d'articles
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [errorId, setErrorId] = useState(null);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await api.getActiveUserCart();
      const cart = response.data[0]; // Accéder au premier panier (si plusieurs)
      if (!cart) {
        setCartData([]);
        calculateTotalItems([]); // Aucun article dans le panier
        setIsLoading(false);
        return;
      }
      setCartData(cart.products);
      calculateTotalItems(cart.products); // Calculer le nombre total d'articles
        setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
    }
  };

  const calculateTotalItems = (products) => {
    const total = products.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
  };

  const addProductQuantityToCart = async (productId, currentQty, change) => {
    try {
      await api.addProductToCart({
        productID: productId,
        productQTY: change, // Ajoute ou retire 1 selon le bouton pressé
      });
      fetchCartData(); // Recharger les données après la mise à jour
    } catch (error) {
      setError(error);
      setErrorId(productId);
      setTimeout(() => setError(""), 3000); // Réinitialiser après 1 seconde  
      console.error('Erreur lors de la mise à jour de la quantité:', error);
    }
  };

  const removeProductQuantityToCart = async (productId, currentQty, change) => {
    try {
      await api.removeProductInCart({
        productID: productId,
        productQTY: change, // Ajoute ou retire 1 selon le bouton pressé
      });
      fetchCartData(); // Recharger les données après la mise à jour
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
      await api.removeProductInCart({
        productID: productId,
        productQTY: quantity,
      });
      fetchCartData(); // Recharger le panier après suppression
    } catch (error) {
      setError(error);
      setErrorId(productId);
      setTimeout(() => setError(""), 3000); // Réinitialiser après 1 seconde  
      console.error('Erreur lors de la suppression du produit du panier:', error);
    }
  };

    const validateActiveCart = async () => {
        try {
            await api.activeCartUserAction({ action: 'validate', comment });
            navigate('/');
        } catch (error) {
          setCartError(error);
          setTimeout(() => setCartError(""), 3000); // Réinitialiser après 1 seconde
          console.error('Erreur lors de la validation du panier:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center bg-gray-100" style={{ minHeight: "84vh" }}>
                <div className="mb-4">
                    <FaShoppingCart className="text-yellow-500 text-6xl mx-auto" />
                </div>
                <Loading color='orange'/>
            </div>
        );
    }

  if (cartData.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center bg-gray-100" style={{ minHeight: "84vh" }}>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
                <div className="mb-4">
                    <FaShoppingCart className="text-gray-500 text-6xl mx-auto" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
                <p className="text-gray-500 mb-6">
                    Vous n'avez pas encore ajouté d'articles à votre panier.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="flex w-full items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md"
                >
                    <FaShoppingBag className="mr-2" />
                    Retourner à la boutique
                </button>
            </div>
        </div>
    );
}

return (
    <div className="flex justify-center bg-gray-50" style={{ minHeight: "84vh" }}>
      <div className="flex md:flex-row flex-col items-start w-full max-w-6xl mx-auto md:my-10 bg-white shadow-xl md:rounded-lg p-6">
        {/* Bloc Gauche : Informations sur les produits du panier */}
        <div className="w-full lg:w-8/12 mb-6 lg:mb-0 md:pr-6">
          <div className=" p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Votre panier</h2>
            <ul className="">
              <li className="flex justify-between items-center border-b pb-3">
                <span className="text-lg font-semibold text-gray-700">Article(s)</span>
                <span className="text-lg font-semibold text-gray-700">Quantité</span>
              </li>
              {cartData.map(item => (
                <li key={item.product._id} className="flex flex-col justify-between items-center py-6 border-b">
                  <div className="flex flex-col items-center">
                        {error && errorId === item.product._id && <p className="text-sm text-red-500 w-full">{error}</p>}
                    </div>
                  <div className="w-full flex items-center">
                    <div className="flex flex-col items-start space-y-1">
                      <p className="text-base font-semibold text-gray-900">{item.product.designation}</p>
                      <p className="text-sm text-gray-500">Marque: {item.product.brand.brand}</p>
                      <p className="text-sm text-gray-500">Réf: {item.product.reference}</p>
                      <p className="text-sm text-gray-500">EAN: {item.product.ean}</p>
                      <p className="text-sm text-gray-500">Prix unitaire: {item.price} €</p>
                    </div>
    
                    <div className="flex w-full flex-col items-end space-y-3">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-3">
                          {/* Bouton "-" pour diminuer la quantité */}
                          <button
                            onClick={() => removeProductQuantityToCart(item.product._id, item.quantity, 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition"
                            disabled={item.quantity <= 0}
                          >
                            <FaMinus />
                          </button>
      
                          {/* Champ pour afficher la quantité */}
                          <span className="text-lg font-semibold border-gray-300 border-2 py-1 px-4 text-center rounded-md">
                            {item.quantity}
                          </span>
      
                          {/* Bouton "+" pour augmenter la quantité */}
                          <button
                            onClick={() => addProductQuantityToCart(item.product._id, item.quantity, 1)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition"
                          >
                            <FaPlus />
                          </button>
      
                        </div>
                        {/* Bouton pour supprimer le produit */}
                        <button
                          onClick={() => removeProductFromCart(item.product._id, item.quantity)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Bloc Droit : Récapitulatif du panier */}
        <div className="w-full lg:w-4/12 bg-gray-100 rounded-lg shadow p-6 ">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Récapitulatif</h2>
          <div className="mb-6">
            <span className="text-lg font-medium text-gray-600">Total des articles :</span><br />
            <span className="text-xl font-bold text-gray-800">{totalItems} produit(s)</span>
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="text-lg font-medium text-gray-600">Commentaire :</label>
            <textarea
              id="comment"
              rows="4"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Laissez un commentaire pour votre commande"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            onClick={() => validateActiveCart()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
            >
            Valider ma commande
          </button>
          {cartError && <p className="text-sm text-red-500 w-full mt-2">{cartError}</p>}
        </div>
      </div>
    </div>
  );
};

export default CartPage;