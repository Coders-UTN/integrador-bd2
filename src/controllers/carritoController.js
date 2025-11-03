import { Carrito } from "../models/carrito.js";

export const crearCarrito = async (req, res, next) => {
  try {
    const { items, usuario } = req.body;
    const nuevoCarrito = new Carrito(items, usuario);

    const carritoGuardado = await nuevoCarrito.save();

    return res.status(201).json(carritoGuardado);
  } catch (error) {
    next(error);
  }
};

export const buscarCarritoUsuario = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;

    const carrito = await Carrito.findOne({ usuario: usuarioId })
      .populate("items.producto", "nombre precio stock")
      .populate("usuario", "apellido nombre");

    if (!carrito) {
      return res.status(200).json({
        items: [],
        usuario: usuarioId,
      });
    }

    return res.status(200).json(carrito);
  } catch (error) {
    next(error);
  }
};

export const calcularTotalCarrito = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate(
      "items.producto",
      "nombre precio stock"
    );

    if (!carrito) {
      return res.status(200).json({
        items: [],
        totalGeneral: 0,
      });
    }

    let totalGeneral = 0;
    const itemsConSubtotal = carrito.items
      .map((item) => {
        // verificacion en caso de producto borrado
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
        return null; // Si el producto fue borrado, lo marcamos como nulo
      })
      .filter((item) => item !== null); // Filtramos los items nulos (productos borrados)

    return res.status(200).json({
      items: itemsConSubtotal,
      totalGeneral: totalGeneral,
    });
  } catch (error) {
    next(error);
  }
};

export const borrarCarritoUsuario = async (req, res, status) => {
  try {
    const { usuarioId } = req.params;
    const carritoBorardo = await Carrito.deleteOne({usuario : usuarioId});

    return res.status(200).json(carritoBorardo);
  } catch (error) {
    
  }
};