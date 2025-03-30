import React from 'react';

const AtlasProductResumePopUpLeftInfo = ({ product }) => {
    if (!product) return null;

    return (
        <div className="flex flex-col items-center p-4">
            {product.product.imageLink && (
                <img src={product.product.imageLink} alt={product.product.designation} className="w-32 h-32 my-4 rounded" />
            )}
            <div className="text-center text-lg mb-2">
                <div className="mb-2 text-gray-500">
                    <small>Référence :</small>
                </div>
                {product.product.reference}
            </div>
            <div className="text-center text-md">
                <div className="mb-2 text-gray-500">
                    <small>Prix :</small>
                </div>
                {product.recentOriginHistory.map((origin) => (
                    <div key={origin._id} className="mb-2">
                        <small>{origin.site}:</small> {origin.price} €
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AtlasProductResumePopUpLeftInfo;