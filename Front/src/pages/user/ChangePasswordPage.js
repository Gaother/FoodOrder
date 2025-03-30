import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import api from '../../api/api';
import HomePageForProComponents from '../../components/HomePageForProComponents';

const ResetPasswordPage = () => {
  const location = useLocation(); // Pour lire l'URL actuelle
  const navigate = useNavigate(); // Pour naviguer après succès
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState(''); // Stocker le token

  // Cette fonction extrait les paramètres de l'URL (incl. le token)
  const parseTokenFromURL = () => {
    const params = new URLSearchParams(location.search);
    const extractedToken = params.get('token'); // Extraire le token
    if (extractedToken) {
      setToken(extractedToken); // Mettre à jour l'état avec le token
    } else {
      setError("Token manquant ou invalide.");
    }
  };

  // Appeler parseTokenFromURL lorsque le composant est monté
  useEffect(() => {
    parseTokenFromURL();
  }, [location]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const response = await api.resetPassword(token, { password }); // Envoyer le token et le nouveau mot de passe
      console.log(response);
      if (response.status === 202) {
        setError(response.data.message);
      } else if (response.status === 201) {
        setMessage(response.data.message);
        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate('/login');
      } else {
        setError('Erreur lors de la réinitialisation du mot de passe');
      }
    } catch (error) {
      setError('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  const inputStyle = error ? "block w-full p-3 rounded bg-gray-200 border border-red-500 focus:outline-none" : "block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none";

  return (
    <div className='flex md:flex-row flex-col min-h-[84vh]'>
      <HomePageForProComponents className="w-1/2" />

      <div className="container mx-auto p-8 flex overflow-hidden md:w-1/2 items-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl text-left pl-4 mb-8 font-bold border-l-8 border-yellow-500">Réinitialiser le mot de passe</h1>

          <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-5 relative">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={inputStyle}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={toggleShowPassword}>
                      {showPassword ? <AiFillEye size={24} /> : <AiFillEyeInvisible size={24} />}
                    </div>
                  </div>
                </div>

                <div className="mb-5 relative">
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-600">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={inputStyle}
                      placeholder="Confirmez le mot de passe"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={toggleShowConfirmPassword}>
                      {showConfirmPassword ? <AiFillEye size={24} /> : <AiFillEyeInvisible size={24} />}
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {message && <p className="text-green-500 mt-2">{message}</p>}
                <div className="mb-5">
                  <button type="submit" className="w-full p-3 bg-yellow-500 text-white rounded shadow">
                    Réinitialiser
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-indigo-600 hover:underline">
                  <Link to="/login">Retour à la connexion</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;