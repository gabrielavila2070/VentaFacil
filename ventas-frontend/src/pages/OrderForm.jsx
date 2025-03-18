import { useState, useEffect } from "react";
import axios from "axios";

const OrderForm = ({ currentOrder }) => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState(currentOrder ? currentOrder.clientId : "");
    const [orderItems, setOrderItems] = useState(currentOrder ? currentOrder.products : []);
    const [total, setTotal] = useState(currentOrder ? currentOrder.total : 0);
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        axios.get("/clients")
            .then(response => {
                if (Array.isArray(response.data)) {
                    setClients(response.data);
                }
            })
            .catch(error => console.error("Error fetching clients", error));

        axios.get("/products")
            .then(response => {
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                }
            })
            .catch(error => console.error("Error fetching products", error));
    }, []);

    useEffect(() => {
        if (currentOrder) {
            setSelectedClient(currentOrder.clientId);
            setOrderItems(currentOrder.products);
            setTotal(currentOrder.total);
        }
    }, [currentOrder]);

    const calculateTotal = (items) => {
        const totalAmount = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        setTotal(totalAmount);
    };

    const handleQuantityChange = (productId, quantity) => {
        quantity = Math.max(0, quantity);
    
        setOrderItems(prevItems => {
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
        });
    
        calculateTotal(orderItems);
    };
    

    const handleSubmit = () => {
        if (!selectedClient || orderItems.length === 0) {
            alert("Seleccione un cliente y al menos un producto.");
            return;
        }

        if (!user || user.id === null || user.id === undefined) {
            alert("Error: No se pudo obtener el usuario.");
            return;
        }

        const selectedClientData = clients.find(client => String(client.id) === String(selectedClient));

        if (!selectedClientData || !selectedClientData.id) {
            alert("Error: Cliente no encontrado o sin ID.");
            return;
        }

        if (orderItems.some(item => !item.id)) {
            alert("Error: Hay productos sin ID.");
            return;
        }

        const orderData = {
            clientId: selectedClientData.id,
            preventistaId: user.id,
            productIds: orderItems.map(item => item.id),
            total: total
        };

        if (currentOrder) {
            // Actualizar pedido existente
            axios.put(`/sales/${currentOrder.id}`, orderData)
                .then(response => {
                    alert("Pedido actualizado con éxito!");
                    setMessage("Pedido actualizado con éxito!");
                })
                .catch(error => {
                    console.error("Error actualizando la venta:", error.response ? error.response.data : error);
                    alert("Hubo un error al actualizar el pedido.");
                });
        } else {
            // Crear nuevo pedido
            axios.post("/sales", orderData)
                .then(response => {
                    alert("Pedido registrado con éxito!");
                    setMessage("Pedido registrado con éxito!");
                    setSelectedClient("");
                    setOrderItems([]);
                    setTotal(0);
                })
                .catch(error => {
                    console.error("Error creando la venta:", error.response ? error.response.data : error);
                    alert("Hubo un error al registrar el pedido.");
                });
        }
    };

    return (
        <div className="flex flex-col h-screen p-6 bg-gray-100">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{currentOrder ? "Editar Pedido" : "Nuevo Pedido"}</h2>

            <div className="mb-4 bg-white p-4 rounded-lg shadow text-gray-800">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Seleccionar Cliente</h3>
                <select 
                    value={selectedClient} 
                    onChange={e => setSelectedClient(e.target.value)}
                    className="border p-2 w-full rounded bg-gray-50"
                >
                    <option value="">Seleccione un cliente</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>
                    ))}
                </select>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex-1 overflow-auto">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Lista de Productos</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border px-4 py-2 text-left">Producto</th>
                            <th className="border px-4 py-2 text-left">Precio</th>
                            <th className="border px-4 py-2 text-left">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b">
                                <td className="border px-4 py-2 text-gray-800">{product.name}</td>
                                <td className="border px-4 py-2 text-gray-800">${product.price}</td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={orderItems.find(item => item.id === product.id)?.quantity || ""}
                                        onChange={e => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                                        className="border p-1 w-full text-center bg-gray-50"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {orderItems.length > 0 && (
                <div className="mt-4 bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Resumen del Pedido</h3>
                    <ul>
                        {orderItems.map(item => (
                            <li key={item.id} className="text-gray-700">
                                {item.name} - {item.quantity} x ${item.price} = ${item.quantity * item.price}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800">Total: ${total.toFixed(2)}</h3>
                <button 
                    onClick={handleSubmit} 
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                >
                    {currentOrder ? "Actualizar Pedido" : "Confirmar Pedido"}
                </button>
            </div>

            {message && <p className="mt-4 text-green-600 font-bold">{message}</p>}
        </div>
    );
};

export default OrderForm;