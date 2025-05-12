import React, { useState, useEffect } from 'react';
import ProductsManagerComponent from '../../../components/filter-with-list-components/FilterAndProductList';
import CreateProductModal from '../../../components/filter-with-list-components/new-product-modal/CreateProductModal';
import { FaTrash, FaPencilAlt, FaTimes, FaCheck, FaPlus, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const ProductsManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showModal]);

  return (
    <div className="pt-4 md:p-0" style={{ minHeight: "83vh" }}>
      <div className="flex-1 overflow-hidden bg-white md:m-4 px-4 pb-4 md:rounded-md shadow-sm border-2">
        <div className="bg-white flex flex-row items-center justify-between w-full border-b-2 mb-2">
          <div>
            <h1 className="text-2xl py-7 font-bold text-gray-800">Gérez vos produits</h1>
          </div>
          <div className='flex flex-row'>
            <button onClick={() => setShowModal(true)} className="rounded-md bg-green-500 hover:bg-green-600 p-4 m-4">
              <span className="text-white flex flex-row items-center md:text-nowrap"><FaPlus className='m-0 md:mr-2'/><span className='hidden md:block font-bold text-sm'>Ajouter un nouveau produit</span></span>
            </button>
          </div>
        </div>
        {showModal && (
        <CreateProductModal onCreate={handleRefresh} showModal={showModal} onClose={() => setShowModal(false)} />
        )}
        <ProductsManagerComponent key={refreshKey} onEdit={handleRefresh}/>
      </div>
    </div>
  );
};

export default ProductsManager;
