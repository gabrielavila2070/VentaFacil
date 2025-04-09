import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaChartLine, FaUsers, FaBox, FaShoppingCart, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const [username, setUserName] = useState('');
  const [role, setRole] = useState('');

  const [totalSales, setTotalSales] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [productsInStock, setProductsInStock] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserName(user.username || '');
        setRole(user.role || '');
      } catch (error) {
        console.error("Error al parsear el usuario desde localStorage:", error);
      }
    }
  }, [userString]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchDashboardData = async () => {
      try {
        const [salesRes, clientsRes, stockRes, topProductsRes] = await Promise.all([
          axios.get('/sales/closed-sales/total', { headers }),
          axios.get('/clients/count', { headers }),
          axios.get('/products/stock-total', { headers }),
          axios.get('/sales/top-products', { headers }),
        ]);

        setTotalSales(salesRes.data);
        setActiveClients(clientsRes.data);
        setProductsInStock(stockRes.data);
        setTopProducts(topProductsRes.data);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Ejemplo temporal para el gráfico de tendencias
  const salesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Ventas Mensuales',
      data: [6500, 5900, 8000, 8100, 5600, 5500],
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
        {/* Perfil */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-white/10 rounded-lg">
          <FaUserCircle className="text-3xl" />
          <div>
            <h2 className="font-bold">{username}</h2>
            <p className="text-sm opacity-80">{role}</p>
          </div>
        </div>

        {/* Menú */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <NavLink to="/dashboard" className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
            }>
              <FaChartLine className="mr-3" /> Dashboard
            </NavLink>

            {role === 'admin' && (
              <NavLink to="/users" className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
              }>
                <FaUsers className="mr-3" /> Usuarios
              </NavLink>
            )}

            <NavLink to="/sales" className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
            }>
              <FaShoppingCart className="mr-3" /> Ventas
            </NavLink>

            <NavLink to="/products" className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`
            }>
              <FaBox className="mr-3" /> Productos
            </NavLink>
          </ul>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center p-3 rounded-lg hover:bg-white/10 transition-all">
          <FaSignOutAlt className="mr-3" /> Cerrar Sesión
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {username}</h1>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Ventas Totales" value={`$${totalSales}`} icon={<FaShoppingCart className="text-blue-600 text-xl" />} bg="bg-blue-100" badge="↑ 12% vs mes anterior" badgeColor="text-green-500" />
          <MetricCard title="Clientes Activos" value={activeClients} icon={<FaUsers className="text-purple-600 text-xl" />} bg="bg-purple-100" badge="+34 nuevos este mes" badgeColor="text-blue-500" />
          <MetricCard title="Productos en Stock" value={productsInStock} icon={<FaBox className="text-green-600 text-xl" />} bg="bg-green-100" badge="15 bajos en inventario" badgeColor="text-red-500" />
          <MetricCard title="Conversión" value="68%" icon={<FaChartLine className="text-orange-600 text-xl" />} bg="bg-orange-100" badge="Meta: 75%" badgeColor="text-gray-500" />
        </div>

        {/* Gráfico */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Tendencia de Ventas</h3>
          <div className="h-80">
            <Line data={salesData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: { y: { beginAtZero: true } }
            }} />
          </div>
        </div>

        {/* Productos más vendidos y actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <span className="font-medium">#{index + 1} {product.productName}</span>
                  <span className="text-blue-600">{product.totalQuantity} unidades</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {[
                { action: 'Nuevo pedido', user: 'Juan Pérez', time: 'Hace 15 min' },
                { action: 'Actualización de stock', user: 'Sistema', time: 'Hace 2 horas' },
                { action: 'Cliente registrado', user: 'María Gómez', time: 'Ayer' }
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

function MetricCard({ title, value, icon, bg, badge, badgeColor }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 ${bg} rounded-lg`}>
          {icon}
        </div>
      </div>
      <span className={`text-sm ${badgeColor}`}>{badge}</span>
    </div>
  );
}

export default Dashboard;
