import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
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
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`/products/${editingProduct.id}`, editingProduct);
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <h2 className="text-3xl font-bold mb-4 text-white-800">Gestión de Productos</h2>

      {/* Formulario para agregar productos */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Agregar Producto</h3>
        <form onSubmit={handleAddProduct} className="flex gap-2">
          <input type="text" name="name" value={newProduct.name} onChange={handleInputChange}
            placeholder="Nombre" className="border p-2 flex-1 rounded"/>
          <input type="number" name="price" value={newProduct.price} onChange={handleInputChange}
            placeholder="Precio" className="border p-2 flex-1 rounded"/>
          <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange}
            placeholder="Stock" className="border p-2 flex-1 rounded"/>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Agregar</button>
        </form>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white p-4 rounded-lg shadow flex-1 overflow-auto">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Lista de Productos</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="border px-4 py-2 text-left">Nombre</th>
              <th className="border px-4 py-2 text-left">Precio</th>
              <th className="border px-4 py-2 text-left">Stock</th>
              <th className="border px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="border px-4 py-2">
                  {editingProduct?.id === product.id ? (
                    <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="border p-1 w-full"/>
                  ) : (
                    <span className="text-gray-800">{product.name}</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingProduct?.id === product.id ? (
                    <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} className="border p-1 w-full"/>
                  ) : (
                    <span className="text-gray-800">${product.price}</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingProduct?.id === product.id ? (
                    <input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} className="border p-1 w-full"/>
                  ) : (
                    <span className="text-gray-800">{product.stock}</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingProduct?.id === product.id ? (
                    <button onClick={handleUpdateProduct} className="bg-green-500 text-white px-2 py-1 mr-2 rounded">Guardar</button>
                  ) : (
                    <button onClick={() => handleEditProduct(product)} className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Editar</button>
                  )}
                  <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;