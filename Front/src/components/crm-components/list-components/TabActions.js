import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from 'date-fns';
import { FaChartBar } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../../api/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TabGraphiques = ({ product }) => {
    const [chartData, setChartData] = useState({ datasets: [] });
    const [startDate, setStartDate] = useState(subDays(new Date(), 30));
    const [endDate, setEndDate] = useState(new Date());
    const [options, setOptions] = useState({});

    const fetchData = async (startDate, endDate) => {
        const response = await api.getPriceHistoryByProduct(product.product._id); // Assurez-vous que cela correspond à votre structure de données
        const apiData = response.data;

        const filteredData = apiData.map(site => ({
            ...site,
            histories: site.histories.filter(history => {
                const historyDate = new Date(history.date);
                return historyDate >= startDate && historyDate <= endDate;
            })
        })).filter(site => site.histories.length > 0);

        const data = { labels: [], datasets: [] };
        let minPrice = Number.MAX_VALUE;
        let maxPrice = Number.MIN_VALUE;

        filteredData.forEach((siteData) => {
            const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            const dataset = {
                label: siteData.site,
                data: siteData.histories.map(history => {
                    const date = new Date(history.date).toLocaleDateString();
                    const price = history.price;
                    if (!data.labels.includes(date)) data.labels.push(date);
                    minPrice = Math.min(minPrice, price);
                    maxPrice = Math.max(maxPrice, price);
                    return { x: date, y: price };
                }),
                borderColor: color,
                backgroundColor: color,
            };
            data.datasets.push(dataset);
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
                  text: 'Prix en €'
                },
                beginAtZero: false
              }
            },
          });

        setChartData(data);
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [product, startDate, endDate]);

    return (
        <div className="flex flex-col bg-white w-full shadow rounded-lg overflow-hidden">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Historique des prix</h1>
                <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                        setStartDate(update[0]);
                        setEndDate(update[1]);
                    }}
                    isClearable={false}
                    withPortal
                    className='p-1 rounded-md w-60 text-center border-gray-800 mb-4 border-2'
                />
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default TabGraphiques;