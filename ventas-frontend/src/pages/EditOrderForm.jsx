import { useState, useEffect } from "react";
import axios from "axios";

const EditOrderForm = ({ order, onClose, onUpdate }) => {
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        if (order?.products) {
            setOrderItems(order.products);
        }
    }, [order]);

    const handleUpdateOrder = () => {
        axios.put(`/sales/${order.id}`, { products: orderItems })
            .then(() => {
                alert("Pedido actualizado con éxito!");
                onUpdate();
                onClose();
            })
            .catch(error => {
                console.error("Error actualizando el pedido", error);
                alert("Error al actualizar el pedido");
            });
    };

    return (
        <div>
            <h2>Editar Pedido</h2>
            {orderItems.map((item, index) => (
                <div key={index}>
                    <span>{item.name} - {item.quantity}</span>
                </div>
            ))}
            <button onClick={handleUpdateOrder}>Actualizar</button>
            <button onClick={onClose}>Cerrar</button>
        </div>
    );
};

export default EditOrderForm;