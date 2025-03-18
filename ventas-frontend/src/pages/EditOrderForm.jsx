import { useState, useEffect } from "react";
import axios from "axios";

const EditOrderForm = ({ order, onClose }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        if (order && Array.isArray(order.products)) {
            const groupedProducts = order.products.reduce((acc, product) => {
                const existing = acc.find(p => p.id === product.id);
                if (existing) {
                    existing.quantity += product.quantity;
                } else {
                    acc.push({ ...product });
                }
                return acc;
            }, []);
    
            setOrderItems(groupedProducts);
        } else {
            setOrderItems([]);
        }
    }, [order]);
    

    useEffect(() => {
        if (allProducts.length === 0) {
            axios.get("/products")
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setAllProducts(response.data);
                    }
                })
                .catch(error => console.error("Error fetching products", error));
        }
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setFilteredProducts(
            query.trim() === "" ? [] : allProducts.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()))
        );
    };

    const calculateTotal = (items) => items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);

    const handleQuantityChange = (productId, quantity) => {
        quantity = Math.max(0, quantity);
    
        setOrderItems(prevItems => {
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
        });
    
        calculateTotal(orderItems);
    };
    
    
    const handleRemoveItem = (productId) => {
        const updatedItems = orderItems.filter(item => item.id !== productId);
    
        axios.put(`/sales/${order.id}`, { 
            productIds: updatedItems.map(item => item.id),
            total: calculateTotal(updatedItems)
        })
        .then(response => {
            alert("Producto eliminado con éxito!");
            setOrderItems(updatedItems);
        })
        .catch(error => {
            console.error("Error eliminando producto:", error.response ? error.response.data : error);
            alert("Hubo un error al eliminar el producto.");
        });
    };

    const handleSubmit = () => {
        if (orderItems.length === 0) {
            alert("Debe seleccionar al menos un producto.");
            return;
        }

        const orderData = {
            productIds: orderItems.map(item => item.id),
            total: calculateTotal(orderItems)
        };

        axios.put(`/sales/${order.id}`, orderData)
            .then(() => {
                alert("Pedido actualizado con éxito!");
                onClose();
            })
            .catch(error => {
                console.error("Error actualizando la venta:", error.response?.data || error);
                alert("Hubo un error al actualizar el pedido.");
            });
    };

    const handleAddProducts = () => {
        if (filteredProducts.length === 0) {
            alert("Debe seleccionar al menos un producto para agregar.");
            return;
        }

        const addProductsData = {
            productIds: filteredProducts.map(product => product.id)
        };

        axios.put(`/sales/${order.id}/products`, addProductsData)
            .then(response => {
                alert("Productos agregados con éxito!");
                if (response.data?.products) {
                    const newProducts = response.data.products.map(product => ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                        quantity: product.quantity
                    }));
                    setOrderItems(prevItems => [...prevItems, ...newProducts]);
                } else {
                    alert("Productos agregados, pero no se pudo obtener la lista actualizada.");
                }
                setFilteredProducts([]);
                setSearchQuery("");
            })
            .catch(error => {
                console.error("Error agregando productos:", error.response?.data || error);
                alert("Hubo un error al agregar productos.");
            });
    };

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-100">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Editar Pedido</h2>

            <div className="bg-white p-4 rounded-lg shadow flex-1 overflow-auto">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Lista de Productos</h3>
                <input
                    type="text"
                    placeholder="Buscar producto"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border p-2 mb-4 w-full"
                />
                {filteredProducts.length > 0 && (
                    <ul className="bg-white border rounded-lg mb-4">
                        {filteredProducts.map(product => (
                            <li
                                key={product.id}
                                className="p-2 border-b cursor-pointer hover:bg-gray-100"
                                onClick={() => handleQuantityChange(product.id, 1)}
                            >
                                {product.name} - ${product.price}
                            </li>
                        ))}
                        <button 
                            onClick={handleAddProducts} 
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                        >
                            Agregar Productos
                        </button>
                    </ul>
                )}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border px-4 py-2 text-left">Producto</th>
                            <th className="border px-4 py-2 text-left">Precio</th>
                            <th className="border px-4 py-2 text-left">Cantidad</th>
                            <th className="border px-4 py-2 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="border px-4 py-2 text-gray-800">{item.name}</td>
                                <td className="border px-4 py-2 text-gray-800">${item.price}</td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.quantity}
                                        onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                                        className="border p-1 w-full text-center bg-gray-50"
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Total: ${calculateTotal(orderItems)}</h3>
                <div className="flex gap-4">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                    >
                        Cerrar
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={orderItems.length === 0}
                        className={`px-4 py-2 rounded transition ${
                            orderItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                    >
                        Actualizar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditOrderForm;
