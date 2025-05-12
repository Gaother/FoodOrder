import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Range } from 'react-range';

const FilterBlock = ({
  type,             // "List" ou "Range"
  name,             // Nom du filtre
  data,             // Liste des valeurs de filtre
  displayType,      // "Fixe" ou "Deroulant"
  selectedFilters = [],  // Liste des filtres sélectionnés, par défaut un tableau vide
  localSearch,      // true ou false
  onFilterChange    // Fonction de rappel pour signaler les changements au parent
}) => {
  const [isOpen, setIsOpen] = useState(displayType === 'Fixe');
  const [searchTerm, setSearchTerm] = useState('');
  const [rangeValues, setRangeValues] = useState([0, 1]); // Valeurs par défaut initialisées à [0, 1]
  const [minValue, setMinValue] = useState(0); // Minimum initialisé à 0
  const [maxValue, setMaxValue] = useState(1);
  const [filteredData, setFilteredData] = useState(data); // État pour filteredData

  useEffect(() => {
    if (type === 'Range') {
      const min = Math.min(...data);
      const max = Math.max(...data);
      setMinValue(min);
      setMaxValue(max);
      setRangeValues([selectedFilters[0], selectedFilters[1]]);
    }
  }, [data, type, selectedFilters]);

  // Mettre à jour filteredData lorsque selectedFilters ou searchTerm change
  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  useEffect(() => {
    setFilteredData(data.filter(item => normalizeString(item.toString()).includes(normalizeString(searchTerm))));
  }, [data, searchTerm, selectedFilters]);
    
  const toggleOpen = () => {
    if (displayType === 'Deroulant') {
      setIsOpen(!isOpen);
    }
  };

  const handleCheckboxChange = (value) => {
    // console.log("filtres selectionnés",selectedFilters);
    // console.log("valeur",value);
    
    let updatedFilters;

    // Si `selectedFilters` est un tableau, ajouter ou enlever la valeur selon son statut de sélection
    if (Array.isArray(selectedFilters)) {
      if (selectedFilters.includes(value)) {
        // Enlever la valeur du filtre si elle est déjà sélectionnée
        updatedFilters = selectedFilters.filter((filter) => filter !== value);
      } else {
        // Ajouter la valeur si elle n'est pas déjà sélectionnée
        updatedFilters = [...selectedFilters, value];
      }
    } else {
      // console.log("dit larrauy")
      if (selectedFilters === value) {
        updatedFilters = [];
      } else {
        updatedFilters = [selectedFilters, value];
      }
      // Si selectedFilters n'est pas un tableau, l'initialiser avec la première valeur
    }
    // Notifier le parent avec les filtres mis à jour
    onFilterChange(updatedFilters);
  };

  const handleRangeChange = (values) => {
    setRangeValues(values);
  };

  const handleRangeFinalChange = (values) => {
    setRangeValues(values); // Met à jour la valeur finale dans l'état local
    onFilterChange(values); // Notifie le parent avec les nouvelles valeurs min et max
  };

  const capitalizeFirstLetter = (value) => {
    if (typeof value === 'string' && value.length > 0 && /^[a-zA-Z]/.test(value[0])) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };


  return (
    <div className="w-full border border-gray-400 rounded-md p-2">
      {/* Header section */}
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleOpen}>
        <span className="font-bold">{name}</span>
        {displayType === 'Deroulant' && (
          <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
        )}
      </div>

      {/* Content section */}
      {isOpen && (
        <div className={`transition-all duration-300 ${displayType === 'Deroulant' ? 'mt-2' : ''}`}>
          {/* Local search bar */}
          {localSearch && type === 'List' && (
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full p-2 border border-gray-400 rounded mb-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          {/* List filter with checkboxes */}
          {type === 'List' && (
            <div className={`flex flex-col gap-2 ${filteredData.length > 8 ? 'max-h-64 overflow-auto' : ''}`}>
              {filteredData.map((item, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox mr-2"
                    checked={selectedFilters.includes(item)} // Vérification correcte de la sélection
                    onChange={() => handleCheckboxChange(item)} // Gérer la modification de la case
                  />
                  {capitalizeFirstLetter(item)}
                </label>
              ))}
            </div>
          )}

          {/* Range filter with slider */}
          {type === 'Range' && (
            <div className="flex flex-col gap-4 mx-4 mt-4">
              <Range
                step={1}
                min={minValue}
                max={maxValue}
                values={rangeValues}
                onChange={handleRangeChange}
                onFinalChange={handleRangeFinalChange}
                renderTrack={({ props, children }) => {
                  const [min, max] = rangeValues;
                  
                  // Calcul du pourcentage pour la partie sélectionnée (active)
                  const left = ((min - minValue) / (maxValue - minValue)) * 100;
                  const width = ((max - min) / (maxValue - minValue)) * 100;

                  return (
                    <div
                      {...props}
                      className="relative w-full h-1 rounded bg-white"
                    >
                      {/* Barre noire représentant la plage sélectionnée */}
                      <div
                        className="absolute h-1 bg-[#6F6856] rounded"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`
                        }}
                      />
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-4 h-4 bg-[#E36A88] rounded-full"
                  />
                )}
              />
              <div className="flex justify-between text-sm">
                <span>{rangeValues[0]}</span>
                <span>{rangeValues[1]}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBlock;