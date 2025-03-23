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
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header y Botón */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserPlus className="text-blue-600" />
          Gestión de Clientes
        </h2>
      </div>

      {/* Mensajes de estado */}
      {message && (
        <div className={`mb-6 p-3 rounded-lg flex items-center justify-between 
          ${message.includes("éxito") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <span>{message}</span>
          <FaTimes 
            onClick={() => setMessage("")} 
            className="cursor-pointer hover:opacity-70"
          />
        </div>
      )}

      {/* Formulario de agregar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Nuevo Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            value={newClient.firstName}
            onChange={handleChange}
            placeholder="Nombre"
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="lastName"
            value={newClient.lastName}
            onChange={handleChange}
            placeholder="Apellido"
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={newClient.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAddClient}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaUserPlus />
          Agregar Cliente
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar clientes..."
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSearch />
            Buscar
          </button>
        </div>
      </div>

      {/* Listado de clientes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Apellido</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  {editingClientId === client.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="firstName"
                          value={editingClientData.firstName}
                          onChange={handleEditClientChange}
                          className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name="lastName"
                          value={editingClientData.lastName}
                          onChange={handleEditClientChange}
                          className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="email"
                          name="email"
                          value={editingClientData.email}
                          onChange={handleEditClientChange}
                          className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleSaveEdit(client.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => setEditingClientId(null)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-gray-800">{client.firstName}</td>
                      <td className="px-6 py-4 text-gray-800">{client.lastName}</td>
                      <td className="px-6 py-4 text-gray-600">{client.email}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => { setEditingClientId(client.id); setEditingClientData(client); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Mostrando {indexOfFirstClient + 1}-{Math.min(indexOfLastClient, filteredClients.length)} de {filteredClients.length}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              <FaChevronLeft />
            </button>
            <button
              disabled={indexOfLastClient >= filteredClients.length}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`p-2 rounded-lg ${indexOfLastClient >= filteredClients.length ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;