import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import api from '../../../api/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import { FaChartBar } from 'react-icons/fa';
import LoadingSpinner from '../../LoadingComponent';



ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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

    // Options pour le graphique en anneau (Doughnut chart)
    const options = {
        plugins: {
          datalabels: {
            color: '#fff',
            anchor: 'start',
            align: 'start',
            offset: 10,
            font: {
              weight: 'bold',
            },
            formatter: (value, context) => {
              const label = context.chart.data.labels[context.dataIndex];
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(2) + '%';
              return label + '\n' + value + " | " + percentage;
            },
            // Cette option permet de placer les labels à l'extérieur et les pourcentages à l'intérieur des segments
            labels: {
              title: {
                font: {
                  weight: 'bold',
                }
              },
              value: {
                color: 'black',
              }
            }
          },
          tooltip: {
            display: true,
            displayColors: false,
            callbacks: {
            label: function (context) {
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(2) + '%';
                return value + ' produits | ' + percentage;
                },
            }
        },
        legend: {
            display: false, // Nous ne voulons pas de la légende par défaut
        },
    },
    // Assurez-vous que les arcs du graphique soient toujours de la même taille, indépendamment des données
    cutout: '70%', // Vous pouvez ajuster le pourcentage pour un effet de "donut" plus ou moins large
    // Autres options que vous souhaitez ajouter...
};

    // Données pour le graphique en anneau (Doughnut chart)
    const data = {
        labels: ['Bien placé', 'Prix égal', 'Mal placé'],
        datasets: [
        {
            label: 'Positionnement du produit',
            data: [dailyReport.nbCompetitiveProducts, dailyReport.nbSamePriceProducts, dailyReport.nbNonCompetitiveProducts],
            backgroundColor: [
            'rgba(75, 192, 192, 0.2)', // Vert pour "Bien placé"
            'rgba(54, 162, 235, 0.2)', // Bleu pour "Prix égal"
            'rgba(255, 99, 132, 0.2)', // Rouge pour "Mal placé"
            ],
            borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
        },
        ],
    };


  return (
    <div className="bg-white w-full shadow rounded-lg overflow-hidden">
      {/* Upper rectangle with orange background */}
      <div className="bg-orange-400 p-4 flex justify-between items-center">
        <h2 className="text-white text-lg font-bold">Parts de chaque groupes de produits</h2>
        <FaChartBar className="text-white text-2xl" />
      </div>

      {/* Lower rectangle with the chart */}
      <div className="p-4">
        <div className="text-center text-m mb-4"><span className='text-lg'>{dailyReport.totalProducts}</span> produits sous surveillance</div>
            <Doughnut className='p-1' data={data} options={options} />
        <div className="text-center text-sm mt-4">Position prix / offre la moins chère</div>
      </div>
    </div>
  );
};

export default AtlasDashBoardProductsAnalysis;
