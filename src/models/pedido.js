import mongoose, { Schema } from "mongoose";

const itemPedido = new mongoose.Schema(
  {
    productoId: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: [0, "El valor del producto no puede ser negativo"],
    },
    cantidad: {
      type: Number,
      required: true,
      min: [1, "La cantidad minima es 1"],
    },
		subtotal : {
			type : Number,
			min : [0, "El subtotal no puede ser negativo"]
		}
  },
  { _id: false }
);

const pedidoSchema = new mongoose.Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    items: [itemPedido],
    total: {
      type: Number,
      required: true,
    },
    metodoPago: {
      type: String,
      enum: {
        values: ["Efectivo", "Credito", "Debito", "Billetera Virtual"],
        message: "{VALUE} no es un medio de pago valido",
      },
    },
    estado: {
      type: String,
      enum: {
        values: ["Pendiente", "Iniciado", "Finalizado", "Demorado"],
        message: "{VALUE} no es un estado valido",
        default : "Pendiente"
      },
    },
  },
  { timestamps: true }
);

export const Pedido = mongoose.model("Pedido", pedidoSchema);
