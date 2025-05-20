import blogModel from "../models/blog.js";
import { v2 as cloudinary } from "cloudinary";

import { config } from "../config.js";

//1- Configurar cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

// Array de funciones vacio
const blogController = {};

//Select
blogController.getAllBlog = async (req, res) => {
  const blogs = await blogModel.find();
  res.json(blogs);
};

//Guardar
blogController.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    let imageUrl = "";

    if (req.file) {
      //Subir el archivo a Cloudinary
      const result = await cloudinary.uploader.upload(
        req.file.path, 
        {
        folder: "public",
        allowed_formats: ["jpg", "png", "jpeg"],
        });
      imageUrl = result.secure_url;
    }

    const newBlog = new blogModel({ title, content, image: imageUrl });
    newBlog.save();

    res.json({ message: "Blog guardado" });
  } catch (error) {
    console.log("error" + error);
  }
};

// Actualizar
blogController.updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Obtener blog actual
    const existingBlog = await blogModel.findById(req.params.id);
    if (!existingBlog) return res.status(404).json({ message: "Blog no encontrado" });

    let imageUrl = existingBlog.image; // mantener la imagen anterior

    if (req.file) {
      // Subir nueva imagen
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["jpg", "png", "jpeg"],
      });
      imageUrl = result.secure_url;
    }

    await blogModel.findByIdAndUpdate(req.params.id, {
      title,
      content,
      image: imageUrl,
    });

    res.json({ message: "Blog actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error al actualizar el blog" });
  }
};

// Eliminar
blogController.deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog no encontrado" });
    }
    res.json({ message: "Blog eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ message: "Error al eliminar el blog" });
  }
};


export default blogController;
