import { Router } from "express";
import { buscarCarritoUsuario, calcularTotalCarrito } from "../controllers/carritoController";

export const carritoRoutes = Router();

carritoRoutes.get("/:usuarioId", buscarCarritoUsuario);

carritoRoutes.get("/:usuarioId/total", calcularTotalCarrito);