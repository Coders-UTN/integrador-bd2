import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'; 

import { categoriaRoutes } from './routes/categoriaRoutes.js';
import { productoRoutes } from './routes/productoRoutes.js';
import { rutasUsuario } from './routes/usuarioRoutes.js';
import { resenaRoutes } from './routes/resenaRoutes.js';
import { carritoRoutes } from './routes/carritoRoutes.js'; 
import { pedidoRoutes } from './routes/pedidoRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('¡MONGO_URI no está definida en .env!');
}

app.use(express.json()); 

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB conectado exitosamente.'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api/usuarios', rutasUsuario);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/ordenes', pedidoRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack); 

    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, error: err.message });
    }
    if (err.code === 11000) { 
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `El campo '${field}' con el valor '${value}' ya existe.`;

        return res.status(400).json({ success: false, error: message });
    }

    res.status(500).json({ 
        success: false, 
        error: err.message || 'Error interno del servidor.' 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});