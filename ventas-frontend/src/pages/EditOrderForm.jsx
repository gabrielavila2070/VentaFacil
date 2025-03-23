import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

const EditOrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState();
  const [products, setProducts] = useState();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [orderItems, setOrderItems] = useState();
  const [initialOrderItems, setInitialOrderItems] = useState(); // Para almacenar los productos iniciales
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, clientsRes, productsRes] = await Promise.all([
          axios.get(`/sales/${id}`),
          axios.get('/clients'),
          axios.get('/products')
        ]);

        const orderData = orderRes.data;

        // Buscar el ID del cliente basado en el clientName recibido
        const foundClient = clientsRes.data.find(client => client.firstName + " " + client.lastName === orderData.clientName);
        if (foundClient) {
          setSelectedClientId(foundClient.id.toString());
        } else {
          console.warn("No se encontró el cliente con el nombre:", orderData.clientName);
          setSelectedClientId(''); // O maneja este caso como prefieras
        }

        const formattedOrderItems = orderData.products.map(p => ({
          id: p.id, // Usa p.id (como en la respuesta del backend)
          name: p.name,
          price: p.price,
          quantity: p.quantity
        }));
        setOrderItems(formattedOrderItems);
        setInitialOrderItems(formattedOrderItems.map(item => ({ ...item }))); // Inicializar initialOrderItems con una copia

        setClients(clientsRes.data);
        setProducts(productsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Error cargando datos del pedido');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddProduct = (product) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveProduct = (productId) => {
    setOrderItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = Math.max(0, newQuantity);
    setOrderItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.id) throw new Error('Usuario no autenticado');

      const productsToUpdate = {};
      const productsToDelete = {};
      const productsToAdd =[]; // Aseguramos que se declare como array aquí

      orderItems?.forEach(currentItem => { // Agregamos una verificación para orderItems
        const initialItem = initialOrderItems?.find(item => item.id === currentItem.id); // Agregamos una verificación para initialOrderItems
        if (initialItem) {
          if (currentItem.quantity !== initialItem.quantity) {
            const quantityDifference = initialItem.quantity - currentItem.quantity;
            if (quantityDifference > 0) {
              // La cantidad se redujo, debemos eliminar la diferencia
              productsToDelete[currentItem.id] = quantityDifference;
            } else if (quantityDifference < 0) {
              // La cantidad aumentó, lo tratamos como una adición
              productsToAdd.push({ id: currentItem.id, quantity: currentItem.quantity - initialItem.quantity });
            }
          }
        } else {
          productsToAdd.push({ id: currentItem.id, quantity: currentItem.quantity });
        }
      });

      initialOrderItems?.forEach(initialItem => { // Agregamos una verificación para initialOrderItems
        if (!orderItems?.some(currentItem => currentItem.id === initialItem.id)) { // Agregamos una verificación para orderItems
          productsToDelete[initialItem.id] = initialItem.quantity; // Eliminar el producto completo
        }
      });

      if (Object.keys(productsToDelete).length > 0) {
        await axios.delete(`/sales/${id}/products`, { data: { products: productsToDelete } });
        console.log("Productos eliminados/reducidos:", productsToDelete);
      }

      if (productsToAdd.length > 0) {
        const productIdsToAdd = productsToAdd.map(p => p.id);
        const quantitiesToAdd = productsToAdd.map(p => p.quantity);
        const addData = { productIds: productIdsToAdd, quantities: quantitiesToAdd };
        await axios.put(`/sales/${id}/products`, addData);
        console.log("Productos añadidos/aumentados:", addData);
      }

      navigate('/sales'); // Redirigir a la lista de pedidos
    } catch (err) {
      setError(err.response?.data?.message || 'Error actualizando pedido');
      console.error("Error al actualizar el pedido:", err);
    } finally {
      setLoading(false);
    }
  };


  const calculateTotal = () =>
    orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) return <div className="text-center py-8">Cargando pedido...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FaEdit className="text-blue-600 text-2xl" />
        <h2 className="text-2xl font-bold text-gray-800">Editar Pedido #{id}</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Selección de Cliente */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Cliente:
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">-- Seleccione un cliente --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Productos Disponibles */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Productos Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products
              .filter(p => !orderItems.some(item => item.id === p.id))
              .map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddProduct(product)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={loading}
                  >
                    Agregar
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Productos en el Pedido */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Productos en el Pedido
          </h3>
          {orderItems.length === 0 ? (
            <p className="text-gray-500 text-center">No hay productos en el pedido</p>
          ) : (
            <div className="space-y-3">
              {orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border rounded text-center"
                        disabled={loading}
                      />
                      <span className="text-gray-600">
                        x ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(item.id)}
                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total y Botones */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold text-blue-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              disabled={loading || !selectedClientId || orderItems.length === 0}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOrderForm;