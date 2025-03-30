import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import Modal from '../user/NewUserModal';
import { FaTrash, FaPencilAlt, FaTimes, FaCheck, FaPlus, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const BrandManagerComponent = ({ onBrandCreated }) => {
    const [brands, setBrands] = useState([]);
    const [newBrand, setNewBrand] = useState({ brand: '' });
    const [editingIndex, setEditingIndex] = useState(-1); // -1 signifie qu'aucune marque n'est en cours d'édition
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // État pour gérer la recherche

    useEffect(() => {
        getAllBrands();
    }, []);

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedBrands = [...brands];
        updatedBrands[index] = { ...updatedBrands[index], [name]: value };
        setBrands(updatedBrands);
    };

    const handleNewBrandChange = (event) => {
        const { name, value } = event.target;
        setNewBrand({ ...newBrand, [name]: value });
    };

    const getAllBrands = async () => {
        try {
          const response = await api.getAllBrand();
          const sortedBrands = response.data.sort((a, b) => a.brand.localeCompare(b.brand));
          setBrands(sortedBrands);
        } catch (error) {
          console.error('Erreur lors de la récupération de toutes les marques:', error);
        }
    };

    const createBrand = async () => {
        try {
          await api.addBrand(newBrand);
          setNewBrand({ brand: '' });
          await getAllBrands();
          onBrandCreated();
        } catch (error) {
          console.error('Erreur lors de la création de la marque:', error);
        }
    };

    const updateBrand = async (brandId, brand) => {
        try {
          await api.updateBrand(brandId, brand);
          await getAllBrands();
          onBrandCreated();
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la marque:', error);
        }
    };

    const deleteBrand = async (brandId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
          try {
              await api.deleteBrand(brandId);
              await getAllBrands();
              onBrandCreated();
          } catch (error) {
              console.error('Erreur lors de la suppression de la marque:', error);
          }
        }
    };

    // Filtrer les marques en fonction du terme de recherche
    const filteredBrands = brands.filter((brand) =>
        brand.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
          <div className="bg-white flex flex-row items-center justify-between w-full border-b-2 mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gérez vos marques</h1>
            </div>
            <div className=''>
              <button onClick={() => setShowModal(true)} className="rounded-md bg-green-500 hover:bg-green-600 p-4 m-4">
              <span className="text-white flex flex-row items-center md:text-nowrap"><FaPlus className='m-0 md:mr-2'/><span className='hidden md:block'>Ajouter une nouvelle marque</span></span>              </button>
            </div>
          </div>  
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <form onSubmit={(e) => { e.preventDefault(); createBrand(); }} className="space-y-4">
                <div>
                  <input className="border-2 pl-1 border-white-100" type="text" name="brand" value={newBrand.brand} onChange={handleNewBrandChange} placeholder="Nom de la marque"/>
                </div>
                <div className="whitespace-nowrap flex flex-col items-center pt-4">
                  <button type="submit" className="w-max py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center">Créer</button>
                </div>
              </form>
            </Modal>
          )}

          {brands.length === 0 ? (
            // Afficher un message centré lorsque la liste des marques est vide
            <div className="flex flex-col items-center justify-center h-64">
              <FaExclamationTriangle className="text-gray-400 text-6xl mb-4" />
              <p className="text-gray-500 text-xl">Aucune marque</p>
            </div>
          ) : (
            <>
              {/* Barre de recherche */}
              <div className="relative w-full mb-4">
                <input
                  type="text"
                  placeholder="Rechercher une marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 w-full pl-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />
              </div>

              <div className="overflow-auto pb-4"> 
                <table className="min-w-full">
                  <thead className="sticky top-0 bg-white">
                    <tr className='bg-gray-200'>
                      <th className="w-1/7 px-4 py-2">Marque</th>
                      <th className="w-1/7 px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBrands.map((brand, index) => (
                      <tr key={brand._id} className={`border-b ${editingIndex === index ? 'bg-gray-100 shadow-outline' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                          {editingIndex === index ? (
                            <input type="text" value={brand.brand} name="brand" onChange={(e) => handleInputChange(e, index)} className="form-input rounded-md shadow-sm mt-1 block w-full" />
                          ) : (
                            <span className="block w-full">{brand.brand}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                          <div className="flex justify-center items-center">
                            {editingIndex === index ? (
                              <>
                                <button onClick={() => {
                                  updateBrand(brand._id, brands[index]);
                                  setEditingIndex(-1);
                                }} className="text-green-600 hover:text-green-900 ">
                                  <FaCheck />
                                </button>
                                <button onClick={() => setEditingIndex(-1)} className="text-red-600 ml-3 hover:text-red-900">
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <button onClick={() => setEditingIndex(index)} className="text-indigo-600 hover:text-indigo-900">
                                <FaPencilAlt />
                              </button>
                            )}
                            <button onClick={() => deleteBrand(brand._id)} className="text-red-600 hover:text-red-900 ml-3">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      );      
};

export default BrandManagerComponent;