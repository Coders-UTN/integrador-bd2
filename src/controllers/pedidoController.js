import { Pedido } from "../models/pedido";

export const mostrarTodosPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find()
      .populate("itemPedido", "nombre  precioUnitario cantidad")
      .populate("usuario", "apellido nombre dni email");

      return res.status(200).json(pedidos);
  } catch (error) {
    next(error);
  } 
};

//pedidos por estado


export const buscarPedidoUsuario = async (req, res, next) => {
  try {
    const { idUsuario } = req.params;
    const pedidosUsuario = await Pedido.find({usuario : idUsuario})
      .populate("itemPedido", "nombre  precioUnitario cantidad")
      .populate("usuario", "apellido nombre");

      return res.status(200).json(pedidosUsuario);
  } catch (error) {
    next(error);
  }  
};
