import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import ImageUploader from '../../user-profile-components/ImageUploader';

const CreateProductModal = ({ onClose, onCreate }) => {
  const [specifications, setSpecifications] = useState([]);
  const [values, setValues] = useState({});
  const [selectedValues, setSelectedValues] = useState([]); // To store selected value IDs
  const [selectedSpecification, setSelectedSpecification] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Local search term
  const [productData, setProductData] = useState({
    reference: '',
    nom: '',
    price: '',
    comment: '',
  });

  // Fetch brands and specifications on mount
  useEffect(() => {
    fetchSpecifications();
  }, []);

  const fetchSpecifications = async () => {
    try {
      const response = await api.getAllProductSpecifications();
      setSpecifications(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des spécifications:', error);
    }
  };

  const getValuesForSpecification = async (specificationId) => {
    try {
      const response = await api.getProductSpecificationsValueByProductSpecificationsId(specificationId);
      setValues((prevValues) => ({ ...prevValues, [specificationId]: response.data }));
      setSelectedSpecification(specificationId);
      setSearchTerm(''); // Reset search when a new specification is selected
    } catch (error) {
      console.error('Erreur lors de la récupération des valeurs:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleValueSelect = (valueId) => {
    // Toggle selection of the value
    const isSelected = selectedValues.includes(valueId);

    if (isSelected) {
      setSelectedValues(selectedValues.filter((id) => id !== valueId));
    } else {
      setSelectedValues([...selectedValues, valueId]);
    }
  };

  const validateFields = () => {
    const { reference, nom, price } = productData;
    return reference && nom && price;
  };

  const resetFields = () => {
    setProductData({
      reference: '',
      nom: '',
      price: '',
      comment: '',
    });
    setSelectedValues([]);
    setSelectedSpecification(null);
    setValues({});
    setErrorMessage('');
  };

  const createProduct = async () => {
    if (!validateFields()) {
      setErrorMessage('Veuillez remplir tous les champs et sélectionner au moins une valeur pour chaque spécification.');
      return;
    }

    const body = {
      ...productData,
      imageUrl: image,
      specifications: selectedValues // Send only value IDs
    };

    try {
      await api.addProduct(body);
      onCreate(); // Refresh the product list
      resetFields(); // Close the modal after creation
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
    }
  };

  const handleModalClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredValues = selectedSpecification
    ? values[selectedSpecification]?.filter((val) =>
        val.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
      )
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative my-4 mx-auto w-11/12 md:max-w-md lg:max-w-lg shadow-lg rounded-md bg-white">
        <div className="bg-blue-500 w-full h-12 rounded-t-md">
          <div className="mx-auto flex items-center justify-between p-2">
            <h3 className="text-lg leading-6 font-medium text-white ml-2">Créer un nouveau produit</h3>
            <button
              onClick={onClose}
              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center mr-1"
              aria-label="close"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="p-5">
          <form onSubmit={(e) => { e.preventDefault(); createProduct(); }}>
            {/* Nom */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Nom</label>
              <input
                type="text"
                name="nom"
                value={productData.nom}
                onChange={handleInputChange}
                className="border-2 w-full p-2 rounded-md"
                placeholder="Nom"
              />
            </div>

            {/* Reference */}
            <div className="flex mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold mb-2">Référence</label>
                <input
                  type="text"
                  name="reference"
                  value={productData.reference}
                  onChange={handleInputChange}
                  className="border-2 w-full p-2 rounded-md"
                  placeholder="Référence"
                />
              </div>
            </div>
  
            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Commentaire</label>
              <input
                type="text"
                name="comment"
                value={productData.comment}
                onChange={handleInputChange}
                className="border-2 w-full p-2 rounded-md"
                placeholder="Commentaire"
              />
            </div>
  
            {/* Price */}
            <div className="flex mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold mb-2">Prix</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  className="border-2 w-full p-2 rounded-md"
                  placeholder="Prix"
                />
              </div>
            </div>

            {/* Image Upload */}
            <ImageUploader image={image} setImage={setImage} />
  
            {/* Specifications and Values */}
            <div className="flex">
              {/* Table for Specifications */}
              <div className="w-1/2 p-4">
                <h3 className="text-lg font-bold mb-2">Spécifications</h3>
                {specifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <FaExclamationTriangle className="text-gray-400 text-6xl mb-4" />
                    <p className="text-gray-500 text-xl">Aucune spécification</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {specifications.map((spec) => (
                      <li
                        key={spec._id}
                        className={`p-4 border rounded-md cursor-pointer ${
                          values[spec._id]?.some(val => selectedValues.includes(val._id)) ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => getValuesForSpecification(spec._id)}
                      >
                        {spec.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
  
              {/* Table for Values */}
              <div className="w-1/2 p-4 max-h-96">
                {selectedSpecification && (
                  <>
                    <h3 className="text-lg font-bold mb-2">
                      Valeurs pour {specifications.find(spec => spec._id === selectedSpecification)?.name}
                    </h3>
  
                    {/* Search input for values */}
                    <input
                      type="text"
                      placeholder="Rechercher une valeur..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="border-2 w-full p-2 rounded-md mb-4"
                    />
  
                    {filteredValues.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64">
                        <FaExclamationTriangle className="text-gray-400 text-6xl mb-4" />
                        <p className="text-gray-500 text-xl">Aucune valeur</p>
                      </div>
                    ) : (
                      <ul className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredValues.map((val) => (
                          <li
                            key={val._id}
                            className={`p-4 border rounded-md cursor-pointer ${
                              selectedValues.includes(val._id) ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => handleValueSelect(val._id)}
                          >
                            {val.value}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
  
            {/* Error message */}
            {errorMessage && (
              <div className="text-red-500 mb-4">
                {errorMessage}
              </div>
            )}
  
            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">Créer le produit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
             