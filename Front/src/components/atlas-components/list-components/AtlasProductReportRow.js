import React, { useState } from 'react';
import { FaSearch, FaChartLine } from 'react-icons/fa';
import NearestMoreExpensiveConcurrent from './AtlasProductReportRowHoverNearest';
import AtlasProductResumePopUp from './AtlasProductResumePopUp';

const ProductRow = ({ product, params }) => {
    const [infoWindowOpenForId, setInfoWindowOpenForId] = useState(null);
    const [showNearestConcurrent, setShowNearestConcurrent] = useState(false);
    const [showGraphPopup, setShowGraphPopup] = useState(false);
    const [graphId, setGraphId] = useState(null);

    const toggleInfoWindow = (id) => {
        if (infoWindowOpenForId === id) {
            setInfoWindowOpenForId(null); // Fermer si déjà ouvert
        } else {
            setInfoWindowOpenForId(id); // Sinon, ouvrir la fenêtre d'info pour ce produit
        }
    };

    let diffColor = 'red'; // Default to red
    if (product.lessOrigin) {
        if (product.diff <= 2 || product.diff_pourcent === 100) {
            diffColor = 'blue'; // If lessOrigin is true but diff is 2 or less
        } else {
            diffColor = 'green'; // If lessOrigin is true and diff is more than 2
        }
    } else if (product.diff <= 2) {
        diffColor = 'blue';
    }

    const infoWindow = (
        <div className={`absolute left-0 -translate-x-full translate-y-1 top-0 ml-3 bg-white border border-blue-500 rounded-lg p-2 shadow-lg pr-8`}
             style={{ whiteSpace: 'nowrap', minWidth: '150px'}}>
            <div className="before:absolute before:border-blue-500 before:border-t-4 before:border-r-4 before:w-4 before:h-4 before:right-2 before:top-1/2 before:-mt-2 before:rotate-45"></div>
            {product.recentPriceHistories.filter(ph => ph.price > 0).map(ph => (
                <a href={ph.productURL} target="_blank" rel="noopener noreferrer" ><div key={ph._id} className=' hover:bg-gray-100 p-1 rounded-md'>{ph.site}</div></a>
            ))}
            {product.recentPriceHistories.filter(ph => ph.price > 0).length === 0 && "Aucun concurrent"}
        </div>
    );

    return (
    <tr key={product._id} className={`bg-white shadow-lg rounded w-full max-w-80vw lg:max-w-full`}>
        <td className="px-4 py-2 overflow-auto flex flex-row items-center">
            {product.product.imageLink && product.product.imageLink !== "" && (
                <img src={product.product.imageLink} alt="Product Image" className="w-12 h-12 mr-4" />
            )}
            {product.product.designation}
        </td>
        <td className="px-4 py-2 overflow-auto">{product.product.reference}</td>
        <td className="px-4 py-2 overflow-auto whitespace-nowrap">
            {product.recentOriginHistory.map((origin) => (
                <div key={origin._id}>
                    <small>{origin.site}:</small> {origin.price} €
                </div>
            ))}
        </td>
        <td className="px-4 py-2 overflow-visible whitespace-nowrap">
            <div className='flex flex-row justify-center' title={product.lessCost.site}>
                {product.lessCost.price} €
            </div>
        </td>
        <td className={`px-4 py-2 text-white`}>
            <div className={`bg-${diffColor}-500 py-1 rounded overflow-visible whitespace-nowrap text-center p-1`} title={product.lessCost.site}>
                <div className={`${product.discount ? 'border-solid border-t-4 border-b-4 border-yellow-200 px-1' : ''} bg-${diffColor}-500`} title={product.lessCost.site}>
                    {product.diff_pourcent.toFixed(2)} %
                </div>
            </div>
        </td>
        <td className={`px-4 py-2 text-${diffColor}-500 relative`}>
            <div 
                className='flex flex-row justify-center cursor-pointer hover:bg-gray-100 rounded-md p-2' 
                onMouseEnter={() => setShowNearestConcurrent(true)}
                onMouseLeave={() => setShowNearestConcurrent(false)}
            >
                {showNearestConcurrent && product.nearestConcurrent && product.nearestConcurrent.productURL ? (
                    <a 
                        href={product.nearestConcurrent.productURL}
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        {product.diff.toFixed(2)} €
                    </a>) : (
                        <span>{product.diff.toFixed(2)} €</span>
                    )}
                {showNearestConcurrent && (
                    <div className="absolute right-full top-0 z-10">
                        {product.nearestConcurrent ? (
                            <NearestMoreExpensiveConcurrent name={product.nearestConcurrent.site} price={product.nearestConcurrent.price}/>
                        ) : (
                            <NearestMoreExpensiveConcurrent name={null} price={null} />
                        )}
                    </div>
                )}
            </div>
        </td>

        <td className="px-4 py-2 cursor-pointer relative" onClick={() => toggleInfoWindow(product._id)}>
            <div className='bg-grey border-2 rounded-full text-center hover:bg-gray-200'>
                {product.nbConcurrent}
            </div>
            {infoWindowOpenForId === product._id && infoWindow}
        </td>
        <td className="">
            <div className='flex flex-row justify-start gap-2'>
                <div>
                    <button
                        onClick={() => {
                            setShowGraphPopup(true);
                            setGraphId(product.product._id);
                        }}
                        className="inline-block p-2 rounded-full bg-green-500 hover:bg-green-700"
                    >
                        <FaChartLine className="text-white" />
                    </button>
                </div>
                {product.lessCost?.productURL && (
                <div>
                    <a href={product.lessCost.productURL} target="_blank" rel="noopener noreferrer"
                        className="inline-block p-2 rounded-full bg-blue-500 hover:bg-blue-700">
                        <FaSearch className="text-white" />
                    </a>
                </div>
                )}
            </div>
            {showGraphPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-lg w-full shadow-lg overflow-y-auto max-h-full relative">
                        <AtlasProductResumePopUp product={product} graph_id={graphId} onClose={() => setShowGraphPopup(false)} />
                    </div>
                </div>
            )}
        </td>
    </tr>
    );
};

export default ProductRow;
// <a href={`/atlas/graph/?graph_id=${product.product._id}`} target="_blank" rel="noopener noreferrer"

