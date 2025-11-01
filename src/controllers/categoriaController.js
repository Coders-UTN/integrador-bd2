import { Categoria } from "../models/categoria.js";

export const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const nuevaCategoria = new Categoria({ nombre, descripcion });
    const categoriaGuardada = await nuevaCategoria.save();

    return res.status(201).json(categoriaGuardada);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const buscarTodas = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const categoriaEncontrada = await Categoria.findById(id);

    if (!categoriaEncontrada) {
      return res.status(404).json({ message: "No se encontro la categoria" });
    }

    return res.status(200).json(categoriaEncontrada);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const actualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const nuevosDatos = {};
    if (nombre != undefined) {
      nuevosDatos.nombre = nombre;
    }
    if (descripcion != undefined) {
      nuevosDatos.descripcion = descripcion;
    }

    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      id,
      nuevosDatos,
      { new: true, runValidators: true }
    );

    if (!categoriaActualizada) {
      return res.status(404).json({
        message: "No se encontro una categoria con el ID especificado",
      });
    }

    return res.status(200).json(categoriaActualizada);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
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
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);

    if (!categoriaEliminada) {
      return res
        .status(404)
        .json({ message: "No se encontro categoria con el ID especificado" });
    }
    return res.status(200).json({
      message: "Categoria eliminada satisfactoriamente",
      categoria: categoriaEliminada,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const totalPorCategoria = async (req, res) => {
  try {
    const totalProductos = await Categoria.aggregate([
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "categoria",
          as: "productos",
        },
      },
      { $addFields: { cantidadProductos: { $size: "$productos" } } },
      {
        $project: {
          nombre: 1,
          cantidadProductos: 1,
        },
      },
    ]);

    return res.status(200).json(totalProductos);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
