import { Router } from "express";
import { actualizarProducto, buscarPorId, buscarTodos, crearProducto, eliminarPorId } from "../controllers/productoController.js";

export const productoRoutes = Router();

productoRoutes.get("/", buscarTodos);

productoRoutes.get("/:id", buscarPorId);

productoRoutes.post("/", crearProducto);

productoRoutes.put("/:id", actualizarProducto);

productoRoutes.delete("/:id", eliminarPorId);