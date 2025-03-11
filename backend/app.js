// Importo todo lo de la libreria express
import express from "express";
import productsRoutes from "./src/routes/products.js";

// Creo una constante que es igual a la libreria
// que acabo de importar, y la ejecuto
const app = express();

// middleware para que acepte datos JSON
app.use(express.json());

app.use("/api/products", productsRoutes);

// exporto esta constante para usar express en todos lados
export default app;
