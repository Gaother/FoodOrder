import React, { useState, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import { FaExclamationTriangle } from 'react-icons/fa';
import ProductListRow from './ProductListRow';
import EditProductModal from './new-product-modal/EditProductModal';
import LoadingComponent from '../LoadingComponent';

const ProductList = ({ products, handleEditProduct, loading }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { userRole } = useContext(AuthContext);
    const isAdminPage = window.location.pathname.includes('/admin');

    const getProductSpecificationValue = (specifications, specName) => {
        const spec = specifications.find(spec => spec.specification.name === specName);
        return spec ? spec.value : 'N/A'; // Retourne la valeur si elle existe, sinon 'N/A'
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    let content;

    if (products.length === 0) {
        if (loading) {
            content = (
                <LoadingComponent color='orange'/>
            );
        } else {
            content = (
                <div className="flex flex-col items-center justify-center mt-4">
                    <FaExclamationTriangle className="text-red-500 text-4xl mb-2" />
                    <p className="text-red-500 text-lg">Désolé, aucun produit ne correspond à votre recherche.</p>
                </div>
            );
        }
    } else {
        content = products.map((product, index) => (
            <div key={index} onClick={() => handleRowClick(product)} className={((userRole === 'admin' || userRole === 'superadmin') && isAdminPage) ? 'cursor-pointer border-2 hover:border-yellow-400' : ''}>
                <ProductListRow
                    product_id={product._id}
                    productSize={getProductSpecificationValue(product.specifications, "Taille de produit")} // Taille de produit
                    productType={getProductSpecificationValue(product.specifications, "Type de produit")} // Type de produit
                    Brand={product.brand ? product.brand.brand : 'Marque inconnue'} // Si la marque existe
                    designation={product.designation}
                    reference={product.reference}
                    ean={product.ean}
                    price={product.price}
                    stock={product.stock}
                    comment={product.comment}
                    active={product.active}
                    userRole={userRole}
                />
            </div>
        ));
    }
    return (
        <div className='flex flex-col gap-2'>
            <div className="bg-[#ffffff] border shadow rounded-md h-auto p-4">
                <div className={`grid gap-4 text-center font-bold ${userRole === 'viewer' ? 'grid-cols-11' : 'grid-cols-12'}`}>
                    <div className="hidden md:block col-span-2">Taille</div>                    
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3 md:col-span-1">Marque</div>
                    <div className="hidden md:block col-span-2">Désignation</div>
                    <div className={`${userRole === 'viewer' ? 'col-span-4' : 'col-span-3'}  md:col-span-2`}>Référence</div>
                    <div className="hidden md:block col-span-1">EAN</div>
                    {userRole !== 'viewer' && <div className="md:col-span-1 col-span-2">Prix</div>}
                    <div className="col-span-1">Stock</div>
                </div>
            </div>
            {content}
            {selectedProduct && (userRole === 'admin' || userRole === 'superadmin') && isAdminPage && (
                <EditProductModal onEdit={handleEditProduct} product={selectedProduct} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default ProductList;