# API REST para E-Commerce - Parcial Integrador

Este proyecto es un parcial integrador para la materia **Bases de Datos II** de la Universidad Tecnológica Nacional (UTN), Facultad Regional Mendoza (FRM).

El objetivo es diseñar e implementar una API REST funcional para un sistema de E-commerce utilizando Node.js, Express y MongoDB con Mongoose.

## Información del Proyecto

* **Materia:** Bases de Datos II
* **Profesor:** Franco Gonzalez
* **Institución:** UTN - FRM

## Integrantes

* Aciar Nahuel
* Ramirez Rodrigo

---

## Tecnologías Utilizadas

El backend de esta aplicación está construido con las siguientes tecnologías:

* **Node.js:** Entorno de ejecución para JavaScript en el servidor.
* **Express:** Framework para la creación de la API REST y manejo de rutas.
* **MongoDB:** Base de datos NoSQL orientada a documentos.
* **Mongoose:** Librería de modelado de datos (ODM) para MongoDB y Node.js.
* **JSON Web Tokens (JWT):** Para la autenticación y autorización de usuarios.
* **Bcrypt:** Para el hasheo y la comparación segura de contraseñas.
* **Dotenv:** Para la gestión de variables de entorno.
* **Nodemon:** Para el reinicio automático del servidor en desarrollo.

---

## 1. Configuración y Puesta en Marcha

### 1.1. 🔑 Variables de Entorno (`.env`)

Crea un archivo `.env` en la raíz del proyecto. Este archivo es **ignorado por Git** y es **vital** para correr el proyecto.

**ATENCIÓN:** Estas son las variables que el `server.js` y `authService.js` de este proyecto esperan leer.

