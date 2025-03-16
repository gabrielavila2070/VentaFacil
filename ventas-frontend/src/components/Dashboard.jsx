import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaChartBar, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'preventista';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white flex flex-col p-5 shadow-lg">
        <h2 className="text-xl font-bold mb-5">Venta Fácil</h2>
        <ul>
          <li className="mb-4 flex items-center cursor-pointer hover:text-gray-300">
            <FaChartBar className="mr-2" /> Dashboard
          </li>
          {role === 'admin' && (
            <li className="mb-4 flex items-center cursor-pointer hover:text-gray-300">
              <FaUser className="mr-2" /> Usuarios
            </li>
          )}
          <li className="mb-4 flex items-center cursor-pointer hover:text-gray-300">
            <FaShoppingCart className="mr-2" /> Ventas
          </li>
          <li
            className="mt-auto flex items-center cursor-pointer text-red-400 hover:text-red-600"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" /> Cerrar sesión
          </li>
        </ul>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido al Dashboard</h1>
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">Ventas</h3>
            <p className="text-2xl font-bold text-blue-600">$12,500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">Clientes</h3>
            <p className="text-2xl font-bold text-blue-600">350</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">Productos en Stock</h3>
            <p className="text-2xl font-bold text-blue-600">75</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
