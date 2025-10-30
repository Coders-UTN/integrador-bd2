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
* **Bcrypt.js:** Para el hasheo y la comparación segura de contraseñas.
* **Dotenv:** Para la gestión de variables de entorno.
* **Nodemon:** Para el reinicio automático del servidor en desarrollo.

---

## Estructura del Proyecto

El proyecto sigue una arquitectura por capas para separar responsabilidades:

## Variables de entorno

Crea el archivo env con las variables de entorno:

```MONGO_USER=admin
MONGO_PASS=admin
PORT=3000
MONGO_URL=mongodb://admin:admin@localhost:27018/biblioteca?authSource=admin
JWT_SECRET=clave_secreta
```

## Pasos para Iniciar el Proyecto

1. Levantar la Base de Datos 🐳

```
docker compose up -d
```

2. Instalar Dependencias 📦

```
npm install
```
. Ejecutar la Aplicación 🚀

```
npm run dev
```