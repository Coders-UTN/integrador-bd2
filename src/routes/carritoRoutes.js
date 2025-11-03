import { Router } from "express";
import { borrarCarritoUsuario, buscarCarritoUsuario, calcularTotalCarrito, crearCarrito } from "../controllers/carritoController";

export const carritoRoutes = Router();

carritoRoutes.get("/:usuarioId", buscarCarritoUsuario);

carritoRoutes.get("/:usuarioId/total", calcularTotalCarrito);

carritoRoutes.post("/", crearCarrito);

pedidoRoutes.delete("/:usuarioId", borrarCarritoUsuario);