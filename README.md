Venta Fácil 🛍️

Venta Fácil es una aplicación web diseñada para simplificar y optimizar el proceso de ventas. La app permite gestionar preventistas, clientes, pedidos y productos, asegurando un control preciso del inventario y un flujo de ventas eficiente. Con una interfaz intuitiva y funcionalidades clave como manejo de stock y seguimiento del estado de pedidos, Venta Fácil es ideal para pequeñas y medianas empresas que buscan digitalizar su gestión de ventas.
Características principales 🚀
🔑 Autenticación y Roles de Usuario

    Admin: Puede gestionar usuarios, cargar productos y controlar el stock.
    Preventista: Registra ventas, clientes y pedidos.
    Supervisor: Supervisa las ventas realizadas y el inventario.

🛒 Gestión de Ventas y Pedidos

    Pedidos: Crear pedidos seleccionando productos y cantidades.
    Estado del Pedido: Seguimiento del estado (PENDIENTE, EN CAMINO, ENTREGADO).
    Control Automático de Stock: Cada vez que se realiza una venta, el stock del producto se reduce automáticamente.

📊 Dashboard Dinámico

    Visualización de métricas clave: Total de ventas, pedidos pendientes, y estado del inventario.

🔍 Documentación de la API (Swagger)

    Documentación detallada de los endpoints REST del backend.

Tecnologías utilizadas 🛠️
Frontend (Cliente):

    React.js: Framework para la interfaz de usuario.
    Vite: Herramienta para desarrollo rápido.
    TailwindCSS: Framework de CSS para un diseño moderno y responsivo.
    Axios: Para gestionar las solicitudes HTTP.
    React Icons: Íconos para mejorar la experiencia visual.

Backend (Servidor):

    Java con Spring Boot: Framework backend.
    MySQL: Base de datos relacional.
    Spring Security con JWT: Autenticación segura.
    Swagger: Documentación de la API REST.

Instalación y configuración ⚙️
1. Requisitos previos

    Node.js (v14 o superior)
    Java 17
    MySQL (para la base de datos)
    Maven (para manejar dependencias en Spring Boot)

2. Clonar el repositorio

git clone https://github.com/gabrielavila2070/VentaFacil.git
cd venta-facil

3. Configurar el Backend

    Crea una base de datos MySQL llamada ventafacil:

CREATE DATABASE ventafacil;

Configura las credenciales de acceso a la base de datos en el archivo application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/VentaFacil
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

Ejecuta el backend:

    cd backend
    mvn spring-boot:run

4. Configurar el Frontend

    Ve al directorio del frontend:

cd frontend

Instala las dependencias:

npm install

Ejecuta el proyecto en modo desarrollo:

    npm run dev

    Abre tu navegador en http://localhost:5173.

Uso de la aplicación 📱
Inicio de Sesión

    Admin, Preventista o Supervisor pueden iniciar sesión con sus credenciales.
    Una vez autenticado, accederás a un Dashboard que mostrará tu rol y las funcionalidades correspondientes.

Gestión de Ventas y Pedidos

    Crear Pedido: Selecciona un cliente y añade productos desde el inventario.
    Actualizar Stock: El admin puede añadir stock desde la sección de productos.
    Estado del Pedido: Cambia el estado del pedido (PENDIENTE → EN CAMINO → ENTREGADO) según el avance de la venta.

Endpoints principales de la API REST 🔗

    POST /sales – Crear una nueva venta.
    GET /sales – Listar todas las ventas.
    PUT /sales/{id}/status – Cambiar el estado de un pedido.
    GET /products – Obtener la lista de productos disponibles.
    POST /clients – Crear un nuevo cliente.

Para más detalles, consulta la documentación Swagger en: http://localhost:8080/swagger-ui.html
Mejoras futuras 🌟

Algunas ideas para futuras actualizaciones:

    Notificaciones push para alertar a los preventistas sobre pedidos pendientes.
    Gráficos avanzados en el Dashboard para visualizar mejor las métricas de ventas.
    Sistema de búsqueda avanzada en la lista de productos y clientes.

Contribuciones 🤝

¡Las contribuciones son bienvenidas! Si deseas colaborar en el proyecto:

    Haz un fork del repositorio.
    Crea una nueva rama para tus cambios:

    git checkout -b feature/nueva-funcionalidad

    Envía un pull request.

Licencia 📄

Este proyecto está licenciado bajo la Licencia MIT. Puedes consultar el archivo LICENSE para más detalles.
Contacto 📬

Si tienes alguna pregunta o sugerencia, no dudes en contactarnos:

    Email: gabrielavila2070@gmail.com
    GitHub: https://github.com/gabrielavila2070/VentaFacil
