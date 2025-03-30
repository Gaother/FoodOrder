import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import Modal from '../user/NewUserModal';
import { FaTrash, FaPencilAlt, FaTimes, FaCheck, FaPlus, FaExclamationTriangle } from 'react-icons/fa';

const FeaturesManagerComponent = ({ onSpecificationCreated }) => {
    const [specifications, setSpecifications] = useState([]);
    const [values, setValues] = useState([]);
    const [selectedSpecification, setSelectedSpecification] = useState(null);
    const [newSpecification, setNewSpecification] = useState({ name: '' });
    const [newValue, setNewValue] = useState({ value: '', specification: '' });
    const [editingIndex, setEditingIndex] = useState(-1);
    const [showSpecificationModal, setShowSpecificationModal] = useState(false);
    const [showValueModal, setShowValueModal] = useState(false);

    useEffect(() => {
        getAllSpecifications();
    }, []);

    // Obtenir toutes les spécifications de produits
    const getAllSpecifications = async () => {
        try {
            const response = await api.getAllProductSpecifications();
            setSpecifications(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des spécifications:', error);
        }
    };

    // Obtenir les valeurs d'une spécification
    const getValuesForSpecification = async (specificationId) => {
        try {
            const response = await api.getProductSpecificationsValueByProductSpecificationsId(specificationId);
            setValues(response.data);
            setSelectedSpecification(specificationId); // Marquer la spécification sélectionnée
        } catch (error) {
            console.error('Erreur lors de la récupération des valeurs:', error);
        }
    };

    const deleteSpecification = async (specificationId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette spécification ?')) {
            try {
                await api.deleteProductSpecifications(specificationId);
                await getAllSpecifications();
                setSelectedSpecification(null); // Réinitialiser la sélection si supprimée
            } catch (error) {
                console.error('Erreur lors de la suppression de la spécification:', error);
            }
        }
    };

    const deleteValue = async (valueId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette valeur ?')) {
            try {
                await api.deleteProductSpecificationsValues(valueId);
                await getValuesForSpecification(selectedSpecification);
            } catch (error) {
                console.error('Erreur lors de la suppression de la valeur:', error);
            }
        }
    };

    const handleNewSpecificationChange = (event) => {
        const { name, value } = event.target;
        setNewSpecification({ ...newSpecification, [name]: value });
    };

    const handleNewValueChange = (event) => {
        const { name, value } = event.target;
        setNewValue({ ...newValue, [name]: value, specification: selectedSpecification });
    };

    const createSpecification = async () => {
        try {
            await api.addProductSpecifications(newSpecification);
            setNewSpecification({ name: '' });
            await getAllSpecifications();
            onSpecificationCreated();
            setShowSpecificationModal(false);
        } catch (error) {
            console.error('Erreur lors de la création de la spécification:', error);
        }
    };

    const createValue = async () => {
        try {
            await api.addProductSpecificationsValues(newValue);
            setNewValue({ value: '', specification: selectedSpecification });
            await getValuesForSpecification(selectedSpecification);
        } catch (error) {
            console.error('Erreur lors de la création de la valeur:', error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full">
            {/* Colonne de gauche : Gestion des Product Specifications */}
            <div className="w-full md:w-1/2 p-4 border-b-2 md:border-r-2">
                <div className="flex flex-col gap-4 items-center mb-4">
                    <h2 className="text-xl font-bold w-full">Product Specifications</h2>
                    <button
                        onClick={() => setShowSpecificationModal(true)}
                        className="w-full rounded-md bg-green-500 hover:bg-green-600 p-2 text-white flex items-center"
                    >
                        <FaPlus className="mr-2" /> Ajouter une spécification
                    </button>
                </div>

                {showSpecificationModal && (
                    <Modal onClose={() => setShowSpecificationModal(false)}>
                        <form onSubmit={(e) => { e.preventDefault(); createSpecification(); }}>
                            <input
                                type="text"
                                name="name"
                                value={newSpecification.name}
                                onChange={handleNewSpecificationChange}
                                placeholder="Nom de la spécification"
                                className="border-2 w-full pl-2 py-2 rounded-md"
                            />
                            <div className="flex justify-end mt-4">
                                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">Créer</button>
                            </div>
                        </form>
                    </Modal>
                )}

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
                              className={`p-4 border rounded-md cursor-pointer flex justify-between items-center ${selectedSpecification === spec._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                              onClick={() => getValuesForSpecification(spec._id)}
                          >
                              <span>{spec.name}</span>
                              <FaTrash
                                  className="text-red-600 hover:text-red-900 cursor-pointer"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      deleteSpecification(spec._id);
                                  }}
                              />
                          </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Colonne de droite : Gestion des Values */}
            <div className="w-full md:w-1/2 p-4">
                {selectedSpecification && (
                    <>
                        <div className="flex flex-col gap-4 justify-between items-center mb-4">
                            <h2 className="text-xl font-bold w-full">Values</h2>
                            <button
                                onClick={() => setShowValueModal(true)}
                                className="w-full rounded-md bg-green-500 hover:bg-green-600 p-2 text-white flex items-center"
                            >
                                <FaPlus className="mr-2" /> Ajouter une valeur
                            </button>
                        </div>

                        {showValueModal && (
                            <Modal onClose={() => setShowValueModal(false)}>
                                <form onSubmit={(e) => { e.preventDefault(); createValue(); }}>
                                    <input
                                        type="text"
                                        name="value"
                                        value={newValue.value}
                                        onChange={handleNewValueChange}
                                        placeholder="Nom de la valeur"
                                        className="border-2 w-full pl-2 py-2 rounded-md"
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">Créer</button>
                                    </div>
                                </form>
                            </Modal>
                        )}

                        {values.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <FaExclamationTriangle className="text-gray-400 text-6xl mb-4" />
                                <p className="text-gray-500 text-xl">Aucune valeur</p>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {values.map((val) => (
                                  <li key={val._id} className="p-4 border rounded-md flex justify-between items-center">
                                      <span>{val.value}</span>
                                      <FaTrash
                                          className="text-red-600 hover:text-red-900 cursor-pointer"
                                          onClick={() => deleteValue(val._id)}
                                      />
                                  </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FeaturesManagerComponent;