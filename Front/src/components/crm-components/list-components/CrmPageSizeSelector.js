import React from 'react';

const PageSizeSelector = ({ onSizeChange, totalFilteredProducts }) => {
    const options = ["50", "100", "300", "500", "700", "1000", "Tout"];

    const handleChange = (event) => {
        const value = event.target.value;
        onSizeChange(value === "Tout" ? undefined : value);
    };

    return (
        <div className="flex items-center space-x-4 flex-wrap">
            <div className="p-4 border rounded shadow-lg place-items-center flex gap-4 flex-wrap">
                <select onChange={handleChange} className="border-2 border-gray-300 rounded p-1">
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                        ))}
                </select>
                <span className='whitespace-nowrap'>Produits par page</span>
                <span className='whitespace-nowrap'>Total des produits filtrés: {totalFilteredProducts}</span>
            </div>
        </div>
    );
};

export default PageSizeSelector;
