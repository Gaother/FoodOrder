import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import api from '../../../api/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaChartBar } from 'react-icons/fa';
import LoadingSpinner from '../../LoadingComponent';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const AtlasDashBoardProductsAnalysis = () => {
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

    const labels = [
        "-65 to -55", "-55 to -45", "-45 to -35", "-35 to -25", "-25 to -15", "-15 to -5",
        "-5 to 5", "5 to 15", "15 to 25", "25 to 35", "35 to 45", "45 to 55", "55 to 65"
    ];

    const dataValues = [
        dailyReport.diffPercentCounts.nbMinus55toMinus65, dailyReport.diffPercentCounts.nbMinus45toMinus55,
        dailyReport.diffPercentCounts.nbMinus35toMinus45, dailyReport.diffPercentCounts.nbMinus25toMinus35,
        dailyReport.diffPercentCounts.nbMinus15toMinus25, dailyReport.diffPercentCounts.nbMinus5toMinus15,
        dailyReport.diffPercentCounts.nb5toMinus5, dailyReport.diffPercentCounts.nb5to15,
        dailyReport.diffPercentCounts.nb15to25, dailyReport.diffPercentCounts.nb25to35,
        dailyReport.diffPercentCounts.nb35to45, dailyReport.diffPercentCounts.nb45to55,
        dailyReport.diffPercentCounts.nb55to65
    ];

    const backgroundColors = dataValues.map((value, index) => {
        if (labels[index] === "-5 to 5") return 'blue';
        if (labels[index].includes("-")) return 'red';
        return 'green';
    });

    const data = {
        labels: labels,
        datasets: [{
            label: 'Offres',
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1,
        }]
    };

    const options = {
        scales: {
            x: {
                barThickness: 30, // Makes bars thicker
            },
            y: {
                beginAtZero: true,
            }
        },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#444',
                font: {
                    weight: 'bold'
                }
            },
            legend: {
                display: false,
                position: 'left', // Display legend to the left
                labels: {
                    boxWidth: 20,
                    padding: 20,
                },
            },
            tooltip: {
                enabled: true
            }
        }
    };

    return (
        <div className="bg-white w-full shadow rounded-lg overflow-hidden">
            <div className="bg-orange-400 p-4 flex justify-between items-center">
                <h2 className="text-white text-lg font-bold">Différences de prix offres concurrentes</h2>
                <FaChartBar className="text-white text-2xl" />
            </div>
            <div className="p-4">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default AtlasDashBoardProductsAnalysis;
