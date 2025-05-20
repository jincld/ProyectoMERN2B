import employeeModel from "../models/employee.js";
import bcryptjs from "bcryptjs";

const employeeController = {};

// GET - Traer todos los empleados
employeeController.getemployee = async (req, res) => {
  try {
    const employees = await employeeModel.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados' });
  }
};

// POST - Crear un nuevo empleado
employeeController.createemployee = async (req, res) => {
  const { name, lastName, birthday, email, password, telephone, dui, issnumber, hireDate, address } = req.body;
  try {
    const passwordHash = await bcryptjs.hash(password, 10); // 🔐 Encriptar contraseña

    const newEmployee = new employeeModel({
      name,
      lastName,
      birthday,
      email,
      password: passwordHash,
      telephone,
      dui,
      issnumber,
      hireDate,
      address
    });

    await newEmployee.save();
    res.json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear empleado' });
  }
};

// DELETE - Eliminar un empleado
employeeController.deleteemployee = async (req, res) => {
  try {
    const deletedEmployee = await employeeModel.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el empleado' });
  }
};

// PUT - Actualizar un empleado
employeeController.updateemployee = async (req, res) => {
  let { name, lastName, birthday, email, password, telephone, dui, issnumber, hireDate, address } = req.body;
  try {
    // 🔐 Encriptar si se actualiza la contraseña
    if (password) {
      password = await bcryptjs.hash(password, 10);
    }

    const updatedData = {
      name,
      lastName,
      birthday,
      email,
      telephone,
      dui,
      issnumber,
      hireDate,
      address
    };

    if (password) {
      updatedData.password = password;
    }

    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el empleado' });
  }
};

export default employeeController;
