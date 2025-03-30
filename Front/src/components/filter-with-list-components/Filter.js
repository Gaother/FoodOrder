import React, { useState, useContext } from 'react';
import { AuthContext } from '../../components/AuthContext';
import { FaSlidersH, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ActiveFilter from './ActiveFilter';
import SearchBarFilter from './SearchBarFilter';
import FilterBlock from './FilterBlock';
import DownloadProductExcelButton from './DownloadProductExcelButton';

const Filter = ({ specifications, brands, maxPrice, minPrice, activeFilters = {}, onFilterChange }) => {
  const { userRole } = useContext(AuthContext);
  const isMobileOrTablet = /Mobi|Tablet/i.test(navigator.userAgent);
  const [isMenuOpen, setIsMenuOpen] = useState(!isMobileOrTablet); // Par défaut ouvert sur PC

  const toggleMenu = () => {
    if (isMobileOrTablet) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const tailleSpec = specifications.find(spec => spec.name === 'Taille de produit');
  const typeSpec = specifications.find(spec => spec.name === 'Type de produit');
  const otherSpecs = specifications.filter(spec => spec.index >= 3);

  const getDataArray = (values) => {
    if (!values || values.length === 0) {
      return [];
    }
    if (values.length === 1) {
      return [values[0].key];
    }
    return values.map(v => v.key);
  };

  return (
    <div className={`${!isMenuOpen ? 'pt-4' : 'py-4'} flex flex-col bg-[#ffffff] gap-4 border shadow rounded-md h-auto px-4 w-full`} >
      <div className={`${isMobileOrTablet ? 'cursor-pointer' : ''} flex flex-row items-center justify-between `} onClick={toggleMenu}>
        <div className="flex items-center">
          <FaSlidersH className="mr-2" />
          <strong className="font-bold">Filtre</strong>
        </div>
        {/* Chevron only visible on mobile/tablet */}
        {isMobileOrTablet && (isMenuOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />)}
      </div>
      <div
        className={`flex flex-col gap-2 transition-max-height duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? '' : 'max-h-0'
        }`}
        >
        {userRole != 'viewer' && <DownloadProductExcelButton/>}
        <ActiveFilter
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onFilterRemove={(filterKey) => onFilterChange(filterKey, [])}
        />
        <SearchBarFilter
          searchQuery={activeFilters.search || ''}
          onSearchChange={(value) => onFilterChange('search', value)}
        />

        {/* Taille de produit */}
        {tailleSpec && (
          <FilterBlock
            type="List"
            name="Taille de produit"
            data={getDataArray(tailleSpec.values)}
            displayType="Deroulant"
            selectedFilters={activeFilters['Taille de produit'] || []}
            onFilterChange={(value) => onFilterChange('Taille de produit', value)}
          />
        )}

        {/* Type de produit */}
        {typeSpec && (
          <FilterBlock
            type="List"
            name="Type de produit"
            data={getDataArray(typeSpec.values)}
            displayType="Deroulant"
            selectedFilters={activeFilters['Type de produit'] || []}
            onFilterChange={(value) => onFilterChange('Type de produit', value)}
            localSearch={true}
          />
        )}

        {/* Prix */}
        {userRole !== "viewer" && <FilterBlock
          type="Range"
          name="Prix"
          data={[minPrice, maxPrice]}
          displayType="Fixe"
          selectedFilters={[activeFilters.minprice || minPrice, activeFilters.maxprice || maxPrice]}
          onFilterChange={(values) => {
            onFilterChange('minprice', values[0]);
            onFilterChange('maxprice', values[1]);
          }}
        />}

        {/* Marques */}
        <FilterBlock
          type="List"
          name="Marques"
          data={brands.map(brand => brand.brand)}
          displayType="Deroulant"
          selectedFilters={activeFilters.Marques || []}
          onFilterChange={(value) => onFilterChange('Marques', value)}
          localSearch={true}
        />

        {/* Autres spécifications */}
        {otherSpecs.map((spec) => (
          <FilterBlock
            key={spec._id}
            type="List"
            name={spec.name}
            data={getDataArray(spec.values)}
            displayType="Deroulant"
            selectedFilters={activeFilters[spec.name] || []}
            onFilterChange={(value) => onFilterChange(spec.name, value)}
          />
        ))}
      </div>
    </div>
  );
};

export default Filter;