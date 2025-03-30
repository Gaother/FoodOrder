import React, { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import DBBackupButton from './DBBackupButtonComponent';
import { FaBars, FaClipboardList, FaBox, FaTags, FaList, FaUsers, FaUserClock } from 'react-icons/fa';

const Menu = () => {
    const jwtToken = localStorage.getItem('JWToken');
    const { isLoggedIn, userRole } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const [currentPath, setCurrentPath] = useState(location.pathname);

    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location]);

    const toggleMenu = () => {
        if (window.innerWidth < 768) {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    const isActiveLink = (path) => currentPath === path;

    return (
        <div className="flex max-w-sc">
            {/* Bouton pour afficher/masquer le menu */}
            <button 
                className="md:hidden size-12 flex items-center justify-center fixed bottom-4 right-4 z-50 bg-yellow-500 text-black p-2 rounded-md"
                onClick={toggleMenu}
            >
                <FaBars className='size-6'/>
            </button>

            {/* Menu latéral */}
            <nav className={`bg-black p-4 w-80 md:w-48 flex flex-col gap-1 fixed h-full z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <Link 
                    to="/admin/orders"
                    className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActiveLink('/admin/orders') ? 'bg-yellow-500 text-black border-yellow-500' : 'text-white hover:bg-yellow-600'}`}
                    onClick={toggleMenu}
                >
                    <FaClipboardList className="inline-block mr-2" /> Commandes
                </Link>
                <hr className="border-t-2 border-yellow-500 my-1" />
                <Link 
                    to="/admin/products"
                    className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActiveLink('/admin/products') ? 'bg-yellow-500 text-black border-yellow-500' : 'text-white hover:bg-yellow-600'}`}
                    onClick={toggleMenu}
                >
                    <FaBox className="inline-block mr-2" /> Produits
                </Link>
                <Link 
                    to="/admin/brands"
                    className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActiveLink('/admin/brands') ? 'bg-yellow-500 text-black border-yellow-500' : 'text-white hover:bg-yellow-600'}`}
                    onClick={toggleMenu}
                >
                    <FaTags className="inline-block mr-2" /> Marques
                </Link>
                <Link 
                    to="/admin/features"
                    className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActiveLink('/admin/features') ? 'bg-yellow-500 text-black border-yellow-500' : 'text-white hover:bg-yellow-600'}`}
                    onClick={toggleMenu}
                >
                    <FaList className="inline-block mr-2" /> Caractéristiques
                </Link>
                <hr className="border-t-2 border-yellow-500 my-1" />
                <Link 
                    to="/admin/users"
                    className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActiveLink('/admin/users') ? 'bg-yellow-500 text-black border-yellow-500' : 'text-white hover:bg-yellow-600'}`}
                    onClick={toggleMenu}
                >
                    <FaUsers className="inline-block mr-2" /> Utilisateurs
                </Link>
                <Link
                    to="/admin/user-histories"
                    className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActiveLink('/admin/user-histories') ? 'bg-yellow-500 text-black border-yellow-500' : 'text-white hover:bg-yellow-600'}`}
                    onClick={toggleMenu}
                >
                    <FaUserClock className="inline-block mr-2" /> Historiques
                </Link>
                {isLoggedIn && userRole === 'superadmin' && (
                    <DBBackupButton className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-600"/>
                )}
            </nav>

            {/* Fond flouté */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleMenu}
                ></div>
            )}

            {/* Contenu principal */}
            <div className="md:ml-48 w-full h-full bg-gray-100">
                <Outlet />
            </div>
        </div>
    );
};

export default Menu;