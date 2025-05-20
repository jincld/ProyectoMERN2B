import React, { useState, useEffect } from 'react';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  const [editIndex, setEditIndex] = useState(null); // Controla si estamos editando

  // Cargar los productos desde el backend
  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/products');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  useEffect(() => {
    fetchProductos();  // Llamada inicial para cargar los productos
  }, []);  // Se ejecuta una vez al cargar el componente

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar los datos del formulario (POST o PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de los campos
    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Validar que el precio y el stock sean números y positivos
    if (isNaN(formData.price) || formData.price <= 0) {
      alert("El precio debe ser un número mayor a 0.");
      return;
    }

    if (isNaN(formData.stock) || formData.stock < 0) {
      alert("El stock debe ser un número mayor o igual a 0.");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),  // Convertir a número
      stock: parseInt(formData.stock),    // Convertir a número entero
    };

    try {
      let res;
      if (editIndex !== null) {
        // Asegurarse de que editIndex es válido
        const productToEdit = productos[editIndex];
        if (!productToEdit || !productToEdit._id) {
          throw new Error("El ID del producto no es válido");
        }

        const id = productToEdit._id; // Obtener el _id del producto correctamente

        // Actualizar producto (PUT)
        res = await fetch(`http://localhost:4000/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const updatedData = await res.json();
        alert(updatedData.message || 'Producto actualizado exitosamente');

        // Actualizar el producto en el estado
        setProductos((prevState) => {
          const updatedProductos = [...prevState];
          updatedProductos[editIndex] = { ...updatedProductos[editIndex], ...payload };
          return updatedProductos;
        });
      } else {
        // Crear nuevo producto (POST)
        res = await fetch('http://localhost:4000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        alert(data.message || 'Producto registrado exitosamente');

        // Asegúrate de que el backend devuelva el nuevo producto
        if (data.product) {
          setProductos((prevState) => [...prevState, data.product]); // Agrega el nuevo producto al estado
        } else {
          console.warn("No se recibió el producto completo del backend.");
        }

        // Recargar la lista de productos
        fetchProductos(); // 🔄 Refrescar la lista de productos
      }

      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Ocurrió un error al guardar el producto.');
    }
  };

  // Editar producto
  const handleEdit = (index) => {
    const prod = productos[index];
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock
    });
    setEditIndex(index); // Establecer el índice de edición
  };

  // Eliminar producto
  const handleDelete = async (index) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const id = productos[index]._id;
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        alert(data.message || 'Producto eliminado exitosamente');
        setProductos(productos.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error al eliminar productos:', error);
        alert('Ocurrió un error al eliminar el producto.');
      }
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 margin-top-emp">{editIndex !== null ? 'Editar producto' : 'Registro de productos'}</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        {[ 
          { label: 'Nombre', name: 'name' },
          { label: 'Descripción', name: 'description' },
          { label: 'Precio', name: 'price' },
          { label: 'Stock', name: 'stock' },
        ].map((field, idx) => (
          <div className="col-md-6" key={idx}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.type || 'text'}
              className="form-control"
              name={field.name}
              value={formData[field.name]} 
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editIndex !== null ? 'Actualizar producto' : 'Guardar producto'}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: ''
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

      <h3>Lista de productos</h3>
      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod, index) => (
                <tr key={index}>
                  <td>{prod.name}</td>
                  <td>{prod.description}</td>
                  <td>{prod.price}</td>
                  <td>{prod.stock}</td>
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

export default Productos;
