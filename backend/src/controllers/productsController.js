/*
Este archivo tiene los metodos del CRUD
(Select, insert, update y delete)
*/

// Creo un array de funciones
const productsController = {};
import productsModel from "../models/Products.js";

// SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

// INSERT
productsController.insertProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = new productsModel({ name, description, price, stock });
  await newProduct.save();
  res.json({ message: "Products saved" });
};

// DELETE
productsController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "product deleted" });
};

// UPDATE
productsController.updateProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const updatedProducts = await productsModel.findByIdAndUpdate(
    req.params.id,
    { name, description, price, stock },
    { new: true }
  );
  res.json({ message: "product updated successfully" });
};

export default productsController;
