import React, { useState, useEffect, useContext } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';  // Ensure correct import for icon usage
import { GoGraph } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import LoadingSpinner from '../../LoadingComponent';

const AtlasDashBoardAllProduct = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dailyReport, setDailyReport] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            api.getLastestDailyReport().then(response => {
                if (response.status === 200) {
                    setDailyReport(response.data);
                } else {
                    console.error('Failed to fetch daily report, status:', response.status);
                }
                setLoading(false);
            }).catch(error => {
                console.error('Error fetching the daily report:', error);
                setLoading(false);
            });
        }
    }, [isLoggedIn, navigate]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const { totalProducts, matchedProducts, unmatchedProducts, nbConcurrent } = dailyReport;

    return (
        <div className="flex row-auto md:pl-16 pl-4 pr-8 pt-4">
            <div className="flex flex-col">
                <div className='font-bold text-xl'>
                    {totalProducts?.toLocaleString()}
                </div>
                <div className=''>
                    Produits Total
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col mx-4 h-full my-2" style={{border: '1px solid'}}/>
            </div>
            <div className="flex flex-col">
                <div className='font-bold text-xl'>
                    {matchedProducts?.toLocaleString()}
                </div>
                <div className=''>
                    Produits Matchés
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col mx-4 h-full my-2" style={{border: '1px solid'}}/>
            </div>
            <div className="flex flex-col">
                <div className='font-bold text-xl'>
                    {unmatchedProducts?.toLocaleString()}
                </div>
                <div className=''>
                    Produits Non Matchés
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col mx-4 h-full my-2" style={{border: '1px solid'}}/>
            </div>
            <div className="flex flex-col">
                <div className='flex flex-row'>
                    <div className='font-bold text-xl'>
                        {nbConcurrent?.toLocaleString()}
                    </div>
                    <Link to="/concurrents" className='ml-4 px-3 rounded-full text-white bg-blue-500 border-2 hover:bg-blue-700'>
                        Voir
                    </Link>
                </div>
                <div className=''>
                    Concurrents
                </div>
            </div>
            {/* ... other codes ... */}
        </div>
    );  
};

export default AtlasDashBoardAllProduct;
