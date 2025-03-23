import React, { useState, useEffect } from "react";
import axios from "axios";

const NewOrderForm = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, productsRes] = await Promise.all([
          axios.get("/clients"),
          axios.get("/products")
        ]);
        setClients(clientsRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError("Error cargando datos iniciales");
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = (product) => {
    setOrderItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
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
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) throw new Error("Usuario no autenticado");

      if (!selectedClientId || orderItems.length === 0) {
        throw new Error("Seleccione cliente y agregue productos");
      }

      const orderData = {
        clientId: Number(selectedClientId),
        preventistaId: user.id,
        products: orderItems.map(({ id, quantity }) => ({ id, quantity })),
        total: calculateTotal(),
      };

      const response = await axios.post("/sales", orderData);
      
      alert(`Pedido #${response.data.id} creado exitosamente!`);
      setSelectedClientId("");
      setOrderItems([]);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.message 
        || "Error al crear pedido";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => 
    orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Nuevo Pedido</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Selección de Cliente */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Seleccionar Cliente:
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

        {/* Listado de Productos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Productos Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.map(product => (
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

        {/* Productos Seleccionados */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Productos en el Pedido
          </h3>
          {orderItems.length === 0 ? (
            <p className="text-gray-500 text-center">No hay productos agregados</p>
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
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total y Botón de Envío */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold text-blue-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            disabled={loading || !selectedClientId || orderItems.length === 0}
          >
            {loading ? "Procesando..." : "Confirmar Pedido"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrderForm;