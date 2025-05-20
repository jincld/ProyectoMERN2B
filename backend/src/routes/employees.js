import express from "express";
import employeeController from "../controllers/employeeControllers.js";

const router = express.Router();

// La ruta completa ahora es '/api/employees'
router
  .route("/employees")
  .get(employeeController.getemployee)  // Obtener empleados
  .post(employeeController.createemployee);  // Crear empleado

router
  .route("/employees/:id")
  .put(employeeController.updateemployee)  // Actualizar empleado
  .delete(employeeController.deleteemployee);  // Eliminar empleado

export default router;
