const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Tüm alanları doldurunuz')
    }
    const userExist = await User.findOne({email})
    if (userExist) {
        res.status(400)
        throw new Error('Kullanıcı zaten kayıtlı')
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({name, email, password: hash})
    if (user) {
        res.status(201).json({_id: user.id, name: user.name, email: user.email, token: generateJWTtoken(user._id)});
    } else {
        res.status(400)
        throw new Error('Geçersiz kullanıcı bilgisi')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({_id: user.id, name: user.name, email: user.email, token: generateJWTtoken(user._id)});
    } else {
        res.status(400)
        throw new Error('Geçersiz kullanıcı bilgisi')
    }
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('_id name email');
    if (users.length === 0) {
        res.status(404);
        throw new Error('Kullanıcı bulunamadı');
    }
    res.status(200).json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        res.status(404);
        throw new Error('Kullanıcı bulunamadı');
    }
    res.status(200).json({message: 'Kullanıcı başarıyla silindi', id: userId});
});

const generateJWTtoken = id => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '5d'})
module.exports = {registerUser, loginUser, getUsers, deleteUser}