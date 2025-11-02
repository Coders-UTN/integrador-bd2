import{Router} from "express";

import{
    crearResena,
    listarResenas,
    resenasPorProducto,
    promedioCalificaciones

} from "../controllers/resenaController.js";


import { verificarToken } from "../services/authService.js";


export const resenaRoutes = Router();


//Publicas

resenaRoutes.get("/",listarResenas);

resenaRoutes.get("/top",promedioCalificaciones)

resenaRoutes.post("/",verificarToken,crearResena);


//Admin Edition

resenaRoutes.post("/",verificarToken,crearResena);

