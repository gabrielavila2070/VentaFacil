import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";

function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [newClient, setNewClient] = useState({ firstName: "", lastName: "", email: "" });
  const [editingClientId, setEditingClientId] = useState(null); // Almacena el id del cliente a editar
  const [editingClientData, setEditingClientData] = useState({ firstName: "", lastName: "", email: "" }); // Datos del cliente a editar
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 5;

  // Obtener clientes del backend
  useEffect(() => {
    axios.get("/clients")
      .then(response => {
        console.log("Respuesta de la API:", response.data);
        console.log("Tipo de respuesta:", Array.isArray(response.data)); // Debería ser true
        setClients(response.data);
        setFilteredClients(response.data);
      })
      .catch(error => console.error("Error al obtener clientes:", error));
  }, []);

  // Manejar cambios en inputs de agregar cliente
  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  // Agregar cliente
  const handleAddClient = () => {
    axios.post("/clients", newClient)
      .then(response => {
        const updatedClients = [...clients, response.data];
        setClients(updatedClients);
        setFilteredClients(updatedClients);
        setNewClient({ firstName: "", lastName: "", email: "" });
        setMessage("Cliente agregado con éxito");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(error => console.error("Error al agregar cliente:", error));
  };

  // Eliminar cliente
  const handleDeleteClient = (id) => {
    axios.delete(`/clients/${id}`)
      .then(() => {
        const updatedClients = clients.filter(client => client.id !== id);
        setClients(updatedClients);
        setFilteredClients(updatedClients);
        setMessage("Cliente eliminado con éxito");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(error => console.error("Error al eliminar cliente:", error));
  };

  // Editar cliente
  const handleEditClientChange = (e) => {
    const { name, value } = e.target;
    setEditingClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = (clientId) => {
    axios.put(`/clients/${clientId}`, editingClientData)
      .then(response => {
        const updatedClients = clients.map(client =>
          client.id === clientId ? response.data : client
        );
        setClients(updatedClients);
        setFilteredClients(updatedClients);
        setEditingClientId(null); // Termina la edición
        setMessage("Cliente actualizado con éxito");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(error => console.error("Error al editar cliente:", error));
  };

  // Buscar clientes
  const handleSearch = () => {
    const filtered = clients.filter(client =>
      client.firstName.toLowerCase().includes(search.toLowerCase()) ||
      client.lastName.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredClients(filtered);
    setCurrentPage(1); // Reiniciar a la primera página después de buscar
  };

  // Paginación
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  return (
    <div className="flex flex-col h-screen p-6">
      <h2 className="text-3xl font-bold mb-4 text-white-800">Gestión de Clientes</h2>

      {/* Alertas */}
      {message && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 flex justify-between">
          {message}
          <FaTimes onClick={() => setMessage("")} className="cursor-pointer" />
        </div>
      )}

      {/* Formulario Agregar Cliente */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Agregar Cliente</h3>
        <input type="text" name="firstName" value={newClient.firstName} onChange={handleChange} placeholder="Nombre"
          className="border p-2 w-full mb-2" />
        <input type="text" name="lastName" value={newClient.lastName} onChange={handleChange} placeholder="Apellido"
          className="border p-2 w-full mb-2" />
        <input type="email" name="email" value={newClient.email} onChange={handleChange} placeholder="Correo"
          className="border p-2 w-full mb-2" />
        <button onClick={handleAddClient} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaUserPlus /> Agregar Cliente
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-4 rounded shadow-md mb-4 flex items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="border p-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FaSearch /> Buscar
        </button>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2">Lista de Clientes</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Apellido</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map(client => (
              <tr key={client.id} className="border">
                {/* Si está en modo edición, mostramos los campos de edición */}
                {editingClientId === client.id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="text"
                        name="firstName"
                        value={editingClientData.firstName}
                        onChange={handleEditClientChange}
                        className="border p-2 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        name="lastName"
                        value={editingClientData.lastName}
                        onChange={handleEditClientChange}
                        className="border p-2 w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="email"
                        name="email"
                        value={editingClientData.email}
                        onChange={handleEditClientChange}
                        className="border p-2 w-full"
                      />
                    </td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => handleSaveEdit(client.id)} className="text-green-500">
                        <FaCheck />
                      </button>
                      <button onClick={() => setEditingClientId(null)} className="text-gray-500">
                        <FaTimes />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 text-gray-800">{client.firstName}</td>
                    <td className="p-2 text-gray-800">{client.lastName}</td>
                    <td className="p-2 text-gray-800">{client.email}</td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => { setEditingClientId(client.id); setEditingClientData(client); }} className="text-yellow-500">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteClient(client.id)} className="text-red-500">
                        <FaTrash />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}>
            <FaChevronLeft />
          </button>
          <span>Página {currentPage} de {Math.ceil(filteredClients.length / clientsPerPage)}</span>
          <button disabled={indexOfLastClient >= filteredClients.length} onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded ${indexOfLastClient >= filteredClients.length ? "bg-gray-300" : "bg-blue-500 text-white"}`}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Clients;