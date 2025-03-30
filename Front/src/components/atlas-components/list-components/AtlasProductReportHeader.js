import React from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const TableHeader = ({ title, field, showSearch, showSort, sortConfig, setSortConfig, onSearchChange, width, params }) => {
    const toggleSort = () => {
        let newSort;
        if (sortConfig[field] === undefined) {
            newSort = 'true';
        } else if (sortConfig[field] === 'true') {
            newSort = 'false';
        } else {
            newSort = undefined;
        }
        setSortConfig({ ...sortConfig, [field]: newSort });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearchChange(field, e.target.value);
        }
    };

    // Détermination de la couleur des icônes de tri
    const sortUpIconColor = sortConfig[field] === 'true' ? 'text-green-500' : 'text-gray-500';
    const sortDownIconColor = sortConfig[field] === 'false' ? 'text-green-500' : 'text-gray-500';

    const widthClass = width ? `w-${width}/12` : 'w-auto';

    return (
        <th className={`${widthClass} px-4 py-2 overflow-auto`}>
            <div className="flex flex-col items-center"> 
                <div className="flex flex-row items-center justify-center">
                    {title}
                    {showSort && (
                        <div className="ml-2 flex flex-col items-center">
                            <FaSortUp className={`${sortUpIconColor} cursor-pointer`} onClick={toggleSort} />
                            <FaSortDown className={`${sortDownIconColor} cursor-pointer`} onClick={toggleSort} />
                        </div>
                    )}
                </div>
                {showSearch && (
                    <div className="mt-1">
                        <input
                            type="text"
                            placeholder={`Recherche par ${title.toLowerCase()}...`}
                            onKeyDown={handleKeyDown}
                            className="p-1 border rounded"
                        />
                    </div>
                )}
            </div>
        </th>
    );
};

export default TableHeader;
