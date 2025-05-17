import React, { useState } from 'react';
import { FaExclamationTriangle, FaTimes, FaCartArrowDown, FaCartPlus } from 'react-icons/fa';
import api from '../../api/api';
import AddProductToCartModal from './new-product-modal/AddToCartModal'; // Assurez-vous d'importer la modal
import feuille from '../../assets/feuille.png';
import croixRouge from '../../assets/croix-rouge.png';


const ProductListRow = ({ product_id, nom, reference, price, comment = "", active, userRole, specifications, imageUrl }) => {
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false); // État pour ouvrir/fermer la modal d'ajout au panier

    // Fonction pour ouvrir/fermer la modal des commentaires
    const toggleCommentModal = () => {
        setIsCommentModalOpen(!isCommentModalOpen);
    };

    // Fonction pour ouvrir/fermer la modal d'ajout au panier
    const toggleAddToCartModal = () => {
        setIsAddToCartModalOpen(!isAddToCartModalOpen);
    };

    const isDispoVege = () => {
        if (specifications.some(spec => spec.value === "Végétarien")) {
            return feuille;
        }
        return croixRouge;
    }

    const removeProductToCart = async () => {
        console.log('removeProductToCart');
        try {
            await api.removeProductInCart({
                productID: product_id,
                productQTY: 1,
                productPrice: price
            });
            console.log('Produit retiré du panier');
        } catch (error) {
            console.error("Erreur lors du retrait du produit du panier:", error);
        }
    };

    const validImageUrl = () =>  {
        if (imageUrl === null || imageUrl === undefined || imageUrl === "") {
            return require('../../assets/placeholder/defaultProduct.png');
        }
        return imageUrl;
    }

    // Fonction pour fermer la modal si on clique à l'extérieur de celle-ci
    const handleModalClick = (event) => {
        if (event.target === event.currentTarget) {
            toggleCommentModal();
        }
    };

    return (
        <div className={`${active === false ? 'bg-red-300' : 'bg-[#ffffff]'} border shadow rounded-md h-auto p-4`}>
            <div className={`grid gap-4 text-center grid-cols-6`}>
                <div className="hidden md:block col-span-1 overflow-auto justify-center">
                    <img src={validImageUrl()} alt={nom} className="w-32 h-24 object-cover"/>
                </div>
                <div className="md:col-span-1 col-span-2 flex items-center justify-center overflow-auto">
                    <a className="font-bold" href={`https://www.google.com/search?q=${nom}`} target="_blank" rel="noopener noreferrer">
                        {nom}
                    </a>
                </div>
                <div className="hidden flex justify-center m-auto md:block col-span-2 overflow-auto">
                    <img
                      src={isDispoVege()}
                      alt="végétarien"
                      className="h-6 w-6"
                    />
                </div>
                <div className="md:col-span-1 flex col-span-2 items-center justify-center overflow-auto">
                    <div>{price} €</div>
                </div>
                <div
                  className="md:col-span-1 col-span-2 flex flex-col md:flex-row md:gap-2 items-center justify-center relative">
                    {comment !== "" && (
                      <button onClick={toggleCommentModal} className="ml-2 text-red-500 hover:text-red-700">
                          <FaExclamationTriangle/>
                      </button>
                    )}
                    <div>
                        {/* Bouton pour ouvrir la modal d'ajout au panier */}
                        <button onClick={toggleAddToCartModal}
                                className="bg-[#C60C30] text-white my-2 py-2 px-4 rounded-md">
                            <FaCartPlus/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de commentaire */}
            {isCommentModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                   onClick={handleModalClick}>
                  <div className="bg-white p-6 rounded-lg shadow-lg relative w-11/12 md:max-w-md lg:max-w-lg">
                  <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Commentaire du produit</h2>
                            <button onClick={toggleCommentModal} className="text-gray-600 hover:text-gray-800">
                                <FaTimes />
                            </button>
                        </div>
                        <p className="text-gray-700">{comment}</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={toggleCommentModal} className="bg-blue-500 text-white py-2 px-4 rounded-md">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal d'ajout au panier */}
            {isAddToCartModalOpen && (
                <AddProductToCartModal
                    product={{
                        _id: product_id,
                        price,
                        nom,
                        reference,
                        specifications
                    }}
                    onClose={toggleAddToCartModal}
                />
            )}
        </div>
    );
};

export default ProductListRow;