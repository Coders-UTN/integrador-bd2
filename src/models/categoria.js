import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "El nombre es obligatorio"],
    },
    descripcion: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Categoria = mongoose.model("Categoria", categoriaSchema);
