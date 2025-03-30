import React, { useState } from 'react';
import BrandManagerComponent from '../../../components/back-office-components/brand/BrandManagerComponent';

const BrandManager = () => {
  const [refreshKeyForTeamManager, setRefreshKeyForTeamManager] = useState(0);
  const [refreshKeyForUserManager, setRefreshKeyForUserManager] = useState(0);

  const handleUserCreated = () => {
    setRefreshKeyForTeamManager((prev) => prev + 1);
  };


  return (
    <div className="pt-4 md:p-0" style={{ minHeight: "83vh" }}>
      <div className="flex-1 overflow-hidden bg-white md:m-4 px-4 md:rounded-md shadow-sm border-2">
        <BrandManagerComponent onUserCreated={handleUserCreated} key={refreshKeyForUserManager} />
      </div>
    </div>
  );
};

export default BrandManager;
