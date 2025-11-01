import { Router } from "express";
import { actualizarProducto, actualizarStock, buscarPorId, buscarTodos, crearProducto, eliminarPorId, filtroPrecioMarca, topResenas } from "../controllers/productoController.js";

export const productoRoutes = Router();

productoRoutes.get("/", buscarTodos);

productoRoutes.get("/:id", buscarPorId);

productoRoutes.post("/", crearProducto);

productoRoutes.put("/:id", actualizarProducto);

productoRoutes.delete("/:id", eliminarPorId);

productoRoutes.put("/:id/stock", actualizarStock);

productoRoutes.get("/top", topResenas);

productoRoutes.get("/filtro", filtroPrecioMarca);