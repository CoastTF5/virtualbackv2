import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userPersonas } from '../data/mockData';

function LoginPage() {
  const { login, selectPersona } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would authenticate with a backend
      // For the prototype, we'll just log in successfully
      await login();
      navigate('/');
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSelect = async (personaIndex) => {
    setLoading(true);
    setError(null);

    try {
      const result = await selectPersona(personaIndex);
      if (result) {
        navigate('/');
      }
    } catch (err) {
      setError('Could not sign in as selected persona. Please try again.');
      console.error('Persona selection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Virtual Backlot
          </h1>
          <p className="text-xl text-blue-400">Paramount Global</p>
          <p className="mt-4 text-gray-400">
            A centralized 3D asset platform for creative and technical teams
          </p>
        </div>

        {/* Login form */}
        <div className="mt-12 bg-white shadow rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Left side with login form */}
            <div className="w-full md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign in to your account</h2>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      defaultValue="demo@virtualbacklot.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      defaultValue="password123"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right side with persona selection */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 border-t md:border-t-0 md:border-l border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Try a demo persona
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                For the prototype, you can experience the platform from different user perspectives.
                Select one of the personas below to try their experience:
              </p>

              <div className="space-y-4">
                {userPersonas.map((persona, index) => (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaSelect(index)}
                    disabled={loading}
                    className="w-full p-4 border border-gray-300 rounded-lg flex items-center hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-medium">
                      {persona.avatar}
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="font-medium text-gray-900">{persona.name}</h3>
                      <p className="text-sm text-gray-500">{persona.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;