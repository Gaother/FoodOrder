import React, { useState } from 'react';
import TabCommandes from './TabCommandes';
import TabGraphiques from './TabActions';
import TabStatistiques from './TabActivity';

const CrmProductResumePopUpRightInfo = ({ customer }) => {
    const [activeTab, setActiveTab] = useState('commandes');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'commandes':
                return <TabCommandes customer={customer} />;
            case 'graphique':
                return <TabCommandes customer={customer} />;
            case 'statistiques':
                return <TabCommandes customer={customer} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full">
            <div className="border-b border-gray-200">
                <ul className="flex justify-between">
                    <li className={`flex-1 text-center p-2 cursor-pointer ${activeTab === 'commandes' ? 'border-b-2 border-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('commandes')}>Commandes</li>
                    <li className={`flex-1 text-center p-2 cursor-pointer ${activeTab === 'graphique' ? 'border-b-2 border-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('graphique')}>Graphiques</li>
                    <li className={`flex-1 text-center p-2 cursor-pointer ${activeTab === 'statistiques' ? 'border-b-2 border-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('statistiques')}>Statistiques</li>
                </ul>
            </div>
            <div className="p-4 bg-gray-100">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default CrmProductResumePopUpRightInfo;