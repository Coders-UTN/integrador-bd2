import{Router} from "express";
import{
    crearResena,
    listarResenas,
    resenasPorProducto,
    promedioCalificaciones
} from "../controllers/resenaController.js";
import { verificarToken } from "../services/authService.js";

export const resenaRoutes = Router();


//P de publica
resenaRoutes.get("/",listarResenas);
resenaRoutes.get("/top",promedioCalificaciones);
resenaRoutes.get("/product/:productId", resenasPorProducto);


//P de privada
resenaRoutes.post("/",verificarToken,crearResena);
