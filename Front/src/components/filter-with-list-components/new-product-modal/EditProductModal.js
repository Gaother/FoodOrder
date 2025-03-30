import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const EditProductModal = ({ product, onClose, onEdit }) => {
  const [brands, setBrands] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [values, setValues] = useState({});
  const [selectedValues, setSelectedValues] = useState(product.specifications.map(spec => spec._id)); // IDs des valeurs spécifiées du produit
  const [selectedSpecification, setSelectedSpecification] = useState(null);
  const [productData, setProductData] = useState({
    brand: product.brand._id || '',
    ean: product.ean || '',
    reference: product.reference || '',
    designation: product.designation || '',
    price: product.price || '',
    stock: product.stock || 0,
    comment: product.comment || '',
    active: product.active
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Local search term

  useEffect(() => {
    fetchBrands();
    fetchSpecifications();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await api.getAllBrand();
      setBrands(response.data.sort((a, b) => a.brand.localeCompare(b.brand)));
    } catch (error) {
      console.error('Erreur lors de la récupération des marques:', error);
    }
  };

  const fetchSpecifications = async () => {
    try {
      const response = await api.getAllProductSpecifications();
      setSpecifications(response.data);

      // Fetch values for each specification that the product already has
      response.data.forEach(spec => {
        if (product.specifications.some(pSpec => pSpec.specification._id === spec._id)) {
          getValuesForSpecification(spec._id); // Précharger les valeurs des spécifications attribuées
        }
      });
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
    // Ajouter ou retirer une valeur spécifiée
    const isSelected = selectedValues.includes(valueId);

    if (isSelected) {
      setSelectedValues(selectedValues.filter((id) => id !== valueId));
    } else {
      setSelectedValues([...selectedValues, valueId]);
    }
  };

  const toggleActiveStatus = () => {
    setProductData(prevState => ({
      ...prevState,
      active: !prevState.active
    }));
  };

  const validateFields = () => {
    const { brand, ean, reference, designation, price, stock } = productData;
    return brand && ean && reference && designation && price && stock && selectedValues.length > 0;
  };

  const updateProduct = async () => {
    if (!validateFields()) {
      setErrorMessage('Veuillez remplir tous les champs et sélectionner au moins une valeur pour chaque spécification.');
      return;
    }

    const body = {
      ...productData,
      specifications: selectedValues // Envoyer les IDs de valeurs sélectionnées
    };

    try {
      await api.updateProduct(product._id, body);
      onEdit(); // Rafraîchir la liste des produits
      onClose(); // Fermer la modal après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
    }
  };

  const deleteProduct = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await api.deleteProduct(product._id);
        onEdit(); // Rafraîchir la liste des produits
        onClose(); // Fermer la modal après la mise à jour
      } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
      }
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
            <h3 className="text-lg leading-6 font-medium text-white ml-2">Modifier le produit</h3>
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
          <form onSubmit={(e) => { e.preventDefault(); updateProduct(); }}>
            {/* Select Brand */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Marque</label>
              <select
                name="brand"
                value={productData.brand}
                onChange={handleInputChange}
                className="border-2 w-full p-2 rounded-md"
              >
                <option value="">Sélectionner une marque</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>{brand.brand}</option>
                ))}
              </select>
            </div>
  
            {/* EAN and Reference */}
            <div className="flex justify-between gap-4 mb-4">
              <div className="w-1/2">
                <label className="block text-sm font-bold mb-2">EAN</label>
                <input
                  type="text"
                  name="ean"
                  value={productData.ean}
                  onChange={handleInputChange}
                  className="border-2 w-full p-2 rounded-md"
                  placeholder="EAN"
                />
              </div>
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
  
            {/* Designation */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Désignation</label>
              <input
                type="text"
                name="designation"
                value={productData.designation}
                onChange={handleInputChange}
                className="border-2 w-full p-2 rounded-md"
                placeholder="Désignation"
              />
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
  
            {/* Price and Stock */}
            <div className="flex justify-between gap-4 mb-4">
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
              <div className="w-1/2">
                <label className="block text-sm font-bold mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={handleInputChange}
                  className="border-2 w-full p-2 rounded-md"
                  placeholder="Stock"
                />
              </div>
            </div>

            {/* Bouton Actif/Inactif */}
            <div className="mb-4">
              <button
              type='button'
                onClick={toggleActiveStatus}
                className={`w-full p-2 rounded-md text-white ${productData.active ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {productData.active ? 'Actif' : 'Inactif'}
              </button>
            </div>
  
            {/* Specifications and Values */}
            <div className="flex">
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
                    {filteredValues?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64">
                        <FaExclamationTriangle className="text-gray-400 text-6xl mb-4" />
                        <p className="text-gray-500 text-xl">Aucune valeur</p>
                      </div>
                    ) : (
                      <ul className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredValues?.map((val) => (
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
            <div className="flex justify-center mt-4 gap-8">
                <button type="button" onClick={deleteProduct} className="bg-red-600 text-white py-2 px-4 rounded-md left-0">Supprimer le produit</button>
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md right-0">Mettre à jour le produit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;