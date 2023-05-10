import express from 'express';
import mongoose from'mongoose';
import multer from 'multer';

import * as UserController from './controllers/UserController.js';

import cors from 'cors';

import checkAuth from './utils/checkAuth.js';

import * as PostController from './controllers/PostController.js';
import {postCreateValidation} from "./validations/post.js";
import {registerValidation} from "./validations/auth.js";
import {check} from "express-validator";

mongoose
    .connect('mongodb+srv://hdzy:WIMrlFLnni0vtxG9@vk-internship.vaa3j1q.mongodb.net/social?retryWrites=true&w=majority')
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

const app = express();

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads');
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
   }
});

const upload = multer({
   storage
});

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/register', registerValidation, UserController.register);
app.post('/login', UserController.login);
app.get('/users/:id', UserController.getUser);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/users/:id/posts', checkAuth, UserController.getUserPosts);

app.post('/upload', upload.single('image'), (req, res) => {
   res.json({
      url: `/uploads/${req.file.filename}`,
   });
});

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getAllTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation , PostController.create);
app.patch('/posts/:id',checkAuth, postCreateValidation, PostController.update);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.post('/users/:id/add', checkAuth, UserController.addFriend);
app.delete('/users/:id/delete',checkAuth, UserController.removeFriend)

app.listen(3000, (err) => {
   if (err) console.log(err);
   else console.log('OK!');
});