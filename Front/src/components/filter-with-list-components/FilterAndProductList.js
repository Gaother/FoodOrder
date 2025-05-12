import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import api from '../../api/api';

import Filter from './Filter';
import ProductList from './ProductList';

const FilterAndProductList = ({ onEdit }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [specifications, setSpecifications] = useState([]);
  const [activeFilters, setActiveFilters] = useState({}); // Contient les filtres actifs
  const location = useLocation(); // Utilisé pour lire l'URL actuelle
  const navigate = useNavigate(); // Utilisé pour mettre à jour l'URL

  // Cette fonction extrait les filtres de l'URL au démarrage
  const parseFiltersFromURL = () => {
    const params = new URLSearchParams(location.search);
    const filters = {};

    // Lire chaque paramètre de l'URL et les assigner aux filtres actifs
    params.forEach((value, key) => {
      filters[key] = value.includes(';') ? value.split(';') : value; // Pour les valeurs multiples comme specifications
    });
    setActiveFilters(filters);
  };

  useEffect(() => {
    fetchSpecifications();
    // Extraire les filtres de l'URL au démarrage
    parseFiltersFromURL();
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [activeFilters]);

  const fetchFilteredProducts = async () => {
    try {
      const response = await api.getFilteredProducts(activeFilters);
      setProducts(response.data.products);
      setMaxPrice(response.data.maxPrice);
      setMinPrice(response.data.minPrice);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };

  const fetchSpecifications = async () => {
    try {
      const response = await api.getAllProductSpecifications();
      setSpecifications(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des spécifications:', error);
    }
  };

  // Fonction pour mettre à jour l'URL lorsque les filtres changent
  const updateURLWithFilters = (filters) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.set(key, Array.isArray(filters[key]) ? filters[key].join(';') : filters[key]);
      }
    });

    navigate({ search: params.toString() }); // Utilise navigate pour mettre à jour l'URL
  };

  // Cette fonction met à jour les filtres actifs et l'URL
  const handleFilterChange = (filterKey, filterValue) => {
    setActiveFilters((prevFilters) => {
        // console.log("prevFilters",prevFilters);
      let updatedFilters = { ...prevFilters };

      // Si le filtre est un tableau et devient vide, on le supprime complètement
      if (Array.isArray(filterValue) && filterValue.length === 0) {
        delete updatedFilters[filterKey]; // Supprimer les filtres vides
      } else if (filterValue === '' || filterValue === null) {
        delete updatedFilters[filterKey]; // Supprimer aussi les filtres avec des valeurs nulles ou vides
      } else {
        updatedFilters[filterKey] = filterValue; // Sinon, mettre à jour avec la nouvelle valeur
      }
      // console.log("updatedFilters",updatedFilters);

      updateURLWithFilters(updatedFilters); // Mettre à jour l'URL avec les filtres
      return updatedFilters; // Retourner les filtres mis à jour pour le state
    });
  };

  return (
    <div className="bg-[#FFFBF3] h-auto flex md:flex-row flex-col p-4 gap-4">
      <div className="md:w-1/4">
        <Filter
          specifications={specifications}
          maxPrice={maxPrice}
          minPrice={minPrice}
          activeFilters={activeFilters} // Passer les filtres actifs au composant
          onFilterChange={handleFilterChange} // Passer la fonction pour capturer les filtres
        />
      </div>
      <div className="md:w-3/4">
        <ProductList products={products} handleEditProduct={onEdit} loading={loading}/>
      </div>
    </div>
  );
};

export default FilterAndProductList;
