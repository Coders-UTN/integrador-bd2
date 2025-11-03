import { Pedido } from "../models/pedido.js";
import { Carrito } from "../models/carrito.js";
import { Producto } from "../models/producto.js";

export const crearPedido = async (req, res, next) => {
  try {
    
    const usuarioId = req.user.id; 
    const { metodoPago } = req.body;

    if (!metodoPago) {
      return res.status(400).json({ success: false, error: "El método de pago es obligatorio." });
    }

    // 1. Buscar el carrito del usuario
    const carrito = await Carrito.findOne({ usuario: usuarioId })
        .populate("items.producto", "nombre precio stock");
    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ success: false, error: "No puedes crear un pedido con un carrito vacío." });
    }

    let totalPedido = 0;
    const itemsPedido = [];
    const operacionesStock = []; // Para descontar stock

    // 2. Iteramos el carrito, validamos stock y armamos el pedido
    for (const item of carrito.items) {
      const producto = item.producto;
      if (!producto) {
        return res.status(404).json({ success: false, error: `El producto con ID ${item.producto} ya no existe.` });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ success: false, error: `Stock insuficiente para ${producto.nombre}. Quedan ${producto.stock}` });
      }
      const subtotal = producto.precio * item.cantidad;
      totalPedido += subtotal;
      // Creamos el item para el Pedido (la "foto" de la compra)
      itemsPedido.push({
        productoId: producto._id.toString(),
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        cantidad: item.cantidad,
        subtotal: subtotal
      });
      // Preparamos la operación para descontar el stock (Operador $inc)
      operacionesStock.push({
        updateOne: {
          filter: { _id: producto._id },
          update: { $inc: { stock: -item.cantidad } }
        }
      });
    }

    // 3. Crear el nuevo pedido
    const nuevoPedido = new Pedido({
      usuario: usuarioId,
      items: itemsPedido,
      total: totalPedido,
      metodoPago: metodoPago,
      estado: "Pendiente" 
    });
    const pedidoGuardado = await nuevoPedido.save();

    // 4. Actualizar el stock de todos los productos 
    await Producto.bulkWrite(operacionesStock);

    // 5. Vaciar el carrito 
    await Carrito.updateOne(
        { usuario: usuarioId },
        { $set: { items: [] } }
    );
    res.status(201).json({ success: true, data: pedidoGuardado });
  } catch (error) {
    next(error);
  }
};

export const mostrarTodosPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find()
     
      .populate("usuario", "apellido nombre dni email");

    return res.status(200).json({ success: true, data: pedidos });
  } catch (error) {
    next(error);
  }
};


export const pedidosPorEstado = async (req, res, next) => {
  try {
    const pedidosEstado = await Pedido.aggregate([
      {
        $group: {
          _id: "$estado",
          totalPedidos: { $count: {} }, 
        },
      },
    ]);
   
    return res.status(200).json({ success: true, data: pedidosEstado });
  } catch (error) {
    next(error);
  }
};

export const buscarPedidoUsuario = async (req, res, next) => {

    

  try {
   
    const { userId } = req.params;


    if (req.user.rol !== 'admin' && req.user.id !== userId) {
        return res.status(403).json({ success: false, error: "No tienes permiso para ver estos pedidos." });
    }
    
    const pedidosUsuario = await Pedido.find({usuario : userId})
      .populate("usuario", "apellido nombre");

    return res.status(200).json({ success: true, data: pedidosUsuario });

  } catch (error) {

    next(error);
  }
};


export const actualizarEstadoPedido = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ success: false, error: "El campo 'estado' es requerido." });
    }
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      id,
      { estado: estado }, 
      { new: true, runValidators: true }
    );

    if (!pedidoActualizado) {
        return res.status(404).json({ success: false, error: "Pedido no encontrado." });
    }
    return res.status(200).json({ success: true, data: pedidoActualizado });

  } catch (error) {
    next(error);
  }
};