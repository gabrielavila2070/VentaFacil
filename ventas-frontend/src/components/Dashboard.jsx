import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaBox, FaShoppingCart, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'preventista';
  const userName = localStorage.getItem('userName') || 'Usuario';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Datos de ejemplo para gráficos
  const salesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Ventas Mensuales',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: 'rgb(79, 70, 229)',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(79, 70, 229, 0.05)'
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-blue-600 to-purple-700 text-white flex flex-col p-6 shadow-xl">
        {/* Perfil de usuario */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-white/10 rounded-lg">
          <FaUserCircle className="text-3xl" />
          <div>
            <h2 className="font-bold">{userName}</h2>
            <p className="text-sm opacity-80">{role}</p>
          </div>
        </div>

        {/* Menú */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <FaChartLine className="mr-3" /> Dashboard
            </NavLink>
            
            {role === 'admin' && (
              <NavLink 
                to="/users" 
                className={({isActive}) => `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                <FaUsers className="mr-3" /> Usuarios
              </NavLink>
            )}
            
            <NavLink 
              to="/sales" 
              className={({isActive}) => `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <FaShoppingCart className="mr-3" /> Ventas
            </NavLink>
            
            <NavLink 
              to="/products" 
              className={({isActive}) => `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <FaBox className="mr-3" /> Productos
            </NavLink>
          </ul>
        </nav>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center p-3 rounded-lg hover:bg-white/10 transition-all"
        >
          <FaSignOutAlt className="mr-3" /> Cerrar Sesión
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {userName}</h1>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Ventas Totales</p>
                <p className="text-2xl font-bold text-gray-800">$24,500</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaShoppingCart className="text-blue-600 text-xl" />
              </div>
            </div>
            <span className="text-sm text-green-500">↑ 12% vs mes anterior</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Clientes Activos</p>
                <p className="text-2xl font-bold text-gray-800">1,240</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
            </div>
            <span className="text-sm text-blue-500">+34 nuevos este mes</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Productos en Stock</p>
                <p className="text-2xl font-bold text-gray-800">586</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaBox className="text-green-600 text-xl" />
              </div>
            </div>
            <span className="text-sm text-red-500">15 bajos en inventario</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Conversión</p>
                <p className="text-2xl font-bold text-gray-800">68%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaChartLine className="text-orange-600 text-xl" />
              </div>
            </div>
            <span className="text-sm text-gray-500">Meta: 75%</span>
          </div>
        </div>

        {/* Gráfico Principal */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Tendencia de Ventas</h3>
          <div className="h-80">
            <Line 
              data={salesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        {/* Sección Inferior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productos Populares */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
            <div className="space-y-4">
              {['Pepsi 2L', 'Galletas Oreo', 'Agua Mineral 500ml'].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <span className="font-medium">#{index + 1} {product}</span>
                  <span className="text-blue-600">1,240 unidades</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {[
                {action: 'Nuevo pedido', user: 'Juan Pérez', time: 'Hace 15 min'},
                {action: 'Actualización de stock', user: 'Sistema', time: 'Hace 2 horas'},
                {action: 'Cliente registrado', user: 'María Gómez', time: 'Ayer'}
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;