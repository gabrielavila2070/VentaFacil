import { useState, useEffect } from "react";
import axios from "axios";
import OrderForm from "./OrderForm";
import EditOrderForm from "./EditOrderForm";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    useEffect(() => {
        axios.get("/sales").then(response => setOrders(response.data));
    }, []);

    const handleEdit = (order) => {
        setCurrentOrder(order);
        setShowEditForm(true);
    };

    const handleDelete = (orderId) => {
        axios.delete(`/sales/${orderId}`).then(() => {
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            alert("Pedido eliminado");
        }).catch(error => {
            console.error("Error eliminando el pedido", error);
            alert("Hubo un error al eliminar el pedido");
        });
    };

    return (
        <div>
            <h2>Lista de Pedidos</h2>
            <button onClick={() => setShowOrderForm(true)}>Nuevo Pedido</button>
            {showOrderForm && <OrderForm onClose={() => setShowOrderForm(false)} onOrderCreated={(newOrder) => setOrders([...orders, newOrder])} />}
            {showEditForm && <EditOrderForm order={currentOrder} onClose={() => setShowEditForm(false)} onUpdate={() => axios.get("/sales").then(response => setOrders(response.data))} />}
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        {order.clientName} - ${order.total}
                        <button onClick={() => handleEdit(order)}>Editar</button>
                        <button onClick={() => handleDelete(order.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;