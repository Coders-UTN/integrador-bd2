import mongoose, { Schema } from "mongoose";

const resenaSchema = new mongoose.Schema(
  {
    comentario: {
      type: String,
      trim: true,
      maxlength: [500, "El comentario no puede exceder los 500 caracteres"],
    },
    calificacion: {
      type: Number,
      required: [true, "La calificación es obligatoria"],
      min: [1, "La calificación debe ser al menos 1"],
      max: [5, "La calificación no puede ser mayor a 5"],
    },

    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "La reseña debe pertenecer a un usuario"],
    },

    producto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: [true, "La reseña debe estar asociada a un producto"],
    },
  },
  { timestamps: true }
);

export const Resena = mongoose.model("Resena", resenaSchema);
