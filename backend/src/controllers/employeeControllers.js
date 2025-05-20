import employeeModel from "../models/employee.js";
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
  const { name, lastName, birthday, email, password, telephone, dui, issnumber, hireDate } = req.body;
  try {
    const newEmployee = new employeeModel({
      name,
      lastName,
      birthday,
      email,
      password,
      telephone,
      dui,
      issnumber,
      hireDate
    });
    await newEmployee.save();
    res.json({ message: 'Empleado guardado exitosamente' });
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
  const { name, lastName, birthday, email, password, telephone, dui, issnumber, hireDate } = req.body;
  try {
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        birthday,
        email,
        password,
        telephone,
        dui,
        issnumber,
        hireDate
      },
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
