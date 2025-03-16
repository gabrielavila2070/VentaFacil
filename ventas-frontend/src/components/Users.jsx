import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "PREVENTISTA" });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
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
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`/users/${editingUser.id}`, editingUser);
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <h2 className="text-3xl font-bold mb-4 text-white-800">Gestión de Usuarios</h2>

      {/* Formulario para agregar usuarios */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Agregar Usuario</h3>
        <form onSubmit={handleAddUser} className="flex gap-2">
          <input type="text" name="username" value={newUser.username} onChange={handleInputChange}
            placeholder="Usuario" className="border p-2 flex-1 rounded"/>
          <input type="password" name="password" value={newUser.password} onChange={handleInputChange}
            placeholder="Contraseña" className="border p-2 flex-1 rounded"/>
          <select name="role" value={newUser.role} onChange={handleInputChange}
            className="border p-2 flex-1 rounded">
            <option value="PREVENTISTA">Preventista</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Agregar</button>
        </form>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white p-4 rounded-lg shadow flex-1 overflow-auto">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Lista de Usuarios</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="border px-4 py-2 text-left">Usuario</th>
              <th className="border px-4 py-2 text-left">Rol</th>
              <th className="border px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="border px-4 py-2 text-gray-800">{user.username}</td>
                <td className="border px-4 py-2">
                  {editingUser?.id === user.id ? (
                    <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="border p-1 w-full">
                      <option value="PREVENTISTA">Preventista</option>
                      <option value="SUPERVISOR">Supervisor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    <span className="text-gray-800">{user.role}</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingUser?.id === user.id ? (
                    <button onClick={handleUpdateUser} className="bg-green-500 text-white px-2 py-1 mr-2 rounded">Guardar</button>
                  ) : (
                    <button onClick={() => handleEditUser(user)} className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded">Editar</button>
                  )}
                  <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;

