import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import AtlasDashBoardAllProduct from '../../components/atlas-components/dashboard-components/AtlasDashBoardMatchedProduct';
import AtlasDashBoardGraphMatchedProduct from '../../components/atlas-components/dashboard-components/AtlasDashBoardPieMatchedProduct';
import AtlasDashBoardGraphAllNbProduct from '../../components/atlas-components/dashboard-components/AtlasDashBoardGraphLineAllNbProduct';
import AtlasDashBoardBarGroupPourcentDiff from '../../components/atlas-components/dashboard-components/AtlasDashBoardBarGroupPourcentDiff';
import AtlasDashBoardMatchCompetitiveRate from '../../components/atlas-components/dashboard-components/AtlasDashBoardMatchCompetitiveRate';
import AtlasDashBoardRecentMoves from '../../components/atlas-components/dashboard-components/AtlasDashBoardRecentMoves';


const AtlasDashBoardPage = () => {
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
              <AtlasDashBoardAllProduct/>
          </div>
          <div className="flex-1">
              <AtlasDashBoardMatchCompetitiveRate/>
          </div>
          <div className="flex flex-wrap md:flex-nowrap max-w-full justify-center">
              <div className="md:w-1/3">
                <AtlasDashBoardRecentMoves/>
                <div className="flex m-3 md:mb-3">
                    <AtlasDashBoardGraphMatchedProduct/>
                </div>
              </div>
              <div className="flex flex-col flex-grow justify-center items-stretch gap-2 p-4 md:w-2/3">
                  <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex flex-grow mb-4 md:mb-0 md:w-1/2">
                          <AtlasDashBoardGraphAllNbProduct/>
                      </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex flex-grow mb-4 md:mb-0 md:w-1/2">
                          <AtlasDashBoardBarGroupPourcentDiff/>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  };
  
  export default AtlasDashBoardPage;