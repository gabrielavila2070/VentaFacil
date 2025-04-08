import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 
import { FaArrowLeft } from "react-icons/fa";

function ClosedSaleDetails() {
  const { id } = useParams(); // Obtiene el ID desde la URL
  const navigate = useNavigate();
  const [closedSale, setClosedSale] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchClosedSale() {
      try {
        const response = await axios.get(`/sales/closed-sales/${id}`);
        setClosedSale(response.data);
      } catch (err) {
        console.error("Error al obtener los detalles de la venta cerrada:", err);
        setError("Error al cargar los detalles de la venta cerrada.");
      }
    }
    fetchClosedSale();
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-blue-600 hover:underline"
      >
        <FaArrowLeft />
        <span>Volver</span>
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!closedSale ? (
        <p className="text-gray-600">Cargando detalles...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Detalles de Venta Cerrada</h2>
          <div className="mb-2">
            <p>
              <strong>ID de Venta Cerrada:</strong> {closedSale.id}
            </p>
            <p>
              <strong>ID de Venta Original:</strong> {closedSale.originalSaleId}
            </p>
            <p>
              <strong>Cliente:</strong> {closedSale.clientName}
            </p>
            <p>
              <strong>Total:</strong> ${closedSale.total.toFixed(2)}
            </p>
            <p>
              <strong>Fecha de Cierre:</strong>{" "}
              {new Date(closedSale.dateClosed).toLocaleString()}
            </p>
          </div>

          <h3 className="text-xl font-semibold mt-4 mb-2">Productos</h3>
          {closedSale.products && closedSale.products.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-700">
              {closedSale.products.map((product, index) => (
                <li key={index}>
                  {product.productName} - Cantidad: {product.quantity} - Precio: $
                  {product.total.toFixed(2)} c/u - Subtotal: $
                  {(product.total * product.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay productos registrados.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ClosedSaleDetails;
