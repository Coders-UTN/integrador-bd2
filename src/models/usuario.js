import mongoose, { Schema } from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    apellido: { type: String, required: [true, "El apellido es obligatorio"] },
    nombre: { type: String, required: [true, "El nombre es obligatorio"] },
    dni: String,
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
    },
    direccion: {
      type: String,
      required: [true, "La direccion es obligatoria"],
    },
    telefono: String,
    rol: {
      type: String,
      enum: {
        values: ["cliente", "admin"],
        message: "{VALUE} no es un rol valido",
      },
      default: "cliente",
    },
    contrasena: String,
  },
  { timestamps: true }
);

export const Usuario = mongoose.model("Usuario", usuarioSchema);
