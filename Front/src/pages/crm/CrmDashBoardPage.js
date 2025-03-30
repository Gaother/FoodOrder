import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import CrmDashBoardAllProduct from '../../components/crm-components/dashboard-components/CrmDashBoardMatchedProduct';
import CrmDashBoardGraphMatchedProduct from '../../components/crm-components/dashboard-components/CrmDashBoardPieMatchedProduct';
import CrmDashBoardGraphAllNbProduct from '../../components/crm-components/dashboard-components/CrmDashBoardGraphLineAllNbProduct';
import CrmDashBoardBarGroupPourcentDiff from '../../components/crm-components/dashboard-components/CrmDashBoardBarGroupPourcentDiff';
import CrmDashBoardMatchCompetitiveRate from '../../components/crm-components/dashboard-components/CrmDashBoardMatchCompetitiveRate';
import CrmDashBoardRecentMoves from '../../components/crm-components/dashboard-components/CrmDashBoardRecentMoves';


const CrmDashBoardPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!isLoggedIn) {
        navigate('/login');
      }
    }, [isLoggedIn, navigate]);
  
    return (
      <div className="flex flex-col">
          <div className="flex-1 bg-white pb-4 border-2 border-t-0">
              <CrmDashBoardAllProduct/>
          </div>
          <div className="flex-1">
              <CrmDashBoardMatchCompetitiveRate/>
          </div>
          <div className="flex flex-wrap md:flex-nowrap max-w-full justify-center">
              <div className="md:w-1/3">
                <CrmDashBoardRecentMoves/>
                <div className="flex m-3 md:mb-3">
                    <CrmDashBoardGraphMatchedProduct/>
                </div>
              </div>
              <div className="flex flex-col flex-grow justify-center items-stretch gap-2 p-4 md:w-2/3">
                  <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex flex-grow mb-4 md:mb-0 md:w-1/2">
                          <CrmDashBoardGraphAllNbProduct/>
                      </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-grow mb-4 md:mb-0 md:w-1/2">
                          <CrmDashBoardBarGroupPourcentDiff/>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  };
  
  export default CrmDashBoardPage;