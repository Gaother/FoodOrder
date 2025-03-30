import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/api'; // Vérifiez le chemin d'accès
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { subDays } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function AtlasProductPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const product_name = queryParams.get('productReference');
    const reference = queryParams.get('productId');
    const [chartData, setChartData] = useState({ datasets: [] });
    const [startDate, setStartDate] = useState(subDays(new Date(), 30));
    const [endDate, setEndDate] = useState(new Date());
    const [options, setOptions] = useState({});

    const fetchData = async (startDate, endDate) => {
        // console.log(reference);
        const response = await api.getPriceHistoryByProduct(reference); // Simuler l'appel API
        const apiData = response.data; // Assurez-vous que cela correspond à votre structure de données

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

        const priceMargin = (maxPrice - minPrice) * 0.05; // Marge de 5%
        setOptions({
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: minPrice - priceMargin,
                    suggestedMax: maxPrice + priceMargin,
                },
            },
        });

        setChartData(data);
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [reference, startDate, endDate]);

    return (
        <div  className='p-8 right-0'>
            <h1>Historique des prix pour {product_name} <br/>id: {reference}</h1><br/>
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
                className='w-full'
            />
            <Line data={chartData} options={options} />
        </div>
    );
}

export default AtlasProductPage;
