import React, { useState } from 'react';
import TabConcurrents from './TabConcurrents';
import TabGraphiques from './TabGraphiques';
import TabStatistiques from './TabStatistiques';

const AtlasProductResumePopUpRightInfo = ({ product }) => {
    const [activeTab, setActiveTab] = useState('concurrents');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'concurrents':
                return <TabConcurrents product={product} />;
            case 'graphique':
                return <TabGraphiques product={product} />;
            case 'statistiques':
                return <TabStatistiques product={product} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full">
            <div className="border-b border-gray-200">
                <ul className="flex justify-between">
                    <li className={`flex-1 text-center p-2 cursor-pointer ${activeTab === 'concurrents' ? 'border-b-2 border-blue-500 font-bold' : ''}`} onClick={() => setActiveTab('concurrents')}>Concurrents</li>
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

export default AtlasProductResumePopUpRightInfo;