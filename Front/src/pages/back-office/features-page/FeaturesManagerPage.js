import React, { useState } from 'react';
import FeaturesManagerComponent from '../../../components/back-office-components/features/FeaturesManagerComponent';

const FeaturesManager = () => {
  const [refreshKeyForTeamManager, setRefreshKeyForTeamManager] = useState(0);
  const [refreshKeyForUserManager, setRefreshKeyForUserManager] = useState(0);

  const handleUserCreated = () => {
    setRefreshKeyForTeamManager((prev) => prev + 1);
  };


  return (
    <div className="pt-4 md:p-0" style={{ minHeight: "83vh" }}>
      <div className="flex-1 overflow-hidden bg-white md:m-4 px-4 md:rounded-md shadow-sm border-2">
        <div className="bg-white flex flex-row items-center justify-between w-full border-b-2 mb-2">
            <h1 className="text-2xl py-7 font-bold text-gray-800">Gérez vos caractéristiques de produit</h1>
        </div>
        <FeaturesManagerComponent onUserCreated={handleUserCreated} key={refreshKeyForUserManager} />
      </div>
    </div>
  );
};

export default FeaturesManager;
