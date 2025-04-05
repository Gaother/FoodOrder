import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import HomePageForProComponents from '../../components/HomePageForProComponents';
import api from '../../api/api';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // État pour gérer le prénom
  const [lastName, setLastName] = useState(''); // État pour gérer le nom
  const [isRegister, setIsRegister] = useState(false); // État pour basculer entre login et register
  const [error, setError] = useState(''); // État pour gérer les messages d'erreur
  const [fieldErrors, setFieldErrors] = useState({});
  const { logIn, isLoggedIn, assignUserRole, setUserNotification } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      // Redirigez l'utilisateur vers la page d'accueil s'il est déjà connecté
      navigate('/');
    }
  }, [logIn]);

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
    if (error) setError('');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (error) setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (error) setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    if (error) setError('');
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    if (error) setError('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const body = {
      email,
      password,
    };
    try {
      const response = await api.login(body);
      if (response.data && response.data.user.token) {
        localStorage.setItem("JWToken", response.data.user.token);
        logIn();
        assignUserRole(response.data.user.role);
        setUserNotification(response.data.user.notifications);
        navigate('/');
      } else {
        setError("Connexion échouée"); // Message par défaut si pas de token
        setFieldErrors({ password: ' ', email: ' ' });
      }
      console.log(response);
    } catch (error) {
      setFieldErrors({ password: ' ', email: ' ' });

      // Afficher directement le message d'erreur en tant que texte
      setError(error ? error : "Erreur de connexion");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const body = {
      email,
      password,
      firstName,
      lastName,
      phone,
    };
    try {
      const response = await api.register(body); // Assurez-vous que la route API /register existe
      if (response.data && response.data.user.token) {
        localStorage.setItem("JWToken", response.data.user.token);
        logIn();
        assignUserRole(response.data.user.role);
        navigate('/');
      } else {
        setError("Inscription échouée"); // Message par défaut si pas de token
      }
    } catch (error) {
      setFieldErrors({});
      const errorMessage = error.toString();
      // Exemple d'erreur : "User validation failed: firstName: Path `firstName` is required."
      const errors = errorMessage.match(/`(\w+)` is required/g) || [];
      const translations = {
        firstName: 'Le prénom',
        lastName: 'Le nom',
        email: 'L\'email',
        password: 'Le mot de passe',
        phone: "Le numéro de téléphone"
      };

      const newFieldErrors = errors.reduce((acc, curr) => {
        const fieldName = curr.match(/`(\w+)`/)[1];
        const translatedFieldName = translations[fieldName] || fieldName;
        acc[fieldName] = `${translatedFieldName} est manquant`;
        return acc;
      }, {});
      setFieldErrors(newFieldErrors);
      if (error.toString().startsWith("User validation failed")) {
        setError("Veuillez remplir tous les champs requis.");
      } else {
        setError(error.toString());
      }
    }
  };

  // Définir le style des inputs en cas d'erreur
  const inputStyle = error ? "block w-full p-3 rounded bg-gray-200 border border-red-500 focus:outline-none" : "block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none";

  return (
    <div className='flex md:flex-row flex-col min-h-[84vh]'>
         <HomePageForProComponents className="w-1/2"/>
    <div className="container mx-auto p-8 flex overflow-hidden md:w-1/2 items-center">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl text-left pl-4 mb-8 font-bold border-l-8 border-yellow-500">{isRegister ? 'Inscription' : 'Connexion'}</h1>

        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="p-8">
            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              {isRegister && (
                <>
                  <div className="mb-5">
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-600">Nom</label>
                    <input
                      className={`block w-full p-3 rounded bg-gray-200 border ${fieldErrors.lastName ? 'border-red-500' : 'border-transparent'} focus:outline-none`}
                      placeholder="Nom"
                      value={lastName}
                      onChange={handleLastNameChange}
                    />
                    {fieldErrors.lastName && <p className="text-red-500">{fieldErrors.lastName}</p>}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-600">Prénom</label>
                    <input
                      className={`block w-full p-3 rounded bg-gray-200 border ${fieldErrors.firstName ? 'border-red-500' : 'border-transparent'} focus:outline-none`}
                      placeholder="Prénom"
                      value={firstName}
                      onChange={handleFirstNameChange}
                    />
                    {fieldErrors.firstName && <p className="text-red-500">{fieldErrors.firstName}</p>}
                  </div>

                  <div className="mb-5">
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-600">Numéro de téléphone</label>
                    <input
                      className={`block w-full p-3 rounded bg-gray-200 border ${fieldErrors.phone ? 'border-red-500' : 'border-transparent'} focus:outline-none`}
                      placeholder="Numéro de téléphone"
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                    {fieldErrors.phone && <p className="text-red-500">{fieldErrors.phone}</p>}
                  </div>
                </>
              )}

              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">Email</label>
                <input
                      className={`block w-full p-3 rounded bg-gray-200 border ${fieldErrors.email ? 'border-red-500' : 'border-transparent'} focus:outline-none`}
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {isRegister && fieldErrors.email && <p className="text-red-500">{fieldErrors.email}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">Mot de passe</label>
                <input
                      type="password"
                      className={`block w-full p-3 rounded bg-gray-200 border ${fieldErrors.password ? 'border-red-500' : 'border-transparent'} focus:outline-none`}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {isRegister && fieldErrors.password && <p className="text-red-500">{fieldErrors.password}</p>}
                {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>} {/* Afficher le message d'erreur ici */}
              </div>

              <button type="submit" className="w-full p-3 bg-yellow-500 text-white rounded shadow">
                {isRegister ? 'Inscription' : 'Connexion'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button 
                onClick={() => setIsRegister(!isRegister)} 
                className="text-indigo-600 hover:underline"
                >
                {isRegister ? 'Vous avez déjà un compte ? Connectez-vous à la place !' : 'Pas de compte ? Créez-en un'}
              </button>
              <div className="mt-2">
              <Link to="/reset-password" className="text-indigo-600 hover:underline">
                  Mot de passe oublié ?
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginRegister;