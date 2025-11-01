import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'; 
import { categoriaRoutes } from './routes/categoriaRoutes.js';
import { productoRoutes } from './routes/productoRoutes.js';

//import { rutasUsuario } from './routes/usuarioRoutes.js';

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

//app.use('/api/usuarios', rutasUsuario);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); 

    if (err.name === 'ValidationError') {
        return res.status(400).json({ success: false, error: err.message });
    }
    if (err.code === 11000) { 
        return res.status(400).json({ success: false, error: 'El email ya está en uso.' });
    }

    res.status(500).json({ 
        success: false, 
        error: err.message || 'Error interno del servidor.' 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});