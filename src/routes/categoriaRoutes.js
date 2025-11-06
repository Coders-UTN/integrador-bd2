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

categoriaRoutes.get("/", buscarTodas);

categoriaRoutes.post("/", verificarToken, EsAdmin, crearCategoria);

categoriaRoutes.get("/stats", verificarToken, EsAdmin, totalPorCategoria);

categoriaRoutes.get("/:id", buscarPorId);

categoriaRoutes.put("/:id", verificarToken, EsAdmin, actualizarCategoria);

categoriaRoutes.delete("/:id", verificarToken, EsAdmin, eliminarPorId);