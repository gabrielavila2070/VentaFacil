import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaPlus } from 'react-icons/fa';

function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      setMessage('Error cargando productos');
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', stock: '' });
      setMessage('Producto agregado correctamente');
    } catch (error) {
      setMessage('Error al agregar producto');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`/products/${editingProduct.id}`, editingProduct);
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
      setEditingProduct(null);
      setMessage('Producto actualizado correctamente');
    } catch (error) {
      setMessage('Error al actualizar producto');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      setMessage('Producto eliminado correctamente');
    } catch (error) {
      setMessage('Error al eliminar producto');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaPlus className="text-blue-600" />
          Gestión de Productos
        </h2>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-lg flex items-center justify-between ${
          message.includes('correctamente') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
      )}

      {/* Formulario para agregar productos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Nuevo Producto</h3>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            placeholder="Precio"
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Agregar
          </button>
        </form>
      </div>

      {/* Listado de productos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {editingProduct?.id === product.id ? (
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{product.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingProduct?.id === product.id ? (
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-800">${product.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingProduct?.id === product.id ? (
                      <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                        className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-800">{product.stock}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {editingProduct?.id === product.id ? (
                        <>
                          <button
                            onClick={handleUpdateProduct}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;