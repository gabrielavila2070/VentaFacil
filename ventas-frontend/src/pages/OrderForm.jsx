import { useState, useEffect } from "react";
import axios from "axios";

const OrderForm = ({ onClose, onOrderCreated }) => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        axios.get("/clients").then(response => setClients(response.data));
        axios.get("/products").then(response => setProducts(response.data));
    }, []);

    const handleAddProduct = (product) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const handleCreateOrder = () => {
        if (!selectedClient || orderItems.length === 0) {
            alert("Selecciona un cliente y al menos un producto");
            return;
        }
    
        const user = JSON.parse(localStorage.getItem("user")); // Obtener usuario logueado
        
        // Estructura exacta que espera el backend
        const orderData = {
            clientId: Number(selectedClient),
            preventistaId: user.id, // ID del usuario logueado
            products: orderItems.map(item => ({
                id: Number(item.id), // Solo enviar ID del producto
                quantity: Number(item.quantity)
            })),
            total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
    
        axios.post("/sales", orderData)
            .then(response => {
                alert("Venta creada con éxito!");
                onOrderCreated(response.data);
                onClose();
            })
            .catch(error => {
                console.error("Error en creación:", error.response?.data);
                alert("Error: " + (error.response?.data?.message || "Verifica los datos"));
            });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Nuevo Pedido</h2>
            
            <div className="mb-4">
                <label className="block mb-2">Cliente:</label>
                <select 
                    value={selectedClient}
                    onChange={e => setSelectedClient(e.target.value)}
                    className="border p-2 w-full"
                >
                    <option value="">Seleccionar Cliente</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Productos Disponibles</h3>
                <div className="grid grid-cols-2 gap-2">
                    {products.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleAddProduct(product)}
                            className="p-2 border rounded hover:bg-gray-100 text-left"
                        >
                            <span className="font-medium">{product.name}</span>
                            <span className="block text-sm">Precio: ${product.price}</span>
                        </button>
                    ))}
                </div>
            </div>

            {orderItems.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Productos Seleccionados</h3>
                    <ul className="space-y-2">
                        {orderItems.map(item => (
                            <li key={item.id} className="flex justify-between items-center">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex gap-4">
                <button 
                    onClick={handleCreateOrder}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Crear Pedido
                </button>
                <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default OrderForm;