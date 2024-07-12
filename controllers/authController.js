import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;

        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }
        if (!email) {
            return res.status(400).send({ message: 'Email is required' });
        }
        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }
        if (!phone) {
            return res.status(400).send({ message: 'Phone number is required' });
        }
        if (!address) {
            return res.status(400).send({ message: 'Address is required' });
        }
        if (!answer) {
            return res.status(400).send({ message: 'Answer is required' });
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({
                success: false,
                message: 'User already exists, please login',
            });
        }
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save();
        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            user
        });

    } catch (message) {
        console.log(message);
        res.status(500).send({
            success: false,
            message: 'message in registration',
            message
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email not registered'
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).send({
                success: false,
                message: 'Incorrect password'
            });
        }
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                phone: user.phone,
                email: user.email,
                address: user.address,
                role: user.role
            },
            token,
        });

    } catch (message) {
        console.log(message);
        res.status(500).send({
            success: false,
            message: 'message in login',
            message
        });
    }
};

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newpassword } = req.body
        if (!email) {
            res.status(400).send({ message: 'Email required' })
        }
        if (!answer) {
            res.status(400).send({ message: 'answer required' })
        }
        if (!newpassword) {
            res.status(400).send({ message: 'Newpassword required' })
        }
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong email or Answer'
            })
        }
        const hashed = await hashPassword(newpassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: 'Password changed succesfully'
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error

        })
    }
}


export const testController = (req, res) => {
    res.send("protected routes");
};



export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        console.log('Request body:', req.body); // Debugging statement

        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (password && password.length < 6) {
            return res.json({ error: "Password should be 6 characters long" });
        }

        const hashedPwd = password ? await hashPassword(password) : undefined;
        console.log('Hashed password:', hashedPwd);

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPwd || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true });

        console.log('Updated user:', updatedUser); // Debugging statement

        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            updatedUser,
        });

    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({
            success: false,
            message: "Something went wrong while updating the profile",
            error
        });
    }
};
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong while fetching orders",
            error
        });
    }
};
