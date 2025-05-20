import React, { useState, useEffect } from 'react';
import './Empleados.css';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    birthday: '',
    email: '',
    address: '',
    password: '',
    hireDate: '',
    telephone: '',
    dui: '',
    issnumber: ''
  });
  const [editIndex, setEditIndex] = useState(null); // Controla si estamos editando

  // Cargar los empleados desde el backend
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
const res = await fetch('http://localhost:4000/api/employees');
        const data = await res.json();
        setEmpleados(data);
      } catch (error) {
        console.error('Error al cargar los empleados:', error);
      }
    };

    fetchEmpleados();
  }, []);

  // Manejo de cambios en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar los datos del formulario (POST o PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      lastName: formData.lastName,
      birthday: formData.birthday,
      email: formData.email,
      address: formData.address,
      password: formData.password,
      hireDate: formData.hireDate,
      telephone: formData.telephone,
      dui: formData.dui,
      issnumber: formData.issnumber
    };

    try {
      let res;
      if (editIndex !== null) {
        // Actualizar empleado (PUT)
        const id = empleados[editIndex]._id;
        res = await fetch(`http://localhost:4000/api/employees/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const updatedData = await res.json();
        alert(updatedData.message || 'Empleado actualizado exitosamente');
        setEmpleados((prevState) => {
          const updatedEmpleados = [...prevState];
          updatedEmpleados[editIndex] = { ...updatedEmpleados[editIndex], ...payload };
          return updatedEmpleados;
        });
      } else {
        // Crear nuevo empleado (POST)
        res = await fetch('http://localhost:4000/api/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        alert(data.message || 'Empleado registrado exitosamente');
        setEmpleados([...empleados, payload]);
      }

      // Limpiar formulario
      setFormData({
        name: '',
        lastName: '',
        birthday: '',
        email: '',
        address: '',
        password: '',
        hireDate: '',
        telephone: '',
        dui: '',
        issnumber: ''
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error al guardar empleado:', error);
      alert('Ocurrió un error al guardar el empleado.');
    }
  };

  // Editar empleado
  const handleEdit = (index) => {
    const emp = empleados[index];
    setFormData({
      name: emp.name,
      lastName: emp.lastName,
      birthday: emp.birthday,
      email: emp.email,
      address: emp.address,
      password: emp.password,
      hireDate: emp.hireDate,
      telephone: emp.telephone,
      dui: emp.dui,
      issnumber: emp.issnumber
    });
    setEditIndex(index);
  };

  // Eliminar empleado
  const handleDelete = async (index) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      const id = empleados[index]._id;
      try {
        const res = await fetch(`http://localhost:4000/api/employees/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        alert(data.message || 'Empleado eliminado exitosamente');
        setEmpleados(empleados.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        alert('Ocurrió un error al eliminar el empleado.');
      }
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4 margin-top-emp">{editIndex !== null ? 'Editar Empleado' : 'Registro de Empleados'}</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        {[ 
          { label: 'Nombre', name: 'name' },
          { label: 'Apellido', name: 'lastName' },
          { label: 'Cumpleaños', name: 'birthday', type: 'date' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Dirección', name: 'address' },
          { label: 'Contraseña', name: 'password', type: 'password' },
          { label: 'Fecha de Contrato', name: 'hireDate', type: 'date' },
          { label: 'Teléfono', name: 'telephone' },
          { label: 'DUI', name: 'dui' },
          { label: 'ISSS Número', name: 'issnumber' },
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
            {editIndex !== null ? 'Actualizar Empleado' : 'Guardar Empleado'}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFormData({
                  name: '',
                  lastName: '',
                  birthday: '',
                  email: '',
                  address: '',
                  password: '',
                  hireDate: '',
                  telephone: '',
                  dui: '',
                  issnumber: ''
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

      <h3>Lista de Empleados</h3>
      {empleados.length === 0 ? (
        <p>No hay empleados registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cumpleaños</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Fecha Contrato</th>
                <th>Teléfono</th>
                <th>DUI</th>
                <th>ISSS</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((emp, index) => (
                <tr key={index}>
                  <td>{emp.name}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.birthday}</td>
                  <td>{emp.email}</td>
                  <td>{emp.address}</td>
                  <td>{emp.hireDate}</td>
                  <td>{emp.telephone}</td>
                  <td>{emp.dui}</td>
                  <td>{emp.issnumber}</td>
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

export default Empleados;
