import { Router } from "express";
import { 
    actualizarCategoria, 
    buscarPorId, 
    buscarTodas, 
    crearCategoria, 
    eliminarPorId, 
    totalPorCategoria 
} from "../controllers/categoriaController.js";

import { verificarToken, EsAdmin } from "../services/authService.js";

export const categoriaRoutes = Router();

//P de publica

categoriaRoutes.get("/", buscarTodas);




//P de privada

categoriaRoutes.get("/stats", verificarToken, EsAdmin, totalPorCategoria);
categoriaRoutes.post("/", verificarToken, EsAdmin, crearCategoria);
categoriaRoutes.put("/:id", verificarToken, EsAdmin, actualizarCategoria)
categoriaRoutes.delete("/:id", verificarToken, EsAdmin, eliminarPorId);

categoriaRoutes.get("/:id", buscarPorId);