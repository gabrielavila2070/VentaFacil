import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

const ClosedSalesList = () => {
  const [closedSales, setClosedSales] = useState([]);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const user = getUserFromToken();
  const role = user?.role || "";

  const fetchClosedSales = async () => {
    try {
      let url = "/sales/closed-sales";
      const params = [];
      if (startDate) params.push(`start=${startDate}`);
      if (endDate) params.push(`end=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }
      const response = await axios.get(url);
      setClosedSales(response.data);
      setError('');
    } catch (err) {
      console.error("Error al cargar las ventas cerradas:", err);
      setError("Error al cargar las ventas cerradas.");
    }
  };

  useEffect(() => {
    fetchClosedSales();
  }, []);

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

  const handleFilter = () => {
    fetchClosedSales(startDate, endDate);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    fetchClosedSales();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Ventas Cerradas
      </h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>
        <div className="flex gap-2 mt-2 md:mt-6">
          <button
            onClick={handleFilter}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Filtrar
          </button>
          <button
            onClick={handleClearFilter}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Limpiar filtro
          </button>
        </div>
      </div>

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
                      {product.productName} (x{product.quantity}) – ${product.total.toFixed(2)}
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
                {role === "ADMIN" && (
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