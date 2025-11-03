import { Router } from "express";
import { actualizarEstado, buscarPedidoUsuario, crearPedido, mostrarTodosPedidos, totalPedidosEstado } from "../controllers/pedidoController";

export const pedidoRoutes = Router()

pedidoRoutes.get("/", mostrarTodosPedidos);

pedidoRoutes.get("/pedidos/stats", totalPedidosEstado);

pedidoRoutes.get("/pedidos/usuario/:usuarioId", buscarPedidoUsuario);

pedidoRoutes.put(":id/status", actualizarEstado);

pedidoRoutes.post("/", crearPedido);

