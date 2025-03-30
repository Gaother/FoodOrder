import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import api from '../../api/api';
import LoadingSpinner from '../../components/LoadingComponent'; // Assurez-vous d'avoir ce composant

const LoginRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logIn, isLoggedIn, assignUserRole } = useContext(AuthContext);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get('adress');
    const password = query.get('pwd');
    const redir = query.get('redir');
    
    if (isLoggedIn) {
        if (redir) {
          navigate(redir.slice(1, -1));
        } else
          navigate('/');
    } else {
        if (redir) {
          loginAttempt(email.slice(1, -1), password.slice(1, -1), redir.slice(1, -1));
        } else 
          loginAttempt(email.slice(1, -1), password.slice(1, -1));
    }
}, [isLoggedIn]);

const loginAttempt = async (email, password, redir = "/") => {
    if (!email || !password) {
      navigate('/login'); // Rediriger vers la page de login si les paramètres ne sont pas fournis
      return;
    }

    try {
      const response = await api.login({ email, password });
      if (response.data && response.data.user.token) {
        localStorage.setItem("JWToken", response.data.user.token);
        logIn();
        assignUserRole(response.data.user.role);
        setTimeout(() => navigate(redir), 1000);
      }
    } catch (error) {
      console.error('Login failed', error);
      navigate('/login'); // Rediriger vers la page de login en cas d'échec
    }
  };

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p>Connexion en cours...</p>
      </div>
    </div>
  );
};

export default LoginRegister;
