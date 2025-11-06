import { Carrito } from "../models/carrito.js";
import { Producto } from "../models/producto.js";

export const agregarItem = async (req, res, next) => {
    try {
        const { usuarioId } = req.params;
        const { productoId, cantidad } = req.body;

      
        if (req.user.rol !== 'admin' && req.user.id !== usuarioId) {
            return res.status(403).json({ success: false, error: "No tienes permiso para modificar este carrito." });
        }
        if (!productoId || !cantidad || cantidad < 1) {
            return res.status(400).json({ success: false, error: "Datos de producto o cantidad inválidos." });
        }
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ success: false, error: "Producto no encontrado." });
        }
        let carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            carrito = new Carrito({ usuario: usuarioId, items: [] });
            await carrito.save(); 
        }
        const itemIndex = carrito.items.findIndex(
            (item) => item.producto.toString() === productoId
        );
        if (itemIndex > -1) {
            // Caso 1: El producto ya existe 
            const nuevaCantidad = carrito.items[itemIndex].cantidad + cantidad;
            await Carrito.updateOne(
                { _id: carrito._id, "items.producto": productoId },
                { $set: { "items.$.cantidad": nuevaCantidad } }
            );
        } else {
            // Caso 2: El producto es nuevo 
            const nuevoItem = { producto: productoId, cantidad: cantidad };
            await Carrito.updateOne(
                { _id: carrito._id },
                { $push: { items: nuevoItem } }
            );
        }
        const carritoActualizado = await Carrito.findById(carrito._id)
            .populate("items.producto", "nombre precio marca");
        res.status(200).json({ success: true, data: carritoActualizado });
    } catch (error) {
        next(error);
    }
};


export const eliminarItem = async (req, res, next) => {
    try {
        const { usuarioId, productoId } = req.params;
        
        if (req.user.rol !== 'admin' && req.user.id !== usuarioId) {
            return res.status(403).json({ success: false, error: "No tienes permiso para modificar este carrito." });
        }
        
        const carritoActualizado = await Carrito.findOneAndUpdate(
            { usuario: usuarioId },
            { $pull: { items: { producto: productoId } } },
            { new: true }
        ).populate("items.producto", "nombre precio marca");
        if (!carritoActualizado) {
            return res.status(404).json({ success: false, error: "Carrito no encontrado." });
        }
        res.status(200).json({ success: true, data: carritoActualizado });
    } catch (error) {
        next(error);
    }
};

export const buscarCarritoUsuario = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    if (req.user.rol !== 'admin' && req.user.id !== usuarioId) {
        return res.status(403).json({ success: false, error: "No tienes permiso para ver este carrito." });
    }
    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate(
      "items.producto",
      "nombre precio stock"
    );
    if (!carrito) {
      return res.status(200).json({
        success: true,
        data: {
            items: [],
            usuario: usuarioId,
        }
      });
    }
    return res.status(200).json({ success: true, data: carrito });
  } catch (error) {
    next(error);
  }
};

export const calcularTotalCarrito = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    if (req.user.rol !== 'admin' && req.user.id !== usuarioId) {
        return res.status(403).json({ success: false, error: "No tienes permiso para ver este carrito." });
    }
    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate(
      "items.producto",
      "nombre precio stock"
    );
    if (!carrito) {
      return res.status(200).json({
        success: true,
        data: {
            items: [],
            totalGeneral: 0,
        }
      });
    }
    let totalGeneral = 0;
    const itemsConSubtotal = carrito.items
      .map((item) => {
        if (item.producto) {
          const subtotalItem = item.producto.precio * item.cantidad;
          totalGeneral += subtotalItem;
          return {
            productoId: item.producto._id,
            nombre: item.producto.nombre,
            precioUnitario: item.producto.precio,
            cantidad: item.cantidad,
            subtotal: subtotalItem,
            stockDisponible: item.producto.stock,
          };
        }
        return null; 
      })
      .filter((item) => item !== null); 
    return res.status(200).json({
      success: true, 
      data: {
          items: itemsConSubtotal,
          totalGeneral: totalGeneral,
      }
    });
  } catch (error) {
    next(error);
  }
};

