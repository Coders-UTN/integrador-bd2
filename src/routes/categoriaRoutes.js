import { Router } from "express";
import { actualizarCategoria, buscarPorId, buscarTodas, crearCategoria, eliminarPorId } from "../controllers/categoriaController.js";

export const categoriaRoutes = Router();

categoriaRoutes.get("/", buscarTodas);

categoriaRoutes.get("/:id", buscarPorId);

categoriaRoutes.post("/", crearCategoria);

categoriaRoutes.put("/:id", actualizarCategoria)

categoriaRoutes.delete("/:id", eliminarPorId);