import employeesModel from "../models/employees.js";

const employeesController = {};

//SELECT
employeesController.getEmployees = async (req, res) => {
    const employees = await employeesModel.find();
    res.json(employees);
};

//INSERT
employeesController.insertEmployees = async (req, res) => {
    //Solicita los datos a guardar
    const {name, lastName, salary, DUI, phone, email, password, idBranch} = req.body;

    //Creación de objeto con los datos solicitados
    const newEmployee = new employeesModel({name, lastName, salary, DUI, phone, email, password, idBranch});   

    //Guardar el nuevo empleado creado
    await newEmployee.save();

    //Envío de respuesta JSON de confirmación
    res.json({message: "Employee Saved"});

};

//DELETE
employeesController.deleteEmployees = async (req, res) => {
    await employeesModel.findByIdAndDelete(req.params.id);
    res.json({message: "Employee Deleted"});
};

//UPDATE
employeesController.updateEmployees = async (req, res) => {
    const {name, lastName, salary, DUI, phone, email, password, idBranch} = req.body;
    await employeesModel.findByIdAndUpdate(req.params.id, {name, lastName, salary, DUI, phone, email, password, idBranch});
    res.json({message: "Employee Updated"});
}

export default employeesController;