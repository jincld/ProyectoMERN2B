import { Schema, model } from "mongoose";

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,  
    },
    description: { 
      type: String,
      required: true,  
    },
    price: {
      type: Number,
      required: true,
      min: 0,  
    },
    stock: {
      type: Number,
      required: true,
      min: 0,  
    },
  },
  {
    timestamps: true,  
    strict: true,  
  }
);

export default model("Products", productsSchema);
