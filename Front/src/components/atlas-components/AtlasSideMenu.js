import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MdOutlineDashboard, MdKeyboardArrowRight, MdMenu, MdClose, MdKeyboardArrowUp } from "react-icons/md";
import { GrOverview } from "react-icons/gr";
import { RiTeamLine } from "react-icons/ri";
import { VscTools } from "react-icons/vsc";
import { IoSettingsOutline } from "react-icons/io5";
import BreadCrum from '../BreadCrum';


const Menu = () => {
    const [menuState, setMenuState] = useState({
        veilleTarifaire: { isOpen: false, isTransitioning: false },
        concurrents: { isOpen: false, isTransitioning: false },
        outils: { isOpen: false, isTransitioning: false },
        settings: { isOpen: false, isTransitioning: false },
        mobileMenuOpen: false,
        showScrollTopButton: false,
    });

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setMenuState(prev => ({ ...prev, showScrollTopButton: true }));
            } else {
                setMenuState(prev => ({ ...prev, showScrollTopButton: false }));
            }
        };
        
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const toggleMenu = (menu) => {
        setMenuState(prevState => ({
            ...prevState,
            [menu]: {
                isOpen: !prevState[menu].isOpen,
                isTransitioning: true,
            },
        }));
    };

    const handleTransitionEnd = (menu) => {
        setMenuState(prevState => ({
            ...prevState,
            [menu]: {
                ...prevState[menu],
                isTransitioning: false,
            },
        }));
    };

    const toggleMobileMenu = () => {
        setMenuState(prevState => ({
            ...prevState,
            mobileMenuOpen: !prevState.mobileMenuOpen,
        }));
    };

    return (
        <div className="flex">
            <button className="lg:hidden absolute top-0 right-0 mt-3 mr-2 pt-20" onClick={toggleMobileMenu}>
                {menuState.mobileMenuOpen ? <MdClose className="h-8 w-8 text-white -translate-y-8 hidden" /> : <MdMenu className="h-10 w-10 text-white bg-gray-800 rounded-full p-2" />}
            </button>
            <nav className={`bg-gray-800 p-4 flex flex-col fixed h-full w-60 text-white transform ${menuState.mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
                <Link to="/atlas" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 mb-2">
                    <MdOutlineDashboard className='mr-2 h-6 w-6'/>
                    Tableau de bord
                </Link>

                {/* Veille Tarifaire */}
                <div className='mb-2'>
                    <button onClick={() => toggleMenu('veilleTarifaire')} className={`flex items-center justify-between px-3 py-2 text-sm font-medium w-full ${menuState.veilleTarifaire.isOpen || menuState.veilleTarifaire.isTransitioning ? 'bg-gray-500 rounded-t-md' : 'rounded-md hover:bg-gray-700'}`}>
                        <div className="flex items-center space-x-2">
                            <GrOverview className='mr-2 h-6 w-6'/>
                            <span>Veille tarifaire</span>
                        </div>
                        <MdKeyboardArrowRight className={`${menuState.veilleTarifaire.isOpen ? 'transform rotate-90' : ''} transition-transform duration-200`} />
                    </button>
                    <div onTransitionEnd={() => handleTransitionEnd('veilleTarifaire')} className={`transition-all duration-200 ease-in ${menuState.veilleTarifaire.isOpen ? 'max-h-40' : 'max-h-0'} overflow-hidden bg-gray-700 rounded-b-md`}>
                        <Link to="/atlas/overview/total" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">Tous les produits</Link>
                        <Link to="/atlas/daily-reports" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">Rapports journaliers</Link>
                        <Link to="/atlas/overview/matched" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">⚠ Ne pas cliquer ⚠</Link>
                    </div>
                </div>

                {/* Concurrents */}
                <div className='mb-2'>
                    <button onClick={() => toggleMenu('concurrents')} className={`flex items-center justify-between px-3 py-2 text-sm font-medium w-full ${menuState.concurrents.isOpen || menuState.concurrents.isTransitioning ? 'bg-gray-500 rounded-t-md' : 'rounded-md hover:bg-gray-700'}`}>
                        <div className="flex items-center space-x-2">
                            <RiTeamLine className='mr-2 h-6 w-6'/>
                            <span>Concurrents</span>
                        </div>
                        <MdKeyboardArrowRight className={`${menuState.concurrents.isOpen ? 'transform rotate-90' : ''} transition-transform duration-200`} />
                    </button>
                    <div onTransitionEnd={() => handleTransitionEnd('concurrents')} className={`transition-all duration-200 ease-in ${menuState.concurrents.isOpen ? 'max-h-40' : 'max-h-0'} overflow-hidden bg-gray-700 rounded-b-md`}>
                        <Link to="/atlas/competitors/list" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">Liste des concurrents</Link>
                        <Link to="/atlas/competitors/analysis" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">Analyse des concurrents</Link>
                    </div>
                </div>

                {/* Outils */}
                <div className='mb-2'>
                    <button onClick={() => toggleMenu('outils')} className={`flex items-center justify-between px-3 py-2 text-sm font-medium w-full ${menuState.outils.isOpen || menuState.outils.isTransitioning ? 'bg-gray-500 rounded-t-md' : 'rounded-md hover:bg-gray-700'}`}>
                        <div className="flex items-center space-x-2">
                            <VscTools className='mr-2 h-6 w-6'/>
                            <span>Outils</span>
                        </div>
                        <MdKeyboardArrowRight className={`${menuState.outils.isOpen ? 'transform rotate-90' : ''} transition-transform duration-200`}/>
                    </button>
                    <div onTransitionEnd={() => handleTransitionEnd('outils')} className={`transition-all duration-200 ease-in ${menuState.outils.isOpen ? 'max-h-40' : 'max-h-0'} overflow-hidden bg-gray-700 rounded-b-md`}>
                        <Link to="/atlas/tools/calculator" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">Calculatrice</Link>
                        <Link to="/atlas/tools/converter" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">Convertisseur</Link>
                    </div>
                </div>

                {/* Réglages */}
                <div className='mb-2'>
                    <button onClick={() => toggleMenu('settings')} className={`flex items-center justify-between px-3 py-2 text-sm font-medium w-full ${menuState.settings.isOpen || menuState.settings.isTransitioning ? 'bg-gray-500 rounded-t-md' : 'rounded-md hover:bg-gray-700'}`}>
                        <div className="flex items-center space-x-2 ">
                            <IoSettingsOutline className='mr-2 h-6 w-6'/>
                            <span>Réglages</span>
                        </div>
                        <MdKeyboardArrowRight className={`${menuState.settings.isOpen ? 'transform rotate-90' : ''} transition-transform duration-200`}/>
                    </button>
                    <div onTransitionEnd={() => handleTransitionEnd('settings')} className={`transition-all duration-200 ease-in ${menuState.settings.isOpen ? 'max-h-40' : 'max-h-0'} overflow-hidden bg-gray-700 rounded-b-md`}>
                        <Link to="/atlas/settings/profile" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">Profil</Link>
                        <Link to="/atlas/settings/preferences" className="flex justify-start px-3 py-2 text-sm font-medium hover:bg-gray-600">Préférences</Link>
                    </div>
                </div>
                {/* Bouton pour fermer le menu dans le mode mobile */}
                <button className="lg:hidden mt-2 px-3 py-2 rounded text-white bg-gray-700 hover:bg-gray-600 p-4 " onClick={toggleMobileMenu}>
                    Fermer
                </button>
            </nav>
            {menuState.showScrollTopButton && (
                <button className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full border-2 cursor-pointer z-50"
                        onClick={scrollToTop}>
                    <MdKeyboardArrowUp className="text-xl"/>
                </button>
            )}
            <div className={`ml-0 lg:ml-60 w-full bg-gray-100 ${menuState.mobileMenuOpen ? '' : 'lg:ml-60'}`}>
                <BreadCrum />
                <Outlet />
            </div>
        </div>
    );
};

export default Menu;