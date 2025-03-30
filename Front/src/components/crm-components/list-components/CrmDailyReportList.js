import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CrmDashBoardRecentMoves from '../dashboard-components/CrmDashBoardRecentMoves';
import api from '../../../api/api'; // Assurez-vous d'avoir le bon chemin vers votre instance d'API

const CrmDailyReportList = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Pour la navigation entre les mois
  const [dailyReports, setDailyReports] = useState([]); // Pour stocker les rapports quotidiens

  useEffect(() => {
    // Construisez votre objet de requête en fonction de l'API que vous utilisez.
    const fetchData = async () => {
      const month = currentDate.getMonth() + 1; // +1 car getMonth() renvoie un index basé sur 0
      const year = currentDate.getFullYear();
      
      try {
        const response = await api.getFilteredAllDailyReport({ month, year });
        setDailyReports(response.data); // Stocke les rapports quotidiens dans le state
        console.log(response); // Affiche la réponse de l'API dans la console
      } catch (error) {
        console.error('Erreur lors de la récupération des rapports quotidiens:', error);
      }
    };

    fetchData();
  }, []); 

  const renderDayTile = ({ date, view, activeStartDate }) => {
    const isCurrentMonth = date.getMonth() === activeStartDate.getMonth();
    const matchingReport = dailyReports.find(report => {
      const reportDate = new Date(report.date);
      return reportDate.getDate() === date.getDate() && reportDate.getMonth() === date.getMonth() && reportDate.getFullYear() === date.getFullYear();
    });

    if (matchingReport) {
      return (
        <div className={`bg-gray-200 py-2  text-center`}>
          <div>{new Date(matchingReport.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}</div>
          <CrmDashBoardRecentMoves calendar={true} dailyReportId={matchingReport._id} />
        </div>
      );
    } else {
      return <div className={`bg-gray-200 py-2  text-center`}>
        <div>{new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}</div>
        <div className="text-gray-500">Pas de rapport disponible</div>
      </div>;
    }
  };

  return (
    <div className="flex flex-grow w-full">
      <Calendar
        onChange={setCurrentDate}
        value={currentDate}
        navigationLabel={({ date, view }) => date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        showNavigation={true}
        showNeighboringMonth={true}
        locale="fr-FR"
        tileContent={renderDayTile}
        className="w-full max-w-full"
        next2Label={null}
        prev2Label={null}
        view="month"
        minDetail="month"
        maxDetail="month"
        formatDay={() => null} // Add this line to hide the day number
      />
    </div>
  );
};

export default CrmDailyReportList;
