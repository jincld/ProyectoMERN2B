import React, { useState, useEffect } from 'react';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const [editIndex, setEditIndex] = useState(null); // Controla si estamos editando

  // Cargar los blogs desde el backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/blogs');
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error al cargar los blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Enviar los datos del formulario (POST o PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de los campos
    if (!formData.title || !formData.content) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Crear un FormData para manejar la subida de imágenes
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('content', formData.content);
    if (formData.image) {
      payload.append('image', formData.image);
    }

    try {
      let res;
      if (editIndex !== null) {
        // Asegurarse de que editIndex es válido
        const blogToEdit = blogs[editIndex];
        if (!blogToEdit || !blogToEdit._id) {
          throw new Error("El ID del blog no es válido");
        }

        const id = blogToEdit._id; // Obtener el _id del blog correctamente

        // Actualizar blog (PUT)
        res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
          method: 'PUT',
          body: payload,
        });

        const updatedData = await res.json();
        alert(updatedData.message || 'Blog actualizado exitosamente');

        // Actualizar el blog en el estado
        setBlogs((prevState) => {
          const updatedBlogs = [...prevState];
          updatedBlogs[editIndex] = { ...updatedBlogs[editIndex], ...formData };
          return updatedBlogs;
        });
      } else {
        // Crear nuevo blog (POST)
        res = await fetch('http://localhost:4000/api/blogs', {
          method: 'POST',
          body: payload,
        });

        const data = await res.json();
        alert(data.message || 'Blog registrado exitosamente');
        setBlogs([...blogs, { title: formData.title, content: formData.content }]);
      }

      // Limpiar formulario
      setFormData({
        title: '',
        content: '',
        image: null
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error al guardar el blog:', error);
      alert('Ocurrió un error al guardar el blog.');
    }
  };

  // Editar blog
  const handleEdit = (index) => {
    const blog = blogs[index];
    setFormData({
      title: blog.title,
      content: blog.content,
      image: null // No cargamos la imagen al editar
    });
    setEditIndex(index); // Establecer el índice de edición
  };

  // Eliminar blog
  const handleDelete = async (index) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este blog?')) {
      const id = blogs[index]._id;
      try {
        const res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        alert(data.message || 'Blog eliminado exitosamente');
        setBlogs(blogs.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error al eliminar el blog:', error);
        alert('Ocurrió un error al eliminar el blog.');
      }
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">{editIndex !== null ? 'Editar Blog' : 'Registrar Blog'}</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        {[
          { label: 'Título', name: 'title' },
          { label: 'Contenido', name: 'content' },
        ].map((field, idx) => (
          <div className="col-md-6" key={idx}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.name === 'content' ? 'textarea' : 'text'}
              className="form-control"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        
        <div className="col-md-6">
          <label className="form-label">Imagen</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={handleChange}
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editIndex !== null ? 'Actualizar Blog' : 'Guardar Blog'}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFormData({
                  title: '',
                  content: '',
                  image: null
                });
                setEditIndex(null);
              }}
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      <hr className="my-5" />

      <h3>Lista de Blogs</h3>
      {blogs.length === 0 ? (
        <p>No hay blogs registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead>
              <tr>
                <th>Título</th>
                <th>Contenido</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={index}>
                  <td>{blog.title}</td>
                  <td>{blog.content}</td>
                  <td>
                    {blog.image && <img src={blog.image} alt="Blog" width="100" />}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(index)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(index)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Blogs;
