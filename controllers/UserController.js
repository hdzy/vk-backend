import {registerValidation} from "../validations/auth.js";
import {validationResult} from "express-validator";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import PostModel from "../models/post.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            name: req.body.name,
            nickname: req.body.nickname,
            surname: req.body.surname,
            city: req.body.city,
            education: req.body.education,
            email: req.body.email,
            passwordHash: passHash,
            avatarUrl: req.body.avatarUrl,
        })

        const user = await doc.save();


        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret',
            {
                expiresIn: '30d'
            });

        const {passwordHash, ...userDate} = user._doc;

        res.json({...userDate, token});
    } catch (err) {
        console.log(err);
        res.status(500).send('Ошибка при регистрации');
    }
};
export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({errors: [{msg: 'Ошибка авторизации'}]});
        }

        const isValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValid) {
            return res.status(404).json({errors: [{msg: 'Ошибка авторизации'}]});
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret',
            {
                expiresIn: '30d'
            });

        const {passwordHash, ...userDate} = user._doc;

        res.json({...userDate, token});

    } catch (err) {
        console.log(err);
        res.status(500).send('Ошибка при авторизации');
    }
};
export const getMe = async (req , res) => {
    try {
        const user = await UserModel.findById(req.userID);

        if (!user) {
            return res.status(404).json({errors: [{msg: 'No user found'}]});
        }

        const {passwordHash, ...userDate} = user._doc;
        res.json({...userDate});
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Ошибка при авторизации');
    }
};

export const getUser = async (req, res) => {
    try {
        const userID = req.params.id;

        UserModel.findById(userID)
            .then(user => {res.json(user)})
            .catch(err => {
                console.log(err)})
    }

    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось получить пользователя');
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const userID = req.params.id;

        const user = await PostModel.find({user: userID});

        res.json([...user]);
    }

    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось получить пользователя');
    }
}



export const addFriend = async (req , res) => {
    try {
        const userID = await UserModel.findById(req.userID);
        const friendID = await UserModel.findById(req.params.id);

        if (!userID || !friendID) {
            return res.status(404).json({errors: [{msg: 'No user found'}]});
        }

        userID.friends.push({
            avatar: friendID.avatarUrl,
            nickname: friendID.nickname,
            id: friendID._id,
        });

        friendID.friends.push({
            avatar: userID.avatarUrl,
            nickname: userID.nickname,
            id: userID._id,
        });

        userID.save();
        friendID.save();

        res.json({
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Ошибка при авторизации');
    }
};
export const removeFriend = async (req, res) => {
    try {
        const userID = await UserModel.findById(req.userID);
        const friendID = await UserModel.findById(req.params.id);

        if (!userID || !friendID) {
            return res.status(404).json({errors: [{msg: 'No user found'}]});
        }

        userID.friends.remove({
            avatar: friendID.avatarUrl,
            nickname: friendID.nickname,
            id: friendID._id,
        });

        friendID.friends.remove({
            avatar: userID.avatarUrl,
            nickname: userID.nickname,
            id: userID._id,
        });

        userID.save();
        friendID.save();

        res.json({
            success: true
        });
    }

    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось получить пользователя');
    }
}