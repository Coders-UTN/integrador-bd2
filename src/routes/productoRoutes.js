import { Router } from "express";
import { 
    actualizarProducto, 
    actualizarStock, 
    buscarPorId, 
    buscarTodos, 
    crearProducto, 
    eliminarPorId, 
    filtroPrecioMarca, 
    topResenas 
} from "../controllers/productoController.js";

import { verificarToken, EsAdmin } from "../services/authService.js";

export const productoRoutes = Router();

//P de publica
productoRoutes.get("/", buscarTodos);
productoRoutes.get("/filtro", filtroPrecioMarca);
productoRoutes.get("/top", topResenas);
productoRoutes.get("/:id", buscarPorId);



//P de privada

productoRoutes.post("/", verificarToken, EsAdmin, crearProducto);
productoRoutes.put("/:id", verificarToken, EsAdmin, actualizarProducto);
productoRoutes.patch("/:id/stock", verificarToken, EsAdmin, actualizarStock); 
productoRoutes.delete("/:id", verificarToken, EsAdmin, eliminarPorId);