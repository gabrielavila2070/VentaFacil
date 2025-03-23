import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

   
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/auth/login', null, {  
        params: { username, password },
      });
  
      const token = response.data.token;
      const user = response.data.user;   // Ahora el backend envía user
  
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Guarda el usuario
  
      navigate('/dashboard'); 
    } catch (err) {
      setError('Credenciales incorrectas');
      console.error('Error al iniciar sesión:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo y Título */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6 animate-fade-in">
            <img 
              src="images/logo.png" 
              alt="Logo" 
              className="w-16 h-16 drop-shadow-lg transition-transform hover:scale-105"
            />
            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
              Venta Fácil
            </h1>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white/90">
            Bienvenido de vuelta
          </h2>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-300 hover:shadow-2xl">
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg">
              <FaExclamationCircle className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="nombre.usuario"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-all ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              <FaSignInAlt className="text-lg" />
              {isLoading ? 'Iniciando sesión...' : 'Acceder al sistema'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm">
          © {new Date().getFullYear()} Venta Fácil. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

export default Login;