import { Router } from "express";
import {
    crearPedido,
    mostrarTodosPedidos,
    buscarPedidoUsuario,
    pedidosPorEstado,
    actualizarEstadoPedido
} from "../controllers/pedidoController.js";
import { verificarToken, EsAdmin } from "../services/authService.js";

export const pedidoRoutes = Router();

pedidoRoutes.get("/", verificarToken, EsAdmin, mostrarTodosPedidos);
pedidoRoutes.get("/stats", verificarToken, EsAdmin, pedidosPorEstado);
pedidoRoutes.patch("/:id/status", verificarToken, EsAdmin, actualizarEstadoPedido);
pedidoRoutes.post("/", verificarToken, crearPedido);
pedidoRoutes.get("/user/:userId", verificarToken, buscarPedidoUsuario);