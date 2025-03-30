import React from 'react';

const CrmProductReportRowHoverNearest = ({ name, price }) => {
    if (name === null || price == null) {
        return (
            <div className="border-2 bg-white border-blue-500 p-2 rounded-md">
                <div className='mr-4'>
                Ce produit n'existe pas chez les concurrents
                </div>
                <div className="before:absolute before:border-blue-500 before:border-t-4 before:border-r-4 before:w-4 before:h-4 before:right-2 before:top-1/2 before:-mt-2 before:rotate-45"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col border-2 text-blue-500 bg-white border-blue-500 p-2 rounded-md">
            <div className='flex flex-col mr-4'>
                <span>{name}</span>
                <span className='text-black whitespace-nowrap overflow-visible items-center'>{price} €</span>
            </div>
            <div className="flex before:absolute before:border-blue-500 before:border-t-4 before:border-r-4 before:w-4 before:h-4 before:right-2 before:top-1/2 before:-mt-2 before:rotate-45"></div>
        </div>
    );
};

export default CrmProductReportRowHoverNearest;