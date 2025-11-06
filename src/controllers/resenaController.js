import {Resena} from "../models/resena.js";
import { Producto } from "../models/producto.js";
import {Pedido} from "../models/pedido.js"


export const listarResenas = async(req,res,next) =>{
    try{
      const resenas = await Resena.find()
      .populate("usuario", "nombre apellido")
      .populate("producto","nombre");
      res.status(200).json({success: true, data: resenas});
    } catch(error){
        next(error);
    }
};

export const resenasPorProducto =async(req,res,next) =>{
    try{
    const{ productId } = req.params;
    const resenas = await Resena.find({producto: productId})
    .populate("usuario","nombre apellido")
    .sort({createdAt: -1});
    res.status(200).json({success: true,data: resenas});
    } catch(error){
        next(error);
    }
}

export const promedioCalificaciones = async(req,res,next) =>{
    try{
        const estadisticas = await Resena.aggregate([
            {
                $group:{
                   _id: "$producto",
                   promedio: {$avg: "$calificacion"},
                   totalResenas: {$sum: 1}
                }
            },
            {
                $lookup:{
                    from: "productos",
                    localField: "_id",
                    foreignField: "_id",
                    as: "datos_producto"
                }
            },
            {
                $unwind: "$datos_producto"
            },
            {
                $sort: {promedio: -1} //En este caso 10 es nota el resto va despues.
            },
            {
                $project:{
                   _id: 0,
                   productoId: "$_id",
                   nombre: "$datos_producto.nombre",
                   promedio: "$promedio",
                   totalResenas: "$totalResenas"
                }
            }
        ]);
        
        res.status(200).json({success: true,data: estadisticas});
    } catch(error){
        next(error);
    } 
};

export const crearResena = async(req,res,next) =>{
    try{
        const{producto,comentario,calificacion} = req.body;
        const usuario = req.user.id;
        const pedido = await Pedido.findOne({
            usuario: usuario,
            
            estado: "Finalizado",
            "items.productoId": producto  // se busca dentro del array de item
        }) 
        if(!pedido){
            return res.status(403).json({
               
                success: false,
                error: "Acceso denegado. Si queres reseñar el producto primero tenes que comprarlo -.-"
            });
        }
         // Validamos que no este ya reseñado:
        const resenaExistente = await Resena.findOne({producto,usuario});
        if(resenaExistente){
            return res.status(400).json({
              
                success: false,
                error: "Hola muchas gracias por su feedback pero ya hay una reseña de este producto"
            })
        }
        const nuevaResena = new Resena({
            producto,usuario,comentario,calificacion
        });
        const resenaGuardada = await nuevaResena.save();
        //Actualizar el producto para que tenga la resena:
        await Producto.findByIdAndUpdate(producto,{
            $push: {resenas: resenaGuardada._id},
            $inc: {cantidadResenas: 1} //suma al cont
        });
        
        res.status(201).json({success: true,data: resenaGuardada});
    } catch(error){
        next(error);
    }
};
