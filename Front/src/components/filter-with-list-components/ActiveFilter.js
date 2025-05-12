import React from 'react';
import { FaTimes } from 'react-icons/fa';
import classNames from 'classnames';

const ActiveFilter = ({ activeFilters, onFilterChange }) => {
  
  // Fonction pour supprimer une valeur spécifique d'un filtre
  const handleRemoveFilterValue = (filterKey, valueToRemove) => {
    const currentValues = activeFilters[filterKey];
    
    // On filtre pour ne garder que les valeurs différentes de celle à supprimer
    const updatedValues = Array.isArray(currentValues) 
      ? currentValues.filter(value => value !== valueToRemove)
      : currentValues !== valueToRemove ? currentValues : [];

    onFilterChange(filterKey, updatedValues);
  };

  // Fonction pour supprimer tous les filtres actifs
  const handleClearAllFilters = () => {
    Object.keys(activeFilters).forEach(filterKey => {
      onFilterChange(filterKey, []);
    });
  };

  // Fonction pour mettre en majuscule la première lettre si c'est une lettre
  const capitalizeFirstLetter = (value) => {
    if (typeof value === 'string' && value.length > 0 && /^[a-zA-Z]/.test(value[0])) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };

  const hasActiveFilters = activeFilters && Object.keys(activeFilters).length > 0;

  return (
    <div className={classNames("relative border border-gray-400 rounded-md h-full w-full p-2 flex flex-wrap gap-2", {
      'pb-10': hasActiveFilters
    })}>
      {hasActiveFilters ? (
        <>
          {Object.keys(activeFilters).map((filterKey) => (
            Array.isArray(activeFilters[filterKey]) ? (
              activeFilters[filterKey].map((value) => (
                <div key={`${filterKey}-${value}`} className="flex items-center bg-[#FFFBF3] border border-[#948C1D] text-[#E36A88] text-sm px-2 py-1 rounded-full">
                  {capitalizeFirstLetter(value)}
                  <button onClick={() => handleRemoveFilterValue(filterKey, value)} className="ml-1 text-red-500">
                    <FaTimes />
                  </button>
                </div>
              ))
            ) : (
              <div key={filterKey} className="flex items-center bg-[#FFFBF3] border border-[#948C1D] text-[#E36A88] text-sm px-2 py-1 rounded-full">
                {capitalizeFirstLetter(activeFilters[filterKey])}
                <button onClick={() => handleRemoveFilterValue(filterKey, activeFilters[filterKey])} className="ml-1 text-red-500">
                  <FaTimes />
                </button>
              </div>
            )
          ))}
          <button 
            onClick={handleClearAllFilters} 
            className="absolute bottom-2 right-2 text-[#E36A88] underline"
          >
            Effacer tout
          </button>
        </>
      ) : (
        <div className="text-gray-500">Aucun filtre actif</div>
      )}
    </div>
  );
};

export default ActiveFilter;