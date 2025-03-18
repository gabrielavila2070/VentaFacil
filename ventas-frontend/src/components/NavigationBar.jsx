import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

function NavigationBar() {
  const location = useLocation();
  const hiddenRoutes = ["/", "/login"];
  const user = getUserFromToken();
  const role = user?.role || ""; // Obtener rol del usuario
  

  // Si estamos en login o en "/", mostrar solo el título
  if (hiddenRoutes.includes(location.pathname)) {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl">Venta Fácil</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Venta Fácil</div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard" className="text-white hover:text-gray-400">Dashboard</Link>
          </li>
          <li>
            <Link to="/clients" className="text-white hover:text-gray-400">Clientes</Link>
          </li>
          <li>
            <Link to="/products" className="text-white hover:text-gray-400">Productos</Link>
          </li>
          <li>
            <Link to="/Sales" className="text-white hover:text-gray-400">Pedidos</Link>
          </li>

          {/* Mostrar "Usuarios" solo si el usuario es admin */}
          {role === "ADMIN" && (
            
            <li>
              <Link to="/users" className="text-white hover:text-gray-400">Usuarios</Link>
            </li>
          )}
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login"; // Redirigir al login
              }}
              className="text-white hover:text-gray-400"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;