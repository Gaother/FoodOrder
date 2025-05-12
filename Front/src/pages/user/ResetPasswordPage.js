import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';

const ResetPasswordRequestPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.requestPasswordReset({ email });
      if (response.status === 202) {
          setError(response.data.message);
      } else if (response.status === 201) {
        setMessage(response.data.message);
      } else {
        setError('Erreur lors de l\'envoi de l\'email de réinitialisation');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const inputStyle = error
    ? 'block w-full p-3 rounded bg-gray-200 border border-red-500 focus:outline-none'
    : 'block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none';

  return (
    <div className='flex md:flex-row flex-col min-h-[84vh]'>
      <div className="container mx-auto p-8 flex overflow-hidden md:w-1/2 items-center">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl text-left pl-4 mb-8 font-bold border-l-8 border-yellow-500">Réinitialiser le mot de passe</h1>

          <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">Adresse e-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className={inputStyle}
                    placeholder="Email"
                  />
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                    {message && <p className="text-green-500 mt-2">{message}</p>}
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full p-3 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 focus:outline-none"
                  >
                    Envoyer
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-indigo-600 hover:underline">
                <Link to="/login">
                    Retour à la connexion
                </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordRequestPage;