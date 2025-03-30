import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import api from '../../../api/api';
import LoadingSpinner from '../../LoadingComponent';
import DataCard from '../DataCard';
import { PiSortDescendingBold } from "react-icons/pi";
import { HiSortDescending } from "react-icons/hi";
import { FaBalanceScale } from 'react-icons/fa';


const AtlasDashBoardProductsAnalysis = ({ dailyReportId = "" , calendar = false}) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dailyReport, setDailyReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleFetchDailyReport = (response) => {
    if (response.status === 200) {
      setDailyReport(response.data);
      setLoading(false);
    } else {
      console.error('Failed to fetch daily report, status:', response.status);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (dailyReportId === "") {
      api.getLastestDailyReport().then(response => {
        handleFetchDailyReport(response);
      }).catch(error => {
        console.error('Error fetching the daily report:', error);
        setLoading(false);
      });
    } else {
      api.getDailyReportById(dailyReportId).then(response => {
        handleFetchDailyReport(response);
      }).catch(error => {
        console.error('Error fetching the daily report:', error);
        setLoading(false);
      });
    }
  }, [isLoggedIn, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (calendar) {
    return (
      <div className="overflow-auto py-1">
        <div className="flex justify-center items-stretch flex-wrap gap-1">
          <button
            className={`bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded`}
            onClick={() => navigate(`/atlas/last-product-move/?daily_id=${dailyReport._id}&rate=comp&history=${dailyReport.date}`)}
          >
            {dailyReport.newCompetitiveProductReports.length}
          </button>
          <button
            className={`bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded`}
            onClick={() => navigate(`/atlas/last-product-move/?daily_id=${dailyReport._id}&rate=equal&history=${dailyReport.date}`)}
          >
            {dailyReport.newEqualProductReports.length}
          </button>
          <button
            className={`bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded`}
            onClick={() => navigate(`/atlas/last-product-move/?daily_id=${dailyReport._id}&rate=non-comp&history=${dailyReport.date}`)}
          >
            {dailyReport.newNonCompetitiveProductReports.length}
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="overflow-auto py-8 px-2">
        <div className="flex justify-center items-stretch flex-wrap gap-2">
          <span className="text-4xl font-bold mb-4 text-center text-gray-600">
            Rapports du jour
          </span>
        </div>
        <div className="flex flex-col justify-center items-stretch flex-wrap gap-2">
          <DataCard
            title="Nouveaux produits compétitifs" 
            data={dailyReport.newCompetitiveProductReports.length} 
            link={`/atlas/last-product-move/?daily_id=${dailyReport._id}&rate=comp&history=${dailyReport.date}`}
            bgColor="green" 
            iconType={<PiSortDescendingBold className="text-4xl" />}
          />
          <DataCard
            title="Nouveaux produits aux mêmes prix" 
            data={dailyReport.newEqualProductReports.length} 
            link={`/atlas/last-product-move/?daily_id=${dailyReport._id}&rate=equal&history=${dailyReport.date}`}
            bgColor="blue" 
            iconType={<FaBalanceScale className="text-4xl" />}
          />
          <DataCard
            title="Nouveaux produits non compétitifs" 
            data={dailyReport.newNonCompetitiveProductReports.length}
            link={`/atlas/last-product-move/?daily_id=${dailyReport._id}&rate=non-comp&history=${dailyReport.date}`}
            bgColor="red" 
            iconType={<HiSortDescending className="text-4xl" />}
          />
          <button
            className="mx-16 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => navigate('/atlas/daily-reports')}
          >
            Voir tous les rapports
          </button>
        </div>
      </div>
    );
  }
};

export default AtlasDashBoardProductsAnalysis;
