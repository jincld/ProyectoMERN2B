//Array de metodos (C R U D)
const productsController = {};
import productsModel from "../models/Products.js";

productsController.getProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};


// INSERT
productsController.createProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = new productsModel({ name, description, price, stock });
  await newProduct.save();
  res.json({ message: "Producto guardado" });
};

// DELETE
productsController.deleteProducts = async (req, res) => {
  const deletedProduct = await productsModel.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  res.json({ message: "Producto eliminado exitosamente" });
};


// UPDATE
productsController.updateProducts = async (req, res) => {
  // Solicito todos los valores
  const { name, description, price, stock } = req.body;
  // Actualizo
  await productsModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      stock,
    },
    { new: true }
  );
  // muestro un mensaje que todo se actualizo
  res.json({ message: "Producto actualizado" });
};

export default productsController;
