import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import api from '../../../api/api';
import LoadingSpinner from '../../LoadingComponent';
import DataCard from '../DataCard';
import { FaTrophy, FaBalanceScale, FaChartLine } from 'react-icons/fa';
import { MdDiscount } from "react-icons/md";


const CrmDashBoardProductsAnalysis = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dailyReport, setDailyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      api.getLastestDailyReport().then(response => {
        if (response.status === 200) {
          setDailyReport(response.data);
          setLoading(false);
        } else {
          console.error('Failed to fetch daily report, status:', response.status);
          setLoading(false);
        }
      }).catch(error => {
        console.error('Error fetching the daily report:', error);
        setLoading(false);
      });
    }
  }, [isLoggedIn, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-auto py-8 px-2">
      <div className="flex justify-center items-stretch flex-wrap gap-2">
        <div className='flex gap-4'>
          <DataCard 
            title="Produits compétitifs" 
            data={dailyReport.nbCompetitiveProducts} 
            link={`/atlas/products?rate=comp&history=${dailyReport.date}`}
            bgColor="green" 
            iconType={<FaTrophy className="text-4xl" />}
            className="w-1/4"
          />
          <DataCard 
            title="Produits aux mêmes prix" 
            data={dailyReport.nbSamePriceProducts} 
            link={`/atlas/products?rate=equal&history=${dailyReport.date}`}
            bgColor="blue" 
            iconType={<FaBalanceScale className="text-4xl" />}
            className="w-1/4"
          />
        </div>
        <div className='flex gap-4'>
          <DataCard 
            title="Produits non compétitifs" 
            data={dailyReport.nbNonCompetitiveProducts} 
            link={`/atlas/products?rate=non-comp&history=${dailyReport.date}`}
            bgColor="red" 
            iconType={<FaChartLine className="text-4xl" />}
            className="w-1/4"
          />
          <DataCard 
            title="Produits en promotions" 
            data={dailyReport.nbDiscount} 
            link={`/atlas/products?rate=promo&history=${dailyReport.date}`}
            bgColor="yellow" 
            iconType={<MdDiscount className="text-4xl" />}
            className="w-1/4"
          />
        </div>
      </div>
    </div>
  );
};

export default CrmDashBoardProductsAnalysis;
