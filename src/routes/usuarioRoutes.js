import express from 'express';

import { verificarToken,EsAdmin } from '../services/authService.js';

import { RegistrarUsuario, InicioSesionUsuario,ObtenerTodosLosUsuarios,ObtenerUsuarioPorId,actualizarUsuario,eliminarUsuario } 
from '../controllers/usuarioController.js';
import { Usuario } from '../models/usuario.js';


export const rutasUsuario = express.Router();

// Rutas (sin token)

//Post (Malone): 

rutasUsuario.post("/",RegistrarUsuario);

rutasUsuario.post('/login',InicioSesionUsuario);



//Rutas que requieren un token:

//GET: 

rutasUsuario.get("/",verificarToken,EsAdmin,ObtenerTodosLosUsuarios);


rutasUsuario.get("/:id",verificarToken,ObtenerUsuarioPorId);


//PUT:

rutasUsuario.put("/:id", verificarToken,actualizarUsuario);

//DELETE: 

rutasUsuario.delete("/:id",verificarToken,EsAdmin,eliminarUsuario);








