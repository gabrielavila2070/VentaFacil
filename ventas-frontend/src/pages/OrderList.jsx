import { useEffect, useState } from "react";
import axios from "axios";
import OrderForm from "./OrderForm"; // Asegúrate de importar OrderForm
import EditOrderForm from "./EditOrderForm"; // Asegúrate de importar EditOrderForm

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false); // Estado para controlar la visibilidad del formulario
    const [showEditForm, setShowEditForm] = useState(false); // Estado para controlar la visibilidad del formulario de edición
    const [currentOrder, setCurrentOrder] = useState(null); // Estado para el pedido actual

    useEffect(() => {
        axios.get("/sales")
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                setError("No se pudieron cargar los pedidos.");
                setLoading(false);
            });
    }, []);

    const handleEdit = (order) => {
        setCurrentOrder(order);
        setShowEditForm(true);
    };

    const handleDelete = (orderId) => {
        axios.delete(`/sales/${orderId}`)
            .then(() => {
                setOrders(orders.filter(order => order.id !== orderId));
                alert("Pedido eliminado con éxito!");
            })
            .catch(error => {
                console.error("Error eliminando el pedido:", error);
                alert("Hubo un error al eliminar el pedido.");
            });
    };

    if (loading) return <p>Cargando pedidos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Lista de Pedidos</h2>
            <button
                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                    setCurrentOrder(null);
                    setShowOrderForm(!showOrderForm);
                }} // Alternar visibilidad del formulario
            >
                {showOrderForm ? "Cerrar Formulario" : "Nuevo Pedido"}
            </button>

            {showOrderForm && <OrderForm />} {/* Mostrar el formulario si showOrderForm es verdadero */}
            {showEditForm && <EditOrderForm order={currentOrder} onClose={() => setShowEditForm(false)} />} {/* Mostrar el formulario de edición si showEditForm es verdadero */}

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border text-gray-800">Cliente</th>
                        <th className="py-2 px-4 border text-gray-800">Preventista</th>
                        <th className="py-2 px-4 border text-gray-800">Productos</th>
                        <th className="py-2 px-4 border text-gray-800">Total</th>
                        <th className="py-2 px-4 border text-gray-800">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => {
                        // Verificar si order.products existe y agrupar productos
                        const groupedProducts = order.products
                            ? order.products.reduce((acc, product) => {
                                if (acc[product.name]) {
                                    acc[product.name] += product.quantity;
                                } else {
                                    acc[product.name] = product.quantity;
                                }
                                return acc;
                            }, {})
                            : {};

                        return (
                            <tr key={order.id} className="border">
                                <td className="py-2 px-4 border text-gray-800">{order.clientName}</td>
                                <td className="py-2 px-4 border text-gray-800">{order.preventistaName}</td>
                                <td className="py-2 px-4 border text-gray-800">
                                    {Object.keys(groupedProducts).length > 0
                                        ? Object.entries(groupedProducts)
                                            .map(([name, quantity]) => `${name} (x${quantity})`)
                                            .join(", ")
                                        : "Sin productos"}
                                </td>
                                <td className="py-2 px-4 border text-gray-800">${order.total.toFixed(2)}</td>
                                <td className="py-2 px-4 border text-gray-800">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2"
                                        onClick={() => handleEdit(order)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                        onClick={() => handleDelete(order.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersList;