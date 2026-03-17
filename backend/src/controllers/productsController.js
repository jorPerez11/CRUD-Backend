//Importar el Schema de la colección a usar
import productsModel from "../models/products.js"

//Creación de array de métodos
const productsController = {};

//SELECT
productsController.getProducts = async (req, res) => {
    //Busca y espera los datos solicitados. Se devuelve en JSON
    const products = await productsModel.find();
    res.json(products);
};

//INSERT
productsController.insertProducts = async(req, res) => {
    //Solicita los datos a guardar
    const {name, description, price, stock} = req.body;

    //Guarda los datos ingresados en una nueva variable
    const newProduct = new productsModel({name, description, price, stock});

    //Se guarda los datos desde la variable enviada
    await newProduct.save();

    //Responde con un JSON
    res.json({message: "Product Saved"});
};

//DELETE
productsController.deleteProducts = async(req, res) => {
    //Se manda el ID del producto, mandando a llamar la funcion "findByIdAndDelete"
    await productsModel.findByIdAndDelete(req.params.id);
    res.json({message: "Product Deleted"});
};

//UPDATE
productsController.updateProducts = async(req, res) => {
    //Solicita los datos a actualizar
    const {name, description, price, stock} = req.body;
    //Se ejecuta la función "findByIdAndUpdate", se manda los parametros del ID y los campos
    await productsModel.findByIdAndUpdate(req.params.id, {
        name, description, price, stock,
    }, {new: true}); //Si se desea imprimir el producto actualizado en la consola, se agrega new: true
    //new: true es parte de la sintaxis, debe de agregarse

    //Se devuelve el mensaje en JSON
    res.json({message: "Product Updated"});
};

export default productsController;



