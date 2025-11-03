import { Categoria } from "../models/categoria.js";
import { Producto } from "../models/producto.js";

export const crearProducto = async (req, res, next) => {

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
        .json({ success: false, error: "No existe la categoria referenciada con el ID" });
    }
    
    const productoGuardado = await nuevoProducto.save();
    
    return res.status(201).json({ success: true, data: productoGuardado });

  } catch (error) {
    next(error);
  }
};

export const buscarTodos = async (req, res, next) => {

  try {
    const productos = await Producto.find().populate("categoria", "nombre");
   
    return res.status(200).json({ success: true, data: productos });

  } catch (error) {
    next(error);
  }
};


export const buscarPorId = async (req, res, next) => { 
  try {
    const { id } = req.params;

    const productoEncontrado = await Producto.findById(id).populate(
      "categoria",
      "nombre"
    );

    if (!productoEncontrado) {
      return res.status(404).json({ success: false, error: "No se encontro el producto" });
    }
    
    return res.status(200).json({ success: true, data: productoEncontrado });

  } catch (error) {
    next(error);
  }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { nombre, descripcion, categoria, precio, marca, stock } = req.body;

    const nuevosDatos = {};

    if (categoria) {

      const categoriaNueva = await Categoria.findById(categoria);

      if (!categoriaNueva) {
        return res
          .status(404)
          .json({ success: false, error: "No existe la categoria definida a actualizar" });
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
        success: false,
        error: "No se encontro un producto con el ID especificado",
      });
    }
   
    return res.status(200).json({ success: true, data: productoActualizado });
  } catch (error) {
    next(error);
  }
};


export const eliminarPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontro producto con el ID especificado" });
    }
    return res.status(200).json({
      success: true,
      message: "Producto eliminado satisfactoriamente",
      producto: productoEliminado,
    });
  } catch (error) {
    next(error);
  }
};


export const filtroPrecioMarca = async (req, res, next) => {

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
          .json({ success: false, error: "El precio minimo debe ser un numero" });
      }
      precioFiltro.$gte = Number(precioMin);
    }
    if (precioMax) {
      if (isNaN(precioMax)) {
        return res
          .status(400)
          .json({ success: false, error: "El precio maximo debe ser un numero" });
      }
      precioFiltro.$lte = Number(precioMax);
    }
    if (precioMin && precioMax && Number(precioMin) > Number(precioMax)) {
      return res
        .status(400)
        .json({ success: false, error: "El precio minimo no puede ser mayor que el maximo" });
    }
    if (Object.keys(precioFiltro).length > 0) {
      query.precio = precioFiltro;
    }

    const productosEncontrados = await Producto.find(query);
    
    return res.status(200).json({ success: true, data: productosEncontrados });
  } catch (error) {
    next(error);
  }
};


export const topResenas = async (req, res, next) => {
  try {
    const topProductos = await Producto.find(
      {},
      { nombre: 1, marca: 1, cantidadResenas: 1 }
    )
      .sort({ cantidadResenas: -1 })
      .limit(10);
    return res.status(200).json({ success: true, data: topProductos });
  } catch (error) {
    next(error);
  }
};


export const actualizarStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ success: false, error: "Se erquiere envio de stock" });
    }
    if (isNaN(stock)) {
      return res
        .status(400)
        .json({ success: false, error: "El valor de stock debe ser numerico" });
    }
    const productoModificado = await Producto.findByIdAndUpdate(
      id,
      { $set: { stock: stock } },
      { new: true, runValidators: true }
    );
    if (!productoModificado) {
      return res
        .status(404)
        .json({ success: false, error: "No se encontro el producto a modificar" });
    }
    return res.status(200).json({ success: true, data: productoModificado });
  } catch (error) {
    next(error);
  }
};