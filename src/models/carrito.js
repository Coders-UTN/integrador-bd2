import mongoose, { Schema } from "mongoose";

const itemCarrito = new mongoose.Schema(
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, "La cantidad minima es 1"],
    },
  },
  { _id: false }
);

const carritoSchema = new mongoose.Schema({
    items : [itemCarrito],
    usuario : {
        type : Schema.Types.ObjectId,
        ref : "Usuario",
        required : true,
        unique : true
    }
},
{timestamps : true})

export const Carrito = mongoose.model("Carrito", carritoSchema)