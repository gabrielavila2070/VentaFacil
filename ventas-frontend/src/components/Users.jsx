import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "PREVENTISTA" });
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      setMessage("Error cargando usuarios");
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users", newUser);
      setUsers([...users, response.data]);
      setNewUser({ username: "", password: "", role: "PREVENTISTA" });
      setMessage("Usuario agregado correctamente");
    } catch (error) {
      setMessage("Error al agregar usuario");
    }
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`/users/${editingUser.id}`, editingUser);
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
      setMessage("Usuario actualizado correctamente");
    } catch (error) {
      setMessage("Error al actualizar usuario");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setMessage("Usuario eliminado correctamente");
    } catch (error) {
      setMessage("Error al eliminar usuario");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUserPlus className="text-blue-600" />
          Gestión de Usuarios
        </h2>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-lg flex items-center justify-between ${
          message.includes("correctamente") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
      )}

      {/* Formulario para agregar usuarios */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Nuevo Usuario</h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            placeholder="Nombre de usuario"
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Contraseña"
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="PREVENTISTA">Preventista</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaUserPlus /> Agregar
          </button>
        </form>
      </div>

      {/* Listado de usuarios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{user.username}</td>
                  <td className="px-6 py-4">
                    {editingUser?.id === user.id ? (
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PREVENTISTA">Preventista</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    ) : (
                      <span className="text-gray-800">{user.role}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      {editingUser?.id === user.id ? (
                        <>
                          <button
                            onClick={handleUpdateUser}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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

export default Users;