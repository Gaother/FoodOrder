import { FaChartBar } from 'react-icons/fa';
import LoadingSpinner from '../../LoadingComponent';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../../../api/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AtlasDashBoardProductsAnalysis = () => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [options, setOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getGraphDataDailyReportNbProduct();
        prepareChartData(response.data);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };
    fetchData();
  }, []);

  const prepareChartData = (data) => {
    // Deduplicate data for the same date keeping only the earliest one
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    let uniqueDatesData = [...new Map(sortedData.map(item => [item.date.slice(0, 10), item])).values()];
    uniqueDatesData = sortedData.slice(-30);
    const labels = uniqueDatesData.map(d => new Date(d.date).toLocaleDateString());
    const competitiveData = uniqueDatesData.map(d => d.nbCompetitiveProducts);
    const samePriceData = uniqueDatesData.map(d => d.nbSamePriceProducts);
    const nonCompetitiveData = uniqueDatesData.map(d => d.nbNonCompetitiveProducts);
    const totalProductsData = uniqueDatesData.map(d => d.totalProducts);
    const matchedProductsData = uniqueDatesData.map(d => d.matchedProducts);
    const unmatchedProductsData = uniqueDatesData.map(d => d.unmatchedProducts);

    setChartData({
      labels,
      datasets: [
      {
        label: 'Produits compétitifs',
        data: competitiveData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        label: 'Produits au même prix',
        data: samePriceData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        label: 'Produits non compétitifs',
        data: nonCompetitiveData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: 5,
        pointHoverRadius: 8
      },
      // Adding new datasets for matched data
      {
        label: 'Nombre de produits total',
        data: totalProductsData,
        borderColor: 'black',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderDash: [5, 5],
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        label: 'Nombre de produits matchés',
        data: matchedProductsData,
        borderColor: 'purple',
        backgroundColor: 'rgba(128, 0, 128, 0.5)',
        borderDash: [5, 5],
        pointRadius: 5,
        pointHoverRadius: 8
      },
      {
        label: 'Nombre de produits non-matchés',
        data: unmatchedProductsData,
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.5)',
        borderDash: [5, 5],
        pointRadius: 5,
        pointHoverRadius: 8
      }
      ]
    });

    setOptions({
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          display: false,
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Nombre de produits'
          },
          beginAtZero: false
        }
      },
    });
  };


  return (
    <div className="flex flex-col bg-white w-full shadow rounded-lg overflow-hidden">
      <div className="bg-orange-400 p-4 flex justify-between items-center">
        <h2 className="text-white text-lg font-bold">Évolution des groupes de produits</h2>
        <FaChartBar className="text-white text-2xl" />
      </div>
      <div className="p-4">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AtlasDashBoardProductsAnalysis;
