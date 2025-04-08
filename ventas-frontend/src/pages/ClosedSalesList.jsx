
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// Supongamos que tenés un contexto de autenticación que provee datos del usuario
import { getUserFromToken } from "../utils/auth";

const ClosedSalesList = () => {
  const [closedSales, setClosedSales] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
   const user = getUserFromToken();
    const role = user?.role || "";

  // Cargar ventas cerradas al montar el componente
  useEffect(() => {
    async function fetchClosedSales() {
      try {
        const response = await axios.get("/sales/closed-sales");
        // Se espera que el endpoint retorne un array de DTOs con los siguientes campos:
        // id, originalSaleId, clientName, total, dateClosed, products (array con { name, quantity, precioVenta })
        setClosedSales(response.data);
      } catch (err) {
        console.error("Error al cargar las ventas cerradas:", err);
        setError("Error al cargar las ventas cerradas.");
      }
    }
    fetchClosedSales();
  }, []);

  // Maneja la eliminación de una venta cerrada (solo para ADMIN)
  const handleDeleteClosedSale = async (saleId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar permanentemente esta venta cerrada?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`/sales/closed-sales/${saleId}`);
      setClosedSales((prev) => prev.filter((sale) => sale.id !== saleId));
    } catch (err) {
      console.error("Error al eliminar la venta cerrada:", err);
      setError("Error al eliminar la venta cerrada.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Ventas Cerradas
      </h1>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {closedSales.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No hay ventas cerradas registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {closedSales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{sale.clientName}</h3>
                  <p className="text-sm text-gray-500">Venta #{sale.originalSaleId}</p>
                  <p className="text-xs text-gray-500">
                    Fecha: {new Date(sale.dateClosed).toLocaleString()}
                  </p>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  ${sale.total.toFixed(2)}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Productos:</p>
                <ul className="text-sm text-gray-600 list-disc ml-4">
                  {sale.products.map((product, index) => (
                    <li key={index}>
                      {product.name} (x{product.quantity}) – $ 
                      {(product.total).toFixed(2)} cada uno
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => navigate(`/sales/closed-sales/details/${sale.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <FaEye /> Detalles
                </button>
                {user && user.role === "ADMIN" && (
                  <button
                    onClick={() => handleDeleteClosedSale(sale.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <FaTrash /> Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClosedSalesList;
