import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).send({ message: 'Name is required' });
        }

        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category Already exists'
            });
        }

        const category = new categoryModel({ name, slug: slugify(name) });
        await category.save();  // Correct way to save the category

        res.status(201).send({
            success: true,
            message: 'New category created',
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Category',
            error
        });
    }
};


export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        const { id } = req.params
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            message: "Successfully updated category",
            category

        })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while updating",
            error
        })
    }
};

export const categoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "Category list",
            category
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fetching",
            error
        })
    }

};
export const singleCategoryController = async (req, res) => {
    try {

        const category = await categoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: "single Category",
            category
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fetching single category",
            error
        })

    }

};
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Deleted successfully",
        })


    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fetching single category",
            error
        })

    }

};
