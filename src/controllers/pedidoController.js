import { Pedido } from "../models/pedido";

export const crearPedido = async (req, res, next) => {
  try {
    const { usuario, items, total, metodoPago } = req.body;
    const nuevoPedido = new Pedido(usuario, items, total, metodoPago);

    const pedidoGuardado = await nuevoPedido.save();

    return res.status(201).json(pedidoGuardado);
  } catch (error) {
    next(error);
  }
};

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

export const totalPedidosEstado = async (req, res, next) => {
  try {
    const pedidosEstado = await Pedido.aggregate([
      {
        $group: {
          _id: "$estado",
          totalPedidos: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json(pedidosEstado);
  } catch (error) {
    next(error);
  }
};

export const buscarPedidoUsuario = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const pedidosUsuario = await Pedido.find({ usuario: usuarioId })
      .populate("itemPedido", "nombre  precioUnitario cantidad")
      .populate("usuario", "apellido nombre");

    return res.status(200).json(pedidosUsuario);
  } catch (error) {
    next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true, runValidators: true }
    );

    return res.status(200).json(pedidoActualizado);
  } catch (error) {
    next(error);
  }
};
