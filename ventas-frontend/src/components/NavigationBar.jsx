import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaUsers, 
  FaBox, 
  FaClipboardList,
  FaUserCog,
  FaSignOutAlt
} from "react-icons/fa";
import { getUserFromToken } from "../utils/auth";

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const hiddenRoutes = ["/", "/login"];
  const user = getUserFromToken();
  const role = user?.role || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (hiddenRoutes.includes(location.pathname)) {
    return (
      <nav className="bg-white shadow-sm py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex items-center gap-2">
            <FaBox className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">VentaFácil</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg py-3 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo y Nombre */}
        <div className="flex items-center gap-2">
          <FaBox className="text-blue-600 text-2xl" />
          <span className="text-xl font-bold text-gray-800">VentaFácil</span>
        </div>

        {/* Menú Principal */}
        <div className="flex flex-wrap items-center gap-4">
          <NavLink to="/dashboard" icon={<FaHome />} label="Inicio" />
          <NavLink to="/clients" icon={<FaUsers />} label="Clientes" />
          <NavLink to="/products" icon={<FaBox />} label="Productos" />
          <NavLink to="/Sales" icon={<FaClipboardList />} label="Pedidos" />
          
          {role === "ADMIN" && (
            <NavLink to="/users" icon={<FaUserCog />} label="Usuarios" />
          )}
        </div>

        {/* Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
}

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className={({ isActive }) => 
      `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isActive 
          ? "bg-blue-50 text-blue-600" 
          : "text-gray-600 hover:bg-gray-50"
      }`
    }
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export default NavigationBar;