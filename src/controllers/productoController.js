import { Categoria } from "../models/categoria.js";
import { Producto } from "../models/producto.js";

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio, marca, stock } = req.body;
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      categoria,
      precio,
      marca,
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
    const productos = await Producto.find().populate("categoria" ,"nombre");
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const productoEncontrado = await Producto.findById(id).populate("categoria", "nombre");

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
    const { nombre, descripcion, categoria, precio, marca, stock } = req.body;
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
    if (marca != undefined) {
      nuevosDatos.marca = marca;
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

export const filtroPrecioMarca = async (req, res) => {
  try {
    const { precioMin, precioMax, marca } = req.query;
    const query = {};

    if (marca) {
      query.marca = new RegExp(marca, "i"); //no distingue mayusculas
    }

    const precioFiltro = {};

    if (precioMin) {
      if (isNaN(precioMin)) {
        return res
          .status(400)
          .json({ message: "El precio minimo debe ser un numero" });
      }
      precioFiltro.$gte = Number(precioMin);
    }

    if (precioMax) {
      if (isNaN(precioMax)) {
        return res
          .status(400)
          .json({ message: "El precio maximo debe ser un numero" });
      }
      precioFiltro.$lte = Number(precioMax);
    }

    if (precioMin && precioMax && Number(precioMin) > Number(precioMax)) {
      return res
        .status(400)
        .json({ message: "El precio minimo no puede ser mayor que el maximo" });
    }

    if (Object.keys(precioFiltro).length > 0) {
      query.precio = precioFiltro;
    }

    const productosEncontrados = await Producto.find(query);

    return res.status(200).json(productosEncontrados);
  } catch (error) {
    res.status(500).json({ message: "Error inesperado del servidor" });
  }
};

export const topResenas = async (req, res) => {
  try {
    const topProductos = await Producto.find({},{nombre : 1, marca : 1, cantidadResenas : 1}).sort({cantidadResenas : -1}).limit(10);

    return res.status(200).json(topProductos);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body

    if (stock === undefined) { 
      return res.status(400).json({message : "Se erquiere envio de stock"})
    }

    if (isNaN(stock)) {
      return res.status(400).json({message : "El valor de stock debe ser numerico"})
    }

    const productoModificado = await Producto.findByIdAndUpdate(
      id,
      {$set : { stock : stock}},
      {new : true, runValidators : true}
    );

    if (!productoModificado){
      return res.status(404).json({message : "No se encontro el producto a modificar"})
    }

    return res.status(200).json(productoModificado);
  } catch (error) {
    return res.status(500).json({message : "Error interno del servidor"});
  }
}