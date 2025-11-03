import { Router } from "express";
import {
    buscarCarritoUsuario,
    calcularTotalCarrito,
    agregarItem,
    eliminarItem
} from "../controllers/carritoController.js";
import { verificarToken } from "../services/authService.js";

export const carritoRoutes = Router();

carritoRoutes.use(verificarToken);

carritoRoutes.get("/:usuarioId", buscarCarritoUsuario);

carritoRoutes.get("/:usuarioId/total", calcularTotalCarrito);

carritoRoutes.post("/:usuarioId/item", agregarItem);

carritoRoutes.delete("/:usuarioId/item/:productoId", eliminarItem);