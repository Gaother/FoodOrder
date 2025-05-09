import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaTimes, FaShoppingBasket } from 'react-icons/fa';
import api from '../../../api/api';
import CircularLoadingComponent from '../../CircularLoadingComponent';

const AddProductToCartModal = ({ product, onClose }) => {
  const { nom, reference } = product;
  const [quantity, setQuantity] = useState(1);
  const [productSpecifications, setProductSpecifications] = useState([]);
  const [selectedSpecifications, setSelectedSpecifications] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canValidate, setCanValidate] = useState(false);

  useEffect(() => {
    setProductSpecifications(getSpecifications());
  }, [])

  useEffect(() => {
    handleCanValidate();
  }, [selectedSpecifications])

  const getSpecifications= () => {
    const specifications = product.specifications;
    const groupedSpecifications = [];
    specifications.forEach(spec => {
      const index = groupedSpecifications.findIndex(g => g.id === spec.specification._id);
      if (index !== -1) {
        groupedSpecifications[index].values.push({
          name: spec.value,
          id: spec._id,
        });
      }
      else {
        groupedSpecifications.push({
          id: spec.specification._id,
          name: spec.specification.name,
          values: [{
              name: spec.value,
              id: spec._id,
          }],
        })
      }
    });
    setSelectedSpecifications(new Array(groupedSpecifications.length).fill(null));
    return groupedSpecifications;
  }

  const handleQuantityChange = (value) => {
    // Vérifie que la valeur est un nombre entre 1 et le stock
    const newValue = Math.max(1, value);
    setQuantity(newValue);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    // N'autorise que les chiffres
    if (!isNaN(value) && value !== "") {
      handleQuantityChange(parseInt(value));
    }
  };

  const handleSpecificationChange = (event, index, nameParent) => {
    setSelectedSpecifications(prev => {
      const newSpecs = [...prev];
      newSpecs[index] = {
        nameParent: nameParent,
        value: event.target.value
      };
      return newSpecs;
    })
  }

  const handleCanValidate = () => {
    setCanValidate(!selectedSpecifications?.some(spec => spec === null || spec.value === ''))
  }

  const addProductToCart = async () => {
    try {
      setIsLoading(true);
      await api.addProductToCart({
        productID: product._id,
        productQTY: quantity,
        productPrice: product.price,
        specifications: selectedSpecifications,
      });
      setIsLoading(false);
      onClose(); // Ferme la modal après ajout au panier
    } catch (error) {
      setErrorMessage(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative my-4 mx-auto w-11/12 md:max-w-md lg:max-w-lg shadow-lg rounded-md bg-white">
        <div className="bg-blue-500 w-full h-12 rounded-t-md flex justify-between items-center p-2">
          <h3 className="text-lg leading-6 font-medium text-white ml-2">Ajouter au panier</h3>
          <button
            onClick={onClose}
            className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center mr-1"
            aria-label="close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-5">

          <div className="mb-4">
            <p className="text-sm font-bold">Nom :</p>
            <p>{nom}</p>
          </div>

          <div className="mb-4 flex justify-between gap-4">
            <div>
              <p className="text-sm font-bold">Référence :</p>
              <p>{reference}</p>
            </div>
          </div>
          {productSpecifications.map(((spec, index) => (
            <div className="mb-4 flex justify-between gap-4">
              <div>
                <p className="text-sm font-bold">{spec.name} :</p>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  onChange={(e) => handleSpecificationChange(e, index, spec.name)}
                >
                  <option key={null} value={null}> </option>
                  {spec.values.map((option) => (
                    <option key={option.value} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )))}

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold">Quantité :</p>
            <div className="flex items-center gap-2">
            <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded-full"
                disabled={quantity <= 1}
              >
                <FaMinus />
              </button>

              {/* Champ de saisie de la quantité */}
              <input
                type="text"
                value={quantity}
                onChange={handleInputChange}
                className="text-lg border-gray-300 border-2 rounded-md py-1 text-center w-16"
                inputMode="numeric" // Assure que le clavier numérique s'ouvre sur mobile
              />

              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded-full"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <div className="flex justify-between mt-6 gap-8">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white py-2 px-4 rounded-md"
            >
              Annuler
            </button>

            <button
              disabled={!canValidate}
              onClick={addProductToCart}
              className={`bg-green-600 text-white py-2 px-4 rounded-md flex items-center gap-2 ${!canValidate ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? <CircularLoadingComponent /> : <><FaShoppingBasket /> Ajouter au panier</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductToCartModal;