const { User } = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/configuration');

exports.createSignUp = async (req, res) => {
    try {
        const { email, password , username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();
        res.status(201).json({ message: 'Signup successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email , username : user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

      return  res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username : user.username 
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.userDetail = async(req,res)=>{
    try {
       const userId = req.params.userId
        const userDetail = await User.findById(userId);
        if (!userDetail) {
            return res.status(400).json({ error: "User doesn't exists" });
        }
        return  res.status(200).json({
            message: 'User detail fetched successfully',
            data : userDetail
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }

}
