import { Categoria } from "../models/categoria.js";
import { Producto } from "../models/producto.js";

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, stock } = req.body;
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
    });

    const categoriaProducto = await Categoria.findById(categoria);

    if (!categoriaProducto) {
      return res
        .status(404)
        .json({ message: "No existe la categoria referenciada con el ID" });
    }

    const productoGuardado = await nuevoProducto.save();

    return res.status(201).json(productoGuardado);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe un producto con ese nombre" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const buscarTodos = async (req, res) => {
  try {
    const productos = await Producto.find();
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const productoEncontrado = await Producto.findById(id);

    if (!productoEncontrado) {
      return res.status(404).json({ message: "No se encontro el producto" });
    }

    return res.status(200).json(productoEncontrado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria, precio, stock } = req.body;
    const nuevosDatos = {};

    if (categoria) {
      const categoriaNueva = await Categoria.findById(categoria);

      if (!categoriaNueva) {
        return res
          .status(404)
          .json({ message: "No existe la categoria definida a actualizar" });
      }
    }

    if (nombre != undefined) {
      nuevosDatos.nombre = nombre;
    }
    if (descripcion != undefined) {
      nuevosDatos.descripcion = descripcion;
    }
    if (categoria != undefined) {
      nuevosDatos.categoria = categoria;
    }
    if (precio != undefined) {
      nuevosDatos.precio = precio;
    }
    if (stock != undefined) {
      nuevosDatos.stock = stock;
    }
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      nuevosDatos,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({
        message: "No se encontro un producto con el ID especificado",
      });
    }

    return res.status(200).json(productoActualizado);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe un producto con ese nombre" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const eliminarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res
        .status(404)
        .json({ message: "No se encontro producto con el ID especificado" });
    }
    return res.status(200).json({
      message: "Producto eliminado satisfactoriamente",
      producto: productoEliminado,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
