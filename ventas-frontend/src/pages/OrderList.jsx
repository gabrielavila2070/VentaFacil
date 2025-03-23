import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaBoxOpen } from 'react-icons/fa';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get('/sales');
        setOrders(response.data);
      } catch (err) {
        setError('Error al cargar los pedidos.');
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Listado de Pedidos</h1>
          <FaBoxOpen className="text-blue-600 text-xl" />
        </div>
        
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/sales/new')}
        >
          <FaPlus className="text-lg" />
          <span>Nuevo Pedido</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No hay pedidos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{order.clientName}</h3>
                  <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Productos:</p>
                <div className="text-sm text-gray-600">
                  {order.products.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex justify-between">
                      <span>{p.name}</span>
                      <span>x{p.quantity}</span>
                    </div>
                  ))}
                  {order.products.length > 3 && (
                    <p className="text-gray-400 text-sm mt-1">+{order.products.length - 3} productos más</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-3">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => navigate(`/sales/edit/${order.id}`)}
                >
                  <FaEdit className="text-sm" />
                  <span>Editar Pedido</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersList;