import PostModel from "../models/post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            content: req.body.content,
            user: req.userID,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
        });

        const post = await doc.save();

        res.json(post);
    }
    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось создать статью');
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    }

    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось получить статьи');
    }
}

export const getOne = async (req, res) => {
    try {
        const postID = req.params.id;

        PostModel.findOneAndUpdate({
                _id: postID
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            ).populate('user')
            .then((post) => {res.json(post);})
            .catch((err) => {console.log(err); res.status(500).json('Не удалось получить статью')});
    }

    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось получить статью');
    }
}

export const remove = async (req, res) => {
    try {
        const postID = req.params.id;

        PostModel.findOneAndDelete({
            _id: postID
        })
            .then(() => {res.json({
                removed: true,
            })})
            .catch((err) => {console.log(err); res.status(500).json('Не удалось удалить статью')});
    }

    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось получить статью');
    }
}

export const update = async (req, res) => {
    try {
        const postID = req.params.id;

        await PostModel.updateOne({
            _id: postID,
        }, {
            title: req.body.title,
            content: req.body.content,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
        })

        res.json({
            updated: true,
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось обновить статью');
    }
}

export const getAllTags = async (req, res) => {
    try {
        const tags = await PostModel.distinct('tags');

        res.json(tags);
    }

    catch (err) {
        console.log(err);
        res.status(500).json('Не удалось получить список тегов');
    }
}

