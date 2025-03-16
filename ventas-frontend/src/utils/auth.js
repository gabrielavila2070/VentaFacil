export const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64)); // Decodificar JWT
  
      console.log("Token decodificado:", payload); // Agregar log para verificar
  
      return { username: payload.sub, role: payload.role }; // Verificar la estructura real del token
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return null;
    }
  };