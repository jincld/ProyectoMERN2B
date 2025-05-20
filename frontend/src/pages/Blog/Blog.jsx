import React, { useState, useEffect } from 'react';
import './Blog.css';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const [editIndex, setEditIndex] = useState(null);

  // Cargar blogs desde el backend
  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error al cargar los blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('content', formData.content);
    if (formData.image) {
      payload.append('image', formData.image);
    }

    try {
      if (editIndex !== null) {
        const blogToEdit = blogs[editIndex];
        const id = blogToEdit._id;

        const res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
          method: 'PUT',
          body: payload
        });

        const data = await res.json();
        alert(data.message || 'Blog actualizado exitosamente');

      } else {
        const res = await fetch('http://localhost:4000/api/blogs', {
          method: 'POST',
          body: payload
        });

        const data = await res.json();
        alert(data.message || 'Blog registrado exitosamente');
      }

      // Limpiar formulario y recargar blogs
      setFormData({ title: '', content: '', image: null });
      setEditIndex(null);
      fetchBlogs();

    } catch (error) {
      console.error('Error al guardar el blog:', error);
      alert('Ocurrió un error al guardar el blog.');
    }
  };

  // Editar
  const handleEdit = (index) => {
    const blog = blogs[index];
    setFormData({
      title: blog.title,
      content: blog.content,
      image: null
    });
    setEditIndex(index);
  };

  // Eliminar
  const handleDelete = async (index) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este blog?')) {
      const id = blogs[index]._id;
      try {
        const res = await fetch(`http://localhost:4000/api/blogs/${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        alert(data.message || 'Blog eliminado exitosamente');
        fetchBlogs();
      } catch (error) {
        console.error('Error al eliminar el blog:', error);
        alert('Ocurrió un error al eliminar el blog.');
      }
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 margin-top-emp">{editIndex !== null ? 'Editar Blog' : 'Registrar Blog'}</h2>

      <div className="centered-form">

      <form onSubmit={handleSubmit} className="row g-3 w-75">
        <div className="col-md-6">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Contenido</label>
          <input
            type="text"
            className="form-control"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

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
                setFormData({ title: '', content: '', image: null });
                setEditIndex(null);
              }}
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
      </div>

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
                    {blog.image && (
                      <img
                        src={blog.image}
                        alt="Blog"
                        style={{ width: '100px', objectFit: 'cover' }}
                      />
                    )}
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
