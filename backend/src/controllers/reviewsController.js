import reviewsModel from "../models/reviews.js";

const reviewsController = {};

//SELECT
reviewsController.getReviews = async (req, res) => {
    const reviews = await reviewsModel.find();
    res.json(reviews);
};  

//INSERT
reviewsController.insertReviews = async (req, res) => {
    const {idEmployee, idProduct, rating, comment} = req.body;

    const newReview = new reviewsModel({idEmployee, idProduct, rating, comment});

    await newReview.save();

    res.json({message: "Review Saved"});
};

//DELETE
reviewsController.deleteReviews = async (req, res) => {
    await reviewsModel.findByIdAndDelete(req.params.id);
    res.json({message: "Review Deleted"});
};

//UPDATE
reviewsController.updateReviews = async (req, res) => {
    const {idEmployee, idProduct, rating, comment} = req.body;
    await reviewsModel.findByIdAndUpdate(req.params.id, {idEmployee, idProduct, rating, comment});
    res.json({message: "Review Updated"});
};

export default reviewsController;


