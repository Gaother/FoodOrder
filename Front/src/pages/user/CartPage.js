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
  const [dateLivraison, setDateLivraison] = useState('') ;
  const [lieuLivraison, setLieuLivraison] = useState('');
  const [prixTotal, setPrixTotal] = useState(0); // Prix total du panier
  const [totalItems, setTotalItems] = useState(0); // Nombre total d'articles
  const [isLoading, setIsLoading] = useState(true);
  const [canValidate, setCanValidate] = useState(false);
  const [error, setError] = useState(null);
  const [cartError, setCartError] = useState(null);
  const [errorId, setErrorId] = useState(null);

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    handleCanValidate()
  }, [dateLivraison, cartData]);

  const fetchCartData = async () => {
    try {
      const response = await api.getActiveUserCart();
      const cart = response.data[0]; // Accéder au premier panier (si plusieurs)
      if (!cart) {
        setCartData([]);
        calculateTotalItems([]); // Aucun article dans le panier
        setPrixTotal(0.00); // Prix total à 0
        setIsLoading(false);
        return;
      }
      setCartData(cart.products);
      calculateTotalItems(cart.products); // Calculer le nombre total d'articles
      calculateTotalPrice(cart.products); // Calculer le prix total
        setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
    }
  };

  const calculateTotalItems = (products) => {
    const total = products.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
  };

  const calculateTotalPrice = (products) => {
    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setPrixTotal(total.toFixed(2));
  }

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

  const handleCanValidate = () => {
    setCanValidate(cartData.length > 0 && dateLivraison !== '')
  }

    const validateActiveCart = async () => {
        try {
            await api.activeCartUserAction({ action: 'validate', comment, dateLivraison, lieuLivraison });
            navigate('/');
        } catch (error) {
          setCartError(error);
          setTimeout(() => setCartError(""), 3000); // Réinitialiser après 1 seconde
          console.error('Erreur lors de la validation du panier:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center bg-[#FFFBF3]" style={{ minHeight: "84vh" }}>
                <div className="mb-4">
                    <FaShoppingCart className="text-[#C60C30] text-6xl mx-auto" />
                </div>
                <Loading color='#C60C30'/>
            </div>
        );
    }

  if (cartData.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center bg-[#FFFBF3]" style={{ minHeight: "84vh" }}>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
                <div className="mb-4">
                    <FaShoppingCart color='3C3333' className="text-gray-500 text-6xl mx-auto" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
                <p className="text-gray-500 mb-6">
                    Vous n'avez pas encore ajouté d'articles à votre panier.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="flex w-full items-center justify-center bg-[#FFFBF3] border border-[#948C1D] text-[#3C3333] font-bold py-2 px-4 rounded-md"
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
                    <div className="w-full flex flex-col items-start space-y-1">
                      <p className="text-base font-semibold text-gray-900">{item.product.nom}</p>
                      {item.specifications.map(((spec, index) => (
                        <div key={index} className="flex items-center">
                          <p className="text-sm text-gray-500">{spec.nameParent} : {spec.value}</p>
                        </div>
                      )))}
                      <p className="text-sm text-gray-500">Prix unitaire: {item.price} €</p>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
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

          <div className="mb-6 flex flex-col">
            <label htmlFor="dateLivraison" className="text-lg font-medium text-gray-600">Date de livraison :</label>
            <input
              type="date"
              name="dateLivraison"
              value={dateLivraison}
              onChange={(e) => setDateLivraison(e.target.value)}
              className="border px-2 py-1 rounded-md"
            />
          </div>

          <div className="mb-6 flex flex-col">
            <label htmlFor="adresseLivraison" className="text-lg font-medium text-gray-600">Adresse de livraison :</label>
            <input
              type="text"
              name="adresseLivraison"
              placeholder="Entrez votre adresse de livraison"
              onChange={(e) => setLieuLivraison(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="text-lg font-medium text-gray-600">Commentaire et allergies :</label>
            <textarea
              id="comment"
              rows="4"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              placeholder="Laissez un commentaire pour votre commande"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="text-lg font-medium text-gray-600">Total : {prixTotal}€</label>
          </div>
          <button
            onClick={() => validateActiveCart()}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition ${!canValidate ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!canValidate}
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