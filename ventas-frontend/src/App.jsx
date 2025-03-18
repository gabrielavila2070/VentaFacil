import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Preventista from './components/Preventista.jsx';
import Supervisor from './components/Supervisor.jsx';
import Admin from './components/Admin.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import Dashboard from './components/Dashboard.jsx';
import Clients from './components/Clients.jsx';
import Products from './components/Products.jsx';
import Users from './components/Users.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import OrderForm from "./pages/OrderForm.jsx"; // <-- Importación corregida
import OrdersList from "./pages/OrderList.jsx";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/products" element={<Products />} />
          <Route path="/users" element={<Users />} />
          <Route path="/preventista" element={<Preventista />} />
          <Route path="/supervisor" element={<Supervisor />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/orders" element={<OrderForm />} /> {/* <-- Corregida la ruta */}
          <Route path='/sales' element={<OrdersList />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
