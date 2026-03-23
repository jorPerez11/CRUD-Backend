// Importamos el modelo de branches (Schema) para usarlo en el controlador
import branchesModel from "../models/branches.js"

// Creación de array de métodos
const branchesController = {};

//SELECT
branchesController.getBranches = async (req, res) => {
    //Busca y espera los datos solicitados. Se devuelve en JSON
    const branches = await branchesModel.find();
    //Se devuelven los datos en formato JSON
    res.json(branches);
};

//INSERT
branchesController.insertBranches = async(req, res) => {
    //Solicita los datos a guardar
    const {name, address, schedule, isActive} = req.body;

    //Crea un nuevo documento con los datos proporcionados
    const newBranch = new branchesModel({name, address, schedule, isActive});

    //Guarda el nuevo documento en la base de datos
    await newBranch.save(); 

    //Responde con un JSON que contiene el nuevo documento creado
    res.json({message: "Branch Saved"});
};

//DELETE
branchesController.deleteBranches = async (req, res) => {
    //Se manda el ID del objeto a eliminar, llamando el método de "findByIdAndDelete"
    await branchesModel.findByIdAndDelete(req.params.id);
    //Se devuelve un mensaje en JSON confirmando la eliminación
    res.json({message: "Branch Deleted"});
};

//UPDATE
branchesController.updateBranches = async (req, res) => {
    //Solicita los datos a actualizar. Los guarda en parámetro req.body
    const {name, address, schedule, isActive} = req.body;
    //Se manda a llamar la función "findByIdAndUpdate" desde branchesModel. 
    //Desde el parametro de ID, actializa los campos específicos dentro del cuerpo de la petición (req.body)
    await branchesModel.findByIdAndUpdate(req.params.id, {name, address, schedule, isActive});
    //Se devuelve un mensaje JSON
    res.json({message: "Branch Updated"});

}


export default branchesController;