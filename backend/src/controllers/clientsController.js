import clientsModel from "../models/clients.js"

const clientsController = {};

//SELECT
clientsController.getClients = async (req, res) => {
    try{
        const clients = await clientsModel.find();
        return res.status(200).json(clients);
    }catch (error){
        console.log("error" + error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

//UPDATE
clientsController.updateClient = async(req, res) => {
    try{
        let {
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttempts,
            timeOut
        } = req.body;

        //Validaciones
        name = name?.trim();
        email = email?.trim();

        //Validacion de contraseña
        if(password.length < 8){
            return res.status(400).json({message: "Short password"})
        }

        //Valores requeridos
        if(!name || !email || !password){
            return res.status(400).json({message: "Fields required"})
        };

        //Validaciones de fechas
        if(birthdate > new Date || birthdate < new Date("1901-01-01") ){
            return res.status(400).json({message: "Invalid date"});
        };


        const clientsUpdated = await clientsModel.findByIdAndUpdate(req.params.id, {
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttempts,
            timeOut 
        },{
            new: true
        },);


        if(!clientsUpdated){
            return res.status(400).json({message: "Client not found"})
        };

        return res.status(200).json({message: "Client Updated"})

    }catch (error){
        console.log("error", error);
        return res.status(500).json({message: "Internal Server Error"})
    };
}


clientsController.deleteClient = async(req, res) => {
    try{

        const deleteClient = await clientsModel.findByIdAndDelete(req.params.id);

        //SI no se elimina, no existe el id
        if(!deleteClient){
            return res.status(404).json({message: "Client Not Found"});
        };

        return res.status(200).json({message: "Client Deleted"})


    }catch(error){
        console.log("error", error);
        return res.status(500).json({message: "Internal Server Error"})
    };
}

export default clientsController;