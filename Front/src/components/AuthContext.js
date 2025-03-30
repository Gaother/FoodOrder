import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import LoadingSpinner from './MainLoadingComponent';
//import { useNavigate, useLocation } from 'react-router-dom';


export const AuthContext = createContext();

function timeout(delay) {
  return new Promise( res => setTimeout(res, delay) );
}

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userNotification, setUserNotification] = useState({});
  const [userPlatform, setUserPlatform] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("JWToken");

    const fetchData = async () => {
      if (token) {

        try {
          // Essayez d'obtenir le rôle de l'utilisateur en utilisant le token
          const response = await api.getUserInfo();
          if (response && response.data.role) {
            // Si la réponse indique un token valide, considérez l'utilisateur comme connecté
            setUserRole(response.data.role);
            setIsLoggedIn(true);
            if (response.data.notifications)
              setUserNotification(response.data.notifications);
          }
            // Détecter la plateforme de l'utilisateur
            const userAgent = navigator.userAgent;
            let platform = "Unknown";

            if (/android/i.test(userAgent)) {
              platform = "Android";
            } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
              platform = "iOS";
            } else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
              platform = "MacOS";
            } else if (/Win32|Win64|Windows|WinCE/.test(userAgent)) {
              platform = "Windows";
            } else if (/Linux/.test(userAgent)) {
              platform = "Linux";
            }
            // console.log("Platform detected:", platform);

            // Ajouter des informations sur le navigateur
            const browserInfo = userAgent.match(/(firefox|msie|chrome|safari|trident|edge|opera|opr|edg)\/?\s*(\d+)/i) || [];
            const browser = browserInfo[1] ? browserInfo[1] : "Unknown";
            const version = browserInfo[2] ? browserInfo[2] : "Unknown";
            // console.log("Browser detected:", browser, "Version:", version);

            // Ajouter des informations sur l'appareil
            const deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";
            // console.log("Device type detected:", deviceType);

            // Ajouter des informations sur la langue
            const language = navigator.language || navigator.userLanguage;
            // console.log("Language detected:", language);

            // Ajouter des informations sur la résolution de l'écran
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            // console.log("Screen resolution detected:", screenWidth, "x", screenHeight);

            // Ajouter des informations sur la connexion réseau
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const networkType = connection ? connection.effectiveType : "Unknown";
            // console.log("Network type detected:", networkType);

            setUserPlatform({
              platform,
              browser,
              version,
              deviceType,
              language,
              screenWidth,
              screenHeight,
              networkType
            });
        } catch (error) {
          // En cas d'erreur, cela signifie que le token est invalide, appelez la fonction logOut
          logOut();
        } finally {
          // await timeout(1500);
          // Quelle que soit la réponse ou l'erreur, le chargement est terminé
          // console.log(userPlatform);
          setLoading(false);
        }
      } else {
        await timeout(1500);
        // Si aucun JWT n'est présent dans le local storage, le chargement est terminé
        setLoading(false);
      }
    };

    fetchData(); // Appelez la fonction asynchrone ici pour qu'elle s'exécute au chargement du composant
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("JWToken");
      if (token) {
        try {
          // Essayez d'obtenir le rôle de l'utilisateur en utilisant le token
          const response = await api.getUserInfo();
          if (response && response.data.role) {
            // Si la réponse indique un token valide, considérez l'utilisateur comme connecté
            setUserRole(response.data.role);
            setIsLoggedIn(true);
            setUserNotification(response.data.notifications);
          }
        } catch (error) {
          // En cas d'erreur, cela signifie que le token est invalide, appelez la fonction logOut
          logOut();
        } finally {
          // Quelle que soit la réponse ou l'erreur, le chargement est terminé
        }
      } else {
        // Si aucun JWT n'est présent dans le local storage, le chargement est terminé
      }
    };

    fetchData(); // Appelez la fonction asynchrone ici pour qu'elle s'exécute au chargement du composant

    const intervalId = setInterval(fetchData, 60000); // Appeler fetchData toutes les minutes

    return () => clearInterval(intervalId); // Nettoyer l'intervalle lors du démontage du composant
  }, []);

  const logIn = () => {
    setIsLoggedIn(true);
  };


  const logOut = () => {
    // Appelez la fonction logOut pour déconnecter l'utilisateur
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("JWToken");
  };

  const assignUserRole = (role) => {
    setUserRole(role);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, userRole, loading, assignUserRole, userNotification, setUserNotification }}>
      {children}
    </AuthContext.Provider>
  );
};
