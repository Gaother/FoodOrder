import React, { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import HomePageForProComponents from '../components/HomePageForProComponents';
import FooterTrust from '../components/FooterTrustComponents';
import FilterAndProductList from '../components/filter-with-list-components/FilterAndProductList';
import GuestMessage from '../components/GuestMessage'; // Importer le nouveau composant

const HomePage = () => {
  const { isLoggedIn, userRole } = useContext(AuthContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <div className="bg-gray-100" style={{ minHeight: "84vh" }}>
        <HomePageForProComponents/>
        {userRole === 'guest' ? (
          <GuestMessage/>
        ) : (
          <FilterAndProductList key={refreshKey} onEdit={handleRefresh}/>
        )}
        <FooterTrust/>
      </div>
    </>
  );
};

export default HomePage;