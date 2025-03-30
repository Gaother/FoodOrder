import React, { useState } from 'react';
import UserManagerComponent from '../../../components/back-office-components/user/UserManagerComponent';
import TeamManagerComponent from '../../../components/back-office-components/TeamManagerComponent';

const UserManager = () => {
  const [refreshKeyForTeamManager, setRefreshKeyForTeamManager] = useState(0);
  const [refreshKeyForUserManager, setRefreshKeyForUserManager] = useState(0);

  const handleUserCreated = () => {
    setRefreshKeyForTeamManager((prev) => prev + 1);
  };

  const handleUserAssignedToTeam = () => {
    setRefreshKeyForUserManager((prev) => prev + 1);
  };

  return (
    <div className="pt-4 md:p-0" style={{ minHeight: "83vh" }}>
      <div className="flex-1 overflow-hidden bg-white md:m-4 px-4 md:rounded-md shadow-sm border-2">
        <UserManagerComponent onUserCreated={handleUserCreated} key={refreshKeyForUserManager} />
      </div>
    </div>
  );
};

export default UserManager;
