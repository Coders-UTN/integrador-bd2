import mongoose, { Schema } from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, trim: true },
    descripcion: { type: String, trim: true },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: [true, "El producto debe pertenecer a una categoria"],
    },
    precio: {
      type: Number,
      required: [true, "El producto debe tener precio"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "El producto debe tener stock asignado"],
      default: 0,
      min: [0, "El stock no puede ser negativo"],
    },
    resenas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resena",
      },
    ],
  },
  { timestamps: true }
);

export const Producto = mongoose.model("Producto", productoSchema);