```.env
# Puerto del servidor
PORT=3000

# URL de la DB (¡Usar 127.0.0.1 es más seguro que 'localhost'!)
# Este es el nombre que usará Mongoose para crear la DB
MONGO_URI=mongodb://127.0.0.1:27017/integrador-bd2

# Secreto para JWT
JWT_SECRET=esto-es-un-secreto-muy-largo-12345   //Cambiar a gusto

# Expiración (usada por authService.js)
JWT_SECRET_IN=1h


# 1. Instalar (solo la primera vez)
npm install

# 2. Correr el servidor
npm run dev


2.1. Crear el Entorno (Environment)

    En Postman, ir a Environments (izquierda) -> Clic en +.

    Ponerle de nombre: Integrador BD2 - Entorno.

    Agregar las siguientes variables (dejaremos vacías las que se llenan en las pruebas):

VARIABLE,CURRENT VALUE
baseURL,http://localhost:3000
tokenAdmin,(vacío)
token,(vacío)
usuarioId,(vacío)
categoriaId,(vacío)
productoId_A,(vacío)
productoId_B,(vacío)
pedidoId,(vacío)


 2.2. ¡Ahora a usar el Entorno! 

En la esquina superior derecha de Postman, seleccionar Integrador BD2 - Entorno. (Si dice "No Environment", las pruebas fallarán).

#3. 🧪 Flujo de Pruebas (Fase 1: Creación de Datos)

Ejecutar estas peticiones en orden para cargar la base de datos con datos de prueba.

3.1. Crear Usuario "Admin"

    Petición: POST {{baseURL}}/api/usuarios

    Auth: No Auth

    Body (raw, JSON):
    JSON

    { "nombre": "Admin", "apellido": "User", "email": "admin@test.com", "contrasena": "admin123", "direccion": "Admin St 123" }

    Acción Manual (Vital): Ir a MongoDB Compass -> parcial-bd2 -> usuarios -> buscar admin@test.com y cambiar su rol a "admin".

3.2. Login Admin (Guardar Token)

    Petición: POST {{baseURL}}/api/usuarios/login

    Body (raw, JSON):
    JSON

    { "email": "admin@test.com", "contrasena": "admin123" }

    Acción: Copiar el token de la respuesta -> Pegarlo en la variable de entorno {{tokenAdmin}}.

3.3. Crear Usuario "Cliente" (Guardar Token y ID)

    Petición: POST {{baseURL}}/api/usuarios

    Body (raw, JSON):
    JSON

    { "nombre": "Nahuel", "apellido": "Cliente", "email": "nahuel-cliente@test.com", "contrasena": "123456", "direccion": "Calle Falsa 123" }

    Acción:

        Copiar el _id de la respuesta -> Pegarlo en la variable {{usuarioId}}.

        Copiar el token de la respuesta -> Pegarlo en la variable {{token}}.

3.4. Crear Categoría y Productos (con Admin)

    Crear Categoría:

        Petición: POST {{baseURL}}/api/categorias

        Auth (Bearer Token): {{tokenAdmin}}

        Body: { "nombre": "Categoría de Prueba" }

        Acción: Copiar el _id -> Pegarlo en {{categoriaId}}.

    Crear Producto A (Comprado):

        Petición: POST {{baseURL}}/api/productos

        Auth (Bearer Token): {{tokenAdmin}}

        Body: { "nombre": "Producto A", "categoria": "{{categoriaId}}", "precio": 100, "marca": "Test", "stock": 10 }

        Acción: Copiar el _id -> Pegarlo en {{productoId_A}}.

    Crear Producto B (No Comprado):

        Petición: POST {{baseURL}}/api/productos

        Auth (Bearer Token): {{tokenAdmin}}

        Body: { "nombre": "Producto B", "categoria": "{{categoriaId}}", "precio": 50, "marca": "Test", "stock": 5 }

        Acción: Copiar el _id -> Pegarlo en {{productoId_B}}.

3.5. (Vital) Crear Pedido Falso en Compass

Este "hack" es necesario para probar el POST /api/resenas.

    Acción: Abrir MongoDB Compass -> pedidos -> ADD DATA -> Insert Document.

    Borrar {} y pegar esto (¡reemplazando los IDs a mano!):
    JSON

    {
      "usuario": { "$oid": "ID_DE_TU_CLIENTE_AQUÍ" },
      "items": [
        {
          "productoId": "ID_DE_TU_PRODUCTO_A_AQUÍ",
          "nombre": "Producto A de Prueba",
          "precioUnitario": 100,
          "cantidad": 1,
          "subtotal": 100
        }
      ],
      "total": 100,
      "metodoPago": "Efectivo",
      "estado": "Finalizado",
      "createdAt": { "$date": "2025-11-01T00:00:00.000Z" }
    }

    Hacer clic en Insert.

#4. 🧪 Flujo de Pruebas (Fase 2: Pruebas de Módulos)

Ahora que los datos están listos, probamos todas las rutas.

4.1. Módulo: Usuarios y Seguridad de Admin

    [GET] Ver Usuario (Dueño)

        Petición: GET {{baseURL}}/api/usuarios/{{usuarioId}}

        Auth (Bearer Token): {{token}} (Cliente)

        Resultado: 200 OK.

    [GET] Ver TODOS (Fallo 403)

        Petición: GET {{baseURL}}/api/usuarios

        Auth (Bearer Token): {{token}} (Cliente)

        Resultado: 403 Forbidden ("Vos no sos admin").

    [POST] Crear Categoría (Fallo 403)

        Petición: POST {{baseURL}}/api/categorias

        Auth (Bearer Token): {{token}} (Cliente)

        Body: { "nombre": "Test Fallido" }

        Resultado: 403 Forbidden.

4.2. Módulo: Productos y Categorías

    [GET] Listar Productos (Público)

        Petición: GET {{baseURL}}/api/productos

        Auth: No Auth

        Resultado: 200 OK.

    [GET] Filtrar Productos (PúblicD)

        Petición: GET {{baseURL}}/api/productos/filtro?precioMin=80&precioMax=120

        Auth: No Auth

        Resultado: 200 OK (Debe devolver solo el Producto A).

    [GET] Stats Categorías (Admin)

        Petición: GET {{baseURL}}/api/categorias/stats

        Auth (Bearer Token): {{tokenAdmin}}

        Resultado: 200 OK (Debe mostrar la categoría con 2 productos).

4.3. Módulo: Reseñas

    [POST] Crear Reseña (Producto NO Comprado)

        Petición: POST {{baseURL}}/api/resenas

        Auth (Bearer Token): {{token}} (Cliente)

        Body: { "producto": "{{productoId_B}}", "calificacion": 5 }

        Resultado: 403 Forbidden ("...primero tenes que comprarlo").

    [POST] Crear Reseña (Producto SÍ Comprado)

        Petición: POST {{baseURL}}/api/resenas

        Auth (Bearer Token): {{token}} (Cliente)

        Body: { "producto": "{{productoId_A}}", "calificacion": 5, "comentario": "¡Excelente!" }

        Resultado: 201 Created.

    [POST] Crear Reseña (Duplicada)

        Petición: (Repetir la anterior)

        Resultado: 400 Bad Request ("...ya hay una reseña").

    [GET] Ver Reseñas del Producto A

        Petición: GET {{baseURL}}/api/resenas/product/{{productoId_A}}

        Auth: No Auth

        Resultado: 200 OK (Debe mostrar la reseña creada).

    [GET] Ver Promedio Calificaciones

        Petición: GET {{baseURL}}/api/resenas/top

        Auth: No Auth

        Resultado: 200 OK (Debe mostrar el Producto A con promedio 5).

4.4. Módulo: Carrito (Flujo $push/$pull)

    [GET] Ver Carrito (Vacío)

        Petición: GET {{baseURL}}/api/carrito/{{usuarioId}}

        Auth (Bearer Token): {{token}} (Cliente)

        Resultado: 200 OK (Devuelve un carrito vacío).

    [POST] Agregar Producto A (2 unidades)

        Petición: POST {{baseURL}}/api/carrito/{{usuarioId}}/item

        Auth (Bearer Token): {{token}} (Cliente)

        Body: { "productoId": "{{productoId_A}}", "cantidad": 2 }

        Resultado: 200 OK (Devuelve el carrito con 2 unidades de A).

    [POST] Agregar Producto B (1 unidad)

        Petición: POST {{baseURL}}/api/carrito/{{usuarioId}}/item

        Auth (Bearer Token): {{token}} (Cliente)

        Body: { "productoId": "{{productoId_B}}", "cantidad": 1 }

        Resultado: 200 OK (Devuelve el carrito con 2 items).

    [GET] Calcular Total

        Petición: GET {{baseURL}}/api/carrito/{{usuarioId}}/total

        Auth (Bearer Token): {{token}} (Cliente)

        Resultado: 200 OK (Debe calcular el total: (2 * $100) + (1 * $50) = $250).

    [DELETE] Eliminar Producto A

        Petición: DELETE {{baseURL}}/api/carrito/{{usuarioId}}/item/{{productoId_A}}

        Auth (Bearer Token): {{token}} (Cliente)

        Resultado: 200 OK (Devuelve el carrito solo con el Producto B).

4.5. Módulo: Pedidos (El Flujo Final)

    [POST] Crear Pedido (Desde Carrito)

        Prerrequisito: El carrito debe tener el Producto B (de la prueba anterior).

        Petición: POST {{baseURL}}/api/ordenes

        Auth (Bearer Token): {{token}} (Cliente)

        Body: { "metodoPago": "Efectivo" }

        Resultado: 201 Created (Devuelve el nuevo pedido).

        Acción: Copiar el _id del pedido creado -> Pegarlo en la variable {{pedidoId}}.

    [GET] Verificar Carrito Vacío

        Petición: GET {{baseURL}}/api/carrito/{{usuarioId}}

        Auth (Bearer Token): {{token}} (Cliente)

        Resultado: 200 OK (El carrito debe estar vacío de nuevo).

    [GET] Verificar Stock Descontado

        Petición: GET {{baseURL}}/api/productos/{{productoId_B}}

        Auth: No Auth

        Resultado: 200 OK (El stock del Producto B debe haber bajado de 5 a 4).

    [GET] Ver Pedidos del Usuario

        Petición: GET {{baseURL}}/api/ordenes/user/{{usuarioId}}

        Auth (Bearer Token): {{token}} (Cliente)

        Resultado: 200 OK (Debe mostrar el pedido recién creado).

    [PATCH] Actualizar Estado (Admin)

        Petición: PATCH {{baseURL}}/api/ordenes/{{pedidoId}}/status

        Auth (Bearer Token): {{tokenAdmin}}

        Body: { "estado": "Finalizado" }

        Resultado: 200 OK.

    [GET] Ver Stats de Pedidos (Admin)

        Petición: GET {{baseURL}}/api/ordenes/stats

        Auth (Bearer Token): {{tokenAdmin}}

        Resultado: 200 OK (Debe mostrar [ { "_id": "Finalizado", "totalPedidos": 1 } ]).
