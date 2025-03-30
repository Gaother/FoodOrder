import React, { useState, useEffect, useContext } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { GoGraph } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import LoadingSpinner from '../../components/LoadingComponent';



const AtlasHomePage = () => {
  const [products, setProducts] = useState([]);
  const [uniqueSites, setUniqueSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ sortOrder: 0, ascendingSort: true });
  const [originalProducts, setOriginalProducts] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!isLoggedIn) {
      // Redirigez l'utilisateur vers la page d'accueil s'il est déjà connecté
      navigate('/login');
    }

    const fetchProducts = async () => {
      try {
        const response = await api.getPriceHistoryForAllSiteByProduct();
        const origins = new Set(response.data.flatMap(p => p.latestOriginHistory.map(h => h.site.toLowerCase())));
        const sites = new Set(response.data.flatMap(p => p.latestPriceHistory.map(h => h.site.toLowerCase())));
        setUniqueSites(Array.from(new Set([...origins, ...sites])));
        setProducts(response.data);
        setOriginalProducts(response.data); // Sauvegarder le tableau original
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits', error);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const getHistoryPriceColor = (price, lowestOriginPrice) => {
    if (price > lowestOriginPrice) return 'bg-green-300';
    if (price < lowestOriginPrice) return 'bg-red-300';
    return 'bg-blue-200'; // Égalité
  };

  const findLowestPrice = (prices) => {
    const validPrices = prices.filter(Boolean).map(p => parseInt(p, 10));
    return validPrices.length ? Math.min(...validPrices) : null;
  };

  const findPriceForSite = (history, site) => {
    const record = history.find(h => h.site.toLowerCase() === site);
    return record ? record.price : null;
  };

  const toggleSortOrder = () => {
    setSortConfig(currentConfig => {
      let nextSortOrder = (currentConfig.sortOrder + 1) % 3;
      let nextAscendingSort = currentConfig.ascendingSort;

      if (nextSortOrder === 1) {
        nextAscendingSort = !currentConfig.ascendingSort;
      } else if (nextSortOrder === 0) {
        nextAscendingSort = true;
      }

      return { sortOrder: nextSortOrder, ascendingSort: nextAscendingSort };
    });
  };

  const sortProducts = (productsToSort) => {

    switch (sortConfig.sortOrder) {
      case 1: // Trier en favorisant priceHistory
        return productsToSort.slice().sort((a, b) => {
          const aLowestPriceHistory = findLowestPrice(a.latestPriceHistory.map(h => parseInt(h.price, 10)));
          const bLowestPriceHistory = findLowestPrice(b.latestPriceHistory.map(h => parseInt(h.price, 10)));

          const aLowestOriginHistory = findLowestPrice(a.latestOriginHistory.map(h => parseInt(h.price, 10)));
          const bLowestOriginHistory = findLowestPrice(b.latestOriginHistory.map(h => parseInt(h.price, 10)));

          // Prioriser le tri en fonction de si priceHistory < originHistory
          const aIsPriceHistoryLower = aLowestPriceHistory < aLowestOriginHistory;
          const bIsPriceHistoryLower = bLowestPriceHistory < bLowestOriginHistory;

          if (aIsPriceHistoryLower && !bIsPriceHistoryLower) {
            return -1;
          } else if (!aIsPriceHistoryLower && bIsPriceHistoryLower) {
            return 1;
          } else {
            // Si les deux sont égaux, trier par prix le plus bas
            return sortConfig.ascendingSort ? aLowestPriceHistory - bLowestPriceHistory : bLowestPriceHistory - aLowestPriceHistory;
          }
        });
      case 2: // Trier en favorisant originHistory
        return productsToSort.slice().sort((a, b) => {
          const aLowestOriginPrice = findLowestPrice(a.latestOriginHistory.map(h => parseInt(h.price, 10)));
          const bLowestOriginPrice = findLowestPrice(b.latestOriginHistory.map(h => parseInt(h.price, 10)));
          const aLowestPriceHistory = findLowestPrice(a.latestPriceHistory.map(h => parseInt(h.price, 10)));
          const bLowestPriceHistory = findLowestPrice(b.latestPriceHistory.map(h => parseInt(h.price, 10)));

          const aIsOriginLower = aLowestOriginPrice <= aLowestPriceHistory;
          const bIsOriginLower = bLowestOriginPrice <= bLowestPriceHistory;

          // Si originHistory est inférieur ou égal à priceHistory, placez-le en premier
          if (aIsOriginLower && !bIsOriginLower) {
            return -1;
          } else if (!aIsOriginLower && bIsOriginLower) {
            return 1;
          } else {
            // Si les deux ont des originHistory inférieurs ou égaux, triez par le prix le plus bas
            if (sortConfig.ascendingSort) {
              return aLowestOriginPrice - bLowestOriginPrice;
            } else {
              return bLowestOriginPrice - aLowestOriginPrice;
            }
          }
        });
      default:
        return productsToSort;
    }
  };

  const filteredProducts = products.filter(
    product =>
      product.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndFilteredProducts = sortProducts(filteredProducts);

  const renderSortIndicators = () => {
    if (sortConfig.sortOrder === 0) {
      return (
        <div className='flex flex-col pl-2'>
          <span className="text-gray-500">▲</span>
          <span className="text-gray-500">▼</span>
        </div>
      );
    } else if (sortConfig.sortOrder === 1 && !sortConfig.ascendingSort) {
      return (
        <div className='flex flex-col pl-2'>
          <span className="text-gray-500">▲</span>
          <span className="text-green-500">▼</span>
        </div>
      );
    } else if (sortConfig.sortOrder === 2 && !sortConfig.ascendingSort) {
      return (
        <div className='flex flex-col pl-2'>
          <span className="text-green-500">▲</span>
          <span className="text-gray-500">▼</span>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto py-8 px-20">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full px-3 py-2 rounded-full border focus:outline-none focus:ring focus:border-blue-300"
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto leading-normal">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 cursor-pointer text-left">Produits</th>
              {uniqueSites.map(site => (
                <th key={site} className="px-2 cursor-pointer">{site.toUpperCase()}</th>
              ))}
              <th className="flex flex-row items-center place-content-center px-2 cursor-pointer whitespace-nowrap" onClick={toggleSortOrder}>
                Le - cher
                {renderSortIndicators()}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredProducts.map(product => {
              const originPrices = product.latestOriginHistory.map(h => Math.floor(parseFloat(h.price)));
              const priceHistoryPrices = product.latestPriceHistory.map(h => Math.floor(parseFloat(h.price)));
              const lowestOriginPrice = findLowestPrice(originPrices);
              const lowestHistoryPrice = findLowestPrice(priceHistoryPrices);
              const lowestPrice = findLowestPrice([...originPrices, ...priceHistoryPrices]);
              const isOriginLowest = lowestOriginPrice <= (lowestHistoryPrice || lowestOriginPrice);
              const rowColor = lowestPrice ? (isOriginLowest ? 'bg-green-100' : 'bg-red-100') : 'bg-gray-200';
  
              return (
                <tr key={product._id} className='border-b border-gray-900'>
                    <td className={`px-2 hover-bg-gray-100 ${rowColor}`}>
                        <div className='flex flex-row'>
                            <Link className='flex flex-col justify-center mx-3 border bg-slate-300 m-2 p-2 rounded-md' to={`/atlas/graph/${product._id}/?${product.reference}`}>
                                <GoGraph/>
                            </Link>
                            <div>
                                {product.designation}
                                <br />
                                <span className="text-gray-500 italic">{product.reference}</span>
                            </div>

                        </div>
                        
                    </td>
                  {uniqueSites.map(site => {
                    const originPrice = findPriceForSite(product.latestOriginHistory, site);
                    const history = product.latestPriceHistory.find(h => h.site.toLowerCase() === site);
                    const historyPrice = history ? Math.floor(parseFloat(history.price)) : null;
                    const discountPrice = history && history.discountPrice !== "N/A" ? Math.floor(parseFloat(history.discountPrice)) : null;
                    const discountCode = history && history.discountCode !== "N/A" ? history.discountCode : null;
                    const stockInfo = history && history.stockInfo !== "N/A" ? history.stockInfo : null;
                    const shippingPrice = history && history.shippingPrice !== "N/A" && parseFloat(history.shippingPrice) > 0 ? parseFloat(history.shippingPrice) : null;
                    const productURL = history && history.productURL !== "N/A" ? history.productURL : null;
                    const sitePrice = originPrice !== null ? originPrice : historyPrice;
                    const bgColor = historyPrice !== null ? getHistoryPriceColor(historyPrice, lowestOriginPrice) : 'bg-gray-200';
  
                    let discountPercentage = discountPrice ? (((historyPrice - discountPrice) / historyPrice) * 100).toFixed(2) : null;
  
                    return (
                      <td key={site} className={`px-2 ${originPrice ? rowColor : bgColor}`}>
                        <div className="flex flex-row">
                          <div className='flex flex-col'>
                            {discountPrice !== null && discountPrice !== 0 && (
                              <>
                                <span className="text-sm">
                                  {`${discountPrice}`}
                                  {discountPercentage && <span className="text-blue-500"> ({discountPercentage}%)</span>}
                                </span>
                              </>
                            )}
                            <span className="text-xl">{sitePrice !== 0 ? `${sitePrice}` : '—'}</span>
                            {discountCode && (
                              <span className="text-xs text-blue-500">{discountCode}</span>
                            )}
                            {stockInfo && (
                              <span className="text-xs text-purple-500">{stockInfo}</span>
                            )}
                            {shippingPrice && (
                              <span className="text-xs text-purple-500">Livraison: {shippingPrice}€</span>
                            )}
                          </div>
                          <div className='flex flex-col justify-center pl-2'>
                            {productURL && (
                              <a href={productURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 border-2 p-2 bg-blue-200 rounded-full hover:text-blue-700 hover:bg-blue-300">
                                <FaMagnifyingGlass />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td className={`px-2 ${lowestPrice ? (isOriginLowest ? 'bg-green-300' : 'bg-red-300') : 'bg-gray-200'}`}>
                  <span className="text-xl">{lowestPrice !== null ? `${lowestPrice}` : '—'}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );  
};

export default AtlasHomePage;
