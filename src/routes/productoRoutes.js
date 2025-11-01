import { Router } from "express";
import { actualizarProducto, actualizarStock, buscarPorId, buscarTodos, crearProducto, eliminarPorId, filtroPrecioMarca, topResenas } from "../controllers/productoController.js";

export const productoRoutes = Router();

productoRoutes.get("/", buscarTodos);

productoRoutes.get("/filtro", filtroPrecioMarca);

productoRoutes.get("/top", topResenas);

productoRoutes.get("/:id", buscarPorId);

productoRoutes.post("/", crearProducto);

productoRoutes.put("/:id", actualizarProducto);

productoRoutes.put("/:id/stock", actualizarStock);

productoRoutes.delete("/:id", eliminarPorId);



