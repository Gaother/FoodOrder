import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaArrowUp } from 'react-icons/fa';
import NotificationsManager from './notifications-components/NotificationManagerComponent';
import UserNotificationsManager from './notifications-components/UserNotificationManagerComponent';
import destockdisSvg from '../assets/destockdis.svg';


const Menu = () => {
  const jwtToken = localStorage.getItem('JWToken');
  const { isLoggedIn, userRole } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [menuState, setMenuState] = useState({
    showScrollTopButton: false,
  });

  useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > 700) {
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

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/reset-password' && location.pathname !== '/change-password') {
      navigate('/login');
    }
  }, [isLoggedIn, navigate, location.pathname]);

  return (
    <div className="flex z-100">
      <nav className="flex justify-between items-center fixed top-0 left-0 right-0 z-10 bg-black p-4">
        <div className="flex items-center">
          {isLoggedIn && <Link to="/"><img src={destockdisSvg} alt="Logo" className="h-12 w-36 mr-4 visible sm:block" /></Link>}
          {!isLoggedIn && <img src={destockdisSvg} alt="Logo" className="h-12 w-36 mr-4 visible sm:block" />}
          {isLoggedIn && (userRole === "admin" || userRole === "superadmin") && <Link to="/admin/orders" className="text-white px-3 py-2 rounded-md text-lg leading-6 font-bold hover:bg-yellow-600">Admin Dashboard</Link>}
        </div>
        <div className="flex items-center">
          {!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/reset-password" && location.pathname !== "/change-password" && <Link to="/login" className="text-black px-3 py-2 rounded-md text-sm font-medium bg-yellow-500 hover:bg-yellow-600">Se connecter</Link>}
          {isLoggedIn && <Link to="/profile" className="ml-4 flex p-0.5 items-center justify-center bg-yellow-500 text-white rounded-full h-12 w-12 hover:bg-yellow-600">
              <FaUser color='black' className='p-2 h-full w-full' />
          </Link>}
          {isLoggedIn && (userRole === "admin" || userRole === "superadmin") && 
              <NotificationsManager/>
          }
          {isLoggedIn && userRole === "certifiate" && 
              <UserNotificationsManager/>
          }
          {isLoggedIn && userRole !== "guest" && userRole !== "viewer" && <Link to="/cart" className="ml-4 flex p-0.5 items-center justify-center bg-yellow-500 text-white rounded-full h-12 w-12 hover:bg-yellow-600">
              <FaShoppingCart color='black' className='p-2 h-full w-full' />
          </Link>}
        </div>
      </nav>
      <div className="mt-4 w-full h-full">
        <Outlet/>
      </div>
      {menuState.showScrollTopButton && (
          <button className={`fixed ${location.pathname.includes('/admin') ? 'bottom-20 md:bottom-4' : 'bottom-4'} right-4 p-2 bg-yellow-500 hover:bg-yellow-600 text-black border-black rounded-full border-2 cursor-pointer z-50`}
                  onClick={scrollToTop}>
              <FaArrowUp className="text-xl"/>
          </button>
      )}
    </div>
  );
};

export default Menu;
